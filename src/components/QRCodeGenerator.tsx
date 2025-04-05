
import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, QrCode, Table as TableIcon, Share2 } from "lucide-react";

export const QRCodeGenerator = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState(`${window.location.origin}/menu`);
  const [qrSize, setQrSize] = useState('200');
  const [qrType, setQrType] = useState('menu');
  const [tableNumber, setTableNumber] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  // Calculate the final URL based on QR type
  const finalUrl = qrType === 'table' && tableNumber 
    ? `${window.location.origin}/menu?table=${tableNumber}` 
    : url;

  // Handle download QR code
  const handleDownload = () => {
    if (!qrRef.current) return;

    try {
      // Get the SVG from the ref
      const svgElement = qrRef.current.querySelector('svg');
      if (!svgElement) return;

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      // Set canvas dimensions
      const svgRect = svgElement.getBoundingClientRect();
      canvas.width = svgRect.width;
      canvas.height = svgRect.height;

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create an image from the SVG
      const img = new Image();
      img.onload = () => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);

        // Convert canvas to PNG URL
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `qr-${qrType}-${tableNumber || 'menu'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);

        toast({
          title: "QR Kodu İndirildi",
          description: "QR kodu başarıyla bilgisayarınıza kaydedildi.",
        });
      };
      img.src = svgUrl;
    } catch (error) {
      console.error("QR kod indirme hatası:", error);
      toast({
        title: "Hata",
        description: "QR kodu indirilirken bir sorun oluştu.",
        variant: "destructive",
      });
    }
  };

  // Handle QR code sharing
  const handleShare = async () => {
    if (!qrRef.current || !navigator.share) {
      toast({
        title: "Paylaşım Desteklenmiyor",
        description: "Tarayıcınız paylaşım özelliğini desteklemiyor.",
        variant: "destructive",
      });
      return;
    }

    try {
      const svgElement = qrRef.current.querySelector('svg');
      if (!svgElement) return;

      // Convert SVG to Blob for sharing
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      
      // Create a File from the Blob
      const file = new File([svgBlob], `qr-${qrType}-${tableNumber || 'menu'}.svg`, { type: 'image/svg+xml' });

      await navigator.share({
        title: 'Menü QR Kodu',
        text: 'Restoranımızın menüsünü görüntülemek için QR kodu tarayın',
        url: finalUrl,
        files: [file]
      });

      toast({
        title: "Paylaşıldı",
        description: "QR kod paylaşımı başlatıldı.",
      });
    } catch (error) {
      console.error("QR kod paylaşım hatası:", error);
      
      // If error is about File sharing, try sharing just the URL
      try {
        await navigator.share({
          title: 'Menü QR Kodu',
          text: 'Restoranımızın menüsünü görüntülemek için bu linki kullanın',
          url: finalUrl
        });
        
        toast({
          title: "Paylaşıldı",
          description: "Menü linki paylaşımı başlatıldı.",
        });
      } catch (e) {
        toast({
          title: "Hata",
          description: "QR kodu paylaşılırken bir sorun oluştu.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="menu" onValueChange={(value) => setQrType(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="menu">Genel Menü</TabsTrigger>
          <TabsTrigger value="table">Masa Özel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu">
          <div className="space-y-4">
            <div>
              <Label htmlFor="menu-url">Menü Linki</Label>
              <Input 
                id="menu-url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="https://yoursite.com/menu"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Bu link QR kodunuzu tarayacak müşterilerinize gösterilecek
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="table">
          <div className="space-y-4">
            <div>
              <Label htmlFor="table-number">Masa Numarası</Label>
              <Input 
                id="table-number" 
                value={tableNumber} 
                onChange={(e) => setTableNumber(e.target.value)} 
                placeholder="1"
                type="number"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Masa numarası QR kodla birlikte URL'e eklenir
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div>
        <Label htmlFor="qr-size">QR Kod Boyutu</Label>
        <Select value={qrSize} onValueChange={setQrSize}>
          <SelectTrigger id="qr-size">
            <SelectValue placeholder="Boyut seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="128">Küçük (128px)</SelectItem>
            <SelectItem value="200">Orta (200px)</SelectItem>
            <SelectItem value="256">Büyük (256px)</SelectItem>
            <SelectItem value="350">Çok Büyük (350px)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col items-center space-y-4 pt-4">
        <div ref={qrRef} className="bg-white p-4 rounded-xl">
          <QRCodeSVG 
            value={finalUrl}
            size={parseInt(qrSize)}
            level="H" // High error correction capability
            includeMargin={true}
            imageSettings={{
              src: "/favicon.ico",
              x: undefined,
              y: undefined,
              height: parseInt(qrSize) * 0.2,
              width: parseInt(qrSize) * 0.2,
              excavate: true,
            }}
          />
        </div>
        
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              <span className="block font-medium text-foreground">{finalUrl}</span>
              {qrType === 'table' && tableNumber && (
                <span className="flex items-center justify-center mt-1">
                  <TableIcon size={14} className="mr-1" /> Masa {tableNumber}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex space-x-2 w-full">
          <Button className="flex-1" onClick={handleDownload}>
            <Download size={16} className="mr-2" /> İndir
          </Button>
          {navigator.share && (
            <Button variant="outline" className="flex-1" onClick={handleShare}>
              <Share2 size={16} className="mr-2" /> Paylaş
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
