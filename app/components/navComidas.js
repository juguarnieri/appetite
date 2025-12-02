import { View, Text, StyleSheet, Image } from "react-native";

export default function NavComidas({ icon, navTitulo }) {
    return (
        <View style={styles.content}>
            <Image source={icon} style={styles.logo} />
            <Text style={styles.navTitulo}>{navTitulo}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        alignItems: "center",
        display: "flex",
        width: "100%",
        justifyContent: "center",
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    navTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
});