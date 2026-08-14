import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  Printer,
} from "lucide-react";
import { Link } from "react-router-dom";
import InvoiceDocument from "../components/InvoiceDocument";
import StatusBadge from "../components/StatusBadge";
import { invoices } from "../data/invoices";

export default function InvoiceView() {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      /*
       * First try to load the invoice created
       * from the Create Invoice page.
       */
      const savedInvoice = localStorage.getItem(
        "limitless-design-invoice"
      );

      if (savedInvoice) {
        const parsedInvoice = JSON.parse(savedInvoice);

        /*
         * Convert CreateInvoice data into the
         * format expected by InvoiceDocument.
         */
        const formattedInvoice = {
          ...parsedInvoice,

          id:
            parsedInvoice.invoiceNumber ||
            "LD/2026-27/0002",

          client:
            parsedInvoice.clientName ||
            "Client",

          status:
            parsedInvoice.status ||
            "Pending",

          /*
           * Keep the original items so the
           * InvoiceDocument can use them.
           */
          items: parsedInvoice.items || [],

          subtotal:
            Number(parsedInvoice.subtotal) || 0,

          discount:
            Number(parsedInvoice.discount) || 0,

          total:
            Number(parsedInvoice.total) || 0,

          amountPaid:
            Number(parsedInvoice.amountPaid) || 0,

          balanceDue:
            Number(parsedInvoice.balanceDue) || 0,

          gst: 0,
        };

        setInvoice(formattedInvoice);
      } else {
        /*
         * If there is no newly-created invoice,
         * use the existing demo invoice data.
         */
        const firstInvoice = invoices?.[0];

        if (firstInvoice) {
          setInvoice(firstInvoice);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load invoice:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================
     PRINT
  ========================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm font-medium text-slate-500">
          Loading invoice...
        </div>
      </div>
    );
  }

  /* =========================================
     INVOICE NOT FOUND
  ========================================= */

  if (!invoice) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Invoice not found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Create an invoice first.
        </p>

        <Link
          to="/invoices/create"
          className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Create Invoice
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        {/* LEFT */}

        <div className="flex items-center gap-3">
          <Link
            to="/invoices"
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-slate-950">
                {invoice.invoiceNumber ||
                  invoice.id}
              </h1>

              <StatusBadge
                status={
                  invoice.status ||
                  "Pending"
                }
              />
            </div>

            <p className="mt-1 text-xs text-slate-400">
              {invoice.clientName ||
                invoice.client ||
                "Client"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Printer size={17} />
            Print
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Download size={17} />
            Save / PDF
          </button>
        </div>
      </div>

      {/* =====================================
          INVOICE DOCUMENT
      ===================================== */}

      <InvoiceDocument invoice={invoice} />
    </div>
  );
}