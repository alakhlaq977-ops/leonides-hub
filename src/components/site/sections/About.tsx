import { useQuery } from "@tanstack/react-query";
import { Clapperboard, Gamepad2, Laugh, Radio, Sparkles, Trophy } from "lucide-react";
import { settingsQuery } from "@/lib/site-data";
import { Reveal, SectionHeading } from "../Reveal";

const TAGS = [
  { icon: Gamepad2, label: "الألعاب" },
  { icon: Clapperboard, label: "الأفلام" },
  { icon: Laugh, label: "الكوميديا" },
  { icon: Trophy, label: "التحديات" },
  { icon: Sparkles, label: "الترفيه" },
  { icon: Radio, label: "البثوث المباشرة" },
];

export function About() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <section id="about" className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="التعريف" title="مين هو مروان ريحان؟" />

        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <img
              src={settings?.portrait_url ?? MARWAN_PORTRAIT}
              alt="مروان ريحان"
              loading="lazy"
              width={640}
              height={720}
              className="glass w-full rounded-3xl object-cover p-1"
            />
          </Reveal>

          <Reveal delay={120}>
            <p className="text-lg leading-loose text-foreground/90">
              {settings?.bio || "أضف نبذة عن مروان من لوحة التحكم."}
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TAGS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="card-hover flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold"
                >
                  <Icon size={18} className="text-primary" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
