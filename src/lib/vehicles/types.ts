export interface RecentVehicle {
  vehicle_number: string;
  vehicle_type: string;
  display_label: string;
  maker_model: string;
  last_searched_at: string | null;
  search_count: number;
}
