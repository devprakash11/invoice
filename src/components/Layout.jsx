import { NavLink, Outlet, Link } from 'react-router-dom'
import { FileText, LayoutDashboard, Palette, Plus, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/services', label: 'Services', icon: Palette },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-mist text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Logo className="h-11 w-14" />
            <div className="hidden sm:block">
              <p className="text-sm font-black tracking-tight text-ink">Limitless Design</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Invoice Studio</p>
            </div>
          </Link>

          <button className="rounded-xl p-2 text-slate-700 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={`${open ? 'absolute left-0 right-0 top-20 border-b border-slate-200 bg-white p-4 shadow-xl' : 'hidden'} md:static md:flex md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${isActive ? 'bg-ink text-white shadow-lg shadow-slate-900/10' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <Icon size={17} /> {label}
              </NavLink>
            ))}
            <Link to="/invoices/new" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-accentDark md:ml-2 md:mt-0">
              <Plus size={17} /> New invoice
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 Limitless Design. All rights reserved.</span>
          <span>Professional invoices • No GST charged</span>
        </div>
      </footer>
    </div>
  )
}
