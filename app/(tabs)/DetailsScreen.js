import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function DetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [receita, setReceita] = useState(null);
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);

  const getReceitaById = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/receitas/${id}`);
      setReceita(response.data);
      
      // Se a receita tem um campo 'favorita', use-o
      setIsFavorited(response.data.favorita || false);

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

  const toggleFavorite = async () => {
    try {
      const novoEstado = !isFavorited;
      
      // Atualiza o estado local imediatamente para feedback visual
      setIsFavorited(novoEstado);
      
      // Chama a API para salvar no backend
      await axios.patch(`${process.env.EXPO_PUBLIC_API_URL}/api/receitas/${id}/favorita`, {
        favorita: novoEstado
      });

      // Mostra mensagem de feedback
      Alert.alert(
        "Sucesso!", 
        novoEstado ? "Receita adicionada aos favoritos!" : "Receita removida dos favoritos!",
        [{ text: "OK", style: "default" }],
        { cancelable: true }
      );
      
    } catch (error) {
      console.error("Erro ao favoritar receita:", error);
      
      // Reverte o estado se der erro
      setIsFavorited(!isFavorited);
      
      Alert.alert(
        "Erro", 
        "Não foi possível favoritar a receita. Tente novamente.",
        [{ text: "OK", style: "default" }]
      );
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
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="warning" size={60} color="#FF6B6B" />
        <Text style={styles.errorText}>Receita não encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!receita) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Ionicons name="restaurant" size={50} color="#2E7D32" />
          <Text style={styles.loadingText}>Carregando receita...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com imagem de fundo */}
      <View style={styles.imageContainer}>
        <Image
          source={
            receita.imagem
              ? receita.imagem.startsWith("http")
                ? { uri: receita.imagem }
                : { uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${receita.imagem}` }
              : require("../../assets/salgadoIcon.png")
          }
          style={styles.image}
        />
        
        {/* Overlay com botão voltar */}
        <View style={styles.overlay}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <Ionicons 
              name={isFavorited ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorited ? "#FF6B6B" : "#FFFFFF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title e Info */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{receita.titulo}</Text>
          <Text style={styles.description}>{receita.descricao}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={styles.infoText}>{receita.avaliacao || "4.5"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{receita.tempo_preparo} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{receita.porcoes || "4"} porções</Text>
            </View>
          </View>
        </View>
        
        {/* Ingredientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={24} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Ingredientes</Text>
          </View>
          
          <View style={styles.ingredientsContainer}>
            {receita.ingredientes.split(",").map((ingrediente, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.ingredientItem}
                onPress={() => toggleCheckbox(ingrediente.trim())}
              >
                <View style={styles.checkboxContainer}>
                  {ingredientesSelecionados[ingrediente.trim()] ? (
                    <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={24} color="#CCC" />
                  )}
                </View>
                <Text style={[
                  styles.ingredient,
                  ingredientesSelecionados[ingrediente.trim()] && styles.ingredientChecked
                ]}>
                  {ingrediente.trim()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Modo de Preparo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book-outline" size={24} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          </View>
          
          <View style={styles.stepsContainer}>
            {receita.modo_preparo.split("\n").map((passo, index) => (
              passo.trim() && (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{passo.trim()}</Text>
                </View>
              )
            ))}
          </View>
        </View>
        
        {/* Botão Ver mais receitas */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.moreRecipesButton} 
            onPress={() => router.push("/(tabs)/ListingScreen")}
          >
            <Ionicons name="restaurant-outline" size={20} color="#2E7D32" />
            <Text style={styles.moreRecipesText}>VER MAIS RECEITAS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFC",
  },
  imageContainer: {
    position: "relative",
    height: 280,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFCFC",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingVertical: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginLeft: 6,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  ingredientsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  checkboxContainer: {
    marginRight: 15,
  },
  ingredient: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    lineHeight: 20,
  },
  ingredientChecked: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  stepsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    marginTop: 2,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  moreRecipesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  moreRecipesText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFCFC",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 20,
    color: "#333",
    marginVertical: 20,
    textAlign: "center",
  },
  errorButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFCFC",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
    marginTop: 15,
    fontWeight: "500",
  },
});