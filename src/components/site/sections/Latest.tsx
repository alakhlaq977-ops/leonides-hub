import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { formatArabicDate, latestContentQuery } from "@/lib/site-data";
import { SocialIcon } from "../SocialIcon";
import { Reveal, SectionHeading } from "../Reveal";

export function Latest() {
  const { data, isLoading } = useQuery(latestContentQuery);
  const items = data ?? [];

  if (isLoading || items.length === 0) return null;

  return (
    <section id="latest" className="section-pad bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Latest Content" title="أحدث المحتوى من كل المنصات" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal as="li" key={item.id} delay={index * 60}>
              <article className="card-hover flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    width={480}
                    height={270}
                    className="aspect-video w-full object-cover"
                  />
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <span className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <SocialIcon platform={item.platform} size={14} />
                    {item.platform}
                  </span>
                  <h3 className="mt-2 line-clamp-2 font-bold leading-relaxed">{item.title}</h3>
                  {formatArabicDate(item.published_at) ? (
                    <p className="mt-2 text-xs text-muted-foreground">{formatArabicDate(item.published_at)}</p>
                  ) : null}
                  <Button asChild size="sm" className="mt-4 w-fit rounded-full">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      مشاهدة
                    </a>
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
