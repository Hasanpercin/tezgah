
import React from "react";

type CardTypeIndicatorProps = {
  cardType: string | null;
};

const CardTypeIndicator: React.FC<CardTypeIndicatorProps> = ({ cardType }) => {
  return (
    <div className="flex gap-2">
      <div className={`opacity-${cardType === "VISA" ? "100" : "30"}`}>
        <span className="font-bold text-blue-600">VISA</span>
      </div>
      <div className={`opacity-${cardType === "MasterCard" ? "100" : "30"}`}>
        <span className="font-bold text-red-600">MC</span>
      </div>
    </div>
  );
};

export default CardTypeIndicator;
