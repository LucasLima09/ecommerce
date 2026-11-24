import { cores, espaco, fonte, raio, TOQUE_MIN } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type AuthInputProps = TextInputProps & {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    error?: string;
};

export default function AuthInput({ label, icon, error, secureTextEntry, ...rest }: AuthInputProps) {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(true);
    const isPassword = !!secureTextEntry;
    const corIcone = error ? cores.erro : focused ? cores.texto : cores.textoSuave;

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>

            <View style={[styles.field, focused && styles.fieldFocused, !!error && styles.fieldError]}>
                <Ionicons name={icon} size={20} color={corIcone} />

                <TextInput
                    style={styles.input}
                    placeholderTextColor={cores.textoSuave}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={isPassword && hidden}
                    accessibilityLabel={label}
                    aria-invalid={!!error}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...rest}
                />

                {isPassword && (
                    <Pressable
                        style={styles.olho}
                        onPress={() => setHidden((v) => !v)}
                        accessibilityRole="button"
                        accessibilityLabel={hidden ? "Mostrar senha" : "Ocultar senha"}
                    >
                        <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={20} color={cores.textoSuave} />
                    </Pressable>
                )}
            </View>

            {!!error && (
                <Text style={styles.error} accessibilityLiveRegion="polite">
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: espaco.sm,
    },
    label: {
        fontSize: fonte.pequeno,
        fontWeight: "600",
        color: cores.texto,
    },
    field: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaco.md,
        backgroundColor: cores.superficie,
        borderRadius: raio.md,
        borderWidth: 1,
        borderColor: cores.borda,
        paddingLeft: espaco.lg,
        paddingRight: espaco.xs,
        height: 48,
        // why: o preenchimento automático da web pode alargar o input e cobrir a borda direita do campo.
        overflow: "hidden",
    },
    fieldFocused: {
        borderColor: cores.texto,
        backgroundColor: cores.superficie,
    },
    fieldError: {
        borderColor: cores.erro,
    },
    input: {
        flex: 1,
        // why: sem minWidth 0 o campo cresce com e-mails longos na web em vez de rolar o texto.
        minWidth: 0,
        fontSize: fonte.corpo,
        color: cores.texto,
        height: "100%",
        paddingRight: espaco.md,
        outlineWidth: 0,
    },
    olho: {
        width: TOQUE_MIN,
        height: TOQUE_MIN,
        alignItems: "center",
        justifyContent: "center",
    },
    error: {
        fontSize: fonte.legenda,
        color: cores.erro,
    },
});

type CampoEmailProps = Omit<AuthInputProps, "label" | "icon">;

export function CampoEmail(props: CampoEmailProps) {
    return (
        <AuthInput
            label="E-mail"
            icon="mail-outline"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            {...props}
        />
    );
}
