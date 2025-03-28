
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name: string;
  gender?: string;
  mobile?: string;
  profileImage?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, gender?: string, mobile?: string, profileImage?: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication functions for demo
const mockLogin = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Valid demo account
      if (email === "demo@ventigrow.com" && password === "password") {
        resolve({
          id: "1",
          email: "demo@ventigrow.com",
          name: "Demo User",
          location: "Central Valley, CA",
        });
      } 
      // Added user's credentials as valid login
      else if (email === "bhaveshsonawane@gmail.com" && password === "Bhavesh@12334") {
        resolve({
          id: "2",
          email: "bhaveshsonawane@gmail.com",
          name: "Bhavesh Sonawane",
          location: "Mumbai, India",
        });
      } 
      // Allow any login for demo purposes with minimum validation
      else if (email.includes('@') && email.includes('.') && password.length >= 6) {
        const name = email.split('@')[0];
        resolve({
          id: Math.random().toString(36).substring(2, 9),
          email,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          location: "New Greenhouse Location",
        });
      }
      else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

const mockSignup = async (
  email: string,
  password: string,
  name: string,
  gender?: string,
  mobile?: string,
  profileImage?: string
): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        gender,
        mobile,
        profileImage,
        location: "New User Location",
      });
    }, 1000);
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("ventigrow-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await mockLogin(email, password);
      setUser(user);
      localStorage.setItem("ventigrow-user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    gender?: string, 
    mobile?: string,
    profileImage?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const user = await mockSignup(email, password, name, gender, mobile, profileImage);
      setUser(user);
      localStorage.setItem("ventigrow-user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("ventigrow-user", JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ventigrow-user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, error, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
