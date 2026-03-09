import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://landledger.ge";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];

  try {
    const supabase = await createClient();
    const { data: parcels } = await supabase
      .from("parcels")
      .select("id, updated_at")
      .order("updated_at", { ascending: false })
      .limit(1000);

    const parcelRoutes: MetadataRoute.Sitemap = (parcels ?? []).map((p) => ({
      url: `${base}/parcels/${p.id}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticRoutes, ...parcelRoutes];
  } catch {
    return staticRoutes;
  }
}
