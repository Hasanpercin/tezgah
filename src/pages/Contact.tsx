
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Contact = () => {
  const heroImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title="İletişim"
        subtitle="Soru ve önerileriniz için bizimle iletişime geçin"
        showButtons={false}
      />
      
      {/* Contact Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 font-playfair">İletişim Bilgilerimiz</h2>
                <p className="text-lg mb-8">
                  Sorularınız, yorumlarınız veya rezervasyon için bizimle iletişime geçebilirsiniz.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="mt-1 flex-shrink-0 text-primary" size={22} />
                  <div>
                    <h3 className="font-medium text-lg">Adres</h3>
                    <p className="text-muted-foreground">Lezzet Caddesi, No:123</p>
                    <p className="text-muted-foreground">Şişli, İstanbul</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="mt-1 flex-shrink-0 text-primary" size={22} />
                  <div>
                    <h3 className="font-medium text-lg">Telefon</h3>
                    <p className="text-muted-foreground">+90 212 123 45 67</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="mt-1 flex-shrink-0 text-primary" size={22} />
                  <div>
                    <h3 className="font-medium text-lg">E-posta</h3>
                    <p className="text-muted-foreground">info@lezzetduragi.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="mt-1 flex-shrink-0 text-primary" size={22} />
                  <div>
                    <h3 className="font-medium text-lg">Çalışma Saatleri</h3>
                    <p className="text-muted-foreground">Pazartesi - Cuma: 11:00 - 23:00</p>
                    <p className="text-muted-foreground">Cumartesi - Pazar: 10:00 - 00:00</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Sosyal Medya</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-muted p-3 rounded-full hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="bg-muted p-3 rounded-full hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="bg-muted p-3 rounded-full hover:bg-primary hover:text-white transition-colors" aria-label="Twitter">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Map & Form */}
            <div className="lg:col-span-2 space-y-10">
              {/* Google Map */}
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48168.83165063752!2d28.939502823815495!3d41.039939902094545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2zxZ5pxZ9saSwgxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1656184212905!5m2!1str!2str" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                ></iframe>
              </div>
              
              {/* Contact Form */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 font-playfair">Bize Yazın</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
