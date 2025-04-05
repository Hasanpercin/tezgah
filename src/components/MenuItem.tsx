
type MenuItemProps = {
  name: string;
  description: string;
  price: string;
  image?: string;
}

const MenuItem = ({ name, description, price, image }: MenuItemProps) => {
  return (
    <div className="menu-item">
      {image && (
        <div className="md:order-2 flex-shrink-0">
          <img src={image} alt={name} className="menu-item-image" />
        </div>
      )}
      
      <div className="menu-item-content">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-playfair font-semibold">{name}</h3>
          <span className="text-lg font-semibold text-primary">{price}</span>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default MenuItem;
