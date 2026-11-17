import Botao from "@/components/botao";
import { cores, espaco, fonte } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function Carregando() {
    return (
        <View style={styles.centro}>
            <ActivityIndicator size="large" color={cores.texto} />
        </View>
    );
}

type ErroProps = {
    mensagem: string;
    onTentarNovamente: () => void;
};

export function Erro({ mensagem, onTentarNovamente }: ErroProps) {
    return (
        <EstadoVazio
            icone="cloud-offline-outline"
            titulo="Algo deu errado"
            mensagem={mensagem}
            acao="Tentar novamente"
            onAcao={onTentarNovamente}
        />
    );
}

type EstadoVazioProps = {
    icone: ComponentProps<typeof Ionicons>["name"];
    titulo: string;
    mensagem?: string;
    acao?: string;
    onAcao?: () => void;
};

export function EstadoVazio({ icone, titulo, mensagem, acao, onAcao }: EstadoVazioProps) {
    return (
        <View style={styles.centro}>
            <View style={styles.icone}>
                <Ionicons name={icone} size={32} color={cores.texto} />
            </View>
            <View style={styles.textos}>
                <Text style={styles.titulo}>{titulo}</Text>
                {!!mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}
            </View>
            {!!acao && !!onAcao && (
                <View style={styles.acao}>
                    <Botao title={acao} onPress={onAcao} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    centro: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: espaco.lg,
        paddingHorizontal: espaco.xl,
        paddingVertical: espaco.xxl,
    },
    icone: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: cores.neutroAtivo,
        alignItems: "center",
        justifyContent: "center",
    },
    textos: {
        alignItems: "center",
        gap: espaco.xs,
    },
    titulo: {
        fontSize: fonte.subtitulo,
        fontWeight: "600",
        color: cores.texto,
        textAlign: "center",
    },
    mensagem: {
        fontSize: fonte.pequeno,
        color: cores.textoSecundario,
        textAlign: "center",
        maxWidth: 280,
    },
    acao: {
        width: 220,
    },
});
