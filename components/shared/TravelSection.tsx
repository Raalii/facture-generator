// components/shared/TravelSection.tsx
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InvoiceFormData } from "@/types/types";
import React from "react";
import { Input } from "../ui/input";

interface TravelSectionProps {
  formData: InvoiceFormData;
  onInputChange: (field: keyof InvoiceFormData, value: string) => void;
}

export const TravelSection: React.FC<TravelSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      {formData.invoiceType === "classic" && (
        <>
          <div className="space-y-2">
            <Label>Type de trajet</Label>
            <Select
              value={formData.travelType}
              onValueChange={(value: "ALLER" | "RETOUR") =>
                onInputChange("travelType", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALLER">Trajet Aller</SelectItem>
                <SelectItem value="RETOUR">Trajet Retour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupLocation">Lieu de prise en charge</Label>
            <Input
              id="pickupLocation"
              type="text"
              required
              value={formData.pickupLocation}
              onChange={(e) => onInputChange("pickupLocation", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoffLocation">Lieu de destination</Label>
            <Input
              id="dropoffLocation"
              type="text"
              required
              value={formData.dropoffLocation}
              onChange={(e) => onInputChange("dropoffLocation", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};
