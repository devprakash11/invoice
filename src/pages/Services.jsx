import { ArrowUpRight, Check } from 'lucide-react'
import { services } from '../data/invoices'

export default function Services() {
  return (
    <div className="space-y-8">
      <section className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">What we do</p><h1 className="mt-2 text-4xl font-black tracking-tight text-ink">Design that makes brands feel limitless.</h1><p className="mt-4 text-base leading-7 text-slate-500">A flexible creative studio for identity, digital experiences, campaigns and visual storytelling.</p></section>
      <section className="grid gap-4 md:grid-cols-2">{services.map((service, i) => <article key={service.title} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-700">0{i + 1}</span><ArrowUpRight size={20} className="text-slate-300 transition group-hover:text-accent" /></div><h2 className="mt-7 text-xl font-black text-ink">{service.title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{service.description}</p><div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-500"><Check size={15} className="text-accent" /> Professional, client-ready output</div></article>)}</section>
    </div>
  )
}
