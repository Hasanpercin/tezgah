
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
      console.log("Starting reservation submission process...");
      
      // First create or get a profile
      let userId;
      
      if (user) {
        // If user is authenticated, use their ID
        userId = user.id;
        console.log("Using authenticated user ID:", userId);
      } else {
        // For anonymous users, we need to create a temporary profile
        const tempId = uuidv4();
        console.log("Generated temporary ID for anonymous user:", tempId);
        
        // Create a temporary profile
        console.log("Creating temporary profile with data:", {
          id: tempId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        });
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: tempId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          });
          
        if (profileError) {
          console.error("Profile creation error:", profileError.message);
          throw profileError;
        }
        
        console.log("Temporary profile created successfully");
        userId = tempId;
      }
      
      // Now create the reservation with proper data type handling
      console.log("Creating reservation with user ID:", userId);
      
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          user_id: userId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date?.toISOString().split('T')[0],
          time: formData.time,
          guests: parseInt(formData.guests), // Ensure guests is converted to number
          notes: formData.notes || null,
          occasion: formData.occasion || null,
          status: 'Beklemede'
        })
        .select()
        .single();
      
      if (error) {
        console.error("Reservation creation error:", error.message);
        throw error;
      }
      
      console.log("Reservation created successfully:", data);
      
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
