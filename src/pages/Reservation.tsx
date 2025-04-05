
import Hero from '@/components/Hero';
import { Clock, Phone } from 'lucide-react';
import MultiStepReservation from '@/components/reservation/MultiStepReservation';

const Reservation = () => {
  const heroImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title="Rezervasyon"
        subtitle="Özel anlarınız için masanızı şimdiden ayırtın"
        showButtons={false}
      />
      
      {/* Reservation Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Masa Rezervasyonu</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Özel anlarınızı unutulmaz kılmak için bize katılın. İsterseniz menülerimizi önceden inceleyip siparişinizi verebilir veya sadece masa ayırtabilirsiniz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Info Section */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 font-playfair">Çalışma Saatleri</h3>
                
                <div className="flex items-start space-x-3 mb-4">
                  <Clock className="mt-1 flex-shrink-0 text-primary" size={18} />
                  <div>
                    <p className="font-medium">Pazartesi - Cuma</p>
                    <p className="text-muted-foreground">11:00 - 23:00</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="mt-1 flex-shrink-0 text-primary" size={18} />
                  <div>
                    <p className="font-medium">Cumartesi - Pazar</p>
                    <p className="text-muted-foreground">10:00 - 00:00</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 font-playfair">Telefonla Rezervasyon</h3>
                
                <div className="flex items-center space-x-3">
                  <Phone className="flex-shrink-0 text-primary" size={18} />
                  <p className="font-medium">+90 212 123 45 67</p>
                </div>
                
                <p className="mt-4 text-sm text-muted-foreground">
                  Özel etkinlikler ve 10+ kişilik rezervasyonlar için lütfen bizi telefonla arayınız.
                </p>
              </div>
            </div>
            
            {/* Form Section */}
            <div className="lg:col-span-4">
              <MultiStepReservation />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservation;
