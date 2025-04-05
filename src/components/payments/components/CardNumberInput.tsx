
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

type CardNumberInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CardNumberInput: React.FC<CardNumberInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="cardNumber">Kart Numarası</Label>
      <div className="relative">
        <Input
          id="cardNumber"
          name="cardNumber"
          placeholder="XXXX XXXX XXXX XXXX"
          value={value}
          onChange={onChange}
          required
          className="pl-10"
        />
        <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};

export default CardNumberInput;
