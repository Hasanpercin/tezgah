
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Hata",
        description: "Lütfen email adresinizi girin.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.error) {
        throw result.error;
      }

      setIsSuccess(true);
      toast({
        title: "Email Gönderildi",
        description: "Şifre sıfırlama bağlantısı gönderildi. Lütfen e-posta kutunuzu kontrol edin.",
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Şifre sıfırlama işlemi başarısız oldu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Şifre Sıfırlama</CardTitle>
          <CardDescription>
            Email adresinize şifre sıfırlama bağlantısı göndereceğiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center p-6">
              <div className="bg-green-100 text-green-700 rounded-md p-4 mb-4">
                Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
              </div>
              <p className="text-muted-foreground mb-4">
                Lütfen e-posta kutunuzu kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    İşlem yapılıyor...
                  </>
                ) : (
                  "Şifre Sıfırlama Bağlantısı Gönder"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-center w-full text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-primary underline underline-offset-4">
              Giriş sayfasına dön
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
