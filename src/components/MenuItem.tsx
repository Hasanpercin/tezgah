
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type MenuItemProps = {
  name: string;
  description: string;
  price: string;
  image?: string;
  id?: string;
  isInStock?: boolean;
}

const MenuItem = ({ name, description, price, image, id, isInStock = true }: MenuItemProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0">
        <div className={`flex ${image ? 'flex-col md:flex-row' : ''} h-full relative`}>
          {!isInStock && (
            <div className="absolute top-0 right-0 m-2 z-10">
              <Badge variant="destructive" className="font-medium">Stokta Yok</Badge>
            </div>
          )}
          
          {image && (
            <div className={`${image ? 'md:w-1/3' : 'hidden'} overflow-hidden relative`}>
              <img 
                src={image} 
                alt={name} 
                className={`w-full h-full object-cover aspect-square md:aspect-auto ${!isInStock ? 'opacity-50' : ''}`}
              />
            </div>
          )}
          
          <div className={`flex-1 p-4 ${!image ? 'w-full' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-playfair font-semibold">{name}</h3>
              <span className="text-lg font-semibold text-primary ml-4 whitespace-nowrap">{price}</span>
            </div>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
