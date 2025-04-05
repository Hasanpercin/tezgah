
import Hero from '@/components/Hero';
import MenuCategory, { MenuCategoryType } from '@/components/MenuCategory';

const Menu = () => {
  const heroImage = "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";
  
  const menuCategories: MenuCategoryType[] = [
    {
      id: "starters",
      name: "Başlangıçlar",
      items: [
        {
          id: 1,
          name: "Mevsim Salatası",
          description: "Taze mevsim sebzeleri, akdeniz yeşillikleri, kiraz domates, salatalık ve özel sos ile",
          price: "₺75",
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
        },
        {
          id: 2,
          name: "Humus Tabağı",
          description: "Nohut püresi, susam ezmesi (tahini), zeytinyağı, limon ve baharatlar ile",
          price: "₺65",
        },
        {
          id: 3,
          name: "Peynir Tabağı",
          description: "Seçkin yerli ve ithal peynirler, kuru meyveler ve ceviz ile",
          price: "₺120",
          image: "https://images.unsplash.com/photo-1535063406830-27dfcd377eac?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
        },
        {
          id: 4,
          name: "Karides Kokteyl",
          description: "Taze karides, avokado, elma, marul ve koktey sosu ile",
          price: "₺135",
        },
        {
          id: 5,
          name: "Mantar Sote",
          description: "Karışık mantarlar, sarımsak, maydanoz ve tereyağı ile",
          price: "₺90",
        }
      ]
    },
    {
      id: "mains",
      name: "Ana Yemekler",
      items: [
        {
          id: 6,
          name: "Özel Lezzet Burger",
          description: "180 gr dana eti, cheddar peyniri, karamelize soğan, özel burger sosu ve ev yapımı patates kızartması ile",
          price: "₺145",
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
        },
        {
          id: 7,
          name: "Izgara Somon",
          description: "Limon ve otlar ile marine edilmiş somon fileto, sebzeli pilav ve taze yeşillikler ile",
          price: "₺180",
        },
        {
          id: 8,
          name: "Karışık Izgara",
          description: "Dana bonfile, kuzu pirzola, tavuk ve köfte karışımı, ızgara sebzeler ve bulgur pilavı ile",
          price: "₺220",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
        },
        {
          id: 9,
          name: "Ev Yapımı Mantı",
          description: "El açması hamur içerisinde kıyma, yoğurt ve özel sos ile",
          price: "₺110",
        },
        {
          id: 10,
          name: "Risotto Mantar",
          description: "Karışık mantarlar, parmesan peyniri ve taze otlarla hazırlanan kremsi risotto",
          price: "₺130",
        }
      ]
    },
    {
      id: "desserts",
      name: "Tatlılar",
      items: [
        {
          id: 11,
          name: "Çikolatalı Sufle",
          description: "Sıcak servis edilen akışkan çikolata dolgulu sufle, vanilya dondurması ile",
          price: "₺85",
          image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
        },
        {
          id: 12,
          name: "Tiramisu",
          description: "Mascarpone peyniri, kahve emdirilmiş kek ve kakao ile",
          price: "₺70",
        },
        {
          id: 13,
          name: "Cheesecake",
          description: "Ev yapımı New York usulü cheesecake, mevsim meyveleri ile",
          price: "₺75",
        },
        {
          id: 14,
          name: "Künefe",
          description: "Kadayıf ve peynir ile hazırlanan geleneksel tatlı, kaymak ile servis edilir",
          price: "₺90",
          image: "https://images.unsplash.com/photo-1530968033775-2c92736b131e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
        }
      ]
    },
    {
      id: "drinks",
      name: "İçecekler",
      items: [
        {
          id: 15,
          name: "Türk Kahvesi",
          description: "Geleneksel usulde pişirilmiş Türk kahvesi",
          price: "₺35",
        },
        {
          id: 16,
          name: "Espresso",
          description: "Seçkin kahve çekirdeklerinden özenle hazırlanmış espresso",
          price: "₺40",
        },
        {
          id: 17,
          name: "Taze Meyve Suları",
          description: "Portakal, elma, havuç veya karışık",
          price: "₺45",
        },
        {
          id: 18,
          name: "Ev Yapımı Limonata",
          description: "Taze limon, nane ve az şeker ile hazırlanan ferahlatıcı limonata",
          price: "₺40",
        },
        {
          id: 19,
          name: "Yerli Şarap (Kadeh)",
          description: "Kırmızı, beyaz veya roze - günün özel şarabı",
          price: "₺70",
        },
        {
          id: 20,
          name: "Yerli Şarap (Şişe)",
          description: "Kırmızı, beyaz veya roze - seçkin yerli bağlardan",
          price: "₺320",
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title="Menümüz"
        subtitle="Taze ve seçkin malzemelerle hazırlanan özel lezzetlerimiz"
        showButtons={false}
      />
      
      {/* Menu Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Lezzetlerimiz</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Şeflerimizin özenle hazırladığı menümüzde, modern ve geleneksel lezzetleri bir araya getirdik
            </p>
          </div>
          
          <MenuCategory categories={menuCategories} />
          
          <div className="text-center mt-16">
            <p className="text-lg font-medium mb-2">Özel diyet ihtiyaçlarınız mı var?</p>
            <p className="text-muted-foreground mb-6">
              Vejetaryen, vegan, glutensiz veya diğer diyet tercihleriniz için lütfen servis personelimize danışınız.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;
