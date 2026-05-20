export type TermsClause = {
  number: number;
  text: string;
  bullets?: string[];
};

export const TERMS_TITLE = "DriveClear Terms & Conditions";

export const TERMS_CLAUSES: TermsClause[] = [
  {
    number: 1,
    text: "DriveClear acts solely as a technology platform facilitating traffic challan assistance and settlement support through authorized legal and service partners. Online challans may take approximately 7–15 working days for settlement, while Court / Virtual Court / Lok Adalat challans may require up to 60 court working days. Timelines are indicative only and may vary based on government processing.",
  },
  {
    number: 2,
    text: "DriveClear's legal and processing partners are responsible for challan settlement activities. Any amount paid by the user, including challan amount, legal fee, or convenience charges, may be processed through authorized settlement partners.",
  },
  {
    number: 3,
    text: "If an online challan is later transferred by the Traffic Department or Government Authority to Court / Virtual Court / Lok Adalat, additional legal processing fees may apply. DriveClear shall not be responsible for such transfers as they are governed solely by government authorities.",
  },
  {
    number: 4,
    text: "No refund shall be applicable once challan settlement processing has been initiated by DriveClear or its authorized partners, except in cases specifically eligible under the refund policy.",
  },
  {
    number: 5,
    text: "Users authorize DriveClear and its authorized partners to process pending challans on their behalf. OTP verification may be mandatory in certain cases and will be sent to the mobile number registered with the Traffic Department or RTO. Users are solely responsible for timely and accurate OTP sharing.",
  },
  {
    number: 6,
    text: "DriveClear shall not be liable for delays, failures, incorrect challan updates, or settlement issues arising due to:",
    bullets: [
      "Incorrect OTP sharing",
      "Delayed user response",
      "Invalid challan information",
      "Government portal downtime",
      "Court or jurisdictional restrictions",
    ],
  },
  {
    number: 7,
    text: "Court challans, Lok Adalat challans, and Virtual Court challans are subject to court approval and processing timelines. Final settlement status depends entirely upon the respective government or judicial authority.",
  },
  {
    number: 8,
    text: "Users acknowledge that challan status updates on government portals may take additional time even after successful payment or settlement processing.",
  },
  {
    number: 9,
    text: "DriveClear may provide payment receipts, portal screenshots, declarations, or other available proof of settlement based on government portal availability.",
  },
  {
    number: 10,
    text: "Any disputes regarding challan status, receipt availability, or settlement discrepancies must be reported to DriveClear support within:",
    bullets: ["30 days for online challans", "90 days for court challans"],
  },
  {
    number: 11,
    text: "Users are solely responsible for ensuring:",
    bullets: [
      "Correct vehicle information",
      "Correct ownership details",
      "Valid mobile number",
      "Updated challan information",
    ],
  },
  {
    number: 12,
    text: "In cases where challan payment amount exceeds the collected order amount or settlement becomes technically impossible, eligible refunds may be processed after verification within standard processing timelines.",
  },
  {
    number: 13,
    text: "DriveClear reserves the right to refuse challan settlement requests in cases involving:",
    bullets: [
      "Court appearance requirements",
      "Invalid documents",
      "Ownership disputes",
      "Jurisdiction restrictions",
      "Government portal restrictions",
    ],
  },
  {
    number: 14,
    text: "Users consent to sharing challan details, vehicle information, contact details, and required documents with authorized processing partners strictly for challan settlement purposes.",
  },
  {
    number: 15,
    text: "DriveClear shall not be liable for any indirect loss, penalty, delay, or legal consequence arising due to government actions, court decisions, or inaccurate information provided by the user.",
  },
  {
    number: 16,
    text: "By proceeding with challan payment or settlement, the user confirms that:",
    bullets: [
      "The challans belong to them or are authorized by them",
      "All provided information is accurate",
      "They agree to DriveClear's processing terms and policies",
    ],
  },
  {
    number: 17,
    text: "DriveClear reserves the right to update or modify these Terms & Conditions at any time without prior notice.",
  },
];

/** Short bullets shown in the footer summary section */
export const TERMS_SUMMARY_POINTS = [
  "Online challans: ~3–5 working days · Court challans: up to 30 court working days (indicative).",
  "Settlement is handled by authorized legal and processing partners.",
  "No refund after settlement processing has started, except per refund policy.",
  "OTP and accurate vehicle/challan details are your responsibility.",
  "Payments are securely processed via Razorpay.",
] as const;
