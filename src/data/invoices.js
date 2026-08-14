// =====================================================
// SERVICES
// =====================================================

export const services = [
  {
    title: "Brand Identity",
    description:
      "Logo systems, visual identity and brand assets designed to create a strong and consistent brand presence.",
  },
  {
    title: "UI/UX Design",
    description:
      "Modern interfaces and user experiences designed for websites, dashboards and digital products.",
  },
  {
    title: "Marketing Design",
    description:
      "Professional posters, social media creatives, banners and promotional materials for marketing campaigns.",
  },
  {
    title: "Web Design",
    description:
      "Clean, responsive and user-focused website designs for modern businesses and brands.",
  },
];


// =====================================================
// DEFAULT INVOICES
// =====================================================

export const invoices = [
  {
    id: "LD/2026-27/0001",
    invoiceNumber: "LD/2026-27/0001",

    client: "Demo Client",
    clientName: "Demo Client",

    company: "Demo Company",

    email: "",
    phone: "",
    billingAddress: "",

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

    // Business details
    businessName: "Limitless Design",
    businessPhone: "+91 76675 83859",
    businessEmail: "help.limitlessdesign@gmail.com",
    website: "https://limitlessdesign.netlify.app",
    businessAddress: "",

    // Payment methods
    upiEnabled: true,
    upiName: "Limitless Design",
    upiId: "yourname@bank",
    upiQr: null,

    bankEnabled: false,
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",

    // Notes
    notes: "Thank you for choosing Limitless Design.",

    terms:
      "Final files will be delivered after completion of the agreed payment. Additional work outside the agreed project scope may be charged separately.",

    updatedAt: "2026-08-10T00:00:00.000Z",
  },
];


// =====================================================
// CALCULATE SUBTOTAL
// =====================================================

export function getSubtotal(invoice) {
  // Use saved subtotal if available
  if (
    invoice &&
    typeof invoice.subtotal === "number"
  ) {
    return invoice.subtotal;
  }

  // Make sure items exist
  if (
    !invoice ||
    !Array.isArray(invoice.items)
  ) {
    return 0;
  }

  // Calculate subtotal from items
  return invoice.items.reduce((sum, item) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;

    return sum + qty * rate;
  }, 0);
}


// =====================================================
// CALCULATE TOTAL
// =====================================================

export function getTotal(invoice) {
  const subtotal = getSubtotal(invoice);
  const discount = Number(invoice?.discount) || 0;

  return Math.max(
    subtotal - discount,
    0
  );
}


// =====================================================
// CALCULATE BALANCE DUE
// =====================================================

export function getBalanceDue(invoice) {
  const total = getTotal(invoice);
  const amountPaid =
    Number(invoice?.amountPaid) || 0;

  return Math.max(
    total - amountPaid,
    0
  );
}


// =====================================================
// GET PAYMENT STATUS
// =====================================================

export function getPaymentStatus(invoice) {
  const total = getTotal(invoice);
  const amountPaid =
    Number(invoice?.amountPaid) || 0;

  // Fully paid
  if (amountPaid >= total && total > 0) {
    return "Paid";
  }

  // Partially paid
  if (amountPaid > 0 && amountPaid < total) {
    return "Partially Paid";
  }

  // Due date check
  if (invoice?.dueDate) {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (
      dueDate < today &&
      amountPaid < total
    ) {
      return "Overdue";
    }
  }

  // No payment
  return "Pending";
}


// =====================================================
// FORMAT INR
// =====================================================

export function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}