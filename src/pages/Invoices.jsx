import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import InvoiceTable from '../components/InvoiceTable'
import { invoices } from '../data/invoices'

export default function Invoices() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const filtered = useMemo(() => invoices.filter(i => {
    const matchQuery = `${i.id} ${i.client}`.toLowerCase().includes(query.toLowerCase())
    const matchStatus = status === 'All' || i.status === status
    return matchQuery && matchStatus
  }), [query, status])
  return (
    <div className="space-y-6">
      <div><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">Billing</p><h1 className="mt-1 text-3xl font-black tracking-tight text-ink">Invoices</h1><p className="mt-2 text-sm text-slate-500">Create, review and share professional client invoices.</p></div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <label className="relative flex-1"><Search size={17} className="absolute left-3 top-3 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search invoice or client" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-indigo-100" /></label>
        <div className="flex items-center gap-2"><SlidersHorizontal size={17} className="text-slate-400" /><select value={status} onChange={e => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none"><option>All</option><option>Paid</option><option>Pending</option><option>Overdue</option></select></div>
      </div>
      <InvoiceTable invoices={filtered} />
    </div>
  )
}
