import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  Printer,
  Plus,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import InvoiceDocument from "../components/InvoiceDocument";
import StatusBadge from "../components/StatusBadge";
import { invoices as defaultInvoices } from "../data/invoices";

export default function InvoiceView() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const activeSaved = localStorage.getItem("limitless-design-invoice");
      let parsedActive = null;
      if (activeSaved) {
        try {
          parsedActive = JSON.parse(activeSaved);
        } catch (e) {
          console.error("Error parsing limitless-design-invoice:", e);
        }
      }

      const allSavedStr = localStorage.getItem("limitless-design-invoices");
      let allSaved = [];
      if (allSavedStr) {
        try {
          const parsedList = JSON.parse(allSavedStr);
          if (Array.isArray(parsedList)) {
            allSaved = parsedList;
          }
        } catch (e) {
          console.error("Error parsing limitless-design-invoices:", e);
        }
      }

      let targetInvoice = null;

      if (invoiceId && invoiceId !== "preview") {
        const decodedId = decodeURIComponent(invoiceId).trim().toLowerCase();

        // 1. Check in saved invoices list
        targetInvoice = allSaved.find(
          (inv) =>
            (inv.id && String(inv.id).trim().toLowerCase() === decodedId) ||
            (inv.invoiceNumber &&
              String(inv.invoiceNumber).trim().toLowerCase() === decodedId)
        );

        // 2. Check in default invoices
        if (!targetInvoice) {
          targetInvoice = defaultInvoices.find(
            (inv) =>
              (inv.id && String(inv.id).trim().toLowerCase() === decodedId) ||
              (inv.invoiceNumber &&
                String(inv.invoiceNumber).trim().toLowerCase() === decodedId)
          );
        }

        // 3. Check in active preview invoice if it matches
        if (!targetInvoice && parsedActive) {
          const activeId = String(
            parsedActive.invoiceNumber || parsedActive.id || ""
          )
            .trim()
            .toLowerCase();
          if (activeId === decodedId) {
            targetInvoice = parsedActive;
          }
        }
      } else {
        // 'preview' or default
        if (parsedActive) {
          targetInvoice = parsedActive;
        } else if (allSaved.length > 0) {
          targetInvoice = allSaved[0];
        } else if (defaultInvoices.length > 0) {
          targetInvoice = defaultInvoices[0];
        }
      }

      if (targetInvoice) {
        const formattedInvoice = {
          ...targetInvoice,
          id:
            targetInvoice.invoiceNumber ||
            targetInvoice.id ||
            "LD/2026-27/0001",
          invoiceNumber:
            targetInvoice.invoiceNumber ||
            targetInvoice.id ||
            "LD/2026-27/0001",
          client:
            targetInvoice.clientName ||
            targetInvoice.client ||
            "Client",
          clientName:
            targetInvoice.clientName ||
            targetInvoice.client ||
            "Client",
          status: targetInvoice.status || "Pending",
          items: targetInvoice.items || [],
          subtotal: Number(targetInvoice.subtotal) || 0,
          discount: Number(targetInvoice.discount) || 0,
          total: Number(targetInvoice.total) || 0,
          amountPaid: Number(targetInvoice.amountPaid) || 0,
          balanceDue: Number(targetInvoice.balanceDue) || 0,
          gst: 0,
        };

        setInvoice(formattedInvoice);
      } else {
        setInvoice(null);
      }
    } catch (error) {
      console.error("Unable to load invoice:", error);
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  /* =========================================
     PRINT / PDF
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
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Invoice not found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          We couldn't find the invoice you're looking for.
        </p>

        <div className="mt-5 flex justify-center gap-3">
          <Link
            to="/invoices"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            All Invoices
          </Link>
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Create Invoice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* =====================================
          HEADER (Hidden in Print)
      ===================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Link
            to="/invoices"
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:text-slate-900"
            title="Back to invoices"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-slate-950">
                {invoice.invoiceNumber || invoice.id}
              </h1>

              <StatusBadge
                status={invoice.status || "Pending"}
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