import { createClient } from "@/lib/supabase/server";
import type { Parcel, ParcelFilters, ParcelInsert, ParcelUpdate, PaginatedParcels } from "@/features/parcels/types";

const DEFAULT_PAGE_SIZE = 20;

export async function findManyParcels(filters: ParcelFilters = {}): Promise<PaginatedParcels> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("parcels")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.mine) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) query = query.eq("user_id", user.id);
  }
  if (filters.region) query = query.ilike("region", `%${filters.region}%`);
  if (filters.municipality) query = query.ilike("municipality", `%${filters.municipality}%`);
  if (filters.cadastral) query = query.ilike("cadastral_code", `%${filters.cadastral}%`);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const total = count ?? 0;
  return {
    data: data ?? [],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function findParcelById(id: string): Promise<Parcel> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parcels")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function insertParcel(payload: ParcelInsert): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("parcels").insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateParcelById(id: string, payload: ParcelUpdate): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("parcels").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteParcelById(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("parcels").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ნახვის ჩაწერა — UPSERT: duplicate silently ignored (unique constraint)
export async function upsertParcelView(parcelId: string, viewerId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("parcel_views")
    .upsert(
      { parcel_id: parcelId, viewer_id: viewerId },
      { onConflict: "parcel_id,viewer_id", ignoreDuplicates: true }
    );
  if (error) throw new Error(error.message);
}

// უნიკალური ნახვების რაოდენობა (მხოლოდ მფლობელისთვის)
export async function countUniqueViews(parcelId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("parcel_views")
    .select("*", { count: "exact", head: true })
    .eq("parcel_id", parcelId);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
