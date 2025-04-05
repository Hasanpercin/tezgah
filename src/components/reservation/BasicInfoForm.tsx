
import { useState } from 'react';
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormError, FormData } from './types';

type BasicInfoFormProps = {
  formData: FormData;
  errors: FormError;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDateChange: (date: Date | undefined) => void;
};

const BasicInfoForm = ({
  formData,
  errors,
  handleInputChange,
  handleSelectChange,
  handleDateChange
}: BasicInfoFormProps) => {
  return (
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
                className="pointer-events-auto"
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
  );
};

export default BasicInfoForm;
