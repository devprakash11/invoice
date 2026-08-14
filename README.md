# Limitless Design — Invoice Studio

A professional, responsive invoice website built with React, Vite, React Router and Tailwind CSS.

## Stack
- HTML5
- CSS3 + Tailwind CSS
- JavaScript (React)
- React Router
- Vite
- Lucide React icons

## Structure
```text
src/
├── assets/       # Uploaded Limitless Design logo
├── components/   # Reusable UI and invoice components
├── data/         # Business, invoice and service data
├── pages/        # Dashboard, invoices, create invoice, invoice view, services
└── styles/       # Tailwind and print styles
```

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Invoice / GST behavior
The invoice template is intentionally configured with **No GST**: GST is displayed as ₹0 and the invoice states that no GST is charged. Update `src/data/invoices.js` with your actual business details and invoice data.

## PDF
Open any invoice and choose **Save / PDF**. The browser print dialog can save the print-ready invoice as a PDF.
