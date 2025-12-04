import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from 'expo-router';
import Header from "../components/header";
import NavComidas from "../components/navComidas";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";

export default function HomeScreen() {
  const { user } = useAuth();
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Buscar receitas com ID par da sua API
  useEffect(() => {
    fetchRecipesWithEvenIds();
  }, []);

  const fetchRecipesWithEvenIds = async () => {
    try {
      setLoading(true);
      console.log('Buscando receitas da API:', `${process.env.EXPO_PUBLIC_API_URL}/api/receitas`);
      
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/receitas`);
      console.log('Resposta da API:', response.data);
      
      const receitas = response.data;
      
      // Filtrar apenas receitas com ID par
      const evenIdRecipes = receitas.filter(recipe => recipe.id % 2 === 0);
      console.log('Receitas com ID par:', evenIdRecipes);
      
      // Mapear para o formato esperado pelo RecipeCard
      const formattedRecipes = evenIdRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.titulo,
        time: `${recipe.tempo_preparo} min`,
        image: recipe.imagem 
          ? recipe.imagem.startsWith("http")
            ? recipe.imagem
            : `${process.env.EXPO_PUBLIC_API_URL}/uploads/${recipe.imagem}`
          : null
      }));
      
      setPopularRecipes(formattedRecipes);
      console.log('Receitas formatadas para exibição:', formattedRecipes);
    } catch (error) {
      console.error('Erro detalhado ao buscar receitas:', error.response?.data || error.message);
      // Fallback para dados estáticos em caso de erro
      setPopularRecipes([
        { id: 2, title: "CupCake", time: "20 min", image: null },
        { id: 4, title: "Brownie", time: "30 min", image: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipeId) => {
    console.log('Navegando para receita ID:', recipeId);
    // Navegar para a tela de detalhes passando o ID da receita
    router.push(`/DetailsScreen?id=${recipeId}`);
  };

  const handleCategoryPress = (categoria) => {
    console.log('Navegando para categoria:', categoria);
    // Navegar para o ListingScreen com filtro de categoria
    router.push(`/(tabs)/ListingScreen?categoria=${categoria}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Header />

        <View style={styles.bannerContainer}>
          <Image source={require('../../assets/bannerAppetite.png')} style={styles.banner} />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>Receitas da Semana</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navContainer}
          contentContainerStyle={styles.navContent}
        >
          <NavComidas
            icon={require('../../assets/doceIcon.png')}
            navTitulo="DOCES"
            backgroundColor="#FFE5E5"
            onPress={() => handleCategoryPress('Sobremesas')}
          />
          <NavComidas
            icon={require('../../assets/salgadoIcon.png')}
            navTitulo="SALGADOS"
            backgroundColor="#FFF5E1"
            onPress={() => handleCategoryPress('Lanches')}
          />
          <NavComidas
            icon={require('../../assets/veganIcon.png')}
            navTitulo="VEGETARIANOS"
            backgroundColor="#E8F5E9"
            onPress={() => handleCategoryPress('Vegetariano')}
          />
          <NavComidas
            icon={require('../../assets/saudavelIcon.png')}
            navTitulo="DIET"
            backgroundColor="#E3F2FD"
            onPress={() => handleCategoryPress('Vegetariano')}
          />
          <NavComidas
            icon={require('../../assets/drinkIcon.png')}
            navTitulo="DRINKS"
            backgroundColor="#F3E5F5"
            onPress={() => handleCategoryPress('Bebidas')}
          />
        </ScrollView>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar Receitas"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>RECEITAS POPULARES </Text>

          {loading ? (
            <Text style={styles.loadingText}>Carregando receitas...</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recipeScroll}
            >
              {popularRecipes.length > 0 ? (
                popularRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    title={recipe.title}
                    time={recipe.time}
                    image={recipe.image} 
                    onPress={() => handleRecipePress(recipe.id)}
                  />
                ))
              ) : (
                <Text style={styles.noRecipesText}>Nenhuma receita encontrada</Text>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFC",
  },
  bannerContainer: {
    width: "100%",
    height: 200,
    position: "relative",
    marginBottom: 20,
  },
  banner: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  bannerText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    flex: 1,
    display: "flex",
  },
  emoji: {
    fontSize: 80,
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  userName: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  navContainer: {
    marginBottom: 20,
  },
  navContent: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    outlineStyle: "none",
  },
  popularSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  recipeScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    paddingVertical: 20,
  },
  noRecipesText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    paddingVertical: 20,
  },
});
