import { FadeInDown } from "react-native-reanimated";

// why: o atraso cresce por item só até o 8º, para listas longas não demorarem a aparecer por inteiro.
export const entradaItem = (index: number) => FadeInDown.duration(350).delay(Math.min(index, 8) * 60);
