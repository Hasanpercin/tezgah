
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  showButtons: boolean;
  className?: string; // Added className prop
}

const Hero: React.FC<HeroProps> = ({ 
  backgroundImage, 
  title, 
  subtitle, 
  showButtons,
  className = "h-[70vh]" // Default height that can be overridden
}) => {
  return (
    <section 
      className={`relative flex items-center justify-center ${className}`}
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container text-center text-white z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-playfair">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">{subtitle}</p>
        
        {showButtons && (
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/reservation">Rezervasyon Yap</Link>
            </Button>
            <Button asChild variant="outline" className="text-white border-white hover:bg-white/10">
              <Link to="/menu">Menüyü Gör</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
