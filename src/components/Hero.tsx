
import { Link } from 'react-router-dom';

type HeroProps = {
  backgroundImage: string;
  title: string;
  subtitle: string;
  showButtons?: boolean;
}

const Hero = ({ backgroundImage, title, subtitle, showButtons = true }: HeroProps) => {
  return (
    <div className="hero-section">
      <div 
        className="hero-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="hero-overlay bg-primary/60"></div>
      
      <div className="hero-content">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-white">{title}</h1>
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
