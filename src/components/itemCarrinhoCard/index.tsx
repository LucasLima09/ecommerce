import BotaoIcone from "@/components/botaoIcone";
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
            <Image source={{ uri: item.imagem }} style={styles.imagem} contentFit="cover" />

            <View style={styles.info}>
                <View style={styles.topo}>
                    <Text style={styles.nome} numberOfLines={2}>
                        {item.nome}
                    </Text>
                    <BotaoIcone
                        icone="trash-outline"
                        cor="#FF3B30"
                        descricao={`Remover ${item.nome}`}
                        onPress={onRemover}
                        disabled={desabilitado}
                    />
                </View>

                <Text style={styles.unitario}>{formatarPreco(item.preco)} cada</Text>

                <View style={styles.rodape}>
                    <View style={styles.quantidade}>
                        <BotaoIcone
                            icone="remove"
                            tamanho={18}
                            comFundo
                            descricao="Diminuir quantidade"
                            onPress={onDiminuir}
                            disabled={desabilitado}
                        />
                        <Text style={styles.qtdTexto}>{item.quantidade}</Text>
                        <BotaoIcone
                            icone="add"
                            tamanho={18}
                            comFundo
                            descricao="Aumentar quantidade"
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
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 12,
        gap: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#E5E5EA",
    },
    imagem: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: "#F2F2F7",
    },
    info: {
        flex: 1,
        gap: 4,
    },
    topo: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    nome: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#1C1C1E",
    },
    unitario: {
        fontSize: 13,
        color: "#8E8E93",
    },
    rodape: {
        marginTop: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    quantidade: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    qtdTexto: {
        fontSize: 15,
        fontWeight: "600",
        minWidth: 20,
        textAlign: "center",
    },
    subtotal: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1C1C1E",
    },
});
