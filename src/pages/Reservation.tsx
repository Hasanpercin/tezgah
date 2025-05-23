
import Hero from '@/components/Hero';
import { Clock, Phone } from 'lucide-react';
import MultiStepReservation from '@/components/reservation/MultiStepReservation';
import { useIsMobile } from '@/hooks/use-mobile';

const Reservation = () => {
  const heroImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";
  const isMobile = useIsMobile();
  
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
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Info Section - Enhanced Design */}
            <div className={`${isMobile ? 'order-2' : 'order-1'} lg:col-span-1 space-y-6`}>
              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 font-playfair text-primary">Çalışma Saatleri</h3>
                
                <div className="flex items-start space-x-3 mb-4 group hover:bg-white/50 p-2 rounded-md transition-colors">
                  <Clock className="mt-1 flex-shrink-0 text-primary" size={20} />
                  <div>
                    <p className="font-medium">Pazartesi - Cuma</p>
                    <p className="text-muted-foreground">11:00 - 24:00</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group hover:bg-white/50 p-2 rounded-md transition-colors">
                  <Clock className="mt-1 flex-shrink-0 text-primary" size={20} />
                  <div>
                    <p className="font-medium">Cumartesi - Pazar</p>
                    <p className="text-muted-foreground">11:00 - 02:00</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/20 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 font-playfair text-secondary-foreground">Telefonla Rezervasyon</h3>
                
                <div className="flex items-center space-x-3 group hover:bg-white/50 p-2 rounded-md transition-colors">
                  <Phone className="flex-shrink-0 text-secondary" size={20} />
                  <p className="font-medium">+90 554 434 60 68</p>
                </div>
                
                <p className="mt-4 text-sm text-muted-foreground">
                  Özel etkinlikler ve 10+ kişilik rezervasyonlar için lütfen bizi telefonla arayınız.
                </p>
              </div>
            </div>
            
            {/* Form Section */}
            <div className={`${isMobile ? 'order-1' : 'order-2'} lg:col-span-4`}>
              <MultiStepReservation />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservation;
