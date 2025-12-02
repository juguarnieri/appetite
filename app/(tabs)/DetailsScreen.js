import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DetailsScreen() {
  const { id, title } = useLocalSearchParams();

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum item foi fornecido.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Detalhes do Item</Text>
      <View style={styles.card}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.detail}>{id}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Título:</Text>
        <Text style={styles.detail}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  detail: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
