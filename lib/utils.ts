import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// utils/pdfGenerator.ts
import { COMPANY_INFO, InvoiceFormData } from "@/types/types";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { REGULAR_CLIENTS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Configuration du PDF
const PDF_CONFIG = {
  margins: {
    left: 20,
    right: 20,
  },
  spacing: {
    normal: 8, // Espacement normal entre les lignes
    semiSection: 15,
    section: 25, // Espacement entre les sections
    large: 40, // Grand espacement
  },
  fonts: {
    title: 32,
    subtitle: 18,
    regular: 12,
    small: 10,
  },
  logo: {
    path: "/logo.png",
    width: 50,
    height: 40,
    x: 20,
    y: 10,
  },
} as const;

// Ajout de la police Poppins
const addPoppinsFont = (pdf: jsPDF) => {
  pdf.addFont("/font/Poppins-Regular.ttf", "Poppins", "normal");
  pdf.addFont("/font/Poppins-Bold.ttf", "Poppins", "bold");
};

export const generatePDF = (formData: InvoiceFormData) => {
  const pdf = new jsPDF("p", "mm", "a4");

  // Configuration initiale
  addPoppinsFont(pdf);
  pdf.setFont("Poppins", "normal");

  const marginRight = pdf.internal.pageSize.width - PDF_CONFIG.margins.right;
  let currentY = 25;

  // Ajout du logo
  try {
    pdf.addImage(
      PDF_CONFIG.logo.path,
      "PNG",
      PDF_CONFIG.margins.left,
      10,
      PDF_CONFIG.logo.width,
      PDF_CONFIG.logo.height
    );
  } catch (error) {
    console.error("Erreur lors du chargement du logo:", error);
  }

  // Titre "VTC Facture"
  pdf.setFontSize(PDF_CONFIG.fonts.title);
  pdf.text("VTC Facture", marginRight, currentY, { align: "right" });
  currentY += PDF_CONFIG.spacing.large;

  // Date et numéro de facture selon le type de facture
  pdf.setFontSize(PDF_CONFIG.fonts.regular);

  if (formData.invoiceType === "classic") {
    pdf.setFont("Poppins", "normal");
    pdf.text("DATE: ", PDF_CONFIG.margins.left, currentY);
    pdf.setFont("Poppins", "bold");
    pdf.text(
      formData.date || "",
      PDF_CONFIG.margins.left + pdf.getTextWidth("DATE: "),
      currentY
    );
    currentY += PDF_CONFIG.spacing.normal;
  }

  pdf.setFont("Poppins", "normal");
  pdf.text("Facture n°", PDF_CONFIG.margins.left, currentY);
  pdf.setFont("Poppins", "bold");
  pdf.text(
    formData.invoiceNumber,
    PDF_CONFIG.margins.left + pdf.getTextWidth("Facture n°"),
    currentY
  );
  currentY += PDF_CONFIG.spacing.semiSection;

  // Informations de la société
  pdf.setFont("Poppins", "bold");
  pdf.text(COMPANY_INFO.name, PDF_CONFIG.margins.left, currentY);
  currentY += PDF_CONFIG.spacing.normal;

  pdf.setFont("Poppins", "normal");
  pdf.text(`${COMPANY_INFO.address},`, PDF_CONFIG.margins.left, currentY);
  currentY += PDF_CONFIG.spacing.normal;

  pdf.text(COMPANY_INFO.city, PDF_CONFIG.margins.left, currentY);
  currentY += PDF_CONFIG.spacing.normal;

  pdf.text("EMAIL : ", PDF_CONFIG.margins.left, currentY);
  pdf.setFont("Poppins", "bold");
  pdf.text(
    COMPANY_INFO.email,
    PDF_CONFIG.margins.left + pdf.getTextWidth("EMAIL : "),
    currentY
  );
  currentY += PDF_CONFIG.spacing.normal;

  pdf.setFont("Poppins", "normal");
  pdf.text("SIRET : ", PDF_CONFIG.margins.left, currentY);
  pdf.setFont("Poppins", "bold");
  pdf.text(
    COMPANY_INFO.siret,
    PDF_CONFIG.margins.left + pdf.getTextWidth("SIRET : "),
    currentY
  );
  currentY += PDF_CONFIG.spacing.normal;

  pdf.setFont("Poppins", "normal");
  pdf.text("TEL : ", PDF_CONFIG.margins.left, currentY);
  pdf.setFont("Poppins", "bold");
  pdf.text(
    COMPANY_INFO.tel,
    PDF_CONFIG.margins.left + pdf.getTextWidth("TEL : "),
    currentY
  );

  // Nom du client
  currentY += PDF_CONFIG.spacing.normal;
  const clientName =
    formData.clientType === "regular"
      ? REGULAR_CLIENTS.find((c) => c.id === formData.selectedClientId)?.name
      : formData.newClientName;
  pdf.setFont("Poppins", "bold");
  pdf.text(clientName?.toUpperCase() || "", marginRight, currentY, {
    align: "right",
  });

  // Type de trajet ou titre mensuel
  currentY += PDF_CONFIG.spacing.section;
  pdf.setFontSize(PDF_CONFIG.fonts.subtitle);

  const travelText =
    formData.invoiceType === "classic"
      ? `TRAJET ${formData.travelType}`
      : `TRAJETS MOIS ${formData.selectedMonth?.toUpperCase()}`;

  pdf.text(travelText, pdf.internal.pageSize.width / 2, currentY, {
    align: "center",
  });

  if (formData.invoiceType === "classic") {
    // Détails du trajet
    currentY += PDF_CONFIG.spacing.section;
    pdf.setFontSize(PDF_CONFIG.fonts.regular);
    pdf.setFont("Poppins", "normal");
    pdf.text("LIEU DE PRISE EN CHARGE : ", PDF_CONFIG.margins.left, currentY);
    pdf.setFont("Poppins", "bold");
    pdf.text(
      formData.pickupLocation,
      PDF_CONFIG.margins.left + pdf.getTextWidth("LIEU DE PRISE EN CHARGE : "),
      currentY
    );

    currentY += PDF_CONFIG.spacing.normal;
    pdf.setFont("Poppins", "normal");
    pdf.text("LIEU DE DESTINATION : ", PDF_CONFIG.margins.left, currentY);
    pdf.setFont("Poppins", "bold");
    pdf.text(
      formData.dropoffLocation,
      PDF_CONFIG.margins.left + pdf.getTextWidth("LIEU DE DESTINATION : "),
      currentY
    );
  } else {
    currentY += 20;
  }

  // Calculs financiers
  const ttc = parseFloat(formData.price);
  const tvaRate = parseFloat(formData.tva) / 100;
  const tva = ttc * tvaRate;
  const ht = ttc - tva;

  // Montants
  currentY += PDF_CONFIG.spacing.semiSection;
  pdf.setFontSize(PDF_CONFIG.fonts.regular);

  const amountX = marginRight - 50;
  const labelX = amountX - 20;

  pdf.setFont("Poppins", "normal");
  pdf.text("HT :", labelX, currentY, { align: "right" });
  pdf.setFont("Poppins", "bold");
  pdf.text(`${ht.toFixed(2)} €`, marginRight, currentY, { align: "right" });

  currentY += PDF_CONFIG.spacing.normal;
  pdf.setFont("Poppins", "normal");
  pdf.text("TVA :", labelX, currentY, { align: "right" });
  pdf.setFont("Poppins", "bold");
  pdf.text(`${tva.toFixed(2)} €`, marginRight, currentY, { align: "right" });

  currentY += PDF_CONFIG.spacing.normal;
  pdf.setFont("Poppins", "normal");
  pdf.text("TTC :", labelX, currentY, { align: "right" });
  pdf.setFont("Poppins", "bold");
  pdf.text(`${ttc.toFixed(2)} €`, marginRight, currentY, { align: "right" });

  // Mention TVA
  currentY += PDF_CONFIG.spacing.section;
  pdf.setFontSize(PDF_CONFIG.fonts.small);
  pdf.setFont("Poppins", "normal");
  pdf.text(
    "TVA non applicable selon l'article 293B du Code Général des Impôts",
    marginRight,
    currentY,
    { align: "right" }
  );

  // Sauvegarde du PDF
  pdf.save(
    `facture-${formData.invoiceNumber}_${formData.newClientName || ""}.pdf`
  );
};

export const useIsClient = () => {
  // Fonction permettant de lancer le render après hydratation du client
  "use client";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
