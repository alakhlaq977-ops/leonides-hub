import { createServerFn } from "@tanstack/react-start";

export type FeedVideo = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  views: string | null;
  url: string;
};

const CHANNEL_IDS: Record<string, string> = {
  main: "UCbD4HxUyH2-sDDncYs3PjPg",
  shorts: "UCf4UfbDfku3e3i_qggQjPRg",
  live: "UCCXVX-w1Y0_c2NPI9cqTxFw",
};

function pick(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match?.[1]?.trim() ?? "";
}

function decode(text: string) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Public: reads the channel's public Atom feed — no API key needed. */
export const getChannelFeed = createServerFn({ method: "GET" })
  .inputValidator((data: { channel?: string; limit?: number }) => ({
    channel: data?.channel && CHANNEL_IDS[data.channel] ? data.channel : "main",
    limit: Math.min(Math.max(data?.limit ?? 9, 1), 15),
  }))
  .handler(async ({ data }): Promise<FeedVideo[]> => {
    const channelId = CHANNEL_IDS[data.channel]!;
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      headers: { "user-agent": "Mozilla/5.0" },
    });
    if (!res.ok) throw new Error("تعذر تحميل الفيديوهات من يوتيوب");
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);

    return entries.slice(0, data.limit).map((entry) => {
      const id = pick(entry, "yt:videoId");
      const views = entry.match(/<media:statistics views="(\d+)"/)?.[1] ?? null;
      return {
        id,
        title: decode(pick(entry, "title")),
        publishedAt: pick(entry, "published"),
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        views,
        url: `https://www.youtube.com/watch?v=${id}`,
      };
    });
  });
