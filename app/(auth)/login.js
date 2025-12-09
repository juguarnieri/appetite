import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,  
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { Link } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const last = await getLastUserEmail();
        if (mounted && last) setEmail(last);
      } catch (e) {
        // ignore
      }
    })();

    return () => (mounted = false);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email, password);

      if (result.success) {
        console.log('✅ Login bem-sucedido, navegando para home...');
        // ✅ Aguardar um pouco e depois navegar
        setTimeout(() => {
          router.replace("/(tabs)/home");
        }, 500);
      } else {
        Alert.alert("Erro", result.message || "Falha ao fazer login");
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Erro:', error);
      Alert.alert("Erro", "Falha ao fazer login");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Image source={require('../../assets/logoAppetite.png')} style={styles.logo} />
        <Text style={styles.title}>Entrar na sua conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem conta? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.infoText}>
          💡 Dica: Se não tiver conta, crie uma nova!
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFC",
  },
  content: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Arial",
  },
  input: {
    backgroundColor: "#e4f1da",
    borderRadius: 12,
    width: "90%",
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    color: "black",
    outlineStyle: "none",
    placeholderTextColor: "#797979",
  },
  button: {
    backgroundColor: "#035810",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    minHeight: 50,
    width: "70%",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#797979",
    fontSize: 14,
  },
  registerLink: {
    color: "#00AD1A",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoText: {
    marginTop: 30,
    textAlign: "center",
    color: "#797979",
    fontSize: 14,
    paddingHorizontal: 20,
  },
});
