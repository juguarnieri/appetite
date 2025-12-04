import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, CheckBox } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

export default function DetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [receita, setReceita] = useState(null);
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState({});

  const getReceitaById = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/receitas/${id}`);
      setReceita(response.data);

      const ingredientes = response.data.ingredientes.split(",");
      const estadoInicial = {};
      ingredientes.forEach((ingrediente) => {
        estadoInicial[ingrediente.trim()] = false;
      });
      setIngredientesSelecionados(estadoInicial);
    } catch (error) {
      console.error("Erro ao buscar receita:", error);
    }
  };

  const toggleCheckbox = (ingrediente) => {
    setIngredientesSelecionados(prev => ({
      ...prev,
      [ingrediente]: !prev[ingrediente]
    }));
  };

  useEffect(() => {
    if (id) {
      getReceitaById();
    } else {
      console.error("ID da receita não foi fornecido.");
    }
  }, [id]);

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: ID da receita não foi fornecido.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!receita) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{"< Voltar"}</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={
          receita.imagem
            ? receita.imagem.startsWith("http")
              ? { uri: receita.imagem }
              : { uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${receita.imagem}` }
            : require("../../assets/default-recipe.png")
        }
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{receita.titulo}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.rating}>⭐ {receita.avaliacao || "N/A"}</Text>
          <Text style={styles.time}>{receita.tempo_preparo} min</Text>
          <Text style={styles.portions}>{receita.porcoes || "N/A"} Porções</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {receita.ingredientes.split(",").map((ingrediente, index) => (
            <View key={index} style={styles.ingredientContainer}>
              <CheckBox
                value={ingredientesSelecionados[ingrediente.trim()]}
                onValueChange={() => toggleCheckbox(ingrediente.trim())}
                style={styles.checkbox}
              />
              <Text style={[
                styles.ingredient,
                ingredientesSelecionados[ingrediente.trim()] && styles.ingredientChecked
              ]}>
                {ingrediente.trim()}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          {receita.modo_preparo.split("\n").map((passo, index) => (
            <Text key={index} style={styles.step}>
              {index + 1}. {passo.trim()}
            </Text>
          ))}
        </View>
        
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>INICIAR PREPARO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backToRecipesButton} onPress={() => router.push("/(tabs)/ListingScreen")}>
          <Text style={styles.backToRecipesText}>VER + RECEITAS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 16,
    color: "#666666",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 15,
  },
  rating: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  time: {
    fontSize: 16,
    color: "#666666",
  },
  portions: {
    fontSize: 16,
    color: "#666666",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  checkbox: {
    marginRight: 12,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  ingredient: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  ingredientChecked: {
    textDecorationLine: "line-through",
    color: "#999999",
  },
  step: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  startButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToRecipesButton: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  backToRecipesText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFCFC",
  },
  errorText: {
    fontSize: 18,
    color: "#FF0000",
    marginBottom: 16,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
});