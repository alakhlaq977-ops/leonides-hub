import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Eye, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatArabicDate, formatCount, videosQuery } from "@/lib/site-data";
import { getChannelFeed, type FeedVideo } from "@/lib/youtube.functions";
import { Reveal, SectionHeading } from "../Reveal";

export function Videos() {
  const feedFn = useServerFn(getChannelFeed);
  const [playing, setPlaying] = useState<FeedVideo | null>(null);

  const manual = useQuery(videosQuery);
  const feed = useQuery({
    queryKey: ["yt-feed", "main"],
    queryFn: () => feedFn({ data: { channel: "main", limit: 9 } }),
    staleTime: 1000 * 60 * 30,
  });

  const manualVideos: FeedVideo[] = (manual.data ?? []).map((v) => ({
    id: v.youtube_id,
    title: v.title,
    publishedAt: v.published_at ?? "",
    thumbnail: v.thumbnail_url ?? `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`,
    views: v.views,
    url: `https://www.youtube.com/watch?v=${v.youtube_id}`,
  }));

  const videos = [...manualVideos, ...(feed.data ?? [])].filter(
    (v, index, all) => all.findIndex((x) => x.id === v.id) === index,
  );

  const loading = feed.isLoading || manual.isLoading;

  return (
    <section id="videos" className="section-pad bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="الفيديوهات"
          title="أحدث الفيديوهات"
          description="تُجلب تلقائيًا من قناة يوتيوب الرسمية، ويمكن إضافة فيديوهات مختارة من لوحة التحكم."
        />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}
          </div>
        ) : feed.isError && videos.length === 0 ? (
          <div className="glass mx-auto max-w-md rounded-3xl p-8 text-center">
            <AlertTriangle className="mx-auto mb-3 text-destructive" aria-hidden="true" />
            <p className="font-semibold">تعذر تحميل الفيديوهات الآن</p>
            <Button className="mt-4 rounded-full" onClick={() => feed.refetch()}>
              إعادة المحاولة
            </Button>
          </div>
        ) : videos.length === 0 ? (
          <p className="text-center text-muted-foreground">لا توجد فيديوهات لعرضها حاليًا.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => {
              const date = formatArabicDate(video.publishedAt || null);
              const views = formatCount(video.views);
              return (
                <Reveal as="li" key={video.id} delay={index * 60}>
                  <article className="card-hover group h-full overflow-hidden rounded-3xl border border-border bg-card">
                    <button
                      type="button"
                      onClick={() => setPlaying(video)}
                      className="relative block w-full"
                      aria-label={`تشغيل الفيديو: ${video.title}`}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                        width={480}
                        height={270}
                        className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <PlayCircle size={54} className="text-primary" aria-hidden="true" />
                      </span>
                    </button>
                    <div className="p-5">
                      <h3 className="line-clamp-2 text-base font-bold leading-relaxed">{video.title}</h3>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {date ? <span>{date}</span> : null}
                        {views ? (
                          <span className="flex items-center gap-1">
                            <Eye size={14} aria-hidden="true" />
                            {views} مشاهدة
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="rounded-full" onClick={() => setPlaying(video)}>
                          مشاهدة الفيديو
                        </Button>
                        <Button asChild size="sm" variant="outline" className="rounded-full">
                          <a href={video.url} target="_blank" rel="noopener noreferrer">
                            على يوتيوب
                          </a>
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog open={!!playing} onOpenChange={(open) => !open && setPlaying(null)}>
        <DialogContent className="max-w-3xl border-border bg-card p-3">
          <DialogTitle className="px-2 text-right text-base">{playing?.title}</DialogTitle>
          {playing ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${playing.id}?autoplay=1&rel=0`}
                title={playing.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
