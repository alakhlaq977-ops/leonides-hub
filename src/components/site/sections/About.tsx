import { useQuery } from "@tanstack/react-query";
import { Clapperboard, Gamepad2, Laugh, Radio, Sparkles, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { settingsQuery } from "@/lib/site-data";
import { Reveal, SectionHeading } from "../Reveal";

const MARWAN_PORTRAIT =
  "/__l5e/assets-v1/8826fdc7-fadf-43d1-9a6d-6c0982c2f5dc/marwan-portrait.png";

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
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="تكبير صورة مروان ريحان"
                  className="glass card-hover block w-full overflow-hidden rounded-3xl p-1"
                >
                  <img
                    src={settings?.portrait_url ?? MARWAN_PORTRAIT}
                    alt="مروان ريحان"
                    loading="lazy"
                    width={905}
                    height={901}
                    className="aspect-square w-full rounded-[1.35rem] object-cover"
                  />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl border-border bg-card p-2">
                <DialogTitle className="sr-only">صورة مروان ريحان</DialogTitle>
                <img
                  src={settings?.portrait_url ?? MARWAN_PORTRAIT}
                  alt="مروان ريحان"
                  className="h-auto w-full rounded-xl object-contain"
                />
              </DialogContent>
            </Dialog>
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
