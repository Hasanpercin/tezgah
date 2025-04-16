
import { useReservationForm } from './reservation/useReservationForm';
import BasicInfoForm from './reservation/BasicInfoForm';
import SubmitButton from './reservation/SubmitButton';
import MenuSelection from './reservation/MenuSelection';

const ReservationForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleSubmit,
    menuSelection,
    handleMenuSelectionChange
  } = useReservationForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoForm
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleDateChange={handleDateChange}
      />

      {formData.guests && (
        <MenuSelection
          value={menuSelection}
          onChange={handleMenuSelectionChange}
          guestCount={formData.guests}
        />
      )}

      <div className="pt-4">
        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
};

export default ReservationForm;
