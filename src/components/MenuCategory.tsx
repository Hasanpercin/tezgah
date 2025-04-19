
import { useState } from 'react';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType } from '@/services/menuService'; 

export type MenuCategoryType = {
  id: string;
  name: string;
  items: MenuItemType[];
}

type MenuCategoryProps = {
  categories: MenuCategoryType[];
}

const MenuCategory = ({ categories }: MenuCategoryProps) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');
  
  // Make sure we have categories before rendering
  if (!categories || categories.length === 0) {
    return <div className="p-8 text-center">No menu categories available</div>;
  }
  
  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto scrollbar-none mb-6 border-b border-border">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`menu-category-tab whitespace-nowrap px-4 py-2 border-b-2 font-medium transition-colors ${
              activeCategory === category.id ? 'text-primary border-primary' : 'border-transparent hover:text-primary/80 hover:border-primary/30'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Menu Items */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className={`${activeCategory === category.id ? 'block' : 'hidden'}`}
          >
            <div className="grid grid-cols-1 gap-8">
              {category.items.map((item) => (
                <MenuItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description || ''}
                  price={`${item.price} ₺`}
                  image={item.image_path}
                  isInStock={item.is_in_stock}
                  options={item.options || []}
                  variants={item.variants || []}
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
