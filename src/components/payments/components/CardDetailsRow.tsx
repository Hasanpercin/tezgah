
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CardDetailsRowProps = {
  expiryDate: string;
  cvv: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CardDetailsRow: React.FC<CardDetailsRowProps> = ({ expiryDate, cvv, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Son Kullanma Tarihi</Label>
        <Input
          id="expiryDate"
          name="expiryDate"
          placeholder="MM/YY"
          value={expiryDate}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cvv">CVV</Label>
        <Input
          id="cvv"
          name="cvv"
          placeholder="XXX"
          value={cvv}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

export default CardDetailsRow;
