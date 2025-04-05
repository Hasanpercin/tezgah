
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  Image as ImageIcon, 
  Info,
  Phone
} from "lucide-react";

import { HomepageContent } from "./website-content/HomepageContent";
import { AboutContent } from "./website-content/AboutContent";
import { GalleryContent } from "./website-content/GalleryContent";
import { ContactContent } from "./website-content/ContactContent";

export const WebsiteContentPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("homepage");
  
  const handleSaveChanges = () => {
    // This is now handled directly by the content components using Supabase
    // The toast will be shown from the individual hooks after successful updates
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Web Sitesi İçerik Yönetimi</CardTitle>
          <CardDescription>
            Sitenizin içeriğini ve görsellerini buradan düzenleyebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="homepage">
                <Home size={16} className="mr-2" /> Anasayfa
              </TabsTrigger>
              <TabsTrigger value="about">
                <Info size={16} className="mr-2" /> Hakkımızda
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <ImageIcon size={16} className="mr-2" /> Galeri
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Phone size={16} className="mr-2" /> İletişim
              </TabsTrigger>
            </TabsList>

            {/* Homepage Content */}
            <TabsContent value="homepage" className="space-y-6">
              <HomepageContent onSave={handleSaveChanges} />
            </TabsContent>

            {/* About Us Content */}
            <TabsContent value="about" className="space-y-6">
              <AboutContent onSave={handleSaveChanges} />
            </TabsContent>

            {/* Gallery Content */}
            <TabsContent value="gallery" className="space-y-6">
              <GalleryContent onSave={handleSaveChanges} />
            </TabsContent>

            {/* Contact Content */}
            <TabsContent value="contact" className="space-y-6">
              <ContactContent onSave={handleSaveChanges} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
