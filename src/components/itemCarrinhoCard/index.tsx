import BotaoIcone from "@/components/botaoIcone";
import { cores, espaco, fonte, raio } from "@/theme";
import { ItemCarrinho } from "@/types/carrinho";
import { formatarPreco } from "@/utils/formatarPreco";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

type ItemCarrinhoCardProps = {
    item: ItemCarrinho;
    desabilitado: boolean;
    onAumentar: () => void;
    onDiminuir: () => void;
    onRemover: () => void;
};

export default function ItemCarrinhoCard({
    item,
    desabilitado,
    onAumentar,
    onDiminuir,
    onRemover,
}: ItemCarrinhoCardProps) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.imagem} contentFit="cover" transition={200} />

            <View style={styles.info}>
                <View style={styles.topo}>
                    <View style={styles.textos}>
                        <Text style={styles.nome} numberOfLines={2}>
                            {item.nome}
                        </Text>
                        <Text style={styles.unitario}>{formatarPreco(item.preco)} cada</Text>
                    </View>
                    <BotaoIcone
                        icone="trash-outline"
                        cor={cores.erro}
                        descricao={`Remover ${item.nome}`}
                        onPress={onRemover}
                        disabled={desabilitado}
                    />
                </View>

                <View style={styles.rodape}>
                    <View style={styles.quantidade}>
                        <BotaoIcone
                            icone="remove"
                            tamanho={16}
                            folga={14}
                            descricao={`Diminuir quantidade de ${item.nome}`}
                            onPress={onDiminuir}
                            disabled={desabilitado}
                        />
                        <Text style={styles.qtdTexto} accessibilityLabel={`Quantidade: ${item.quantidade}`}>
                            {item.quantidade}
                        </Text>
                        <BotaoIcone
                            icone="add"
                            tamanho={16}
                            folga={14}
                            descricao={`Aumentar quantidade de ${item.nome}`}
                            onPress={onAumentar}
                            disabled={desabilitado}
                        />
                    </View>

                    <Text style={styles.subtotal}>{formatarPreco(item.subtotal)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: cores.superficie,
        borderRadius: raio.lg,
        padding: espaco.md,
        gap: espaco.md,
        borderWidth: 1,
        borderColor: cores.borda,
    },
    imagem: {
        width: 88,
        height: 88,
        borderRadius: raio.md,
        backgroundColor: cores.neutroAtivo,
    },
    info: {
        flex: 1,
        justifyContent: "space-between",
        gap: espaco.sm,
    },
    topo: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: espaco.sm,
    },
    textos: {
        flex: 1,
        gap: espaco.xs,
    },
    nome: {
        fontSize: fonte.produto,
        fontWeight: "600",
        color: cores.texto,
    },
    unitario: {
        fontSize: fonte.legenda,
        color: cores.textoSecundario,
    },
    rodape: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: espaco.sm,
    },
    quantidade: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaco.md,
        height: 36,
        paddingHorizontal: espaco.md,
        borderRadius: raio.pill,
        borderWidth: 1,
        borderColor: cores.borda,
        backgroundColor: cores.fundo,
    },
    qtdTexto: {
        fontSize: fonte.produto,
        fontWeight: "700",
        minWidth: 20,
        textAlign: "center",
        color: cores.texto,
    },
    subtotal: {
        fontSize: fonte.preco,
        fontWeight: "700",
        letterSpacing: -0.3,
        color: cores.texto,
    },
});
