import type { PublicProfile } from "@/features/profile/types";

export interface Parcel {
  id: string;
  user_id: string;
  cadastral_code: string;
  address: string;
  area_sqm: number | null;
  region: string | null;
  municipality: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParcelWithOwner extends Parcel {
  owner: PublicProfile | null;
}

export type ParcelInsert = Omit<Parcel, "id" | "created_at" | "updated_at">;
export type ParcelUpdate = Partial<Omit<ParcelInsert, "user_id">>;

export interface ParcelFilters {
  mine?: boolean;
  region?: string;
  municipality?: string;
  cadastral?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedParcels {
  data: Parcel[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
