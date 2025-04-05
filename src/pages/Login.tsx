
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Hero from '@/components/Hero';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      
      if (success) {
        toast({
          title: "Giriş başarılı",
          description: "Hoş geldiniz!",
          variant: "default",
        });
        navigate(from);
      } else {
        toast({
          title: "Giriş başarısız",
          description: "Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 800);
  };

  const heroImage = "/lovable-uploads/ea00899c-1323-4ef2-b182-0836dd3edf42.png";

  return (
    <div className="min-h-screen">
      <Hero 
        backgroundImage={heroImage}
        title="Giriş Yap"
        subtitle="Profil ve sadakat programı sayfalarına erişmek için giriş yapın"
        showButtons={false}
        overlayColor="green-600/70"
      />
      
      <section className="section-padding bg-white">
        <div className="container-custom max-w-md">
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Kullanıcı Girişi</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
                  <Input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı adınız"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">Şifre</label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifreniz"
                    required
                  />
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Demo hesap bilgileri:</strong><br />
                  Kullanıcı Adı: kullanici<br />
                  Şifre: sifre123
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Login;
