import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { galleryQuery } from "@/lib/site-data";
import { Reveal, SectionHeading } from "../Reveal";
import channelAvatar from "@/assets/channel-avatar.jpg";
import channelBanner from "@/assets/channel-banner.jpg";
import shortsAvatar from "@/assets/gallery/shorts-avatar.jpg";
import liveAvatar from "@/assets/gallery/live-avatar.jpg";
import xProfile from "@/assets/gallery/x-profile.jpg";
import video1 from "@/assets/gallery/video-1.jpg";
import video2 from "@/assets/gallery/video-2.jpg";
import video3 from "@/assets/gallery/video-3.jpg";

const FALLBACK_IMAGES = [
  { id: "avatar", url: channelAvatar, alt: "مروان ريحان – صورة القناة الرسمية" },
  { id: "banner", url: channelBanner, alt: "بانر قناة مروان ريحان LeOniDeS" },
  { id: "shorts", url: shortsAvatar, alt: "قناة مروان ريحان Shorts" },
  { id: "live", url: liveAvatar, alt: "قناة مروان ريحان للبث المباشر" },
  { id: "x", url: xProfile, alt: "مروان ريحان على منصة X" },
  { id: "v1", url: video1, alt: "من فيديوهات مروان ريحان" },
  { id: "v2", url: video2, alt: "من فيديوهات مروان ريحان" },
  { id: "v3", url: video3, alt: "من فيديوهات مروان ريحان" },
];

export function Gallery() {
  const { data, isLoading } = useQuery(galleryQuery);
  const [active, setActive] = useState<{ url: string; alt: string } | null>(null);
  const images = data && data.length > 0 ? data : FALLBACK_IMAGES;

  return (
    <section id="gallery" className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Gallery" title="صور مروان ريحان" />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-3xl" />
            ))}
          </div>
        ) : (

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <Reveal as="li" key={image.id} delay={index * 50}>
                <button
                  type="button"
                  onClick={() => setActive({ url: image.url, alt: image.alt })}
                  className="card-hover group block w-full overflow-hidden rounded-3xl border border-border bg-card"
                  aria-label={`تكبير الصورة: ${image.alt}`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    width={640}
                    height={480}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              </Reveal>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-4xl border-border bg-card p-3">
          <DialogTitle className="sr-only">{active?.alt ?? "صورة"}</DialogTitle>
          {active ? (
            <img src={active.url} alt={active.alt} className="max-h-[80vh] w-full rounded-2xl object-contain" />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
