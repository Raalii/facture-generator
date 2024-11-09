import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { InvoiceFormData } from "@/types/types";

interface PriceSectionProps {
  formData: InvoiceFormData;
  onInputChange: (field: keyof InvoiceFormData, value: string | number) => void;
}

export const PriceSection: React.FC<PriceSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="price">Prix TTC (en €)</Label>
        <Input
          id="price"
          type="number"
          required
          min="0"
          value={formData.price}
          onChange={(e) => onInputChange("price", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tva">TVA (%)</Label>
        <Input
          id="tva"
          type="number"
          required
          min="0"
          max="100"
          value={formData.tva}
          onChange={(e) => onInputChange("tva", e.target.value)}
        />
      </div>
    </div>
  );
};
