import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  gender?: string;
  mobile?: string;
  profileImage?: string;
  location?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    gender?: string,
    mobile?: string,
    profileImage?: string
  ) => Promise<void>;
  logout: () => void;
  error: string | null;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentSession.user.id)
              .single();
              
            if (profileError) throw profileError;
            
            const userProfile: UserProfile = {
              id: currentSession.user.id,
              email: currentSession.user.email || "",
              name: profileData?.name || "",
              gender: profileData?.gender || undefined,
              mobile: profileData?.mobile || undefined,
              profileImage: profileData?.profile_image_url || undefined,
              location: profileData?.location || undefined,
            };
            
            setUser(userProfile);
          } catch (err) {
            console.error("Error fetching user profile:", err);
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || "",
              name: "",
            });
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (!data.session) {
        setLoading(false);
      }
    };

    initializeAuth();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            gender,
            mobile,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Sign up successful! Please check your email for verification.");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      if (data.name) {
        await supabase.auth.updateUser({
          data: { name: data.name }
        });
      }
      
      const updates = {
        name: data.name,
        gender: data.gender,
        mobile: data.mobile,
        profile_image_url: data.profileImage,
        location: data.location,
        updated_at: new Date().toISOString(), // Fix applied here
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser({ ...user, ...data });
    } catch (err: any) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", err);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, login, signup, logout, error, updateUserProfile }}
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
