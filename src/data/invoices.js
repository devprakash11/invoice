export const invoices = [
  {
    id: "LD/2026-27/0001",
    invoiceNumber: "LD/2026-27/0001",

    client: "Demo Client",
    clientName: "Demo Client",

    company: "Demo Company",

    invoiceDate: "2026-08-10",
    issueDate: "2026-08-10",
    dueDate: "2026-08-17",

    projectName: "Brand Identity Design",

    items: [
      {
        id: 1,
        description: "Logo Design",
        qty: 1,
        rate: 5000,
      },
    ],

    subtotal: 5000,
    discount: 0,
    total: 5000,

    amountPaid: 0,
    balanceDue: 5000,

    status: "Pending",

    gst: 0,
  },
];

export function getSubtotal(invoice) {
  if (typeof invoice.subtotal === "number") {
    return invoice.subtotal;
  }

  if (!Array.isArray(invoice.items)) {
    return 0;
  }

  return invoice.items.reduce((sum, item) => {
    return (
      sum +
      Number(item.qty || 0) *
        Number(item.rate || 0)
    );
  }, 0);
}

export function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}