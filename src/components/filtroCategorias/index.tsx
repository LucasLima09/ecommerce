import BotaoIcone from "@/components/botaoIcone";
import { cores, espaco, fonte, raio } from "@/theme";
import { Categoria } from "@/types/produto";
import { useRef, useState } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    ScrollViewInstance,
    StyleSheet,
    Text,
    View,
} from "react-native";

type FiltroCategoriasProps = {
    categorias: Categoria[];
    selecionada: Categoria["id"] | null; // null = todas
    onSelecionar: (id: Categoria["id"] | null) => void;
};

export default function FiltroCategorias({ categorias, selecionada, onSelecionar }: FiltroCategoriasProps) {
    const opcoes: { id: Categoria["id"] | null; nome: string }[] = [{ id: null, nome: "Todas" }, ...categorias];

    // why: no navegador, arrastar com o mouse não rola a lista; as setas permitem rolar em qualquer plataforma.
    const scrollRef = useRef<ScrollViewInstance>(null);
    const [posicao, setPosicao] = useState(0);
    const [larguraVisivel, setLarguraVisivel] = useState(0);
    const [larguraConteudo, setLarguraConteudo] = useState(0);

    const podeVoltar = posicao > 1;
    const podeAvancar = posicao + larguraVisivel < larguraConteudo - 1;

    function rolar(direcao: 1 | -1) {
        const destino = posicao + direcao * larguraVisivel * 0.7;
        const maximo = Math.max(0, larguraConteudo - larguraVisivel);
        scrollRef.current?.scrollTo({ x: Math.min(Math.max(destino, 0), maximo), animated: true });
    }

    function aoRolar(e: NativeSyntheticEvent<NativeScrollEvent>) {
        setPosicao(e.nativeEvent.contentOffset.x);
    }

    return (
        <View style={styles.container}>
            {podeVoltar && (
                <BotaoIcone icone="chevron-back" comFundo descricao="Ver categorias anteriores" onPress={() => rolar(-1)} />
            )}

            <ScrollView
                ref={scrollRef}
                horizontal
                style={styles.rolagem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.lista}
                onScroll={aoRolar}
                scrollEventThrottle={16}
                onLayout={(e) => setLarguraVisivel(e.nativeEvent.layout.width)}
                onContentSizeChange={(largura) => setLarguraConteudo(largura)}
            >
                {opcoes.map((opcao) => (
                    <Chip
                        key={opcao.id ?? "todas"}
                        nome={opcao.nome}
                        ativa={opcao.id === selecionada}
                        onPress={() => onSelecionar(opcao.id)}
                    />
                ))}
            </ScrollView>

            {podeAvancar && (
                <BotaoIcone icone="chevron-forward" comFundo descricao="Ver mais categorias" onPress={() => rolar(1)} />
            )}
        </View>
    );
}

function Chip({ nome, ativa, onPress }: { nome: string; ativa: boolean; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.chip,
                ativa && styles.chipAtivo,
                pressed && styles.pressionado,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: ativa }}
            accessibilityLabel={`Categoria ${nome}`}
        >
            <Text style={[styles.texto, ativa && styles.textoAtivo]}>{nome}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaco.sm,
    },
    rolagem: {
        flex: 1,
    },
    lista: {
        gap: espaco.sm,
        // why: sem esse respiro o último chip fica encostado na seta e parece cortado ao fim da rolagem.
        paddingRight: espaco.lg,
    },
    chip: {
        minHeight: 36,
        justifyContent: "center",
        paddingHorizontal: espaco.lg,
        borderRadius: raio.pill,
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
    },
    chipAtivo: {
        backgroundColor: cores.primaria,
        borderColor: cores.primaria,
    },
    pressionado: {
        opacity: 0.7,
    },
    texto: {
        // why: sem isso, arrastar com o mouse no navegador seleciona o texto dos chips.
        userSelect: "none",
        fontSize: fonte.pequeno,
        fontWeight: "600",
        color: cores.texto,
    },
    textoAtivo: {
        color: cores.primariaTexto,
    },
});
