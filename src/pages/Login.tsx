
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Hero from '@/components/Hero';
import { Label } from '@/components/ui/label';

const Login = () => {
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Giriş formu
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Kayıt formu
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const from = location.state?.from?.pathname || '/profile';

  // Kullanıcı zaten giriş yapmışsa yönlendir
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      const { email, password } = loginData;
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "Giriş başarılı",
          description: "Hoş geldiniz!",
          variant: "default",
        });
        navigate(from);
      } else {
        toast({
          title: "Giriş başarısız",
          description: result.error || "Bir hata oluştu, lütfen tekrar deneyin.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Giriş başarısız",
        description: "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword } = registerData;
    
    // Form doğrulama
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Şifreler eşleşmiyor",
        description: "Girdiğiniz şifreler aynı değil.",
        variant: "destructive",
      });
      return;
    }

    setIsRegisterLoading(true);

    try {
      const result = await signup(email, password, name);
      
      if (result.success) {
        toast({
          title: "Kayıt başarılı",
          description: "Hesabınız oluşturuldu ve giriş yaptınız.",
          variant: "default",
        });
        navigate(from);
      } else {
        toast({
          title: "Kayıt başarısız",
          description: result.error || "Bir hata oluştu, lütfen tekrar deneyin.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      toast({
        title: "Kayıt başarısız",
        description: "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const heroImage = "/lovable-uploads/ea00899c-1323-4ef2-b182-0836dd3edf42.png";

  return (
    <div className="min-h-screen">
      <Hero 
        backgroundImage={heroImage}
        title="Hesabınıza Erişin"
        subtitle="Giriş yapın veya yeni bir hesap oluşturun"
        showButtons={false}
        overlayColor="green-600/70"
      />
      
      <section className="section-padding bg-white">
        <div className="container-custom max-w-md">
          <Card>
            <div className="p-6">
              <Tabs 
                defaultValue="login" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                  <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">E-posta</Label>
                      <Input 
                        id="login-email" 
                        type="email" 
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        placeholder="E-posta adresiniz"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="login-password">Şifre</Label>
                      <Input 
                        id="login-password" 
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        placeholder="Şifreniz"
                        required
                      />
                    </div>
                    
                    <Button type="submit" disabled={isLoginLoading} className="w-full">
                      {isLoginLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Hesabınız yok mu? 
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab('register')}
                        className="p-0 h-auto ml-1"
                      >
                        Kayıt olun
                      </Button>
                    </p>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Ad Soyad</Label>
                      <Input 
                        id="register-name" 
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                  
                    <div>
                      <Label htmlFor="register-email">E-posta</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        placeholder="E-posta adresiniz"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="register-password">Şifre</Label>
                      <Input 
                        id="register-password" 
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        placeholder="Şifreniz (en az 6 karakter)"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-confirm-password">Şifre Tekrar</Label>
                      <Input 
                        id="register-confirm-password" 
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        placeholder="Şifrenizi tekrar girin"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <Button type="submit" disabled={isRegisterLoading} className="w-full">
                      {isRegisterLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Zaten hesabınız var mı? 
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab('login')}
                        className="p-0 h-auto ml-1"
                      >
                        Giriş yapın
                      </Button>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Login;
