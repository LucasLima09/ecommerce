import BotaoIcone from "@/components/botaoIcone";
import { cores, espaco, fonte, raio } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type CampoBuscaProps = {
    valor: string;
    onChange: (texto: string) => void;
    placeholder?: string;
};

export default function CampoBusca({ valor, onChange, placeholder = "Buscar produtos" }: CampoBuscaProps) {
    const [focado, setFocado] = useState(false);

    return (
        <View style={[styles.campo, focado && styles.campoFocado]}>
            <Ionicons name="search" size={20} color={focado ? cores.texto : cores.textoSuave} />
            <TextInput
                style={styles.input}
                value={valor}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor={cores.textoSuave}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                accessibilityLabel={placeholder}
                onFocus={() => setFocado(true)}
                onBlur={() => setFocado(false)}
            />
            {valor.length > 0 && (
                <BotaoIcone icone="close-circle" cor={cores.textoSuave} tamanho={20} descricao="Limpar busca" onPress={() => onChange("")} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    campo: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaco.md,
        height: 48,
        paddingHorizontal: espaco.lg,
        borderRadius: raio.md,
        backgroundColor: cores.superficie,
        borderWidth: 2,
        borderColor: "transparent",
    },
    campoFocado: {
        borderColor: cores.bordaHover,
    },
    input: {
        flex: 1,
        minWidth: 0,
        fontSize: fonte.corpo,
        color: cores.texto,
        height: "100%",
        outlineWidth: 0,
    },
});
