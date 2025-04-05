
import Hero from '@/components/Hero';
import ImageGallery from '@/components/ImageGallery';

const Gallery = () => {
  const heroImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";
  
  // Gallery images
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Restaurant interior"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Restaurant dining area"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Restaurant table setting"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Gourmet steak"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "BBQ platter"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Fresh salad"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Chocolate dessert"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Gourmet burger"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Chef plating"
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Restaurant bar area"
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1530968033775-2c92736b131e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Traditional dessert"
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
      alt: "Restaurant patio"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title="Galeri"
        subtitle="Atmosferimiz ve lezzetlerimizden kareler"
        showButtons={false}
      />
      
      {/* Gallery Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 font-playfair">Fotoğraf Galerimiz</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Restoranımızın atmosferi, lezzetlerimiz ve özel anlardan kareler
            </p>
          </div>
          
          <ImageGallery images={galleryImages} />
        </div>
      </section>
    </div>
  );
};

export default Gallery;
