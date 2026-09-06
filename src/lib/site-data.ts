import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SiteSettings = Tables<"site_settings">;
export type SocialLink = Tables<"social_links">;
export type YoutubeChannel = Tables<"youtube_channels">;
export type VideoRow = Tables<"videos">;
export type GalleryImage = Tables<"gallery_images">;
export type StatRow = Tables<"stats">;
export type LatestContentRow = Tables<"latest_content">;

export const DEFAULT_SETTINGS = {
  site_name: "Marwan Rehan – LeOniDeS",
  name_ar: "مروان ريحان",
  name_en: "Marwan Rehan / LeOniDeS",
  tagline: "جيمنج، أفلام، كوميديا وبثوث مباشرة — محتوى مصري بطعم مختلف.",
  bio: "",
};

async function run<T>(promise: PromiseLike<{ data: unknown; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await promise;
  if (error) throw new Error(error.message);
  return data as T;
}

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: () => run<SiteSettings | null>(supabase.from("site_settings").select("*").maybeSingle()),
});

export const socialLinksQuery = queryOptions({
  queryKey: ["social_links"],
  queryFn: () => run<SocialLink[]>(supabase.from("social_links").select("*").order("sort_order")),
});

export const channelsQuery = queryOptions({
  queryKey: ["youtube_channels"],
  queryFn: () => run<YoutubeChannel[]>(supabase.from("youtube_channels").select("*").order("sort_order")),
});

export const videosQuery = queryOptions({
  queryKey: ["videos"],
  queryFn: () =>
    run<VideoRow[]>(
      supabase.from("videos").select("*").order("sort_order").order("published_at", { ascending: false }),
    ),
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery_images"],
  queryFn: () => run<GalleryImage[]>(supabase.from("gallery_images").select("*").order("sort_order")),
});

export const statsQuery = queryOptions({
  queryKey: ["stats"],
  queryFn: () => run<StatRow[]>(supabase.from("stats").select("*").order("sort_order")),
});

export const latestContentQuery = queryOptions({
  queryKey: ["latest_content"],
  queryFn: () =>
    run<LatestContentRow[]>(
      supabase
        .from("latest_content")
        .select("*")
        .order("sort_order")
        .order("published_at", { ascending: false }),
    ),
});

export function findLink(links: SocialLink[] | undefined, platform: string) {
  return links?.find((l) => l.platform === platform && l.is_active && l.url)?.url ?? null;
}

/** Uploads a file to the private media bucket and returns a long-lived signed URL. */
export async function uploadMedia(file: File, folder: string) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);
  const { data, error: signError } = await supabase.storage
    .from("media")
    .createSignedUrl(path, 60 * 60 * 24 * 3650);
  if (signError || !data) throw new Error(signError?.message ?? "تعذر إنشاء رابط الصورة");
  return data.signedUrl;
}

export function formatArabicDate(value: string | null) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(value),
    );
  } catch {
    return null;
  }
}

export function formatCount(value: string | number | null) {
  if (value === null || value === "") return null;
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return String(value);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return new Intl.NumberFormat("ar-EG").format(num);
}
