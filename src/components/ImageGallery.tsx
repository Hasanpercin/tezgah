
import { useState } from 'react';
import { X } from 'lucide-react';
import { GalleryImageType } from '@/types/gallery';

type ImageGalleryProps = {
  images: GalleryImageType[];
};

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);

  const openLightbox = (image: GalleryImageType) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <div className="gallery-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="gallery-item relative overflow-hidden rounded-lg cursor-pointer group" 
            onClick={() => openLightbox(image)}
          >
            <img 
              src={image.src} 
              alt={image.alt || `Gallery image ${image.id}`} 
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <h4 className="font-medium text-sm">{image.title}</h4>
                {image.description && (
                  <p className="text-xs text-gray-300 truncate">{image.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-secondary p-2"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
          <div className="max-w-[90%] max-h-[90vh] flex flex-col items-center">
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt || `Gallery image ${selectedImage.id}`} 
              className="max-w-full max-h-[80vh] object-contain" 
              onClick={(e) => e.stopPropagation()}
            />
            {(selectedImage.title || selectedImage.description) && (
              <div className="bg-black/80 p-4 mt-2 rounded-md text-white max-w-full">
                {selectedImage.title && <h3 className="font-medium">{selectedImage.title}</h3>}
                {selectedImage.description && <p className="text-sm text-gray-300 mt-1">{selectedImage.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
