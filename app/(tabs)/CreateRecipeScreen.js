import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function CreateRecipeScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const [novoIngrediente, setNovoIngrediente] = useState("");
  const [modoPreparo, setModoPreparo] = useState("");
  const [imagem, setImagem] = useState(null);

  const selecionarImagem = async () => {
    try {
      // Solicitar permissões
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Erro", "Permissão para acessar a galeria é necessária!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setImagem(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const adicionarIngrediente = () => {
    if (novoIngrediente.trim()) {
      setIngredientes(prev => [...prev, novoIngrediente.trim()]);
      setNovoIngrediente("");
    }
  };

  const removerIngrediente = (index) => {
    setIngredientes(prev => prev.filter((_, i) => i !== index));
  };

  const excluirReceita = () => {
    Alert.alert(
      "Cancelar",
      "Tem certeza que deseja cancelar a criação da receita?",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", style: "destructive", onPress: () => router.back() }
      ]
    );
  };

  const adicionarReceita = async () => {
    if (!titulo || !descricao || !modoPreparo) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    if (ingredientes.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos um ingrediente");
      return;
    }

    try {
      console.log('Tentando enviar para:', `${process.env.EXPO_PUBLIC_API_URL}/api/receitas`);
      
      const ingredientesString = ingredientes.join(", ");
      
      // Primeiro, vamos testar com um objeto simples em vez de FormData
      const receitaData = {
        titulo,
        descricao,
        ingredientes: ingredientesString,
        modo_preparo: modoPreparo,
        tempo_preparo: "30",
        categoria: "Geral",
        usuario_id: "1"
      };

      console.log('Dados a serem enviados:', receitaData);

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/receitas`,
        receitaData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log('Resposta da API:', response.data);
      Alert.alert("Sucesso", "Receita criada com sucesso!");
      
      // Limpar campos
      setTitulo("");
      setDescricao("");
      setIngredientes([]);
      setModoPreparo("");
      setImagem(null);
      
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data || error.message);
      console.error("Status:", error.response?.status);
      
      if (error.response?.status === 404) {
        Alert.alert("Erro", "Endpoint não encontrado. Verifique se a API está rodando.");
      } else {
        Alert.alert("Erro", "Não foi possível criar a receita. Tente novamente.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={excluirReceita}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Receita</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.imageContainer} onPress={selecionarImagem}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageIcon}>📷</Text>
              <Text style={styles.imageText}>Adicionar Foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Título da Receita</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Digite o título da receita"
          />

          <Text style={styles.label}>Descrição/Resumo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Digite uma breve descrição da receita"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.sectionTitle}>Ingredientes</Text>
          
          <View style={styles.addIngredientContainer}>
            <TextInput
              style={styles.ingredientInput}
              value={novoIngrediente}
              onChangeText={setNovoIngrediente}
              placeholder="Digite um ingrediente"
              onSubmitEditing={adicionarIngrediente}
            />
            <TouchableOpacity style={styles.addButton} onPress={adicionarIngrediente}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ingredientsList}>
            {ingredientes.map((ingrediente, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>{ingrediente}</Text>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removerIngrediente(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={styles.label}>Modo de Preparo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={modoPreparo}
            onChangeText={setModoPreparo}
            placeholder="Digite o modo de preparo da receita"
            multiline
            numberOfLines={6}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addRecipeButton} onPress={adicionarReceita}>
          <Text style={styles.addRecipeButtonText}>ADICIONAR RECEITA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    fontSize: 24,
    color: "#333333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  imageIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  imageText: {
    fontSize: 16,
    color: "#666666",
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 25,
    marginBottom: 15,
  },
  addIngredientContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  ingredientInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  addButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  ingredientsList: {
    marginBottom: 20,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  removeButton: {
    backgroundColor: "#FF4444",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  addRecipeButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  addRecipeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
