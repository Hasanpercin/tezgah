
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchFixedMenus } from '@/services/fixedMenuService';
import { fetchMenuItems, formatPrice } from '@/services/menuService';
import { FixMenuOption, MenuItem } from './types/reservationTypes';

type MenuSelectionProps = {
  onFixMenuSelected: (menu: FixMenuOption | null) => void;
  onALaCarteItemsSelected: (items: { item: MenuItem; quantity: number }[]) => void;
  onSelectAtRestaurant: (selected: boolean) => void;
  selectedFixMenu: FixMenuOption | null;
  selectedALaCarteItems: { item: MenuItem; quantity: number }[];
  selectAtRestaurant: boolean;
  guests: string;
};

const MenuSelection = ({
  onFixMenuSelected,
  onALaCarteItemsSelected,
  onSelectAtRestaurant,
  selectedFixMenu,
  selectedALaCarteItems,
  selectAtRestaurant,
  guests,
}: MenuSelectionProps) => {
  // Initialize with no menu type selected
  const [menuType, setMenuType] = useState<'fixed' | 'alacarte' | 'atrestaurant' | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const guestCount = parseInt(guests) || 0;

  // Sabit menüleri çekme
  const { data: fixedMenus = [], isLoading: isLoadingFixedMenus } = useQuery({
    queryKey: ['fixedMenus'],
    queryFn: fetchFixedMenus,
  });

  // Menü kategorilerini çekme
  const { data: menuCategories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['menuCategories'],
    queryFn: () => import('@/services/menuService').then(module => module.fetchMenuCategories()),
  });

  // Set default category if none selected and categories are loaded
  useEffect(() => {
    if (selectedCategoryId === '' && menuCategories.length > 0) {
      setSelectedCategoryId(menuCategories[0]?.id || '');
    }
  }, [menuCategories, selectedCategoryId]);

  // Seçili kategoriye göre menü öğelerini çekme
  const { data: menuItems = [], isLoading: isLoadingMenuItems } = useQuery({
    queryKey: ['menuItems', selectedCategoryId],
    queryFn: () => fetchMenuItems(selectedCategoryId !== '' ? selectedCategoryId : undefined),
  });

  // Sayfa yüklendiğinde veya guests değiştiğinde miktar değerlerini güncelle
  useEffect(() => {
    // A la carte öğeler için quantites nesnesini güncelle
    const newQuantities = { ...quantities };
    selectedALaCarteItems.forEach(item => {
      newQuantities[item.item.id] = item.quantity;
    });
    setQuantities(newQuantities);
  }, [selectedALaCarteItems, guests]);

  // Fix menü seçimi
  const handleFixedMenuSelect = (menu: FixMenuOption | null) => {
    onFixMenuSelected(menu);
    if (menu) {
      setMenuType('fixed');
      // A la carte seçimlerini ve restoranda seçim opsiyonunu temizle
      onALaCarteItemsSelected([]);
      onSelectAtRestaurant(false);
    }
  };

  // A la carte öğe miktarlarını güncelle
  const handleQuantityChange = (item: MenuItem, quantity: number) => {
    // Yeni miktarları güncelle
    const newQuantities = { ...quantities, [item.id]: quantity };
    setQuantities(newQuantities);

    // Seçili öğeleri güncelle (miktar > 0 olan öğeler)
    const selectedItems = Object.keys(newQuantities)
      .filter(itemId => newQuantities[itemId] > 0)
      .map(itemId => {
        const selectedItem = menuItems.find(mi => mi.id === itemId);
        return {
          item: selectedItem as MenuItem,
          quantity: newQuantities[itemId]
        };
      });

    onALaCarteItemsSelected(selectedItems);
    
    if (selectedItems.length > 0) {
      setMenuType('alacarte');
      // Fix menü seçimini ve restoranda seçim opsiyonunu temizle
      onFixMenuSelected(null);
      onSelectAtRestaurant(false);
    }
  };

  // Kategori değişikliği
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  // Menü türü değişikliği
  const handleMenuTypeChange = (type: 'fixed' | 'alacarte' | 'atrestaurant') => {
    setMenuType(type);
    
    if (type === 'fixed') {
      onALaCarteItemsSelected([]);
      onSelectAtRestaurant(false);
    } else if (type === 'alacarte') {
      onFixMenuSelected(null);
      onSelectAtRestaurant(false);
    } else if (type === 'atrestaurant') {
      onFixMenuSelected(null);
      onALaCarteItemsSelected([]);
      onSelectAtRestaurant(true);
    }
  };

  // İskelet yükleme arayüzü
  const renderSkeletons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => (
        <Card key={`skeleton-${i}`} className="mb-4">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <Skeleton className="h-40 md:w-1/3" />
              <div className="p-4 flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ));
  };

  return (
    <div className="py-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Menü Seçimi</h3>
        <p className="text-muted-foreground mb-4">
          Fix menü seçebilir, a la carte sipariş verebilir veya restoranda seçim yapabilirsiniz. {guestCount} kişilik rezervasyonunuz için uygun seçimi yapınız.
        </p>

        <div className="mb-6">
          <RadioGroup
            value={menuType || ''}
            onValueChange={(value) => handleMenuTypeChange(value as 'fixed' | 'alacarte' | 'atrestaurant')}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed" className="font-medium">Fix Menü</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="alacarte" id="alacarte" />
              <Label htmlFor="alacarte" className="font-medium">A La Carte</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="atrestaurant" id="atrestaurant" />
              <Label htmlFor="atrestaurant" className="font-medium">Restoranda seçim yapacağım</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Tabs value={menuType || ''} className="w-full">
        {/* Fix Menü Seçimi */}
        <TabsContent value="fixed" className="mt-0">
          <div className="space-y-6">
            <h4 className="text-base font-medium">Fix Menü Seçenekleri</h4>
            
            {isLoadingFixedMenus ? (
              renderSkeletons(2)
            ) : fixedMenus.length === 0 ? (
              <Card className="p-6 text-center">
                <Table className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p>Henüz fix menü paketi eklenmemiş.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {fixedMenus.map((menu) => (
                  <Card 
                    key={menu.id} 
                    className={`cursor-pointer transition-all ${
                      selectedFixMenu?.id === menu.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleFixedMenuSelect(
                      selectedFixMenu?.id === menu.id ? null : menu
                    )}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {menu.image_path && (
                          <div className="md:w-1/3">
                            <img 
                              src={menu.image_path} 
                              alt={menu.name} 
                              className="w-full h-full object-cover aspect-video md:aspect-square"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold">{menu.name}</h3>
                            <span className="text-lg text-primary font-medium">
                              {formatPrice(menu.price)}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-4">{menu.description}</p>
                          <div className="mt-auto pt-2">
                            <span className="text-sm text-muted-foreground">
                              Kişi başı {formatPrice(menu.price)} ({guestCount} kişi için toplam: {formatPrice(menu.price * guestCount)})
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {selectedFixMenu && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mt-6">
                <h4 className="font-medium mb-2">Seçilen Fix Menü:</h4>
                <div className="flex justify-between">
                  <p>{selectedFixMenu.name}</p>
                  <p className="font-medium">{formatPrice(selectedFixMenu.price * guestCount)}</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* A La Carte Seçimi */}
        <TabsContent value="alacarte" className="mt-0">
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium mb-4">A La Carte Menü</h4>

              {/* Kategori Seçimi - "Tüm Kategoriler" seçeneği kaldırıldı */}
              <div className="flex overflow-x-auto scrollbar-none mb-6 pb-2">
                {isLoadingCategories ? (
                  <div className="flex space-x-2">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-10 w-24" />
                    ))}
                  </div>
                ) : (
                  menuCategories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                      className="whitespace-nowrap mr-2"
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))
                )}
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                {isLoadingMenuItems ? (
                  renderSkeletons(3)
                ) : menuItems.length === 0 ? (
                  <Card className="p-6 text-center">
                    <Table className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p>Bu kategoride henüz ürün bulunmamaktadır.</p>
                  </Card>
                ) : (
                  menuItems.map((item) => {
                    const quantity = quantities[item.id] || 0;
                    
                    return (
                      <Card key={item.id}>
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {item.image_path && (
                              <div className="md:w-1/4">
                                <img 
                                  src={item.image_path} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover aspect-video md:aspect-square"
                                />
                              </div>
                            )}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-medium">{item.name}</h3>
                                  <span className="font-medium text-primary">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-sm mb-4">
                                  {item.description}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-end mt-2">
                                <div className="flex items-center">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item, Math.max(0, quantity - 1))}
                                  >
                                    -
                                  </Button>
                                  <Input
                                    className="h-8 w-12 mx-1 text-center"
                                    value={quantity}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      handleQuantityChange(item, Math.max(0, val));
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item, quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Seçili Öğelerin Özeti */}
            {selectedALaCarteItems.length > 0 && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mt-6">
                <h4 className="font-medium mb-2">Seçilen Öğeler:</h4>
                <div className="space-y-2">
                  {selectedALaCarteItems.map(({ item, quantity }) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        {item.name} x {quantity}
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price * quantity)}
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <div>Toplam</div>
                    <div>
                      {formatPrice(
                        selectedALaCarteItems.reduce(
                          (sum, { item, quantity }) => sum + item.price * quantity,
                          0
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Restoranda Seçim Yapacağım */}
        <TabsContent value="atrestaurant" className="mt-0">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center mb-4">
                <h4 className="text-lg font-medium">Restoranda Menü Seçimi</h4>
                <p className="text-muted-foreground mt-2">
                  Restoranda yemek seçimlerinizi masa başında yapmak istediğinizi belirtmiş bulunmaktasınız. 
                  Rezervasyonunuz onaylandığında, masanız hazır olacak ve menü seçimlerinizi restoranda yapabileceksiniz.
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuSelection;
