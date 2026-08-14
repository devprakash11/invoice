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

const initialItems = [
  {
    id: 1,
    description: "Logo Design Package",
    qty: 1,
    rate: 0,
  },
];

export default function CreateInvoice() {
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    invoiceNumber: "LD/2026-27/0002",
    invoiceDate: "2026-08-14",
    dueDate: "2026-08-21",
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

    // Bank Transfer
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

  /* =========================================
     UPDATE INVOICE
  ========================================= */

  const updateInvoice = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================
     UPDATE ITEM
  ========================================= */

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

  /* =========================================
     ADD ITEM
  ========================================= */

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

  /* =========================================
     REMOVE ITEM
  ========================================= */

  const removeItem = (id) => {
    if (items.length === 1) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  /* =========================================
     CALCULATIONS
  ========================================= */

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const qty = Number(item.qty) || 0;
      const rate = Number(item.rate) || 0;

      return total + qty * rate;
    }, 0);
  }, [items]);

  const discount = Math.max(Number(invoice.discount) || 0, 0);

  const amountPaid = Math.max(Number(invoice.amountPaid) || 0, 0);

  const total = Math.max(subtotal - discount, 0);

  const balanceDue = Math.max(total - amountPaid, 0);

  /* =========================================
     CURRENCY FORMAT
  ========================================= */

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  /* =========================================
     QR CODE UPLOAD
  ========================================= */

  const handleQrUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateInvoice("upiQr", reader.result);
    };

    reader.readAsDataURL(file);
  };

  /* =========================================
     GET INVOICE DATA
  ========================================= */

  const getInvoiceData = () => {
    const status =
      amountPaid >= total
        ? "Paid"
        : amountPaid > 0
        ? "Partially Paid"
        : "Pending";

    return {
      ...invoice,

      // Primary identifiers
      id: invoice.invoiceNumber,
      invoiceNumber: invoice.invoiceNumber,

      // Client aliases used by other pages
      client: invoice.clientName,
      clientName: invoice.clientName,

      // Date aliases
      issueDate: invoice.invoiceDate,
      invoiceDate: invoice.invoiceDate,

      // Items
      items,

      // Financial data
      subtotal,
      discount,
      total,
      amountPaid,
      balanceDue,
      gst: 0,

      // Status
      status,

      // Metadata
      updatedAt: new Date().toISOString(),
    };
  };

  /* =========================================
     SAVE INVOICE
  ========================================= */

  const handleSave = () => {
    const invoiceData = getInvoiceData();

    /*
     * Save the currently opened invoice.
     * InvoiceView / Preview can use this key.
     */
    localStorage.setItem(
      "limitless-design-invoice",
      JSON.stringify(invoiceData)
    );

    /*
     * Read existing invoice list.
     */
    let savedInvoices = [];

    try {
      savedInvoices = JSON.parse(
        localStorage.getItem("limitless-design-invoices") || "[]"
      );

      if (!Array.isArray(savedInvoices)) {
        savedInvoices = [];
      }
    } catch (error) {
      console.error("Unable to read saved invoices:", error);
      savedInvoices = [];
    }

    /*
     * Check whether this invoice already exists.
     */
    const existingIndex = savedInvoices.findIndex(
      (item) =>
        item.id === invoiceData.id ||
        item.invoiceNumber === invoiceData.invoiceNumber
    );

    if (existingIndex !== -1) {
      /*
       * Update existing invoice.
       */
      savedInvoices[existingIndex] = invoiceData;
    } else {
      /*
       * Add new invoice to the beginning.
       */
      savedInvoices.unshift(invoiceData);
    }

    /*
     * Save complete invoice list.
     */
    localStorage.setItem(
      "limitless-design-invoices",
      JSON.stringify(savedInvoices)
    );

    alert("Invoice saved successfully.");

    /*
     * Go back to invoice dashboard/list.
     */
    navigate("/invoices");
  };

  /* =========================================
     PREVIEW INVOICE
  ========================================= */

  const handlePreview = () => {
    const invoiceData = getInvoiceData();

    /*
     * Save current invoice for preview.
     */
    localStorage.setItem(
      "limitless-design-invoice",
      JSON.stringify(invoiceData)
    );

    /*
     * Also save/update it in invoice list.
     */
    let savedInvoices = [];

    try {
      savedInvoices = JSON.parse(
        localStorage.getItem("limitless-design-invoices") || "[]"
      );

      if (!Array.isArray(savedInvoices)) {
        savedInvoices = [];
      }
    } catch (error) {
      console.error("Unable to read saved invoices:", error);
      savedInvoices = [];
    }

    const existingIndex = savedInvoices.findIndex(
      (item) =>
        item.id === invoiceData.id ||
        item.invoiceNumber === invoiceData.invoiceNumber
    );

    if (existingIndex !== -1) {
      savedInvoices[existingIndex] = invoiceData;
    } else {
      savedInvoices.unshift(invoiceData);
    }

    localStorage.setItem(
      "limitless-design-invoices",
      JSON.stringify(savedInvoices)
    );

    navigate("/invoices/preview");
  };

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================
          HEADER
      ===================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Link
              to="/invoices"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Create Invoice
              </h1>

              <p className="text-sm text-slate-500">
                Professional non-GST invoice with UPI and bank transfer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Save size={17} />
              Save
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Eye size={17} />
              Preview
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {/* =====================================
            INVOICE DETAILS
        ===================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Invoice Details"
            description="This template does not add GST."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Invoice Number"
              value={invoice.invoiceNumber}
              onChange={(e) =>
                updateInvoice("invoiceNumber", e.target.value)
              }
            />

            <Input
              label="Project Name"
              placeholder="Website Design & Development"
              value={invoice.projectName}
              onChange={(e) =>
                updateInvoice("projectName", e.target.value)
              }
            />

            <Input
              label="Invoice Date"
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) =>
                updateInvoice("invoiceDate", e.target.value)
              }
            />

            <Input
              label="Due Date"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateInvoice("dueDate", e.target.value)}
            />
          </div>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <strong>Non-GST Invoice:</strong> no GSTIN, CGST, SGST, IGST or
            tax calculation is included.
          </div>
        </section>

        {/* =====================================
            BILL TO
        ===================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Bill To"
            description="Client details."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Client Name"
              required
              value={invoice.clientName}
              onChange={(e) =>
                updateInvoice("clientName", e.target.value)
              }
            />

            <Input
              label="Company"
              value={invoice.company}
              onChange={(e) => updateInvoice("company", e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              value={invoice.email}
              onChange={(e) => updateInvoice("email", e.target.value)}
            />

            <Input
              label="Phone"
              value={invoice.phone}
              onChange={(e) => updateInvoice("phone", e.target.value)}
            />

            <TextArea
              label="Billing Address"
              className="md:col-span-2"
              value={invoice.billingAddress}
              onChange={(e) =>
                updateInvoice("billingAddress", e.target.value)
              }
            />
          </div>
        </section>

        {/* =====================================
            YOUR BUSINESS
        ===================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Your Business"
            description="Limitless Design sender details."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Business Name"
              value={invoice.businessName}
              onChange={(e) =>
                updateInvoice("businessName", e.target.value)
              }
            />

            <Input
              label="Phone"
              value={invoice.businessPhone}
              onChange={(e) =>
                updateInvoice("businessPhone", e.target.value)
              }
            />

            <Input
              label="Email"
              type="email"
              value={invoice.businessEmail}
              onChange={(e) =>
                updateInvoice("businessEmail", e.target.value)
              }
            />

            <Input
              label="Website"
              value={invoice.website}
              onChange={(e) => updateInvoice("website", e.target.value)}
            />

            <TextArea
              label="Business Address"
              className="md:col-span-2"
              value={invoice.businessAddress}
              onChange={(e) =>
                updateInvoice("businessAddress", e.target.value)
              }
            />
          </div>
        </section>

        {/* =====================================
            SERVICES & ITEMS
        ===================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Services & Items"
            description="Add services included in this invoice."
          />

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">
                    Item {index + 1}
                  </p>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_95px_140px_140px]">
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

                    <div className="flex h-[46px] items-center rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-900">
                      {formatINR(
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
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Plus size={17} />
              Add Item
            </button>
          </div>
        </section>

        {/* =====================================
            PAYMENT SUMMARY
        ===================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader title="Payment Summary" />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Discount"
              type="number"
              min="0"
              value={invoice.discount}
              onChange={(e) =>
                updateInvoice("discount", e.target.value)
              }
            />

            <Input
              label="Amount Already Paid"
              type="number"
              min="0"
              value={invoice.amountPaid}
              onChange={(e) =>
                updateInvoice("amountPaid", e.target.value)
              }
            />
          </div>

          <div className="mt-6 ml-auto max-w-md rounded-xl bg-slate-50 p-5">
            <SummaryRow label="Subtotal" value={subtotal} />

            <SummaryRow
              label="Discount"
              value={discount}
            />

            <div className="my-3 border-t border-slate-200" />

            <SummaryRow
              label="Total"
              value={total}
              bold
            />

            <SummaryRow
              label="Paid"
              value={amountPaid}
            />

            <div className="my-3 border-t border-slate-200" />

            <SummaryRow
              label="Balance Due"
              value={balanceDue}
              bold
            />
          </div>
        </section>

        {/* =====================================
            PAYMENT METHODS
        ===================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Payment Methods"
            description="Enable UPI, bank transfer, or both."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <PaymentMethod
              icon={<WalletCards size={20} />}
              title="UPI"
              description="Accept UPI payments via QR code or UPI ID"
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
              description="Provide bank account details for transfers"
              enabled={invoice.bankEnabled}
              onClick={() =>
                updateInvoice(
                  "bankEnabled",
                  !invoice.bankEnabled
                )
              }
            />
          </div>

          {/* UPI DETAILS */}

          {invoice.upiEnabled && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
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

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
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

                      <span className="text-sm font-medium text-slate-700">
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

          {/* BANK TRANSFER */}

          {invoice.bankEnabled && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Bank Name"
                  placeholder="Bank Name"
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
                  placeholder="Account Holder Name"
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
                  placeholder="Account Number"
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
                  placeholder="IFSC Code"
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

        {/* =====================================
            NOTES & TERMS
        ===================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

        {/* =====================================
            BOTTOM ACTIONS
        ===================================== */}

        <div className="sticky bottom-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-lg transition hover:bg-slate-50"
          >
            <Save size={17} />
            Save Invoice
          </button>

          <button
            type="button"
            onClick={handlePreview}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            <Eye size={17} />
            Preview Invoice
          </button>
        </div>
      </main>
    </div>
  );
}

/* =========================================
   SECTION HEADER
========================================= */

function SectionHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-slate-950">
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

/* =========================================
   INPUT
========================================= */

function Input({
  label,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        {...props}
        className="h-[46px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}

/* =========================================
   TEXTAREA
========================================= */

function TextArea({
  label,
  className = "",
  rows = 4,
  ...props
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <textarea
        {...props}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}

/* =========================================
   SUMMARY ROW
========================================= */

function SummaryRow({
  label,
  value,
  bold = false,
}) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        bold
          ? "font-bold text-slate-950"
          : "text-slate-600"
      }`}
    >
      <span>{label}</span>

      <span>{formatINR(value)}</span>
    </div>
  );
}

/* =========================================
   INR FORMAT
========================================= */

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

/* =========================================
   PAYMENT METHOD
========================================= */

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
      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
        enabled
          ? "border-blue-500 bg-blue-50"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={
            enabled
              ? "text-blue-600"
              : "text-slate-400"
          }
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div
        className={`relative h-6 w-11 rounded-full transition ${
          enabled
            ? "bg-blue-600"
            : "bg-slate-200"
        }`}
      >
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </div>
    </button>
  );
}