import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGULAR_CLIENTS } from "@/lib/constants";
import { InvoiceFormData } from "@/types/types";
import React from "react";

interface ClientSectionProps {
  formData: InvoiceFormData;
  onInputChange: (field: keyof InvoiceFormData, value: string | number) => void;
}

export const ClientSection: React.FC<ClientSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type de client</Label>
        <Select
          value={formData.clientType}
          onValueChange={(value: "regular" | "new") =>
            onInputChange("clientType", value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Client régulier</SelectItem>
            <SelectItem value="new">Nouveau client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.clientType === "regular" ? (
        <div className="space-y-2">
          <Label>Sélectionner le client</Label>
          <Select
            value={formData.selectedClientId?.toString()}
            onValueChange={(value) =>
              onInputChange("selectedClientId", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGULAR_CLIENTS.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="newClientName">Nom du nouveau client</Label>
          <Input
            id="newClientName"
            type="text"
            required
            value={formData.newClientName || ""}
            onChange={(e) => onInputChange("newClientName", e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
