
import Hero from '@/components/Hero';
import ImageGallery from '@/components/ImageGallery';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { Skeleton } from '@/components/ui/skeleton';

const Gallery = () => {
  const { content, isLoading } = useWebsiteContent('gallery');
  
  let galleryImages = [];
  
  // Parse gallery images from content if available
  if (content && content.gallery_images) {
    try {
      const parsedImages = JSON.parse(content.gallery_images);
      if (Array.isArray(parsedImages)) {
        galleryImages = parsedImages;
      }
    } catch (error) {
      console.error("Error parsing gallery images:", error);
    }
  }
  
  // If no gallery images are available or parsing failed, use fallback images
  if (galleryImages.length === 0) {
    galleryImages = [
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
      }
    ];
  }

  const heroImage = content.hero_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full h-[40vh]" />
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col items-center mb-12">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title={content.gallery_title || "Galeri"}
        subtitle={content.gallery_subtitle || "Atmosferimiz ve lezzetlerimizden kareler"}
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
