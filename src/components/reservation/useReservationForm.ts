
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from "date-fns";
import { FormData, FormError } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export const useReservationForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
      // First, check if we need to create a profile for this user
      let userId = user?.id;
      
      // If no authenticated user, create a temporary profile
      if (!userId) {
        // Generate a UUID for an anonymous user
        userId = uuidv4();
        
        // Create a profile first
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          });
        
        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw profileError;
        }
      }
      
      // Now create the reservation with the user_id
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          user_id: userId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date?.toISOString().split('T')[0],
          time: formData.time,
          guests: parseInt(formData.guests),
          notes: formData.notes,
          occasion: formData.occasion,
          status: 'Beklemede'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Rezervasyon Alındı",
        description: `${formData.name} adına ${formData.date ? format(formData.date, 'dd MMMM yyyy') : ''} tarihinde ${formData.time} saati için ${formData.guests} kişilik rezervasyon alınmıştır.`,
        variant: "default",
      });

      const multiStepReservation = document.querySelector('[data-reservation-step]');
      if (multiStepReservation) {
        const event = new CustomEvent('reservationCompleted', { 
          detail: { formData, reservationId: data.id }
        });
        multiStepReservation.dispatchEvent(event);
      }
    } catch (error: any) {
      console.error("Reservation error:", error.message);
      toast({
        title: "Hata",
        description: "Rezervasyon işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleSubmit,
  };
};
