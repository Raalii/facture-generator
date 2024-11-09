// app/page.tsx
"use client";

import { ClientSection } from "@/components/shared/ClientSection";
import { InvoiceTypeSection } from "@/components/shared/InvoicesTypeSection";
import { PriceSection } from "@/components/shared/PriceSection";
import { TravelSection } from "@/components/shared/TravelSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generatePDF, useIsClient } from "@/lib/utils";
import type { InvoiceFormData } from "@/types/types";
import React, { useState } from "react";

export default function InvoiceGenerator() {
  const isClient = useIsClient();

  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceType: "classic",
    invoiceNumber: "1",
    date: new Date().toISOString().split("T")[0],
    selectedMonth: undefined,
    clientType: "regular",
    selectedClientId: 1,
    newClientName: "",
    price: "",
    tva: "0",
    travelType: "ALLER",
    pickupLocation: "",
    dropoffLocation: "",
  });

  const handleInputChange = (
    field: keyof InvoiceFormData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Si on change le type de facture
      if (field === "invoiceType") {
        if (value === "monthly") {
          // Supprimer les champs spécifiques à la facture classique
          delete newData.travelType;
          delete newData.date;
        } else {
          // Réinitialiser les champs pour la facture classique
          newData.travelType = "ALLER";
          newData.date = new Date().toISOString().split("T")[0];
          delete newData.selectedMonth;
        }
      }

      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations communes
    if (!formData.invoiceNumber || !formData.price) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validations spécifiques selon le type
    if (formData.invoiceType === "monthly" && !formData.selectedMonth) {
      alert("Veuillez sélectionner un mois pour la facture mensuelle");
      return;
    }

    if (formData.invoiceType === "classic" && !formData.date) {
      alert("Veuillez sélectionner une date pour la facture classique");
      return;
    }

    generatePDF(formData);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Générateur de Factures VTC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InvoiceTypeSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            {/* Numéro de facture toujours visible */}
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input
                id="invoiceNumber"
                type="text"
                required
                value={formData.invoiceNumber}
                onChange={(e) =>
                  handleInputChange("invoiceNumber", e.target.value)
                }
              />
            </div>

            {/* Date uniquement pour les factures classiques */}
            {formData.invoiceType === "classic" && (
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </div>
            )}

            <ClientSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <PriceSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <TravelSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <Button type="submit" className="w-full font-bold">
              Générer la facture PDF
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
