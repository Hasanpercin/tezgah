
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 font-playfair text-primary">404</h1>
        <p className="text-xl md:text-2xl text-foreground mb-8">Üzgünüz, aradığınız sayfa bulunamadı.</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

