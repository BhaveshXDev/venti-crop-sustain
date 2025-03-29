import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
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
  logout: () => Promise<void>;
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
    const initializeAuth = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }

      await handleSessionChange(currentSession);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        await handleSessionChange(currentSession);
        if (event === 'SIGNED_IN') navigate('/dashboard');
        if (event === 'SIGNED_OUT') navigate('/login');
      }
    );

    initializeAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSessionChange = async (currentSession: Session | null) => {
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
          name: profileData?.name || currentSession.user.user_metadata?.name || "",
          gender: profileData?.gender,
          mobile: profileData?.mobile,
          profileImage: profileData?.profile_image_url,
          location: profileData?.location,
        };
        
        setUser(userProfile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUser({
          id: currentSession.user.id,
          email: currentSession.user.email || "",
          name: currentSession.user.user_metadata?.name || "",
        });
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success("Logged in successfully");
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast.error(err.message || "Invalid email or password");
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
      // First upload profile image if exists
      let profileImageUrl = null;
      if (profileImage) {
        const fileExt = profileImage.split(';')[0].split('/')[1];
        const fileName = `profile-${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, dataURLtoBlob(profileImage));

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          profileImageUrl = publicUrl;
        }
      }

      // Then create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // Create profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email,
          name,
          gender,
          mobile,
          profile_image_url: profileImageUrl,
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) throw profileError;
      
      toast.success("Sign up successful! Please check your email for verification.");
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
      const updates: any = { ...data };
      if ('profileImage' in data && data.profileImage) {
        const fileExt = data.profileImage.split(';')[0].split('/')[1];
        const fileName = `profile-${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, dataURLtoBlob(data.profileImage));

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          updates.profile_image_url = publicUrl;
        }
        delete updates.profileImage;
      }
      
      updates.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser({ ...user, ...updates });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
    } catch (err: any) {
      toast.error(err.message || "Logout failed");
    }
  };

  const dataURLtoBlob = (dataURL: string) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session, 
        loading, 
        login, 
        signup, 
        logout, 
        error, 
        updateUserProfile 
      }}
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
