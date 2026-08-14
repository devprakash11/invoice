import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default function InvoiceTable({
  invoices = [],
}) {
  if (!invoices.length) {
    return (
      <div className="px-6 py-12 text-center text-sm text-slate-500">
        No invoices available.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
              Invoice
            </th>

            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
              Client
            </th>

            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
              Date
            </th>

            <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
              Total
            </th>

            <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
              Status
            </th>

            <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {invoices.map((invoice) => (
            <tr
              key={
                invoice.id ||
                invoice.invoiceNumber
              }
              className="transition hover:bg-slate-50"
            >
              <td className="px-6 py-4">
                <p className="text-sm font-black text-slate-900">
                  {invoice.invoiceNumber ||
                    invoice.id}
                </p>

                {invoice.projectName && (
                  <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">
                    {invoice.projectName}
                  </p>
                )}
              </td>

              <td className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-800">
                  {invoice.clientName ||
                    invoice.client ||
                    "Unknown Client"}
                </p>

                {invoice.company && (
                  <p className="mt-1 text-xs text-slate-500">
                    {invoice.company}
                  </p>
                )}
              </td>

              <td className="px-6 py-4 text-sm text-slate-600">
                {invoice.invoiceDate ||
                  invoice.issueDate ||
                  "-"}
              </td>

              <td className="px-6 py-4 text-right">
                <p className="text-sm font-black text-slate-900">
                  {formatINR(invoice.total)}
                </p>

                {Number(invoice.balanceDue) > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    Due:{" "}
                    {formatINR(
                      invoice.balanceDue
                    )}
                  </p>
                )}
              </td>

              <td className="px-6 py-4 text-center">
                <StatusBadge
                  status={
                    invoice.status || "Pending"
                  }
                />
              </td>

              <td className="px-6 py-4 text-right">
                <Link
                  to="/invoices/preview"
                  onClick={() => {
                    localStorage.setItem(
                      "limitless-design-invoice",
                      JSON.stringify(invoice)
                    );
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Eye size={15} />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}