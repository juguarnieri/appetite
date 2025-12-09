import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from 'expo-router';
import Header from "../components/header";
import NavComidas from "../components/navComidas";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  const { user } = useAuth();
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      
      const evenIdRecipes = receitas.filter(recipe => recipe.id % 2 === 0);
      console.log('Receitas com ID par:', evenIdRecipes);
      
      const formattedRecipes = evenIdRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.titulo,
        time: `${recipe.tempo_preparo} min`,
        image: recipe.imagem && recipe.imagem.trim()
          ? recipe.imagem.startsWith("http")
            ? recipe.imagem
            : `${process.env.EXPO_PUBLIC_API_URL}/uploads/${recipe.imagem}`
          : require("../../assets/salgadoIcon.png")
      }));
      
      setPopularRecipes(formattedRecipes);
      console.log('Receitas formatadas para exibição:', formattedRecipes);
    } catch (error) {
      console.error('Erro detalhado ao buscar receitas:', error.response?.data || error.message);
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
    router.push(`/DetailsScreen?id=${recipeId}`);
  };

  const handleCategoryPress = (categoria) => {
    console.log('Navegando para categoria:', categoria);
    router.push({
      pathname: "/(tabs)/ListingScreen",
      params: { categoria: categoria }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerFixed}>
        <Header />
      </View>
      
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
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
              navTitulo="VEGETARIANO"
              backgroundColor="#E8F5E9"
              onPress={() => handleCategoryPress('Vegetariano')}
            />
            <NavComidas
              icon={require('../../assets/saudavelIcon.png')}
              navTitulo="DIET"
              backgroundColor="#E3F2FD"
              onPress={() => handleCategoryPress('Diet')}
            />
            <NavComidas
              icon={require('../../assets/drinkIcon.png')}
              navTitulo="DRINKS"
              backgroundColor="#F3E5F5"
              onPress={() => handleCategoryPress('Bebidas')}
            />
          </ScrollView>

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

          <View style={styles.tipsSection}>
            <View style={styles.tipsHeader}>
              <Text style={styles.sectionTitle}> DICAS DE CULINÁRIA</Text>
            </View>

            <View style={[styles.tipCard, { borderLeftColor: '#2E7D32', borderLeftWidth: 4 }]}>
              <View style={styles.tipCardInner}>
                <View style={[styles.tipIconBox, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={styles.tipIconEmoji}>🧂</Text>
                </View>
                
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Sal no Ponto Certo</Text>
                  <Text style={styles.tipDescription}>Adicione sal gradualmente. Uma pitada até em receitas doces intensifica os sabores naturais</Text>
                </View>
              </View>
            </View>

            <View style={[styles.tipCard, { borderLeftColor: '#FF6B6B', borderLeftWidth: 4 }]}>
              <View style={styles.tipCardInner}>
                <View style={[styles.tipIconBox, { backgroundColor: '#FFEBEE' }]}>
                  <Text style={styles.tipIconEmoji}>🔥</Text>
                </View>
                
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Óleo Bem Quente</Text>
                  <Text style={styles.tipDescription}>Espere o óleo ou manteiga esquentar antes de colocar os alimentos. Assim fica crocante!</Text>
                </View>
              </View>
            </View>

            <View style={[styles.tipCard, { borderLeftColor: '#1E88E5', borderLeftWidth: 4 }]}>
              <View style={styles.tipCardInner}>
                <View style={[styles.tipIconBox, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={styles.tipIconEmoji}>🌡️</Text>
                </View>
                
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Temperatura Ambiente</Text>
                  <Text style={styles.tipDescription}>Ovos, manteiga e leite à temperatura ambiente se misturam melhor e criam texturas perfeitas</Text>
                </View>
              </View>
            </View>

            <View style={[styles.tipCard, { borderLeftColor: '#FFC107', borderLeftWidth: 4 }]}>
              <View style={styles.tipCardInner}>
                <View style={[styles.tipIconBox, { backgroundColor: '#FFF8E1' }]}>
                  <Text style={styles.tipIconEmoji}>⏱️</Text>
                </View>
                
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Deixe a Massa Descansar</Text>
                  <Text style={styles.tipDescription}>Repouso de 30 a 60 minutos desenvolve melhor o glúten e deixa a massa mais macia</Text>
                </View>
              </View>
            </View>

            <View style={[styles.tipCard, { borderLeftColor: '#E91E63', borderLeftWidth: 4 }]}>
              <View style={styles.tipCardInner}>
                <View style={[styles.tipIconBox, { backgroundColor: '#FCE4EC' }]}>
                  <Text style={styles.tipIconEmoji}>🥬</Text>
                </View>
                
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Qualidade dos Ingredientes</Text>
                  <Text style={styles.tipDescription}>Escolha produtos frescos e de boa origem. Isso faz toda a diferença no resultado final</Text>
                </View>
              </View>
            </View>

            <View style={[styles.tipCard, { borderLeftColor: '#9C27B0', borderLeftWidth: 4 }]}>
              <View style={styles.tipCardInner}>
                <View style={[styles.tipIconBox, { backgroundColor: '#F3E5F5' }]}>
                  <Text style={styles.tipIconEmoji}>🚫</Text>
                </View>
                
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Não Abra o Forno</Text>
                  <Text style={styles.tipDescription}>Evite abrir o forno enquanto assa. O ar quente escapa e prejudica o resultado</Text>
                </View>
              </View>
            </View>

            <View style={[styles.tipCard, { borderLeftColor: '#00BCD4', borderLeftWidth: 4 }]}>
              <View style={styles.tipCardInner}>
                <View style={[styles.tipIconBox, { backgroundColor: '#E0F2F1' }]}>
                  <Text style={styles.tipIconEmoji}>⚖️</Text>
                </View>
                
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Medidas Precisas</Text>
                  <Text style={styles.tipDescription}>Use balança ou xícaras medidoras. Medidas aproximadas podem estragar a receita</Text>
                </View>
              </View>
            </View>

            <View style={[styles.tipCard, { borderLeftColor: '#FF9800', borderLeftWidth: 4 }]}>
              <View style={styles.tipCardInner}>
                <View style={[styles.tipIconBox, { backgroundColor: '#FFE0B2' }]}>
                  <Text style={styles.tipIconEmoji}>🌶️</Text>
                </View>
                
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Temperos no Momento Certo</Text>
                  <Text style={styles.tipDescription}>Alho, cebola e especiarias liberam melhor seu aroma quando refogados no óleo quente</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFC",
  },
  headerFixed: {
    paddingTop: 15,
    paddingBottom: 1,
    backgroundColor: "#FFFCFC",
    zIndex: 10,
  },
  scrollContent: {
    flex: 1,
    backgroundColor: "#FFFCFC",
  },
  content: {
    flex: 1,
    display: "flex",
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
    marginBottom: 20, // ✅ Diminuído drasticamente de 60 para 20
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
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
  tipsSection: {
    paddingHorizontal: 20,
    marginTop: 5,  // ✅ Diminuído de 15 para 5
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  tipCardInner: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  tipIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  tipIconEmoji: {
    fontSize: 32,
  },
  tipContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
    lineHeight: 18,
  },
  tipDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 17,
    marginBottom: 12,
  },
  tipTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
