import { useQuery } from "@tanstack/react-query";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { channelsQuery } from "@/lib/site-data";
import { Reveal, SectionHeading } from "../Reveal";

export function Channels() {
  const { data, isLoading } = useQuery(channelsQuery);

  return (
    <section id="channels" className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="YouTube" title="قنواتي على YouTube" />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-3xl" />
            ))}
          </div>
        ) : (data ?? []).length === 0 ? (
          <p className="text-center text-muted-foreground">لا توجد قنوات مضافة بعد.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-3">
            {(data ?? []).map((channel, index) => (
              <Reveal as="li" key={channel.id} delay={index * 80}>
                <article className="card-hover flex h-full flex-col items-center rounded-3xl border border-border bg-card p-7 text-center">
                  {channel.image_url ? (
                    <img
                      src={channel.image_url}
                      alt={channel.name}
                      loading="lazy"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-primary/15 text-primary">
                      <Youtube size={34} aria-hidden="true" />
                    </span>
                  )}
                  <h3 className="mt-4 font-display text-lg font-bold">{channel.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{channel.description}</p>
                  <Button asChild className="mt-5 rounded-full">
                    <a href={channel.url} target="_blank" rel="noopener noreferrer">
                      زيارة القناة
                    </a>
                  </Button>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
