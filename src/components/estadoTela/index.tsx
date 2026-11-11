import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export function Carregando() {
    return (
        <View style={styles.centro}>
            <ActivityIndicator size="large" color="#1C1C1E" />
        </View>
    );
}

type ErroProps = {
    mensagem: string;
    onTentarNovamente: () => void;
};

export function Erro({ mensagem, onTentarNovamente }: ErroProps) {
    return (
        <View style={styles.centro}>
            <Text style={styles.mensagem}>{mensagem}</Text>
            <Pressable onPress={onTentarNovamente} style={styles.botao} accessibilityRole="button">
                <Text style={styles.botaoTexto}>Tentar novamente</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    centro: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    mensagem: {
        fontSize: 15,
        color: "#636366",
        textAlign: "center",
    },
    botao: {
        backgroundColor: "#1C1C1E",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 980,
    },
    botaoTexto: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
});
