import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getUser,
  saveUser,
  removeUser,
  validateLogin,
  saveNewUser,
  saveLastUserEmail,
} from "../utils/storage";
import { useRouter, useSegments } from "expo-router";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Carregar usuário do AsyncStorage ao iniciar
  useEffect(() => {
    loadUser();
  }, []);

  // Proteger rotas baseado em autenticação
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  }, [user, segments, isLoading]);

  const loadUser = async () => {
    try {
      const storedUser = await getUser();
      setUser(storedUser);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await validateLogin(email, password);

      if (result.success) {
        // salvar último email usado para facilitar re-login
        await saveLastUserEmail(result.user.email);
        setUser(result.user);
        await saveUser(result.user);
        return { success: true };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return { success: false, message: "Erro ao fazer login" };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      const result = await saveNewUser(newUser);

      if (result.success) {
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        await saveUser(userWithoutPassword);
        // salvar último email usado após cadastro
        await saveLastUserEmail(userWithoutPassword.email);
        return { success: true };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      return { success: false, message: "Erro ao cadastrar usuário" };
    }
  };

  const signOut = async () => {
    try {
      // antes de remover a sessão, salvar o email atual para prefill
      if (user?.email) {
        await saveLastUserEmail(user.email);
      }
      await removeUser();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
