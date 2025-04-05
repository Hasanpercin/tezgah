
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { Skeleton } from '@/components/ui/skeleton';

const Contact = () => {
  const { content, isLoading } = useWebsiteContent('contact');

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Skeleton className="h-12 w-1/3 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-muted py-12">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sorularınız veya geri bildirimleriniz için bizimle iletişime geçin.
          </p>
        </div>
      </div>
      
      {/* Contact Info & Form */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Adres</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{content.address || "Örnek Mahallesi, Lezzet Sokak No: 123\nKadıköy, İstanbul"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Telefon</h3>
                  <p className="text-muted-foreground">{content.phone || "+90 (212) 123 45 67"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">E-posta</h3>
                  <p className="text-muted-foreground">{content.email || "info@lezzetduragi.com"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Çalışma Saatleri</h3>
                  <div className="space-y-1 text-muted-foreground">
                    <p>{content.hours_weekday_label || "Pazartesi - Cuma"}: {content.hours_weekday_value || "10:00 - 22:00"}</p>
                    <p>{content.hours_weekend_label || "Cumartesi - Pazar"}: {content.hours_weekend_value || "09:00 - 23:00"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Bize Mesaj Gönderin</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      
      {/* Google Maps */}
      <div className="pb-16">
        <div className="container mx-auto px-4">
          <div className="border rounded-lg overflow-hidden h-[400px]">
            {content.maps_embed ? (
              <div dangerouslySetInnerHTML={{ __html: content.maps_embed }} className="w-full h-full" />
            ) : (
              <div className="bg-muted w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Harita konumu CMS'de ayarlanmamış</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Social Media Links */}
      {(content.instagram || content.facebook || content.twitter) && (
        <div className="pb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold mb-6 text-center">Sosyal Medyada Bizi Takip Edin</h2>
            <div className="flex justify-center gap-6">
              {content.instagram && (
                <a 
                  href={content.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-4 rounded-full hover:bg-primary/20 transition-colors"
                >
                  <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              
              {content.facebook && (
                <a 
                  href={content.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-4 rounded-full hover:bg-primary/20 transition-colors"
                >
                  <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19.94 5.066a6.48 6.48 0 0 0-1.653-2.354 6.483 6.483 0 0 0-2.353-1.654C14.713.5 13.11.5 12 .5s-2.713 0-3.934.558a6.483 6.483 0 0 0-2.353 1.654A6.48 6.48 0 0 0 4.06 5.066C3.5 6.287 3.5 7.889 3.5 9s0 2.713.558 3.934a6.48 6.48 0 0 0 1.653 2.354 6.483 6.483 0 0 0 2.353 1.654C9.287 17.5 10.889 17.5 12 17.5s2.713 0 3.934-.558a6.483 6.483 0 0 0 2.353-1.654 6.48 6.48 0 0 0 1.653-2.354c.558-1.221.558-2.823.558-3.934s0-2.713-.558-3.934zm-1.699 7.543a4.488 4.488 0 0 1-1.147 1.631 4.49 4.49 0 0 1-1.63 1.147c-2.053.839-6.986.839-9.04 0a4.49 4.49 0 0 1-1.63-1.147 4.488 4.488 0 0 1-1.147-1.631c-.838-2.053-.838-6.986 0-9.04a4.488 4.488 0 0 1 1.147-1.63A4.49 4.49 0 0 1 7.542 1.8c2.053-.839 6.986-.839 9.04 0a4.49 4.49 0 0 1 1.63 1.147 4.488 4.488 0 0 1 1.147 1.631c.838 2.052.838 6.985 0 9.039z" />
                    <path fill="currentColor" d="M13 10.879V9h2V7h-2V6c0-.551.448-1 1-1h1V3h-1.5a2.5 2.5 0 0 0-2.5 2.5V7H9v2h2v6h2v-4.121z" />
                  </svg>
                </a>
              )}
              
              {content.twitter && (
                <a 
                  href={content.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-4 rounded-full hover:bg-primary/20 transition-colors"
                >
                  <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
