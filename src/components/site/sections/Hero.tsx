import { useQuery } from "@tanstack/react-query";
import { PlayCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_SETTINGS, findLink, settingsQuery, socialLinksQuery } from "@/lib/site-data";
import { SocialIcon } from "../SocialIcon";
import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: links } = useQuery(socialLinksQuery);
  const active = (links ?? []).filter((l) => l.is_active);
  const mainChannel = findLink(links, "youtube") ?? "#channels";
  const background = settings?.banner_url ?? heroBg;

  return (
    <section id="home" className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${background})` }}
        aria-hidden="true"
      />
      <div className="hero-overlay absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pt-28 pb-16 sm:px-6 md:grid-cols-[1.3fr_1fr]">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            Gaming • Movies • Comedy • Live
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-6xl">
            <span className="text-gradient">{settings?.name_ar ?? DEFAULT_SETTINGS.name_ar}</span>
          </h1>
          <p className="mt-2 font-display text-lg tracking-wide text-muted-foreground sm:text-2xl">
            {settings?.name_en ?? DEFAULT_SETTINGS.name_en}
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg">
            {settings?.tagline ?? DEFAULT_SETTINGS.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full shadow-[var(--shadow-glow)]">
              <a href={mainChannel} target="_blank" rel="noopener noreferrer">
                <PlayCircle aria-hidden="true" />
                شاهد القناة
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href="#social">
                <Users aria-hidden="true" />
                تابعني على السوشيال ميديا
              </a>
            </Button>
          </div>

          {active.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {active.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="card-hover grid h-11 w-11 place-items-center rounded-full border border-border bg-card/70 text-foreground backdrop-blur"
                  >
                    <SocialIcon platform={link.platform} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="animate-in fade-in zoom-in-95 duration-700 md:justify-self-end">
          {settings?.portrait_url ? (
            <img
              src={settings.portrait_url}
              alt="مروان ريحان"
              width={420}
              height={520}
              className="glass mx-auto max-h-[520px] w-full max-w-sm rounded-3xl object-cover p-1"
            />
          ) : (
            <div className="glass mx-auto grid h-72 w-full max-w-sm place-items-center rounded-3xl p-8 text-center">
              <div>
                <p className="font-display text-lg font-bold">صورة مروان</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  ارفع الصورة الشخصية من لوحة التحكم لتظهر هنا مباشرة.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
