export interface Client {
  id: number;
  name: string;
}

// types/types.ts
export type InvoiceType = "classic" | "monthly";

export interface InvoiceFormData {
  invoiceType: InvoiceType;
  invoiceNumber: string;
  date?: string; // Optionnel car uniquement pour classic
  selectedMonth?: string; // Uniquement pour monthly
  clientType: "regular" | "new";
  selectedClientId?: number;
  newClientName?: string;
  price: string;
  tva: string;
  travelType?: "ALLER" | "RETOUR"; // Optionnel car uniquement pour classic
  pickupLocation: string;
  dropoffLocation: string;
}

// Constante pour les mois
export const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
] as const;

export const COMPANY_INFO = {
  name: "AIN SEBA NORCADAT",
  address: "2 ALLÉE DES MÉSANGES",
  city: "92290 CHATENAY MALABRY",
  email: "anorcadat@yahoo.fr",
  siret: "442462469",
  tel: "+33 6 50 03 23 50",
};
