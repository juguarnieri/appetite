import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function CreateRecipeScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ingredientes, setIngredientes] = useState([{ id: 1, nome: '', quantidade: '' }]);
  const [modoPreparo, setModoPreparo] = useState('');
  const [tempoPreparo, setTempoPreparo] = useState('');
  const [categoria, setCategoria] = useState('1');
  const [dificuldade, setDificuldade] = useState('FACIL');
  const [imagem, setImagem] = useState(null);
  const [avaliacao, setAvaliacao] = useState(0);
  const [proximoId, setProximoId] = useState(2);

  const selecionarImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.cancelled) {
      setImagem(resultado.assets[0]);
    }
  };

  const adicionarIngrediente = () => {
    setIngredientes([...ingredientes, { id: proximoId, nome: '', quantidade: '' }]);
    setProximoId(proximoId + 1);
  };

  const removerIngrediente = (id) => {
    setIngredientes(ingredientes.filter(ing => ing.id !== id));
  };

  const atualizarIngrediente = (id, campo, valor) => {
    setIngredientes(ingredientes.map(ing => 
      ing.id === id ? { ...ing, [campo]: valor } : ing
    ));
  };

  const adicionarReceita = async () => {
    try {
      if (!titulo.trim()) {
        Alert.alert('Erro', 'Título é obrigatório');
        return;
      }

      if (avaliacao === 0) {
        Alert.alert('Erro', 'Selecione uma avaliação (estrelas)');
        return;
      }

      const ingredientesFormatados = ingredientes
        .filter(ing => ing.nome.trim() !== '')
        .map(ing => `${ing.nome} (${ing.quantidade})`)
        .join(', ');

      const formData = new FormData();
      formData.append('titulo', titulo.trim());
      formData.append('descricao', descricao.trim());
      formData.append('ingredientes', ingredientesFormatados);
      formData.append('modo_preparo', modoPreparo.trim());
      formData.append('tempo_preparo', String(parseInt(tempoPreparo) || 0));
      formData.append('categoria_id', String(parseInt(categoria)));
      formData.append('dificuldade', dificuldade);
      formData.append('usuario_id', '1');
      formData.append('avaliacao', String(avaliacao));

      if (imagem && imagem.uri) {
        const response = await fetch(imagem.uri);
        const blob = await response.blob();
        
        formData.append('imagem', {
          uri: imagem.uri,
          type: blob.type || 'image/jpeg',
          name: `receita-${Date.now()}.jpg`,
        });
      }

      console.log('Enviando receita com avaliação:', avaliacao);

      const axiosResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/receitas`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Sucesso:', axiosResponse.data);
      Alert.alert('Sucesso', 'Receita adicionada com sucesso!');
      
      setTitulo('');
      setDescricao('');
      setIngredientes([{ id: 1, nome: '', quantidade: '' }]);
      setModoPreparo('');
      setTempoPreparo('');
      setCategoria('1');
      setDificuldade('FACIL');
      setImagem(null);
      setAvaliacao(0);
      setProximoId(2);
      
      router.push('/(tabs)/home');
    } catch (error) {
      if (error.response?.data?.details?.includes('unique constraint')) {
        Alert.alert('Erro', 'Essa receita já existe! Use outro título.');
      } else {
        console.error('Erro detalhado:', error.response?.data || error.message);
        Alert.alert('Erro', error.response?.data?.error || 'Erro ao adicionar receita');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com seta de voltar */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Receita</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.imagemButton} onPress={selecionarImagem}>
          {imagem ? (
            <Image source={{ uri: imagem.uri }} style={styles.imagemPreview} />
          ) : (
            <Text style={styles.imagemButtonText}>📷 Selecionar Imagem</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Título da receita"
          value={titulo}
          onChangeText={setTitulo}
        />

        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <Text style={styles.label}>Categoria:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoria}
            onValueChange={setCategoria}
            style={styles.picker}
          >
            <Picker.Item label="Sobremesas" value="1" />
            <Picker.Item label="Lanches" value="2" />
            <Picker.Item label="Diet" value="3" />           {/* Mudado de 'Diets' para 'Diet' */}
            <Picker.Item label="Vegetariano" value="4" />
            <Picker.Item label="Bebidas" value="5" />
          </Picker>
        </View>

        <Text style={styles.label}>Nível de Dificuldade:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={dificuldade}
            onValueChange={setDificuldade}
            style={styles.picker}
          >
            <Picker.Item label="Fácil" value="FACIL" />
            <Picker.Item label="Médio" value="MEDIO" />
            <Picker.Item label="Difícil" value="DIFICIL" />
          </Picker>
        </View>

        <Text style={styles.label}>Avaliação:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star}
              onPress={() => setAvaliacao(star)}
              style={styles.starButton}
            >
              <Ionicons 
                name={star <= avaliacao ? "star" : "star-outline"} 
                size={32} 
                color="#FFD700" 
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Ingredientes:</Text>
        <View style={styles.ingredientesWrapper}>
          {ingredientes.map((item) => (
            <View key={item.id} style={styles.ingredienteContainer}>
              <TextInput
                style={[styles.input, { flex: 2, marginRight: 10, marginBottom: 0 }]}
                placeholder="Nome do ingrediente"
                value={item.nome}
                onChangeText={(valor) => atualizarIngrediente(item.id, 'nome', valor)}
              />
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10, marginBottom: 0 }]}
                placeholder="Qty"
                value={item.quantidade}
                onChangeText={(valor) => atualizarIngrediente(item.id, 'quantidade', valor)}
              />
              <TouchableOpacity 
                style={styles.removerButton}
                onPress={() => removerIngrediente(item.id)}
              >
                <Ionicons name="trash" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.adicionarButton} onPress={adicionarIngrediente}>
          <Ionicons name="add-circle" size={24} color="#2E7D32" />
          <Text style={styles.adicionarButtonText}>Adicionar Ingrediente</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Modo de preparo"
          value={modoPreparo}
          onChangeText={setModoPreparo}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={styles.input}
          placeholder="Tempo de preparo (minutos)"
          value={tempoPreparo}
          onChangeText={setTempoPreparo}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={adicionarReceita}>
          <Text style={styles.buttonText}>Adicionar Receita</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCFC',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFCFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  backButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  imagemButton: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 10,
    padding: 40,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  imagemButtonText: {
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: '600',
  },
  imagemPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  starButton: {
    padding: 8,
  },
  ingredientesWrapper: {
    marginBottom: 15,
  },
  ingredienteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  removerButton: {
    padding: 10,
  },
  adicionarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  adicionarButtonText: {
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});