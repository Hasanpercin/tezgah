
import Hero from '@/components/Hero';

const AboutUs = () => {
  const heroImage = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title="Hakkımızda"
        subtitle="Hikayemiz, vizyonumuz ve tutkumuz"
        showButtons={false}
      />
      
      {/* About Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 font-playfair">Hikayemiz</h2>
              <p className="text-lg mb-4">
                Lezzet Durağı, 2010 yılında İstanbul'un merkezinde, Şef Ahmet Yılmaz'ın geleneksel tatları modern sunumlarla buluşturma hayaliyle kuruldu. İlk günden bu yana amacımız, misafirlerimize sadece lezzetli yemekler değil, unutulmaz bir deneyim sunmaktır.
              </p>
              <p className="text-lg mb-4">
                Menümüzdeki her yemek, uzun yılların birikimi, deneyimi ve tutkusunu taşır. Taze, mevsimsel ve mümkün olduğunca yerel malzemeler kullanarak, geleneksel tarifleri modern dokunuşlarla yeniden yorumluyoruz.
              </p>
              <p className="text-lg">
                Bugün, Lezzet Durağı olarak İstanbul'un en sevilen restoranlarından biri olmaktan ve her gün yeni misafirler ağırlamaktan gurur duyuyoruz.
              </p>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800" 
                alt="Restaurant Chef" 
                className="rounded-lg w-full h-auto object-cover shadow-lg"
              />
              <div className="absolute -bottom-10 -left-10 w-64 h-40 p-6 bg-white shadow-lg rounded-lg hidden md:block">
                <p className="text-lg font-medium italic">
                  "Her tabak, bir hikaye anlatmalı ve bir duygu uyandırmalı."
                </p>
                <p className="mt-2 font-medium text-primary">— Şef Ahmet Yılmaz</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold font-playfair">Misyonumuz</h2>
              <p className="text-lg">
                Lezzet Durağı olarak misyonumuz, en taze ve kaliteli malzemeleri kullanarak hazırladığımız yemeklerle misafirlerimize unutulmaz bir deneyim sunmak, Türk mutfağının zengin mirasını korurken yenilikçi yaklaşımlarla global tatları da sunabilmektir.
              </p>
              <p className="text-lg">
                Her bir misafirimizi ailemizin bir parçası olarak görüyor ve herkesin kendini evinde hissedeceği sıcak bir ortam yaratmayı hedefliyoruz.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold font-playfair">Vizyonumuz</h2>
              <p className="text-lg">
                İstanbul'un en sevilen ve saygı duyulan restoranlarından biri olmaya devam etmek, misafirlerimize sürekli olarak en yüksek kalitede yemek ve hizmet sunmak ve Türk mutfağını dünyaya tanıtmak için bir köprü olmak.
              </p>
              <p className="text-lg">
                Sürdürülebilir uygulamaları benimseyerek çevreye olan etkimizi en aza indirmek ve yerel toplulukları destekleyerek sosyal sorumluluğumuzu yerine getirmek vizyonumuzun önemli bir parçasıdır.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 font-playfair">Ekibimiz</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lezzet Durağı'nın arkasındaki tutkulu ve yaratıcı insanlarla tanışın
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Chef */}
            <div className="text-center">
              <div className="mb-4 relative mx-auto rounded-full w-48 h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400" 
                  alt="Head Chef" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-medium font-playfair">Ahmet Yılmaz</h3>
              <p className="text-primary font-medium">Baş Şef</p>
              <p className="mt-3 text-muted-foreground">
                15 yıllık tecrübesiyle Lezzet Durağı'nın kurucusu ve yaratıcı beyni.
              </p>
            </div>
            
            {/* Restaurant Manager */}
            <div className="text-center">
              <div className="mb-4 relative mx-auto rounded-full w-48 h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400" 
                  alt="Restaurant Manager" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-medium font-playfair">Ayşe Demir</h3>
              <p className="text-primary font-medium">Restoran Müdürü</p>
              <p className="mt-3 text-muted-foreground">
                Mükemmel misafir deneyimi ve ekip yönetimi konusunda uzman.
              </p>
            </div>
            
            {/* Sous Chef */}
            <div className="text-center">
              <div className="mb-4 relative mx-auto rounded-full w-48 h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400" 
                  alt="Sous Chef" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-medium font-playfair">Mehmet Kaya</h3>
              <p className="text-primary font-medium">Sous Şef</p>
              <p className="mt-3 text-muted-foreground">
                İnovatif yaklaşımı ve detaylara olan tutkusuyla tanınan yardımcı şefimiz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
