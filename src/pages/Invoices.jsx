import {
  Search,
  SlidersHorizontal,
  Plus,
  Receipt,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import InvoiceTable from "../components/InvoiceTable";
import { invoices as defaultInvoices } from "../data/invoices";

const STORAGE_KEY = "limitless-design-invoices";

export default function Invoices() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  /* =====================================================
     LOAD INVOICES
  ===================================================== */

  const loadInvoices = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setInvoiceList(parsed);
          return;
        }
      }

      setInvoiceList(defaultInvoices);
    } catch (error) {
      console.error("Unable to load invoices:", error);
      setInvoiceList(defaultInvoices);
    }
  };

  useEffect(() => {
    loadInvoices();

    const handleUpdate = () => {
      loadInvoices();
    };

    window.addEventListener("invoicesUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("invoicesUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  /* =====================================================
     FILTER INVOICES
  ===================================================== */

  const filtered = useMemo(() => {
    const search = query.toLowerCase().trim();

    return invoiceList.filter((invoice) => {
      const searchableText = `
        ${invoice.id || ""}
        ${invoice.invoiceNumber || ""}
        ${invoice.client || ""}
        ${invoice.clientName || ""}
        ${invoice.company || ""}
        ${invoice.projectName || ""}
      `.toLowerCase();

      const matchQuery =
        !search || searchableText.includes(search);

      const matchStatus =
        status === "All" || invoice.status === status;

      return matchQuery && matchStatus;
    });
  }, [invoiceList, query, status]);

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
            Billing
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            Invoices
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create, review and manage professional client invoices.
          </p>
        </div>

        <Link
          to="/invoices/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Create Invoice
        </Link>
      </div>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <label className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoice, client or project..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={17}
            className="text-slate-400"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-indigo-500 focus:bg-white"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* =====================================================
          RESULTS
      ===================================================== */}

      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <InvoiceTable invoices={filtered} />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Receipt size={25} />
          </div>

          <h3 className="mt-4 text-base font-black text-slate-900">
            No invoices found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {query || status !== "All"
              ? "Try changing your search or status filter."
              : "Create your first invoice to get started."}
          </p>

          {!query && status === "All" && (
            <Link
              to="/invoices/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Create Invoice
            </Link>
          )}
        </div>
      )}
    </div>
  );
}