import { createContext, useContext, useEffect, useState } from "react";
import { me, login as loginAPI, signup, logout as logoutAPI, updateProfile as updateProfileAPI, getAllUsers as getAllUsersAPI } from "../api/auth";
import { type User, type AuthState } from '@/types';
import { initSocket, getSocket } from "../lib/socket";


interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refetchUser: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  getAllUsers: () => User[];
  refetchUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [users, setUsers] = useState<User[]>([]);

  const refetchUser = async () => {
    try {
      const res = await me();
      const user = res.data.user;
      setState({
        user: user,
        isAuthenticated: !!user,
        isLoading: false,
      });
      
      // Initialize socket connection when user is authenticated
      if (user) {
        initSocket(user.id);
        // Also fetch users when authenticated
        refetchUsers();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const refetchUsers = async () => {
    try {
      const res = await getAllUsersAPI();
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await loginAPI({ email, password });
      const user = res.data.user;
      
      if (!user) {
        return { success: false, error: 'Invalid response from server' };
      }
      
      setState({
        user: user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Initialize socket connection on login
      initSocket(user.id);
      
      // Fetch all users
      refetchUsers();
      
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      
      // Make sure we set auth state to false on error
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await signup({ email, password, name });
      const user = res.data.user;
      
      if (!user) {
        return { success: false, error: 'Invalid response from server' };
      }
      
      setState({
        user: user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Initialize socket connection on register
      initSocket(user.id);
      
      // Fetch all users
      refetchUsers();
      
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      
      // Make sure we set auth state to false on error
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout to clear session/cookie
      await logoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Disconnect socket on logout
      const socket = getSocket();
      if (socket) {
        socket.disconnect();
      }
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Clear users list
      setUsers([]);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!state.user) {
      return { success: false, error: 'No user logged in' };
    }

    if (!updates.name || typeof updates.name !== 'string' || updates.name.trim().length === 0) {
      return { success: false, error: 'Name is required' };
    }

    try {
      const res = await updateProfileAPI({ name: updates.name.trim() });
      const updatedUser = res.data.user;
      
      if (!updatedUser) {
        return { success: false, error: 'Invalid response from server' };
      }
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      return { success: false, error: errorMessage };
    }
  };

  const getAllUsers = (): User[] => {
    return users;
  };

  // Check authentication on mount
  useEffect(() => {
    refetchUser();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refetchUser,
    updateProfile,
    getAllUsers,
    refetchUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}