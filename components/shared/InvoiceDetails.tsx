// components/InvoiceDetails.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { InvoiceFormData } from "@/types/types";

interface InvoiceDetailsProps {
  formData: InvoiceFormData;
  onInputChange: (field: keyof InvoiceFormData, value: string | number) => void;
}

export const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="invoiceNumber">Numéro de facture</Label>
        <Input
          id="invoiceNumber"
          type="text"
          required
          value={formData.invoiceNumber}
          onChange={(e) => onInputChange("invoiceNumber", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          required
          value={formData.date}
          onChange={(e) => onInputChange("date", e.target.value)}
        />
      </div>
    </div>
  );
};
