import { Image, ImageStyle } from "expo-image";
import { StyleProp } from "react-native";

// invariant: proporções dos PNGs em assets/images; mudar a imagem exige atualizar aqui.
const PROPORCAO_LOGO = 1849 / 349;
const PROPORCAO_SIMBOLO = 554 / 516;

export function LogoBranco({ style }: { style?: StyleProp<ImageStyle> }) {
    return (
        <Image
            source={require("@/assets/images/logo-attura-branco.png")}
            style={[{ aspectRatio: PROPORCAO_LOGO }, style]}
            contentFit="contain"
            accessibilityLabel="ATTURA"
        />
    );
}

// why: marca d'água decorativa sobre a faixa preta; fica fora do leitor de tela.
export function SimboloA({ style }: { style?: StyleProp<ImageStyle> }) {
    return (
        <Image
            source={require("@/assets/images/simbolo-a.png")}
            style={[{ aspectRatio: PROPORCAO_SIMBOLO }, style]}
            contentFit="contain"
            accessible={false}
        />
    );
}
