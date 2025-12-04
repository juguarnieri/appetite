import { View, Text, StyleSheet, Image } from "react-native";

export default function NavComidas({ icon, navTitulo }) {
    return (
        <View style={styles.content}>
            <View style={styles.iconContainer}>
                <Image source={icon} style={styles.logo} />
            </View>
            <Text style={styles.navTitulo}>{navTitulo}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        alignItems: "center",
        marginHorizontal: 10,
        width: 70,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: "hidden",
        marginBottom: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    logo: {
        width: "100%",
        height: "100%",
        resizeMode: "center",
    },
    navTitulo: {
        fontSize: 11,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
    },
});