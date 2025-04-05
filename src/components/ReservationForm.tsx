
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface FormData {
  name: string;
  phone: string;
  email: string;
  guests: string;
  date: Date | undefined;
  time: string;
  notes: string;
}

const ReservationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    guests: '2',
    date: undefined,
    time: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const timeSlots = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData({
      ...formData,
      date
    });
    
    if (errors.date) {
      setErrors({
        ...errors,
        date: undefined
      });
    }
  };
  
  const handleTimeChange = (time: string) => {
    setFormData({
      ...formData,
      time
    });
    
    if (errors.time) {
      setErrors({
        ...errors,
        time: undefined
      });
    }
  };
  
  const handleGuestsChange = (guests: string) => {
    setFormData({
      ...formData,
      guests
    });
    
    if (errors.guests) {
      setErrors({
        ...errors,
        guests: undefined
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = 'İsim gereklidir';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon numarası gereklidir';
    if (!formData.date) newErrors.date = 'Tarih seçmelisiniz';
    if (!formData.time) newErrors.time = 'Saat seçmelisiniz';
    
    // Phone format validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }
    
    // Email format validation (if provided)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Rezervasyon Talebiniz Alındı",
        description: "En kısa sürede onay için sizinle iletişime geçilecektir.",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        guests: '2',
        date: undefined,
        time: '',
        notes: ''
      });
    }
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Disable past dates
  const disableDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon Numarası *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="05XX XXX XXXX"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-posta Adresi</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="guests">Kişi Sayısı *</Label>
          <Select 
            value={formData.guests} 
            onValueChange={handleGuestsChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kişi sayısı seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Kişi
                </SelectItem>
              ))}
              <SelectItem value="11+">11+ Kişi</SelectItem>
            </SelectContent>
          </Select>
          {errors.guests && <p className="text-destructive text-sm">{errors.guests}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Rezervasyon Tarihi *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
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
                selected={formData.date}
                onSelect={handleDateChange}
                disabled={disableDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-destructive text-sm">{errors.date}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Rezervasyon Saati *</Label>
          <Select 
            value={formData.time} 
            onValueChange={handleTimeChange}
          >
            <SelectTrigger className={errors.time ? "border-destructive" : ""}>
              <SelectValue placeholder="Saat seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.time && <p className="text-destructive text-sm">{errors.time}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Özel İstekler / Notlar</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Rezervasyonunuzla ilgili özel istekleriniz varsa belirtiniz."
          rows={4}
        />
      </div>
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Rezervasyon Yap
      </Button>
      
      <p className="text-sm text-muted-foreground text-center">
        * işaretli alanlar zorunludur.
      </p>
    </form>
  );
};

export default ReservationForm;
