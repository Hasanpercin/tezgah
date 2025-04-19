
import { useState } from 'react';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType } from '@/services/menuService'; 

export type MenuCategoryType = {
  id: string;
  name: string;
  items: MenuItemType[];
  displayOrder?: number; // Add display order for category sorting
}

type MenuCategoryProps = {
  categories: MenuCategoryType[];
}

const MenuCategory = ({ categories }: MenuCategoryProps) => {
  // Sort categories to ensure proper order (Ana Yemekler first, İçecekler last)
  const sortedCategories = [...categories].sort((a, b) => {
    // Custom sorting logic
    if (a.name === "Ana Yemekler") return -1;
    if (b.name === "Ana Yemekler") return 1;
    if (a.name === "İçecekler") return 1;
    if (b.name === "İçecekler") return -1;
    return (a.displayOrder || 0) - (b.displayOrder || 0);
  });
  
  const [activeCategory, setActiveCategory] = useState(sortedCategories[0]?.id || '');
  
  if (!categories || categories.length === 0) {
    return <div className="p-8 text-center">Menü kategorileri bulunamadı</div>;
  }
  
  return (
    <div className="w-full">
      {/* Category Tabs with elegant styling */}
      <div className="flex overflow-x-auto scrollbar-none mb-8 border-b border-border">
        {sortedCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`menu-category-tab whitespace-nowrap px-6 py-3 font-playfair text-lg transition-colors 
              ${activeCategory === category.id 
                ? 'text-primary border-b-2 border-primary font-medium' 
                : 'text-muted-foreground hover:text-primary/80 border-b-2 border-transparent'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Menu Items with improved layout */}
      <div className="space-y-12">
        {sortedCategories.map((category) => (
          <div 
            key={category.id} 
            className={`${activeCategory === category.id ? 'block' : 'hidden'}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <MenuItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description || ''}
                  price={`${item.price} ₺`}
                  image={item.image_path}
                  isInStock={item.is_in_stock}
                  options={item.options}
                  variants={item.variants}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
