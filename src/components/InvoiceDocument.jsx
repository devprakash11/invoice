import Logo from "./Logo";
import { formatINR } from "../data/invoices";

export default function InvoiceDocument({ invoice }) {
  if (!invoice) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
        Invoice data not found.
      </div>
    );
  }

  const items = Array.isArray(invoice.items)
    ? invoice.items
    : [];

  const subtotal =
    Number(invoice.subtotal) ||
    items.reduce((sum, item) => {
      return (
        sum +
        Number(item.qty || 0) *
          Number(item.rate || 0)
      );
    }, 0);

  const discount = Number(invoice.discount) || 0;

  const total =
    Number(invoice.total) ||
    Math.max(subtotal - discount, 0);

  const amountPaid =
    Number(invoice.amountPaid) || 0;

  const balanceDue =
    Number(invoice.balanceDue) ||
    Math.max(total - amountPaid, 0);

  const invoiceNumber =
    invoice.invoiceNumber ||
    invoice.id ||
    "LD/2026-27/0002";

  const invoiceDate =
    invoice.invoiceDate ||
    invoice.issueDate ||
    "";

  const dueDate =
    invoice.dueDate || "";

  const clientName =
    invoice.clientName ||
    invoice.client ||
    "Client Name";

  const businessName =
    invoice.businessName ||
    "Limitless Design";

  const businessPhone =
    invoice.businessPhone ||
    "";

  const businessEmail =
    invoice.businessEmail ||
    "";

  const businessWebsite =
    invoice.website ||
    "";

  const businessAddress =
    invoice.businessAddress ||
    "";

  return (
    <article className="invoice-paper mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-10 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-8 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:justify-between">

        {/* BUSINESS */}

        <div className="flex items-start gap-4">

          <Logo className="h-16 w-20" />

          <div>
            <h1 className="text-xl font-black tracking-tight text-ink">
              {businessName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Professional Design & Creative Services
            </p>

            <div className="mt-3 text-xs leading-5 text-slate-400">

              {businessAddress && (
                <div>
                  {businessAddress}
                </div>
              )}

              {businessEmail && (
                <div>
                  {businessEmail}
                </div>
              )}

              {businessPhone && (
                <div>
                  {businessPhone}
                </div>
              )}

              {businessWebsite && (
                <div>
                  {businessWebsite}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* INVOICE INFO */}

        <div className="sm:text-right">

          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
            Invoice
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight text-ink">
            {invoiceNumber}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-1 text-xs sm:justify-items-end">

            <span className="text-slate-400">
              Issue date
            </span>

            <span className="font-bold text-slate-700">
              {formatDate(invoiceDate)}
            </span>

            <span className="text-slate-400">
              Due date
            </span>

            <span className="font-bold text-slate-700">
              {formatDate(dueDate)}
            </span>

          </div>
        </div>
      </div>

      {/* ==================================================
          PROJECT
      ================================================== */}

      {invoice.projectName && (
        <div className="border-b border-slate-200 py-5">

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Project
          </p>

          <p className="mt-2 text-sm font-bold text-slate-800">
            {invoice.projectName}
          </p>

        </div>
      )}

      {/* ==================================================
          CLIENT + TAX
      ================================================== */}

      <div className="grid gap-6 border-b border-slate-200 py-8 sm:grid-cols-2">

        {/* CLIENT */}

        <div>

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Billed To
          </p>

          <p className="mt-2 text-base font-black text-ink">
            {clientName}
          </p>

          {invoice.company && (
            <p className="mt-1 text-sm font-medium text-slate-600">
              {invoice.company}
            </p>
          )}

          {invoice.email && (
            <p className="mt-1 text-sm text-slate-500">
              {invoice.email}
            </p>
          )}

          {invoice.phone && (
            <p className="mt-1 text-sm text-slate-500">
              {invoice.phone}
            </p>
          )}

          {invoice.billingAddress && (
            <p className="mt-2 whitespace-pre-line text-sm leading-5 text-slate-500">
              {invoice.billingAddress}
            </p>
          )}

        </div>

        {/* TAX */}

        <div className="sm:text-right">

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Tax
          </p>

          <p className="mt-2 font-bold text-slate-700">
            No GST charged
          </p>

          <p className="mt-1 text-xs text-slate-400">
            This is a non-GST invoice.
          </p>

        </div>
      </div>

      {/* ==================================================
          ITEMS
      ================================================== */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">

        <table className="w-full text-left text-sm">

          <thead className="bg-ink text-white">

            <tr>

              <th className="px-4 py-3">
                Description
              </th>

              <th className="px-4 py-3 text-center">
                Qty
              </th>

              <th className="px-4 py-3 text-right">
                Rate
              </th>

              <th className="px-4 py-3 text-right">
                Amount
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {items.length > 0 ? (

              items.map((item, index) => {

                const qty =
                  Number(item.qty) || 0;

                const rate =
                  Number(item.rate) || 0;

                const amount =
                  qty * rate;

                return (
                  <tr
                    key={item.id || index}
                  >

                    <td className="px-4 py-4 font-semibold text-slate-700">
                      {item.description ||
                        "Service"}
                    </td>

                    <td className="px-4 py-4 text-center text-slate-500">
                      {qty}
                    </td>

                    <td className="px-4 py-4 text-right text-slate-500">
                      {formatINR(rate)}
                    </td>

                    <td className="px-4 py-4 text-right font-bold text-slate-800">
                      {formatINR(amount)}
                    </td>

                  </tr>
                );
              })

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="px-4 py-8 text-center text-sm text-slate-400"
                >
                  No services or items added.
                </td>

              </tr>

            )}

          </tbody>
        </table>
      </div>

      {/* ==================================================
          PAYMENT INFORMATION + AMOUNT DETAILS
      ================================================== */}

      <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_320px]">

        {/* ==================================================
            PAYMENT INFORMATION - LEFT
        ================================================== */}

        <div className="order-1">

          {(invoice.upiEnabled ||
            invoice.bankEnabled) && (

            <>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Payment Information
              </p>

              <div className="mt-4 space-y-4">

                {/* UPI */}

                {invoice.upiEnabled && (
                  <div className="rounded-2xl border border-slate-200 p-5">

                    <h3 className="text-sm font-black text-slate-900">
                      UPI Payment
                    </h3>

                    {invoice.upiName && (
                      <p className="mt-3 text-sm text-slate-500">
                        Name:{" "}
                        <span className="font-semibold text-slate-800">
                          {invoice.upiName}
                        </span>
                      </p>
                    )}

                    {invoice.upiId && (
                      <p className="mt-1 text-sm text-slate-500">
                        UPI ID:{" "}
                        <span className="font-semibold text-slate-800">
                          {invoice.upiId}
                        </span>
                      </p>
                    )}

                    {invoice.upiQr && (
                      <div className="mt-4">

                        <img
                          src={invoice.upiQr}
                          alt="UPI QR Code"
                          className="h-32 w-32 rounded-xl border border-slate-200 object-contain"
                        />

                      </div>
                    )}

                  </div>
                )}

                {/* BANK */}

                {invoice.bankEnabled && (
                  <div className="rounded-2xl border border-slate-200 p-5">

                    <h3 className="text-sm font-black text-slate-900">
                      Bank Transfer
                    </h3>

                    {invoice.bankName && (
                      <PaymentRow
                        label="Bank"
                        value={invoice.bankName}
                      />
                    )}

                    {invoice.accountName && (
                      <PaymentRow
                        label="Account Name"
                        value={invoice.accountName}
                      />
                    )}

                    {invoice.accountNumber && (
                      <PaymentRow
                        label="Account Number"
                        value={invoice.accountNumber}
                      />
                    )}

                    {invoice.ifsc && (
                      <PaymentRow
                        label="IFSC"
                        value={invoice.ifsc}
                      />
                    )}

                  </div>
                )}

              </div>

            </>

          )}

        </div>

        {/* ==================================================
            AMOUNT DETAILS - RIGHT
        ================================================== */}

        <div className="order-2 w-full">

          {/* SUBTOTAL */}

          <div className="flex justify-between border-b border-slate-100 py-2 text-sm">

            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-bold">
              {formatINR(subtotal)}
            </span>

          </div>

          {/* DISCOUNT */}

          {discount > 0 && (
            <div className="flex justify-between border-b border-slate-100 py-2 text-sm">

              <span className="text-slate-500">
                Discount
              </span>

              <span className="font-bold text-red-500">
                - {formatINR(discount)}
              </span>

            </div>
          )}

          {/* GST */}

          <div className="flex justify-between border-b border-slate-100 py-2 text-sm">

            <span className="text-slate-500">
              GST
            </span>

            <span className="font-bold">
              ₹0
            </span>

          </div>

          {/* TOTAL */}

          <div className="mt-2 flex justify-between rounded-xl bg-slate-50 px-4 py-4">

            <span className="font-black text-ink">
              Total
            </span>

            <span className="text-lg font-black text-accent">
              {formatINR(total)}
            </span>

          </div>

          {/* AMOUNT PAID */}

          {amountPaid > 0 && (
            <div className="mt-2 flex justify-between px-4 py-2 text-sm">

              <span className="text-slate-500">
                Amount Paid
              </span>

              <span className="font-bold text-green-600">
                {formatINR(amountPaid)}
              </span>

            </div>
          )}

          {/* BALANCE DUE */}

          <div className="mt-1 flex justify-between rounded-xl border border-slate-200 px-4 py-3">

            <span className="font-bold text-slate-700">
              Balance Due
            </span>

            <span className="font-black text-slate-950">
              {formatINR(balanceDue)}
            </span>

          </div>

        </div>
      </div>

      {/* ==================================================
          NOTES - BOTTOM
      ================================================== */}

      {invoice.notes && (
        <div className="mt-10 border-t border-slate-200 pt-6">

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Notes
          </p>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
            {invoice.notes}
          </p>

        </div>
      )}

      {/* ==================================================
          TERMS & CONDITIONS
      ================================================== */}

      {invoice.terms && (
        <div className="mt-6 border-t border-slate-200 pt-6">

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Terms & Conditions
          </p>

          <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-500">
            {invoice.terms}
          </p>

        </div>
      )}

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="mt-10 border-t border-slate-200 pt-5 text-center text-[11px] font-medium text-slate-400">

        Thank you for your business ·{" "}
        {businessName} · No GST charged

      </div>

    </article>
  );
}

/* ==================================================
   PAYMENT ROW
================================================== */

function PaymentRow({
  label,
  value,
}) {
  return (
    <div className="mt-2 flex gap-2 text-sm">

      <span className="text-slate-500">
        {label}:
      </span>

      <span className="font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}

/* ==================================================
   DATE FORMAT
================================================== */

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}