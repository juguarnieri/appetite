import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (e) {
      console.error("Erro ao restaurar sessão:", e);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, nome) => {
    try {
      if (!email || !password || !nome) {
        return { success: false, message: "Preencha todos os campos" };
      }

      const usuarioExistente = await AsyncStorage.getItem(`user_${email}`);
      if (usuarioExistente) {
        return { success: false, message: "Email já cadastrado" };
      }

      const token = `token_${Date.now()}`;
      const userData = { id: 1, email, nome, token };

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("lastEmail", email);
      await AsyncStorage.setItem(`user_${email}`, JSON.stringify({ ...userData, password }));

      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      return { success: false, message: "Erro ao criar conta" };
    }
  };

  const signIn = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, message: "Email e senha obrigatórios" };
      }

      const usuarioData = await AsyncStorage.getItem(`user_${email}`);
      if (!usuarioData) {
        console.log(`❌ Usuário não encontrado para: ${email}`);
        return { success: false, message: "Email ou senha incorretos" };
      }

      const usuario = JSON.parse(usuarioData);
      console.log(`✅ Usuário encontrado:`, usuario);
      
      if (usuario.password !== password) {
        console.log(`❌ Senha incorreta. Esperado: ${usuario.password}, Recebido: ${password}`);
        return { success: false, message: "Email ou senha incorretos" };
      }

      const token = `token_${Date.now()}`;
      const userData = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        token 
      };

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("lastEmail", email);

      setUser(userData);
      console.log(`✅ Login realizado com sucesso para:`, email);
      return { success: true };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return { success: false, message: "Erro ao fazer login" };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
