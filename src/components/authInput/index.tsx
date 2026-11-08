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

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>

            <View
                style={[
                    styles.field,
                    focused && styles.fieldFocused,
                    !!error && styles.fieldError,
                ]}
            >
                <Ionicons name={icon} size={20} color="#8E8E93" />

                <TextInput
                    style={styles.input}
                    placeholderTextColor="#C7C7CC"
                    autoCapitalize="none"
                    secureTextEntry={isPassword && hidden}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...rest}
                />

                {isPassword && (
                    <Pressable
                        onPress={() => setHidden((v) => !v)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={hidden ? "Mostrar senha" : "Ocultar senha"}
                    >
                        <Ionicons
                            name={hidden ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#8E8E93"
                        />
                    </Pressable>
                )}
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: "500",
        color: "#636366",
        marginLeft: 4,
    },
    field: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E5EA",
        paddingHorizontal: 14,
        height: 52,
    },
    fieldFocused: {
        borderColor: "#1C1C1E",
    },
    fieldError: {
        borderColor: "#FF3B30",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#1C1C1E",
        height: "100%",
        outlineWidth: 0,
    },
    error: {
        fontSize: 12,
        color: "#FF3B30",
        marginLeft: 4,
    },
});
