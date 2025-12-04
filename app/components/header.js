import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";

export default function header() {
    return (
        <View style={styles.content}>
            <Image source={require('../../assets/logoAppetite.png')} style={styles.logo} />

            <View style={styles.separator}></View>
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
        width: 200,
        height: 110,
        resizeMode: "contain",
    },
    separator: {
        width: "100%",
        height: 7,
        backgroundColor: "#035810",
    }
});