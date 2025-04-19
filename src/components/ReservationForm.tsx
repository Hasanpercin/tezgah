
import { useReservationForm } from './reservation/useReservationForm';
import BasicInfoForm from './reservation/BasicInfoForm';
import SubmitButton from './reservation/SubmitButton';
import { Button } from './ui/button';
import { useReservationSubmission } from './reservation/hooks/useReservationSubmission';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ReservationForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleSubmit
  } = useReservationForm();

  const { user } = useAuth();
  const { toast } = useToast();
  
  // Webhook test butonu için dummy state ve fonksiyon
  const dummyState = {
    formData: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+90 555 555 5555',
      date: new Date(),
      time: '19:00',
      guests: '4',
      notes: 'Test notes',
      occasion: 'Test occasion'
    },
    selectedTable: {
      id: 'test-id',
      size: 4,
      type: 'window' as const,
      position_x: 0,
      position_y: 0,
      available: true,
      label: 'Test Table'
    },
    basicFormCompleted: true,
    menuSelection: {
      type: 'fixed_menu' as const,
      selectedFixedMenus: [{
        menu: {
          id: 'test-menu-id',
          name: 'Test Menu',
          price: 450
        },
        quantity: 2
      }],
      selectedMenuItems: []
    },
    payment: {
      isPaid: true,
      amount: 900
    }
  };
  
  const dummySetCurrentStep = () => {};
  
  const sendWebhookTest = useReservationSubmission(
    user,
    dummyState,
    toast,
    dummySetCurrentStep
  );
  
  const handleWebhookTest = () => {
    sendWebhookTest();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfoForm
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleDateChange={handleDateChange}
        />

        <div className="pt-4">
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </form>
      
      {user && user.email === 'mail@hotmail.com' && (
        <div className="mt-8 pt-4 border-t">
          <h3 className="text-lg font-medium mb-2">Geliştirici Seçenekleri</h3>
          <Button 
            type="button" 
            variant="outline"
            onClick={handleWebhookTest}
            className="bg-yellow-50 text-amber-800 border-amber-300 hover:bg-amber-100"
          >
            Webhook Test Et
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Bu buton sadece geliştirme aşamasında görünür ve webhook entegrasyonunu test etmek içindir.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
