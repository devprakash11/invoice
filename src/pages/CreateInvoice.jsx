import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Eye,
  Plus,
  Save,
  Trash2,
  Upload,
  WalletCards,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const STORAGE_KEY = "limitless-design-invoices";
const CURRENT_INVOICE_KEY = "limitless-design-invoice";

const initialItems = [
  {
    id: Date.now(),
    description: "Logo Design Package",
    qty: 1,
    rate: 0,
  },
];

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function CreateInvoice() {
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    invoiceNumber: `LD/2026-27/${String(Date.now()).slice(-4)}`,
    invoiceDate: getToday(),
    dueDate: "",
    projectName: "Website Design & Development",

    // Client
    clientName: "",
    company: "",
    email: "",
    phone: "",
    billingAddress: "",

    // Business
    businessName: "Limitless Design",
    businessPhone: "+91 76675 83859",
    businessEmail: "help.limitlessdesign@gmail.com",
    website: "https://limitlessdesign.netlify.app",
    businessAddress: "",

    // Payment
    discount: 0,
    amountPaid: 0,

    // UPI
    upiEnabled: true,
    upiName: "Limitless Design",
    upiId: "yourname@bank",
    upiQr: null,

    // Bank
    bankEnabled: false,
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",

    // Notes
    notes: "Thank you for choosing Limitless Design.",
    terms:
      "Final files will be delivered after completion of the agreed payment. Additional work outside the agreed project scope may be charged separately.",
  });

  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState(false);

  /* =====================================================
     UPDATE INVOICE
  ===================================================== */

  const updateInvoice = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =====================================================
     UPDATE ITEM
  ===================================================== */

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "qty" || field === "rate"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  /* =====================================================
     ADD ITEM
  ===================================================== */

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        description: "",
        qty: 1,
        rate: 0,
      },
    ]);
  };

  /* =====================================================
     REMOVE ITEM
  ===================================================== */

  const removeItem = (id) => {
    if (items.length === 1) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return (
        sum +
        (Number(item.qty) || 0) *
          (Number(item.rate) || 0)
      );
    }, 0);
  }, [items]);

  const discount = Math.max(
    Number(invoice.discount) || 0,
    0
  );

  const total = Math.max(subtotal - discount, 0);

  const amountPaid = Math.min(
    Math.max(Number(invoice.amountPaid) || 0, 0),
    total
  );

  const balanceDue = Math.max(total - amountPaid, 0);

  /* =====================================================
     PAYMENT STATUS
  ===================================================== */

  const getPaymentStatus = () => {
    if (total <= 0) {
      return "Pending";
    }

    if (amountPaid >= total) {
      return "Paid";
    }

    if (amountPaid > 0) {
      return "Partially Paid";
    }

    if (
      invoice.dueDate &&
      new Date(invoice.dueDate) < new Date(getToday())
    ) {
      return "Overdue";
    }

    return "Pending";
  };

  /* =====================================================
     CURRENCY
  ===================================================== */

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  /* =====================================================
     QR UPLOAD
  ===================================================== */

  const handleQrUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateInvoice("upiQr", reader.result);
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     GET COMPLETE INVOICE
  ===================================================== */

  const getInvoiceData = () => {
    const status = getPaymentStatus();

    return {
      ...invoice,

      id: invoice.invoiceNumber,
      invoiceNumber: invoice.invoiceNumber,

      client: invoice.clientName,
      clientName: invoice.clientName,

      issueDate: invoice.invoiceDate,
      invoiceDate: invoice.invoiceDate,

      items,

      subtotal,
      discount,
      total,
      amountPaid,
      balanceDue,

      gst: 0,

      status,

      updatedAt: new Date().toISOString(),
    };
  };

  /* =====================================================
     READ SAVED INVOICES
  ===================================================== */

  const getSavedInvoices = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Unable to read invoices:", error);
      return [];
    }
  };

  /* =====================================================
     SAVE TO LOCAL STORAGE
  ===================================================== */

  const saveInvoiceToStorage = (invoiceData) => {
    const savedInvoices = getSavedInvoices();

    const existingIndex = savedInvoices.findIndex(
      (item) =>
        item.id === invoiceData.id ||
        item.invoiceNumber === invoiceData.invoiceNumber
    );

    if (existingIndex >= 0) {
      savedInvoices[existingIndex] = invoiceData;
    } else {
      savedInvoices.unshift(invoiceData);
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedInvoices)
    );

    localStorage.setItem(
      CURRENT_INVOICE_KEY,
      JSON.stringify(invoiceData)
    );

    /*
     * Tell other pages that invoice data changed.
     */
    window.dispatchEvent(new Event("invoicesUpdated"));
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = () => {
    if (!invoice.clientName.trim()) {
      alert("Please enter the client name.");
      return;
    }

    if (items.some((item) => !item.description.trim())) {
      alert("Please enter a description for every item.");
      return;
    }

    setSaving(true);

    try {
      const invoiceData = getInvoiceData();

      saveInvoiceToStorage(invoiceData);

      alert(
        `Invoice saved successfully as ${invoiceData.status}.`
      );

      navigate("/invoices");
    } catch (error) {
      console.error("Unable to save invoice:", error);
      alert("Unable to save invoice.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     PREVIEW
  ===================================================== */

  const handlePreview = () => {
    const invoiceData = getInvoiceData();

    saveInvoiceToStorage(invoiceData);

    navigate("/invoices/preview");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/invoices"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-950">
                Create Invoice
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Create a professional non-GST invoice.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Eye size={17} />
              Preview
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-7">
        {/* INVOICE DETAILS */}

        <section className="card">
          <SectionHeader
            title="Invoice Details"
            description="Basic information about this invoice."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Invoice Number"
              value={invoice.invoiceNumber}
              onChange={(e) =>
                updateInvoice(
                  "invoiceNumber",
                  e.target.value
                )
              }
            />

            <Input
              label="Project Name"
              value={invoice.projectName}
              onChange={(e) =>
                updateInvoice(
                  "projectName",
                  e.target.value
                )
              }
            />

            <Input
              label="Invoice Date"
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) =>
                updateInvoice(
                  "invoiceDate",
                  e.target.value
                )
              }
            />

            <Input
              label="Due Date"
              type="date"
              value={invoice.dueDate}
              onChange={(e) =>
                updateInvoice("dueDate", e.target.value)
              }
            />
          </div>

          <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            <strong>Non-GST Invoice:</strong> GSTIN,
            CGST, SGST and IGST are not included.
          </div>
        </section>

        {/* CLIENT */}

        <section className="card">
          <SectionHeader
            title="Bill To"
            description="Enter your client's billing information."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Client Name"
              required
              value={invoice.clientName}
              onChange={(e) =>
                updateInvoice(
                  "clientName",
                  e.target.value
                )
              }
            />

            <Input
              label="Company"
              value={invoice.company}
              onChange={(e) =>
                updateInvoice("company", e.target.value)
              }
            />

            <Input
              label="Email"
              type="email"
              value={invoice.email}
              onChange={(e) =>
                updateInvoice("email", e.target.value)
              }
            />

            <Input
              label="Phone"
              value={invoice.phone}
              onChange={(e) =>
                updateInvoice("phone", e.target.value)
              }
            />

            <TextArea
              label="Billing Address"
              className="md:col-span-2"
              value={invoice.billingAddress}
              onChange={(e) =>
                updateInvoice(
                  "billingAddress",
                  e.target.value
                )
              }
            />
          </div>
        </section>

        {/* BUSINESS */}

        <section className="card">
          <SectionHeader
            title="Your Business"
            description="Information displayed on your invoice."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Business Name"
              value={invoice.businessName}
              onChange={(e) =>
                updateInvoice(
                  "businessName",
                  e.target.value
                )
              }
            />

            <Input
              label="Phone"
              value={invoice.businessPhone}
              onChange={(e) =>
                updateInvoice(
                  "businessPhone",
                  e.target.value
                )
              }
            />

            <Input
              label="Email"
              type="email"
              value={invoice.businessEmail}
              onChange={(e) =>
                updateInvoice(
                  "businessEmail",
                  e.target.value
                )
              }
            />

            <Input
              label="Website"
              value={invoice.website}
              onChange={(e) =>
                updateInvoice("website", e.target.value)
              }
            />

            <TextArea
              label="Business Address"
              className="md:col-span-2"
              value={invoice.businessAddress}
              onChange={(e) =>
                updateInvoice(
                  "businessAddress",
                  e.target.value
                )
              }
            />
          </div>
        </section>

        {/* ITEMS */}

        <section className="card">
          <SectionHeader
            title="Services & Items"
            description="Add all services included in the invoice."
          />

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-black text-slate-900">
                    Item {index + 1}
                  </p>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.id)
                      }
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_100px_150px_150px]">
                  <Input
                    label="Description"
                    placeholder="Logo Design Package"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Qty"
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "qty",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Rate"
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "rate",
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Amount
                    </label>

                    <div className="flex h-[46px] items-center rounded-xl bg-white px-4 text-sm font-black text-slate-900 ring-1 ring-slate-200">
                      {formatCurrency(
                        Number(item.qty || 0) *
                          Number(item.rate || 0)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Plus size={17} />
              Add Item
            </button>
          </div>
        </section>

        {/* PAYMENT SUMMARY */}

        <section className="card">
          <SectionHeader
            title="Payment Summary"
            description="Payment status is calculated automatically."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Discount"
              type="number"
              min="0"
              value={invoice.discount}
              onChange={(e) =>
                updateInvoice(
                  "discount",
                  e.target.value
                )
              }
            />

            <Input
              label="Amount Already Paid"
              type="number"
              min="0"
              value={invoice.amountPaid}
              onChange={(e) =>
                updateInvoice(
                  "amountPaid",
                  e.target.value
                )
              }
            />
          </div>

          {/* STATUS */}

          <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-sm font-semibold text-slate-600">
              Payment Status
            </span>

            <StatusBadge status={getPaymentStatus()} />
          </div>

          <div className="mt-5 ml-auto max-w-md rounded-2xl bg-slate-950 p-5 text-white">
            <SummaryRow
              label="Subtotal"
              value={subtotal}
            />

            <SummaryRow
              label="Discount"
              value={discount}
            />

            <div className="my-3 border-t border-white/10" />

            <SummaryRow
              label="Total"
              value={total}
              bold
            />

            <SummaryRow
              label="Paid"
              value={amountPaid}
            />

            <div className="my-3 border-t border-white/10" />

            <SummaryRow
              label="Balance Due"
              value={balanceDue}
              bold
            />
          </div>
        </section>

        {/* PAYMENT METHODS */}

        <section className="card">
          <SectionHeader
            title="Payment Methods"
            description="Enable UPI, bank transfer, or both."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <PaymentMethod
              icon={<WalletCards size={20} />}
              title="UPI"
              description="Accept UPI payments using QR or UPI ID."
              enabled={invoice.upiEnabled}
              onClick={() =>
                updateInvoice(
                  "upiEnabled",
                  !invoice.upiEnabled
                )
              }
            />

            <PaymentMethod
              icon={<Building2 size={20} />}
              title="Bank Transfer"
              description="Show your bank account details."
              enabled={invoice.bankEnabled}
              onClick={() =>
                updateInvoice(
                  "bankEnabled",
                  !invoice.bankEnabled
                )
              }
            />
          </div>

          {invoice.upiEnabled && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="UPI Name"
                  value={invoice.upiName}
                  onChange={(e) =>
                    updateInvoice(
                      "upiName",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="UPI ID"
                  placeholder="yourname@bank"
                  value={invoice.upiId}
                  onChange={(e) =>
                    updateInvoice(
                      "upiId",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  UPI QR Code
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
                  {invoice.upiQr ? (
                    <img
                      src={invoice.upiQr}
                      alt="UPI QR Code"
                      className="h-32 w-32 object-contain"
                    />
                  ) : (
                    <>
                      <Upload
                        size={20}
                        className="mb-2 text-slate-500"
                      />

                      <span className="text-sm font-bold text-slate-700">
                        Upload QR Code
                      </span>

                      <span className="mt-1 text-xs text-slate-400">
                        PNG, JPG or JPEG
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleQrUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {invoice.bankEnabled && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Bank Name"
                  value={invoice.bankName}
                  onChange={(e) =>
                    updateInvoice(
                      "bankName",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Account Name"
                  value={invoice.accountName}
                  onChange={(e) =>
                    updateInvoice(
                      "accountName",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Account Number"
                  value={invoice.accountNumber}
                  onChange={(e) =>
                    updateInvoice(
                      "accountNumber",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="IFSC Code"
                  value={invoice.ifsc}
                  onChange={(e) =>
                    updateInvoice(
                      "ifsc",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          )}
        </section>

        {/* NOTES */}

        <section className="card">
          <SectionHeader title="Notes & Terms" />

          <div className="space-y-5">
            <TextArea
              label="Notes"
              rows={4}
              value={invoice.notes}
              onChange={(e) =>
                updateInvoice(
                  "notes",
                  e.target.value
                )
              }
            />

            <TextArea
              label="Terms & Conditions"
              rows={5}
              value={invoice.terms}
              onChange={(e) =>
                updateInvoice(
                  "terms",
                  e.target.value
                )
              }
            />
          </div>
        </section>

        {/* BOTTOM ACTIONS */}

        <div className="sticky bottom-4 z-20 flex justify-end gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Invoice"}
          </button>

          <button
            type="button"
            onClick={handlePreview}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            <Eye size={17} />
            Preview Invoice
          </button>
        </div>
      </main>
    </div>
  );
}

/* =====================================================
   SECTION HEADER
===================================================== */

function SectionHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-black text-slate-950">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

/* =====================================================
   INPUT
===================================================== */

function Input({
  label,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        {...props}
        className="h-[46px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      />
    </div>
  );
}

/* =====================================================
   TEXTAREA
===================================================== */

function TextArea({
  label,
  className = "",
  rows = 4,
  ...props
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        {...props}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      />
    </div>
  );
}

/* =====================================================
   SUMMARY
===================================================== */

function SummaryRow({
  label,
  value,
  bold = false,
}) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        bold
          ? "text-base font-black text-white"
          : "text-sm text-slate-300"
      }`}
    >
      <span>{label}</span>
      <span>{formatINR(value)}</span>
    </div>
  );
}

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({ status }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Overdue: "bg-rose-50 text-rose-700 ring-rose-200",
    "Partially Paid":
      "bg-blue-50 text-blue-700 ring-blue-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${
        styles[status] ||
        "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

/* =====================================================
   PAYMENT METHOD
===================================================== */

function PaymentMethod({
  icon,
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
        enabled
          ? "border-indigo-500 bg-indigo-50"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={
            enabled
              ? "text-indigo-600"
              : "text-slate-400"
          }
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-black text-slate-900">
            {title}
          </p>

          <p className="text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </div>
    </button>
  );
}