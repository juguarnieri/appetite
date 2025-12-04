import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function RecipeCard({ title, time, image, onPress }) {
    return (
        <TouchableOpacity style={styles.recipeCard} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.recipeImageContainer}>
                {image ? (
                    <Image source={image} style={styles.recipeImage} />
                ) : (
                    <Text style={styles.recipeEmoji}>🧁</Text>
                )}
            </View>
            <Text style={styles.recipeTitle}>{title}</Text>
            <Text style={styles.recipeTime}>{time}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    recipeCard: {
        width: 180,
        marginRight: 15,
        backgroundColor: "#FFF",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recipeImageContainer: {
        width: "100%",
        height: 140,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
    },
    recipeImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    recipeEmoji: {
        fontSize: 60,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    recipeTime: {
        fontSize: 14,
        color: "#666",
        paddingHorizontal: 12,
        paddingBottom: 12,
        paddingTop: 4,
    },
});
