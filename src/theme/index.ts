// invariant: toda cor, espaçamento, raio e tamanho de fonte das telas vem daqui,
// para que a identidade visual da ATTURA mude em um único lugar.

export const cores = {
    fundo: "#F7F7F4",
    superficie: "#FFFFFF",
    texto: "#171717",
    textoSecundario: "#5E605A",
    textoSuave: "#8A8C85",
    borda: "#E3E4DF",
    bordaForte: "#BFC0BA",
    primaria: "#171717",
    primariaTexto: "#FFFFFF",
    desabilitado: "#C9CAC4",
    sucesso: "#2F6B4F",
    sucessoFundo: "#E6EFE9",
    erro: "#B3261E",
    neutroAtivo: "#EDEDE8",
    // why: fim do degradê do cartão de login/cadastro; perto do branco para o efeito ficar discreto.
    cartaoDegrade: "#ECEBE4",
    // why: textos e contornos sobre o fundo preto da marca.
    textoInverso: "rgba(255,255,255,0.68)",
    bordaInversa: "rgba(255,255,255,0.28)",
    superficieInversaAtiva: "rgba(255,255,255,0.1)",
} as const;

export const espaco = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    // why: margem lateral das telas; 20 fica entre lg e xl para a vitrine em 2 colunas não apertar no celular.
    tela: 20,
} as const;

export const raio = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
} as const;

export const fonte = {
    mini: 11,
    legenda: 12,
    pequeno: 14,
    produto: 15,
    corpo: 16,
    preco: 17,
    subtitulo: 18,
    secao: 22,
    titulo: 26,
} as const;

// why: 44 é o mínimo de área de toque recomendado no iOS (pt) e na web (px).
export const TOQUE_MIN = 44;

export const sombra = {
    // why: sombra só para separar superfícies brancas do fundo claro; elevation cobre o Android.
    suave: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
} as const;

// why: na web larga e no tablet o conteúdo fica centralizado em vez de esticar de ponta a ponta.
export const larguraConteudo = {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
} as const;
