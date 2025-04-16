
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  showButtons: boolean;
  className?: string;
  overlayColor?: string;
  titleGradient?: boolean;
}

const Hero: React.FC<HeroProps> = ({ 
  backgroundImage, 
  title, 
  subtitle, 
  showButtons,
  className = "h-[70vh]",
  overlayColor = "rgba(0, 0, 0, 0.6)",
  titleGradient = false
}) => {
  return (
    <section 
      className={`relative flex items-center justify-center ${className}`}
      style={{ 
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container text-center text-white z-10 px-4">
        {titleGradient ? (
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-playfair">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200">
              {title}
            </span>
          </h1>
        ) : (
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-playfair">{title}</h1>
        )}
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto flex items-center justify-center">
          <Sparkles className="mr-2 h-5 w-5 text-amber-300" /> {subtitle}
        </p>
        
        {showButtons && (
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/reservation">Rezervasyon Yap</Link>
            </Button>
            <Button asChild variant="outline" className="bg-amber-400 text-black border-amber-400 hover:bg-amber-500 hover:border-amber-500 hover:text-black">
              <Link to="/menu">Menüyü Gör</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
