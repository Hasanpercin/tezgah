
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import UserReservations from '@/components/user/UserReservations';
import { Card, CardContent } from '@/components/ui/card';

const MyReservations = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-playfair font-semibold mb-4">Rezervasyonlarım</h2>
            <p className="text-muted-foreground mb-8">
              Rezervasyonlarınızı görüntülemek için lütfen giriş yapın.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <a href="/login">Giriş Yap</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/register">Kayıt Ol</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        <h2 className="text-3xl font-playfair font-semibold mb-4 text-center">Rezervasyonlarım</h2>
        <p className="text-muted-foreground mb-8 text-center">
          Tüm rezervasyonlarınızı bu sayfadan görüntüleyebilir ve yönetebilirsiniz.
        </p>
        
        <Card>
          <CardContent className="pt-6">
            <UserReservations />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyReservations;
