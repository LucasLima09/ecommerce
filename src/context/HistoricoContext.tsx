import { useAuth } from "@/context/AuthContext";
import { getCompras } from "@/service/comprasService";
import { Compra } from "@/types/compra";
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

// why: a API não garante a ordem da lista; o id maior é a compra mais recente.
function maisRecentePrimeiro(compras: Compra[]) {
    return [...compras].sort((a, b) => b.id - a.id);
}

async function buscarCompras() {
    try {
        return maisRecentePrimeiro(await getCompras());
    } catch {
        // why: se a API falhar, a aba mostra o histórico vazio em vez de travar o app.
        return [];
    }
}

export function HistoricoProvider({ children }: PropsWithChildren) {
    const { usuario } = useAuth();
    const usuarioId = usuario?.id ?? null;

    // invariant: o estado guarda de qual usuarioId ele é; se a conta muda, o histórico anterior é ignorado na leitura.
    const [estado, setEstado] = useState<{ usuarioId: number; compras: Compra[] } | null>(null);

    const atual = usuarioId && estado?.usuarioId === usuarioId ? estado : null;
    const compras = atual?.compras ?? [];
    const loading = !!usuarioId && atual === null;

    useEffect(() => {
        if (!usuarioId) return;
        // hazard: sem essa flag, a resposta de uma conta anterior pode chegar depois e sobrescrever o histórico atual.
        let ativo = true;
        buscarCompras().then((lista) => {
            if (ativo) setEstado({ usuarioId, compras: lista });
        });
        return () => {
            ativo = false;
        };
    }, [usuarioId]);

    // why: a compra recém-finalizada entra no topo da lista sem precisar buscar tudo de novo na API.
    function registrarCompra(compra: Compra) {
        setEstado((prev) => ({
            usuarioId: compra.usuarioId,
            compras: [compra, ...(prev?.usuarioId === compra.usuarioId ? prev.compras : [])],
        }));
    }

    return <HistoricoContext value={{ compras, loading, registrarCompra }}>{children}</HistoricoContext>;
}
