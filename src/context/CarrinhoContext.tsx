import { useAuth } from "@/context/AuthContext";
import {
    addItemCarrinho,
    editarItemCarrinho,
    getCarrinho,
    removerItemCarrinho,
} from "@/service/carrinhoService";
import { finalizarCompra } from "@/service/comprasService";
import { Carrinho } from "@/types/carrinho";
import { Compra, FormaPagamentoId } from "@/types/compra";
import { Produto } from "@/types/produto";
import { getMensagemErroApi } from "@/utils/errosApi";
import { createContext, PropsWithChildren, use, useEffect, useState } from "react";

type CarrinhoContextType = {
    carrinho: Carrinho | null;
    quantidadeTotal: number;
    loading: boolean;
    // why: sem esse bloqueio, toques rápidos em +/− enviam quantidades calculadas sobre um carrinho desatualizado
    atualizando: boolean;
    erro: string | null;
    recarregar: () => Promise<void>;
    // invariant: as ações abaixo rejeitam com Error cuja message é o texto da API (ex.: estoque insuficiente).
    adicionar: (produtoId: Produto["id"], quantidade?: number) => Promise<void>;
    alterarQuantidade: (produtoId: Produto["id"], quantidade: number) => Promise<void>;
    remover: (produtoId: Produto["id"]) => Promise<void>;
    finalizar: (formaPagamento: FormaPagamentoId) => Promise<Compra>;
};

const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

export function useCarrinho() {
    const value = use(CarrinhoContext);
    if (!value) throw new Error("useCarrinho precisa estar dentro do CarrinhoProvider");
    return value;
}

export function CarrinhoProvider({ children }: PropsWithChildren) {
    const { user } = useAuth();
    // invariant: o uid do Firebase é o usuarioId da API, então cada conta tem o próprio carrinho.
    const usuarioId = user?.uid ?? null;

    // invariant: o estado guarda de qual usuarioId ele é; se a conta muda, o carrinho anterior é ignorado na leitura.
    const [estado, setEstado] = useState<{ usuarioId: string; carrinho: Carrinho | null; erro: string | null } | null>(null);
    const [recarregando, setRecarregando] = useState(false);
    const [atualizando, setAtualizando] = useState(false);

    const atual = usuarioId && estado?.usuarioId === usuarioId ? estado : null;
    const carrinho = atual?.carrinho ?? null;
    const erro = atual?.erro ?? null;
    const loading = !!usuarioId && (atual === null || recarregando);

    async function buscar(uid: string) {
        try {
            return { usuarioId: uid, carrinho: await getCarrinho(uid), erro: null };
        } catch (e) {
            return { usuarioId: uid, carrinho: null, erro: getMensagemErroApi(e, "Não foi possível carregar o carrinho.") };
        }
    }

    useEffect(() => {
        if (!usuarioId) return;
        // hazard: sem essa flag, a resposta de uma conta anterior pode chegar depois e sobrescrever o carrinho atual.
        let ativo = true;
        buscar(usuarioId).then((resultado) => {
            if (ativo) setEstado(resultado);
        });
        return () => {
            ativo = false;
        };
    }, [usuarioId]);

    async function recarregar() {
        if (!usuarioId) return;
        setRecarregando(true);
        setEstado(await buscar(usuarioId));
        setRecarregando(false);
    }

    // why: as rotas que alteram o carrinho já devolvem o carrinho completo, então não é preciso um GET extra.
    async function executar(acao: (uid: string) => Promise<Carrinho>, mensagemPadrao: string) {
        if (!usuarioId) throw new Error("Faça login para usar o carrinho.");
        setAtualizando(true);
        try {
            setEstado({ usuarioId, carrinho: await acao(usuarioId), erro: null });
        } catch (e) {
            throw new Error(getMensagemErroApi(e, mensagemPadrao));
        } finally {
            setAtualizando(false);
        }
    }

    function adicionar(produtoId: Produto["id"], quantidade = 1) {
        return executar(
            (uid) => addItemCarrinho(uid, { produtoId, quantidade }),
            "Não foi possível adicionar o produto ao carrinho.",
        );
    }

    function remover(produtoId: Produto["id"]) {
        return executar((uid) => removerItemCarrinho(uid, produtoId), "Não foi possível remover o item.");
    }

    function alterarQuantidade(produtoId: Produto["id"], quantidade: number) {
        // why: a API só aceita quantidade >= 1 no PUT; diminuir a partir de 1 remove o item.
        if (quantidade < 1) return remover(produtoId);
        return executar(
            (uid) => editarItemCarrinho(uid, produtoId, { quantidade }),
            "Não foi possível alterar a quantidade.",
        );
    }

    async function finalizar(formaPagamento: FormaPagamentoId) {
        if (!usuarioId) throw new Error("Faça login para finalizar a compra.");
        setAtualizando(true);
        try {
            const compra = await finalizarCompra({ usuarioId, formaPagamento });
            // why: a API esvazia o carrinho ao registrar a compra; sem isso o badge e a tela do carrinho mostrariam os itens antigos.
            setEstado({ usuarioId, carrinho: { usuarioId, itens: [], quantidadeTotal: 0, total: 0 }, erro: null });
            return compra;
        } catch (e) {
            throw new Error(getMensagemErroApi(e, "Não foi possível finalizar a compra."));
        } finally {
            setAtualizando(false);
        }
    }

    return (
        <CarrinhoContext
            value={{
                carrinho,
                quantidadeTotal: carrinho?.quantidadeTotal ?? 0,
                loading,
                atualizando,
                erro,
                recarregar,
                adicionar,
                alterarQuantidade,
                remover,
                finalizar,
            }}
        >
            {children}
        </CarrinhoContext>
    );
}
