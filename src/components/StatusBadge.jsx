export default function StatusBadge({ status }) {
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
      {status || "Pending"}
    </span>
  );
}