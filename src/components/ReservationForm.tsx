import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FormData = {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
  guests: string;
  occasion: string;
  notes: string;
};

type FormError = {
  [key in keyof FormData]?: string;
};

const ReservationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    date: null,
    time: '',
    guests: '2',
    occasion: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<FormError>({});
  
  const validateForm = () => {
    const newErrors: FormError = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'İsim gereklidir';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon numarası gereklidir';
    }
    
    if (!formData.date) {
      newErrors.date = 'Tarih gereklidir';
    }
    
    if (!formData.time) {
      newErrors.time = 'Saat gereklidir';
    }
    
    if (!formData.guests) {
      newErrors.guests = 'Kişi sayısı gereklidir';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData({
      ...formData,
      date: date || null,
    });
    
    // Clear error when field is edited
    if (errors.date) {
      setErrors({
        ...errors,
        date: undefined,
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      toast({
        title: "Rezervasyon Alındı",
        description: `${formData.name} adına ${format(formData.date, 'dd MMMM yyyy')} tarihinde ${formData.time} saati için ${formData.guests} kişilik rezervasyon alınmıştır.`,
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: null,
        time: '',
        guests: '2',
        occasion: '',
        notes: '',
      });
      
    } catch (error) {
      toast({
        title: "Hata",
        description: "Rezervasyon işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Ad Soyad
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Adınız Soyadınız"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-posta
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ornek@email.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Telefon
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="05XX XXX XX XX"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tarih</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !formData.date && "text-muted-foreground"
                  } ${errors.date ? "border-destructive" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "dd.MM.yyyy")
                  ) : (
                    <span>Tarih seçiniz</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date || undefined}
                  onSelect={handleDateChange}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-destructive text-sm mt-1">{errors.date}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Saat</label>
            <Select 
              value={formData.time} 
              onValueChange={(value) => handleSelectChange("time", value)}
            >
              <SelectTrigger className={errors.time ? "border-destructive" : ""}>
                <SelectValue placeholder="Saat seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12:00">12:00</SelectItem>
                <SelectItem value="12:30">12:30</SelectItem>
                <SelectItem value="13:00">13:00</SelectItem>
                <SelectItem value="13:30">13:30</SelectItem>
                <SelectItem value="14:00">14:00</SelectItem>
                <SelectItem value="14:30">14:30</SelectItem>
                <SelectItem value="18:00">18:00</SelectItem>
                <SelectItem value="18:30">18:30</SelectItem>
                <SelectItem value="19:00">19:00</SelectItem>
                <SelectItem value="19:30">19:30</SelectItem>
                <SelectItem value="20:00">20:00</SelectItem>
                <SelectItem value="20:30">20:30</SelectItem>
                <SelectItem value="21:00">21:00</SelectItem>
              </SelectContent>
            </Select>
            {errors.time && <p className="text-destructive text-sm mt-1">{errors.time}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kişi Sayısı</label>
            <Select 
              value={formData.guests} 
              onValueChange={(value) => handleSelectChange("guests", value)}
            >
              <SelectTrigger className={errors.guests ? "border-destructive" : ""}>
                <SelectValue placeholder="Kişi sayısı seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Kişi</SelectItem>
                <SelectItem value="2">2 Kişi</SelectItem>
                <SelectItem value="3">3 Kişi</SelectItem>
                <SelectItem value="4">4 Kişi</SelectItem>
                <SelectItem value="5">5 Kişi</SelectItem>
                <SelectItem value="6">6 Kişi</SelectItem>
                <SelectItem value="7">7 Kişi</SelectItem>
                <SelectItem value="8">8 Kişi</SelectItem>
                <SelectItem value="9">9 Kişi</SelectItem>
                <SelectItem value="10">10+ Kişi</SelectItem>
              </SelectContent>
            </Select>
            {errors.guests && <p className="text-destructive text-sm mt-1">{errors.guests}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Özel Durum</label>
            <Select 
              value={formData.occasion} 
              onValueChange={(value) => handleSelectChange("occasion", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz (Opsiyonel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Doğum Günü</SelectItem>
                <SelectItem value="anniversary">Yıl Dönümü</SelectItem>
                <SelectItem value="business">İş Yemeği</SelectItem>
                <SelectItem value="date">Romantik Akşam Yemeği</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Özel İstekler
          </label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Özel isteklerinizi belirtebilirsiniz (opsiyonel)"
            rows={3}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              İşlem Yapılıyor...
            </span>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" /> Rezervasyon Yap
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ReservationForm;
