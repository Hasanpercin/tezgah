
import { useState } from 'react';
import MenuItem from './MenuItem';

export type MenuItemType = {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

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
  
  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto scrollbar-none mb-6 border-b border-border">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`menu-category-tab whitespace-nowrap ${
              activeCategory === category.id ? 'active' : 'border-transparent'
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
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
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
