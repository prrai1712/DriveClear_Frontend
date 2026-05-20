export interface Challan {
  uuid: string;
  challan_number: string;
  vehicle_number: string;
  amount: string;
  total_amount?: string;
  challan_status: string;
  status?: string;
  issue_date?: string;
  place?: string;
  offense_name?: string;
  state?: string;
  is_court_challan?: boolean;
  payment_status?: string;
  is_payable?: boolean;
  is_processing?: boolean;
}

export function challanStatus(c: Challan): string {
  return (c.challan_status || c.status || "").toUpperCase();
}

export function isPendingChallan(c: Challan): boolean {
  return challanStatus(c) === "PENDING";
}

export function isOpsPendingChallan(c: Challan): boolean {
  return challanStatus(c) === "OPS_PENDING";
}

export function isPaidChallan(c: Challan): boolean {
  const s = challanStatus(c);
  return (
    s === "PAID" ||
    s === "DISPOSED" ||
    s === "SETTLED" ||
    s === "OPS_PENDING"
  );
}

export function statusLabel(c: Challan): string {
  const s = challanStatus(c);
  if (s === "OPS_PENDING") return "Processing";
  if (s === "PENDING") return "Pending";
  if (s === "PAID" || s === "SETTLED" || s === "DISPOSED") return "Paid";
  return s;
}

export function challanMedium(c: Challan): "online_challan" | "court_challan" {
  return c.is_court_challan ? "court_challan" : "online_challan";
}

export function mediumLabel(medium: string): string {
  return medium === "court_challan" ? "Court challan" : "Online challan";
}

export function challanAmount(c: Challan): number {
  return parseFloat(c.total_amount || c.amount || "0") || 0;
}

export function isZeroAmountChallan(c: Challan): boolean {
  return challanAmount(c) <= 0;
}

/** Pending challans that can be selected and paid */
export function isSelectableChallan(c: Challan): boolean {
  return isPendingChallan(c) && !isZeroAmountChallan(c);
}
