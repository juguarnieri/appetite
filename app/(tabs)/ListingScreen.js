import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput } from "react-native";
import axios from "axios";
import Header from "../components/header";
import { useRouter } from "expo-router";

export default function ListingScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [receitas, setReceitas] = useState([]);
  const [showAll, setShowAll] = useState(false); // Estado para controlar "LER MAIS"

  const getAllReceitas = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/receitas`);
      setReceitas(response.data);
      console.log("Receitas buscadas com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
    }
  };

  useEffect(() => {
    getAllReceitas();
  }, []);

  const filteredData = receitas.filter((item) =>
    item.titulo && typeof item.titulo === "string" && item.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const handlePress = (item) => {
    router.push({
      pathname: "/(tabs)/DetailsScreen",
      params: { id: item.id, titulo: item.titulo },
    });
  };

  // Limitar receitas inicialmente
  const displayedData = showAll ? filteredData : filteredData.slice(0, 5);

  return (
    <View style={styles.container}>
      <Header />
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar receitas..."
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <Text style={styles.header}>Explorar Receitas</Text>
      <FlatList
        data={displayedData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
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
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.titulo}</Text>
              <Text style={styles.description}>{item.descricao}</Text>
              <View style={styles.footer}>
                <Text style={styles.time}>{item.tempo_preparo} min</Text>
                <TouchableOpacity>
                  <Text style={styles.favorite}>{item.favorita ? "❤️" : "♡"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {!showAll && (
        <TouchableOpacity onPress={() => setShowAll(true)}>
          <Text style={styles.readMore}>LER MAIS</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFC",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  filterButton: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  filterText: {
    fontSize: 14,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  searchBar: {
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 12,
    color: "#2e7d32",
  },
  favorite: {
    fontSize: 16,
    color: "#e53935",
  },
  readMore: {
    textAlign: "center",
    fontSize: 16,
    color: "#2e7d32",
    marginVertical: 16,
    fontWeight: "bold",
  },
});
