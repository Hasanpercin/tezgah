
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
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
    // Auth durumu değiştiğinde tetiklenecek fonksiyon
    const handleAuthChange = async (newSession: Session | null) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      // Kullanıcı varsa profilini yükle
      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    };

    // Mevcut oturumu kontrol et
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        await handleAuthChange(data.session);
      } catch (error) {
        console.error('Oturum kontrolü sırasında hata oluştu:', error);
        setIsLoading(false);
      }
    };

    // Auth durum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        // setTimeout kullanarak diğer Supabase çağrılarını erteliyoruz
        setTimeout(() => handleAuthChange(newSession), 0);
      }
    );

    // İlk yükleme kontrolü
    checkSession();

    // Temizleme işlevi
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Kullanıcı profilini getir
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

  // Giriş yap
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

  // Kayıt ol
  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Kayıt sırasında hata:', error.message);
      return { 
        success: false, 
        error: error.message || 'Kayıt sırasında bir hata oluştu'
      };
    }
  };

  // Çıkış yap
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

  // Profil güncelle
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

      // Güncellenmiş profili yeniden yükle
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
      logout,
      updateProfile
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
