export const business = {
  name: 'Limitless Design',
  tagline: 'Design without limits.',
  email: 'hello@limitlessdesign.example',
  phone: '+91 90000 00000',
  address: 'India',
  website: 'limitlessdesign.example',
}

export const invoices = [
  {
    id: 'LD-2026-001',
    client: 'Acme Creative Studio',
    email: 'accounts@acme.example',
    issueDate: '14 Aug 2026',
    dueDate: '28 Aug 2026',
    status: 'Pending',
    currency: 'INR',
    items: [
      { description: 'Brand identity & logo design', qty: 1, rate: 12000 },
      { description: 'Social media campaign creatives', qty: 6, rate: 1500 },
      { description: 'Marketing poster design', qty: 4, rate: 1000 },
    ],
    notes: 'Thank you for choosing Limitless Design. Payment is requested by the due date.',
  },
  {
    id: 'LD-2026-002',
    client: 'Northstar Labs',
    email: 'finance@northstar.example',
    issueDate: '01 Aug 2026',
    dueDate: '10 Aug 2026',
    status: 'Paid',
    currency: 'INR',
    items: [
      { description: 'Website UI design', qty: 1, rate: 18000 },
      { description: 'Design system & components', qty: 1, rate: 7000 },
    ],
    notes: 'Paid in full. No GST charged on this invoice.',
  },
  {
    id: 'LD-2026-003',
    client: 'Mellow House',
    email: 'hello@mellow.example',
    issueDate: '25 Jul 2026',
    dueDate: '05 Aug 2026',
    status: 'Overdue',
    currency: 'INR',
    items: [
      { description: 'Illustration set', qty: 8, rate: 1250 },
      { description: 'Print-ready brochure layout', qty: 1, rate: 6500 },
    ],
    notes: 'Please clear the outstanding balance at your earliest convenience.',
  }
]

export const services = [
  { title: 'Brand Identity', description: 'Distinctive logos, visual systems and brand assets built for consistency.' },
  { title: 'UI / UX Design', description: 'Clean, conversion-focused interfaces for websites and digital products.' },
  { title: 'Marketing Creatives', description: 'Posters, social media creatives, campaigns and launch collateral.' },
  { title: 'Illustration', description: 'Custom illustrations and scalable visual assets for digital experiences.' },
]

export const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export const getSubtotal = (invoice) => invoice.items.reduce((sum, item) => sum + item.qty * item.rate, 0)
