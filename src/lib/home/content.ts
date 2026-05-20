export const TRUST_STRIP = [
  { label: "Secure", icon: "shield" },
  { label: "Razorpay Protected", icon: "card" },
  { label: "Encrypted Payments", icon: "lock" },
] as const;

export const STATS = [
  { value: "2L+", label: "Challans Processed", icon: "receipt" },
  { value: "100%", label: "Secure Payments", icon: "shield" },
  { value: "24/7", label: "Status Tracking", icon: "pulse" },
  { value: "Fast", label: "Settlement Support", icon: "clock" },
] as const;

export const BENEFITS = [
  {
    title: "Secure Payments",
    description: "Payments processed securely via Razorpay. We never store your card details.",
    icon: "shield",
  },
  {
    title: "Verified Challan Data",
    description: "Fetches challan information from trusted official government sources.",
    icon: "check",
  },
  {
    title: "Settlement Tracking",
    description: "Track challan settlement updates after payment in your account.",
    icon: "track",
  },
  {
    title: "Hassle-Free Experience",
    description: "Avoid confusing portals and manage everything in one place.",
    icon: "spark",
  },
] as const;

export const STEPS = [
  {
    step: 1,
    title: "Search",
    description: "Enter your registered vehicle number",
  },
  {
    step: 2,
    title: "Pay Securely",
    description: "Choose challans and complete payment via Razorpay",
  },
  {
    step: 3,
    title: "Settlement",
    description: "Our operations team processes and updates your status",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "How does DriveClear work?",
    a: "Enter your vehicle number to fetch pending challans. Select the ones you want to pay, complete checkout via Razorpay, and we handle settlement with status updates in your account.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. All payments are processed through Razorpay using industry-standard encryption. DriveClear does not store your card or UPI credentials.",
  },
  {
    q: "How long does settlement take?",
    a: "Online challans are typically processed within a few business days. Court challans may take longer due to additional verification and court procedures.",
  },
  {
    q: "Can I track my challan status?",
    a: "Yes. After payment, challans move to a processing state. You can track orders and settlement progress from the Track Your Orders section.",
  },
  {
    q: "What happens after payment?",
    a: "Your challan status updates to processing. Our operations team settles the challan with the relevant authority and confirms completion in the app.",
  },
  {
    q: "Which challans are supported?",
    a: "We support payable pending traffic challans fetched for your vehicle. Zero-amount or already settled challans cannot be paid through DriveClear.",
  },
  {
    q: "Is there a service fee?",
    a: "Yes. A transparent service fee applies per challan — ₹99 for online challans and ₹999 for court challan settlement services, shown before you pay.",
  },
  {
    q: "What if my challan is already paid?",
    a: "Already paid challans appear in the paid section and cannot be selected again. If you believe there is an error, contact support with your payment reference.",
  },
] as const;

