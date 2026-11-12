import BotaoIcone from "@/components/botaoIcone";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TextInput, View } from "react-native";

type CampoBuscaProps = {
    valor: string;
    onChange: (texto: string) => void;
    placeholder?: string;
};

export default function CampoBusca({ valor, onChange, placeholder = "Buscar produtos" }: CampoBuscaProps) {
    return (
        <View style={styles.campo}>
            <Ionicons name="search" size={18} color="#8E8E93" />
            <TextInput
                style={styles.input}
                value={valor}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#C7C7CC"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                accessibilityLabel={placeholder}
            />
            {valor.length > 0 && (
                <BotaoIcone icone="close-circle" cor="#C7C7CC" tamanho={18} descricao="Limpar busca" onPress={() => onChange("")} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    campo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#E5E5EA",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#1C1C1E",
    },
});
