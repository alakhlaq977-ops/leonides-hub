import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { socialLinksQuery } from "@/lib/site-data";
import { SocialIcon } from "../SocialIcon";
import { Reveal, SectionHeading } from "../Reveal";

export function Social() {
  const { data, isLoading } = useQuery(socialLinksQuery);
  const links = (data ?? []).filter((l) => l.is_active);

  return (
    <section id="social" className="section-pad bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Social Media"
          title="تابع مروان ريحان على كل المنصات"
          description="روابط رسمية فقط — أي حساب جديد يمكن إضافته من لوحة التحكم."
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-3xl" />
            ))}
          </div>
        ) : links.length === 0 ? (
          <p className="text-center text-muted-foreground">لم تُضف أي حسابات بعد.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((link, index) => (
              <Reveal as="li" key={link.id} delay={index * 50}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-hover flex h-full items-center gap-4 rounded-3xl border border-border bg-card p-5"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                    <SocialIcon platform={link.platform} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{link.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{link.url}</span>
                  </span>
                  <ExternalLink size={16} className="text-muted-foreground" aria-hidden="true" />
                </a>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
