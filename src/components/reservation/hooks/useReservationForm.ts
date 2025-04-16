
import { useCallback } from 'react';
import { FormData } from '../types';

export const useReservationForm = (setState: Function) => {
  const setFormData = useCallback((data: Partial<FormData>) => {
    setState((prevState: any) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        ...data
      }
    }));
  }, [setState]);

  const setBasicFormCompleted = useCallback((completed: boolean) => {
    setState((prevState: any) => ({
      ...prevState,
      basicFormCompleted: completed
    }));
  }, [setState]);

  return {
    setFormData,
    setBasicFormCompleted
  };
};
