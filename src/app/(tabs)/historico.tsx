import Ionicons from "@expo/vector-icons/Ionicons";
import CompraCard from "@/components/compraCard";
import { Carregando } from "@/components/estadoTela";
import { useHistorico } from "@/context/HistoricoContext";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoricoScreen() {
    const { compras, loading } = useHistorico();

    if (loading) return <Carregando />;

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Text style={styles.titulo}>Histórico</Text>

            {compras.length === 0 ? (
                <View style={styles.vazio}>
                    <Ionicons name="receipt-outline" size={56} color="#C7C7CC" />
                    <Text style={styles.vazioTexto}>Você ainda não fez nenhuma compra.</Text>
                </View>
            ) : (
                <FlatList
                    data={compras}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.lista}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <CompraCard compra={item} />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#F2F2F7",
    },
    titulo: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1C1C1E",
    },
    lista: {
        paddingVertical: 16,
        gap: 12,
    },
    vazio: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    vazioTexto: {
        fontSize: 16,
        color: "#8E8E93",
    },
});
