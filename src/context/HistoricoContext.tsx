import { useAuth } from "@/context/AuthContext";
import { Compra } from "@/types/compra";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, use, useEffect, useState } from "react";

type HistoricoContextType = {
    // invariant: só as compras do usuário logado, da mais recente para a mais antiga.
    compras: Compra[];
    loading: boolean;
    registrarCompra: (compra: Compra) => void;
};

const HistoricoContext = createContext<HistoricoContextType | null>(null);

export function useHistorico() {
    const value = use(HistoricoContext);
    if (!value) throw new Error("useHistorico precisa estar dentro do HistoricoProvider");
    return value;
}

// invariant: uma chave por usuário, para que trocar de conta não mostre as compras de outra pessoa.
const chave = (usuarioId: string) => `historico:${usuarioId}`;

async function lerHistorico(usuarioId: string): Promise<Compra[]> {
    try {
        const salvo = await AsyncStorage.getItem(chave(usuarioId));
        return salvo ? (JSON.parse(salvo) as Compra[]) : [];
    } catch {
        // why: um histórico corrompido ou ilegível não pode travar o app; começa vazio.
        return [];
    }
}

// why: junta duas listas sem duplicar pedidos, mantendo a mais recente primeiro.
function mesclar(novas: Compra[], antigas: Compra[]) {
    const ids = new Set(novas.map((c) => c.id));
    return [...novas, ...antigas.filter((c) => !ids.has(c.id))];
}

export function HistoricoProvider({ children }: PropsWithChildren) {
    const { usuario } = useAuth();
    const usuarioId = usuario ? String(usuario.id) : null;

    // invariant: o estado guarda de qual usuarioId ele é; se a conta muda, o histórico anterior é ignorado na leitura.
    const [estado, setEstado] = useState<{ usuarioId: string; compras: Compra[] } | null>(null);

    const atual = usuarioId && estado?.usuarioId === usuarioId ? estado : null;
    const compras = atual?.compras ?? [];
    const loading = !!usuarioId && atual === null;

    useEffect(() => {
        if (!usuarioId) return;
        // hazard: sem essa flag, a leitura de uma conta anterior pode chegar depois e sobrescrever o histórico atual.
        let ativo = true;
        lerHistorico(usuarioId).then((salvas) => {
            if (!ativo) return;
            // why: se uma compra foi registrada antes da leitura terminar, ela não pode sumir.
            setEstado((prev) => ({
                usuarioId,
                compras: prev?.usuarioId === usuarioId ? mesclar(prev.compras, salvas) : salvas,
            }));
        });
        return () => {
            ativo = false;
        };
    }, [usuarioId]);

    function registrarCompra(compra: Compra) {
        const uid = compra.usuarioId;
        setEstado((prev) => ({
            usuarioId: uid,
            compras: mesclar([compra], prev?.usuarioId === uid ? prev.compras : []),
        }));
        // why: lê o que está salvo antes de gravar, para não apagar compras caso o estado ainda não tenha carregado.
        // hazard: falha ao gravar não pode quebrar a finalização da compra, que já foi confirmada pela API.
        lerHistorico(uid)
            .then((salvas) => AsyncStorage.setItem(chave(uid), JSON.stringify(mesclar([compra], salvas))))
            .catch((e) => console.warn("Não foi possível salvar o histórico de compras.", e));
    }

    return <HistoricoContext value={{ compras, loading, registrarCompra }}>{children}</HistoricoContext>;
}
