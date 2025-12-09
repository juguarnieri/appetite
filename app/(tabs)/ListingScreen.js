import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Header from "../components/header";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const USUARIO_ID = 1;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ========== MAPEAMENTO DE CATEGORIAS ==========
const CATEGORIA_MAP = {
  'Sobremesas': 1,
  'Lanches': 2,
  'Diet': 3,           // ✅ Corrigido: era 'Diets', agora é 'Diet'
  'Vegetariano': 4,
  'Bebidas': 5,
};

const CATEGORIA_NOMES = {
  1: 'Sobremesas',
  2: 'Lanches',
  3: 'Diet',        
  4: 'Vegetariano',
  5: 'Bebidas',
};

export default function ListingScreen() {
  const router = useRouter();
  const { categoria } = useLocalSearchParams();
  const [search, setSearch] = useState("");
  const [todasAsReceitas, setTodasAsReceitas] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarApenasAmericados, setMostrarApenasAmericados] = useState(false);

  // ✅ Carregar TODAS as receitas uma única vez
  const carregarTodasAsReceitas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/receitas`);
      setTodasAsReceitas(response.data);
      console.log('✅ Total de receitas carregadas:', response.data.length);
    } catch (error) {
      console.error("❌ Erro ao buscar receitas:", error.message);
      Alert.alert('Erro', 'Falha ao carregar receitas');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filtrar localmente por categoria
  const filtrarPorCategoria = (receitasOriginais, categoriaProcurada) => {
    if (!categoriaProcurada) return receitasOriginais;
    
    const categoriaMap = {
      'Sobremesas': 1,
      'Lanches': 2,
      'Diet': 3,
      'Vegetariano': 4,
      'Bebidas': 5,
    };
    
    const categoriaId = categoriaMap[categoriaProcurada];
    return receitasOriginais.filter(r => r.categoria_id === categoriaId);
  };

  useEffect(() => {
    carregarTodasAsReceitas();
  }, []);

  useEffect(() => {
    const receitasFiltradas = filtrarPorCategoria(todasAsReceitas, categoria);
    setReceitas(receitasFiltradas);
  }, [categoria, todasAsReceitas]);

  useFocusEffect(
    React.useCallback(() => {
      const receitasFiltradas = filtrarPorCategoria(todasAsReceitas, categoria);
      setReceitas(receitasFiltradas);
    }, [categoria, todasAsReceitas])
  );

  const toggleFavorito = async (receitaId, currentFavorita) => {
    try {
      const novoStatus = !currentFavorita;
      
      console.log(`❤️ Toggling favorita - ID: ${receitaId}, Novo status: ${novoStatus}`);

      const response = await axios.put(
        `${API_URL}/api/receitas/${receitaId}/favorita`,
        { favorita: novoStatus }
      );
      
      console.log('✅ Sucesso:', response.data);

      setReceitas(receitas.map(r =>
        r.id === receitaId ? { ...r, favorita: novoStatus } : r
      ));
    } catch (error) {
      console.error('❌ Erro ao toggar favorita:', error.response?.data || error.message);
      Alert.alert('Erro', 'Erro ao atualizar favorita');
    }
  };

  const receitasFiltradas = Array.isArray(receitas)
    ? receitas.filter((item) => {
        const matchSearch = item.titulo && typeof item.titulo === "string" && 
                           item.titulo.toLowerCase().includes(search.toLowerCase());
        const matchDificuldade = !filtroAtivo || item.dificuldade === filtroAtivo;
        const matchFavorito = !mostrarApenasAmericados || item.favorita;
        return matchSearch && matchDificuldade && matchFavorito;
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

  const displayedData = showAll ? receitasFiltradas : receitasFiltradas.slice(0, 50);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <Ionicons name="restaurant" size={50} color="#2E7D32" />
          <Text style={styles.loadingText}>Carregando receitas...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
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

            <TouchableOpacity
              style={[
                styles.difficultyButton,
                mostrarApenasAmericados && styles.favoritoButtonActive
              ]}
              onPress={() => setMostrarApenasAmericados(!mostrarApenasAmericados)}
            >
              <Ionicons 
                name={mostrarApenasAmericados ? "heart" : "heart-outline"}
                size={20} 
                color={mostrarApenasAmericados ? '#FFFFFF' : '#E91E63'} 
              />
              <Text style={[
                styles.difficultyButtonText,
                mostrarApenasAmericados && styles.difficultyButtonTextActive
              ]}>
                Curtidas
              </Text>
            </TouchableOpacity>
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

        {mostrarApenasAmericados && (
          <View style={styles.filterContainer}>
            <View style={[styles.filterChip, { backgroundColor: '#E91E63' }]}>
              <Ionicons name="heart" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.filterText}>Mostrando: Receitas Curtidas</Text>
              <TouchableOpacity 
                style={styles.clearFilter}
                onPress={() => setMostrarApenasAmericados(false)}
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
            {mostrarApenasAmericados ? "Receitas Curtidas" :
             categoria ? `Receitas de ${categoria}` : "Explorar Receitas"}
          </Text>
          <Text style={styles.subHeader}>
            {receitasFiltradas.length} receita{receitasFiltradas.length !== 1 ? 's' : ''} encontrada{receitasFiltradas.length !== 1 ? 's' : ''}
            {filtroAtivo && ` • Nível ${filtroAtivo === 'FACIL' ? 'Fácil' : filtroAtivo === 'MEDIO' ? 'Médio' : 'Difícil'}`}
          </Text>
        </View>

        {receitasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>
              {mostrarApenasAmericados ? 
                "Você ainda não curtiu nenhuma receita" :
                categoria ? 
                `Nenhuma receita encontrada para a categoria "${categoria}"` : 
                "Nenhuma receita encontrada"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayedData}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={
                        item.imagem
                          ? item.imagem.startsWith("http")
                            ? { uri: item.imagem }
                            : { uri: `${API_URL}/uploads/${item.imagem}` }
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

                      {item.avaliacao && item.avaliacao > 0 && (
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
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorito(item.id, item.favorita)}
                >
                  <Ionicons
                    name={item.favorita ? "heart" : "heart-outline"}
                    size={28}
                    color={item.favorita ? "#E91E63" : "#CCC"}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {!showAll && receitasFiltradas.length > 50 && (
          <TouchableOpacity style={styles.readMoreButton} onPress={() => setShowAll(true)}>
            <Text style={styles.readMore}>VER MAIS RECEITAS</Text>
            <Text style={styles.readMoreIcon}>↓</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ...existing StyleSheet...
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
  favoritoButtonActive: {
    backgroundColor: "#E91E63",
    borderColor: "#E91E63",
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
    paddingBottom: 120,
  },
  cardWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    height: 150,
  },
  imageContainer: {
    width: 120,
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
    height: 150,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
    gap: 6,
  },
  ratingBadgeText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '700',
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
    position: "absolute",
    top: 10,
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
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
    gap: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});