
export type FormData = {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
  guests: string;
  occasion: string;
  notes: string;
};

export type FormError = {
  [key in keyof FormData]?: string;
};
