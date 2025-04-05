
import { useReservationForm } from './reservation/useReservationForm';
import BasicInfoForm from './reservation/BasicInfoForm';
import SubmitButton from './reservation/SubmitButton';

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

  return (
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
  );
};

export default ReservationForm;
