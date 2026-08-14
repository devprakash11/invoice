import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatINR, getSubtotal } from '../data/invoices'

export default function InvoiceTable({ invoices }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
            <tr><th className="px-5 py-4">Invoice</th><th className="px-5 py-4">Client</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Status</th><th className="px-5 py-4"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="group hover:bg-slate-50/80">
                <td className="px-5 py-4"><Link className="font-bold text-ink hover:text-accent" to={`/invoices/${invoice.id}`}>{invoice.id}</Link></td>
                <td className="px-5 py-4"><div className="font-semibold text-slate-800">{invoice.client}</div><div className="text-xs text-slate-400">{invoice.email}</div></td>
                <td className="px-5 py-4 text-sm text-slate-500">{invoice.issueDate}</td>
                <td className="px-5 py-4 font-bold text-slate-800">{formatINR(getSubtotal(invoice))}</td>
                <td className="px-5 py-4"><StatusBadge status={invoice.status} /></td>
                <td className="px-5 py-4 text-right"><Link to={`/invoices/${invoice.id}`} className="inline-flex rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-ink"><ArrowUpRight size={18} /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
