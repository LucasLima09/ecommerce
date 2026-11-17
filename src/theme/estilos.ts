import { StyleSheet } from "react-native";
import { cores, espaco } from "./index";

// invariant: estrutura comum das telas com faixa da marca (Home, Carrinho, Pagamento, Pedido, Histórico).
export const estilosTela = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },
    lista: {
        flex: 1,
    },
    listaConteudo: {
        paddingHorizontal: espaco.tela,
        paddingVertical: espaco.tela,
        gap: espaco.md,
    },
});
