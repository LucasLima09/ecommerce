import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type AuthButtonProps = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export default function AuthButton({ title, onPress, loading, disabled }: AuthButtonProps) {
    const inactive = disabled || loading;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                inactive && styles.buttonDisabled,
                pressed && !inactive && styles.buttonPressed,
            ]}
            onPress={onPress}
            disabled={inactive}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#1C1C1E",
        height: 52,
        borderRadius: 980,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonDisabled: {
        backgroundColor: "#C7C7CC",
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
