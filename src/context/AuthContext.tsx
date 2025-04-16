import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
};

export type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthChange = async (newSession: Session | null) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    };

    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        await handleAuthChange(data.session);
      } catch (error) {
        console.error('Oturum kontrolü sırasında hata oluştu:', error);
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setTimeout(() => handleAuthChange(newSession), 0);
      }
    );

    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Giriş sırasında hata:', error.message);
      return { 
        success: false, 
        error: error.message === 'Invalid login credentials'
          ? 'Geçersiz e-posta veya şifre'
          : error.message || 'Giriş yapılırken bir hata oluştu'
      };
    }
  };

  const signup = async (email: string, password: string, name: string, phone: string) => {
    try {
      // Check if user already exists before sign up attempt
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email);
        
      if (existingUsers && existingUsers.length > 0) {
        return {
          success: false,
          error: { message: 'Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var.' }
        };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Kayıt sırasında hata:', error.message);
      
      // Improve error messages
      let errorMessage = 'Kayıt sırasında bir hata oluştu';
      if (error.message === 'User already registered') {
        errorMessage = 'Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var.';
      }
      
      return { 
        success: false, 
        error: { message: errorMessage }
      };
    }
  };

  const signUp = signup;

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Şifre sıfırlama sırasında hata:', error.message);
      return { 
        success: false, 
        error: error.message || 'Şifre sıfırlama işlemi başarısız oldu.'
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('Kullanıcı oturum açmış değil');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile(user.id);
      
      return { success: true };
    } catch (error: any) {
      console.error('Profil güncellenirken hata:', error.message);
      return { 
        success: false, 
        error: error.message || 'Profil güncellenirken bir hata oluştu'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      profile,
      isLoading,
      isAuthenticated: !!user, 
      login,
      signup,
      signUp,
      logout,
      updateProfile,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
