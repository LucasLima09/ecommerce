import { Categoria } from "@/types/produto";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

type FiltroCategoriasProps = {
    categorias: Categoria[];
    selecionada: Categoria["id"] | null; // null = todas
    onSelecionar: (id: Categoria["id"] | null) => void;
};

export default function FiltroCategorias({ categorias, selecionada, onSelecionar }: FiltroCategoriasProps) {
    const opcoes: { id: Categoria["id"] | null; nome: string }[] = [{ id: null, nome: "Todas" }, ...categorias];

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lista}>
            {opcoes.map((opcao) => {
                const ativa = opcao.id === selecionada;
                return (
                    <Pressable
                        key={opcao.id ?? "todas"}
                        onPress={() => onSelecionar(opcao.id)}
                        style={({ pressed }) => [styles.chip, ativa && styles.chipAtivo, pressed && styles.pressionado]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: ativa }}
                        accessibilityLabel={`Categoria ${opcao.nome}`}
                    >
                        <Text style={[styles.texto, ativa && styles.textoAtivo]}>{opcao.nome}</Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    lista: {
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 980,
        backgroundColor: "#FFFFFF",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#E5E5EA",
    },
    chipAtivo: {
        backgroundColor: "#1C1C1E",
        borderColor: "#1C1C1E",
    },
    pressionado: {
        opacity: 0.7,
    },
    texto: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1C1C1E",
    },
    textoAtivo: {
        color: "#FFFFFF",
    },
});
