import type { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticPaths = ["/", "/villas", "/about", "/contact", "/login", "/signup"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("villas")
      .select("slug, updated_at")
      .eq("is_published", true);
    for (const villa of data ?? []) {
      entries.push({
        url: `${base}/villas/${villa.slug}`,
        lastModified: villa.updated_at ? new Date(villa.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch (error) {
    console.warn("Sitemap generation skipped:", error);
  }

  return entries;
}
