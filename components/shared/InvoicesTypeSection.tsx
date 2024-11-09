// components/shared/InvoiceTypeSection.tsx
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceFormData, MONTHS } from "@/types/types";
import React from "react";

interface InvoiceTypeSectionProps {
  formData: InvoiceFormData;
  onInputChange: (field: keyof InvoiceFormData, value: string) => void;
}

export const InvoiceTypeSection: React.FC<InvoiceTypeSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type de facture</Label>
        <Select
          value={formData.invoiceType}
          onValueChange={(value: "classic" | "monthly") =>
            onInputChange("invoiceType", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type de facture" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">Facture classique</SelectItem>
            <SelectItem value="monthly">Facture mensuelle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.invoiceType === "monthly" && (
        <div className="space-y-2">
          <Label>Mois</Label>
          <Select
            value={formData.selectedMonth}
            onValueChange={(value) => onInputChange("selectedMonth", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le mois" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
