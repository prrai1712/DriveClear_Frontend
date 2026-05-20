export interface CheckoutLineItem {
  challan_uuid: string;
  challan_number: string;
  vehicle_number: string;
  offense_name: string;
  place: string;
  issue_date: string;
  is_court_challan: boolean;
  medium: "online_challan" | "court_challan";
  order_type: string;
  challan_amount: string;
  service_fee: string;
  line_total: string;
}

export interface CheckoutPreview {
  line_items: CheckoutLineItem[];
  challan_count: number;
  subtotal_challans: string;
  subtotal_service_fees: string;
  grand_total: string;
  fee_note: string;
}

export const CHECKOUT_STORAGE_KEY = "dc_checkout_selection";
