export default function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        <span className="rounded-xl bg-slate-100 p-2 text-slate-700"><Icon size={18} /></span>
      </div>
      <p className="text-2xl font-black tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-400">{helper}</p>
    </div>
  )
}
