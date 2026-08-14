import {
  ArrowRight,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileClock,
  Plus,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import InvoiceTable from "../components/InvoiceTable";
import { invoices as defaultInvoices, formatINR, getSubtotal } from "../data/invoices";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "limitless-design-invoices";

export default function Dashboard() {
  const [invoiceList, setInvoiceList] = useState(defaultInvoices);

  /* =====================================================
     LOAD SAVED INVOICES
  ===================================================== */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setInvoiceList(parsed);
        }
      }
    } catch (error) {
      console.error("Unable to load invoices:", error);
      setInvoiceList(defaultInvoices);
    }
  }, []);

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const stats = useMemo(() => {
    const total = invoiceList.reduce(
      (sum, invoice) =>
        sum + Number(invoice.total ?? getSubtotal(invoice) ?? 0),
      0
    );

    const paid = invoiceList.reduce((sum, invoice) => {
      if (invoice.status === "Paid") {
        return (
          sum +
          Number(invoice.amountPaid ?? invoice.total ?? getSubtotal(invoice) ?? 0)
        );
      }

      return sum;
    }, 0);

    const outstanding = invoiceList.reduce((sum, invoice) => {
      if (invoice.status !== "Paid") {
        return (
          sum +
          Number(
            invoice.balanceDue ??
              invoice.total ??
              getSubtotal(invoice) ??
              0
          )
        );
      }

      return sum;
    }, 0);

    return {
      total,
      paid,
      outstanding,
      count: invoiceList.length,
    };
  }, [invoiceList]);

  /* =====================================================
     RECENT INVOICES
  ===================================================== */

  const recentInvoices = useMemo(() => {
    return [...invoiceList]
      .sort((a, b) => {
        const dateA = new Date(
          a.invoiceDate || a.issueDate || 0
        ).getTime();

        const dateB = new Date(
          b.invoiceDate || b.issueDate || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [invoiceList]);

  return (
    <div className="space-y-8">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
              <Receipt size={14} />
              Limitless Design · Invoice Studio
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Professional invoices,
              <span className="block text-indigo-300">
                without the complexity.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Create polished, client-ready invoices for your creative
              projects. Manage billing, payment details and outstanding
              balances from one simple workspace.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <Link
                to="/invoices/new"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                <Plus size={17} />
                Create Invoice
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/invoices"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Invoices
              </Link>

            </div>
          </div>

          {/* HERO SUMMARY */}

          <div className="hidden min-w-[250px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm lg:block">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <TrendingUp size={21} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Total billed
                </p>

                <p className="mt-1 text-xl font-black text-white">
                  {formatINR(stats.total)}
                </p>
              </div>

            </div>

            <div className="mt-5 border-t border-white/10 pt-4">

              <p className="text-xs text-slate-400">
                Active invoices
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                {stats.count}
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total billed"
          value={formatINR(stats.total)}
          helper="Across all invoices"
          icon={CircleDollarSign}
        />

        <StatCard
          label="Paid"
          value={formatINR(stats.paid)}
          helper="Successfully collected"
          icon={FileCheck2}
        />

        <StatCard
          label="Outstanding"
          value={formatINR(stats.outstanding)}
          helper="Pending + overdue"
          icon={Clock3}
        />

        <StatCard
          label="Invoices"
          value={stats.count}
          helper="Total invoice records"
          icon={FileClock}
        />

      </section>

      {/* =====================================================
          RECENT INVOICES
      ===================================================== */}

      <section>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Billing overview
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Recent invoices
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest invoice activity and payment records.
            </p>

          </div>

          <Link
            to="/invoices"
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 transition hover:text-indigo-600"
          >
            View all
            <ArrowRight size={15} />
          </Link>

        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {recentInvoices.length > 0 ? (
            <InvoiceTable invoices={recentInvoices} />
          ) : (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Receipt size={25} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No invoices yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first invoice to start managing your billing.
              </p>

              <Link
                to="/invoices/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
              >
                <Plus size={16} />
                Create Invoice
              </Link>

            </div>
          )}

        </div>

      </section>

    </div>
  );
}