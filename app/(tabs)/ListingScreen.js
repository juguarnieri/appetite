import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, ScrollView } from "react-native";
import axios from "axios";
import Header from "../components/header";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ListingScreen() {
  const router = useRouter();
  const { categoria } = useLocalSearchParams();
  const [search, setSearch] = useState("");
  const [receitas, setReceitas] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllReceitas = async () => {
    try {
      setLoading(true);
      let url = `${process.env.EXPO_PUBLIC_API_URL}/api/receitas`;
      
      if (categoria) {
        url += `?categoria=${encodeURIComponent(categoria)}`;
      }
      
      const response = await axios.get(url);
      setReceitas(response.data);
      
    } catch (error) {
      console.error("Erro ao buscar receitas:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllReceitas();
  }, [categoria]);

  const receitasFiltradas = Array.isArray(receitas)
    ? receitas.filter((item) => {
        const matchSearch = item.titulo && typeof item.titulo === "string" && 
                           item.titulo.toLowerCase().includes(search.toLowerCase());
        const matchDificuldade = !filtroAtivo || item.dificuldade === filtroAtivo;
        return matchSearch && matchDificuldade;
      })
    : [];

  const handlePress = (item) => {
    router.push({
      pathname: "/(tabs)/DetailsScreen",
      params: { id: item.id},
    });
  };

  const handleDifficultyFilter = (dificuldade) => {
    if (filtroAtivo === dificuldade) {
      setFiltroAtivo(null);
    } else {
      setFiltroAtivo(dificuldade);
    }
    setShowAll(false);
  };

  const getDifficultyIcon = (dificuldade) => {
    switch (dificuldade) {
      case 'FACIL':
        return 'star';
      case 'MEDIO':
        return 'star-half';
      case 'DIFICIL':
        return 'flame';
      default:
        return 'star-outline';
    }
  };

  const getDifficultyColor = (dificuldade) => {
    switch (dificuldade) {
      case 'FACIL':
        return '#4CAF50';
      case 'MEDIO':
        return '#FF9800';
      case 'DIFICIL':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const displayedData = showAll ? receitasFiltradas : receitasFiltradas.slice(0, 5);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text>Carregando receitas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyTitle}>Nível de Dificuldade:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.difficultyScroll}>
            {['FACIL', 'MEDIO', 'DIFICIL'].map((dificuldade) => (
              <TouchableOpacity
                key={dificuldade}
                style={[
                  styles.difficultyButton,
                  filtroAtivo === dificuldade && styles.difficultyButtonActive
                ]}
                onPress={() => handleDifficultyFilter(dificuldade)}
              >
                <Ionicons 
                  name={getDifficultyIcon(dificuldade)} 
                  size={20} 
                  color={filtroAtivo === dificuldade ? '#FFFFFF' : getDifficultyColor(dificuldade)} 
                />
                <Text style={[
                  styles.difficultyButtonText,
                  filtroAtivo === dificuldade && styles.difficultyButtonTextActive
                ]}>
                  {dificuldade === 'FACIL' ? 'Fácil' : dificuldade === 'MEDIO' ? 'Médio' : 'Difícil'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {categoria && (
          <View style={styles.filterContainer}>
            <View style={styles.filterChip}>
              <Ionicons name="funnel" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.filterText}>Categoria: {categoria}</Text>
              <TouchableOpacity 
                style={styles.clearFilter}
                onPress={() => router.replace("/(tabs)/ListingScreen")}
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {filtroAtivo && (
          <View style={styles.filterContainer}>
            <View style={[styles.filterChip, { backgroundColor: getDifficultyColor(filtroAtivo) }]}>
              <Ionicons name={getDifficultyIcon(filtroAtivo)} size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.filterText}>
                Dificuldade: {filtroAtivo === 'FACIL' ? 'Fácil' : filtroAtivo === 'MEDIO' ? 'Médio' : 'Difícil'}
              </Text>
              <TouchableOpacity 
                style={styles.clearFilter}
                onPress={() => setFiltroAtivo(null)}
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Pesquisar receitas..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            {categoria ? `Receitas de ${categoria}` : "Explorar Receitas"}
          </Text>
          <Text style={styles.subHeader}>
            {receitasFiltradas.length} receita{receitasFiltradas.length !== 1 ? 's' : ''} encontrada{receitasFiltradas.length !== 1 ? 's' : ''}
            {filtroAtivo && ` • Nível ${filtroAtivo === 'FACIL' ? 'Fácil' : filtroAtivo === 'MEDIO' ? 'Médio' : 'Difícil'}`}
          </Text>
        </View>

        {receitasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {categoria ? 
                `Nenhuma receita encontrada para a categoria "${categoria}"` : 
                "Nenhuma receita encontrada"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayedData}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      item.imagem
                        ? item.imagem.startsWith("http")
                          ? { uri: item.imagem }
                          : { uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${item.imagem}` }
                        : require("../../assets/salgadoIcon.png") 
                    }
                    style={styles.image}
                  />
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.title} numberOfLines={2}>{item.titulo}</Text>
                  <Text style={styles.description} numberOfLines={2}>{item.descricao}</Text>
                  
                  <View style={styles.badgeContainer}>
                    {item.dificuldade && (
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.dificuldade) }]}>
                        <Ionicons 
                          name={getDifficultyIcon(item.dificuldade)} 
                          size={12} 
                          color="#FFFFFF" 
                        />
                        <Text style={styles.difficultyBadgeText}>
                          {item.dificuldade === 'FACIL' ? 'Fácil' : 
                           item.dificuldade === 'MEDIO' ? 'Médio' : 'Difícil'}
                        </Text>
                      </View>
                    )}

                    {item.avaliacao && (
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingBadgeText}>{item.avaliacao}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.footer}>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeIcon}>⏱️</Text>
                      <Text style={styles.time}>{item.tempo_preparo} min</Text>
                    </View>
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Text style={styles.favorite}>{item.favorita ? "❤️" : "♡"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {!showAll && receitasFiltradas.length > 5 && (
          <TouchableOpacity style={styles.readMoreButton} onPress={() => setShowAll(true)}>
            <Text style={styles.readMore}>VER MAIS RECEITAS</Text>
            <Text style={styles.readMoreIcon}>↓</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  difficultyContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  difficultyScroll: {
    flexDirection: "row",
  },
  difficultyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  difficultyButtonActive: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginLeft: 6,
  },
  difficultyButtonTextActive: {
    color: "#FFFFFF",
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  filterText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 8,
  },
  clearFilter: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E8F5E9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: "#666",
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  headerContainer: {
    marginBottom: 25,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    height: 120,
  },
  imageContainer: {
    width: 100,
    flex: 1,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "transparent",
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    height: 120,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
    flex: 1,
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 6,
    flexWrap: "wrap",
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyBadgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 3,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingBadgeText: {
    fontSize: 10,
    color: "#F57C00",
    fontWeight: "600",
    marginLeft: 3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  timeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  time: {
    fontSize: 11,
    color: "#2E7D32",
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 6,
    borderRadius: 15,
    backgroundColor: "#FFF5F5",
  },
  favorite: {
    fontSize: 18,
  },
  readMoreButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  readMore: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  readMoreIcon: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
