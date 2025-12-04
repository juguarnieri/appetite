import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

export default function NavComidas({ icon, navTitulo, backgroundColor, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={styles.title}>{navTitulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 10,
    width: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});