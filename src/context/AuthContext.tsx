import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@company.com',
  role: 'user',
  department: 'Engineering',
  position: 'Software Developer',
  leaveBalance: {
    vacation: 24,
    sick: 10,
    personal: 5
  }
};

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real application, you would authenticate against a backend
    if (email && password) {
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}