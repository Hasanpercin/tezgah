
import { Card, CardContent } from "@/components/ui/card";

type MenuItemProps = {
  name: string;
  description: string;
  price: string;
  image?: string;
  id?: number;
}

const MenuItem = ({ name, description, price, image, id }: MenuItemProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0">
        <div className={`flex ${image ? 'flex-col md:flex-row' : ''} h-full`}>
          {image && (
            <div className={`${image ? 'md:w-1/3' : 'hidden'} overflow-hidden`}>
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover aspect-square md:aspect-auto"
              />
            </div>
          )}
          
          <div className={`flex-1 p-4 ${!image ? 'w-full' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-playfair font-semibold">{name}</h3>
              <span className="text-lg font-semibold text-primary ml-4">{price}</span>
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
