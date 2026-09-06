import { useQuery } from "@tanstack/react-query";
import { statsQuery } from "@/lib/site-data";
import { SocialIcon } from "../SocialIcon";
import { Reveal, SectionHeading } from "../Reveal";

export function Stats() {
  const { data, isLoading } = useQuery(statsQuery);
  const filled = (data ?? []).filter((s) => s.value && s.value.trim() !== "");

  if (isLoading || filled.length === 0) return null;

  return (
    <section id="stats" className="section-pad bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Statistics" title="الأرقام" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {filled.map((stat, index) => (
            <Reveal as="li" key={stat.id} delay={index * 60}>
              <div className="card-hover rounded-3xl border border-border bg-card p-6 text-center">
                <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <SocialIcon platform={stat.platform} size={20} />
                </span>
                <p className="font-display text-3xl font-extrabold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
