
import { Link } from 'react-router-dom';

type HeroProps = {
  backgroundImage: string;
  title: string;
  subtitle: string;
  showButtons?: boolean;
  overlayColor?: string;
}

const Hero = ({ 
  backgroundImage, 
  title, 
  subtitle, 
  showButtons = true,
  overlayColor = "primary/60" 
}: HeroProps) => {
  return (
    <div className="hero-section relative w-full min-h-[50vh] flex items-center justify-center">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className={`absolute inset-0 z-10 bg-${overlayColor}`}></div>
      
      <div className="container z-20 relative text-center px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-secondary">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white">{subtitle}</p>
        
        {showButtons && (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/menu" className="btn-primary">Menüyü Gör</Link>
            <Link to="/reservation" className="btn-secondary">Rezervasyon Yap</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
