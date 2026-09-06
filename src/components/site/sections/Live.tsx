import { useQuery } from "@tanstack/react-query";
import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findLink, settingsQuery, socialLinksQuery } from "@/lib/site-data";
import { SocialIcon } from "../SocialIcon";
import { Reveal, SectionHeading } from "../Reveal";

export function Live() {
  const { data: links } = useQuery(socialLinksQuery);
  const { data: settings } = useQuery(settingsQuery);
  const twitch = findLink(links, "twitch");
  const ytLive = findLink(links, "youtube-live");
  const kick = findLink(links, "kick");
  const discord = findLink(links, "discord");

  return (
    <section id="live" className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Live" title="البث المباشر والمجتمع" />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <article className="glass flex h-full flex-col gap-6 rounded-3xl p-7 sm:flex-row sm:items-center">
              {settings?.portrait_url ? (
                <img
                  src={settings.portrait_url}
                  alt="مروان ريحان أثناء البث"
                  loading="lazy"
                  width={160}
                  height={160}
                  className="h-36 w-36 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <span className="grid h-36 w-36 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <Radio size={44} aria-hidden="true" />
                </span>
              )}
              <div className="flex-1">
                <p className="font-display text-2xl font-bold">LeOniDeS</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  بثوث مباشرة لأحدث الألعاب على Twitch ويوتيوب. تابع الحساب ليصلك إشعار عند بدء البث.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {twitch ? (
                    <>
                      <Button asChild className="rounded-full">
                        <a href={twitch} target="_blank" rel="noopener noreferrer">
                          شاهد البث
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full">
                        <a href={twitch} target="_blank" rel="noopener noreferrer">
                          <SocialIcon platform="twitch" size={16} />
                          تابعني على Twitch
                        </a>
                      </Button>
                    </>
                  ) : null}
                  {ytLive ? (
                    <Button asChild variant="outline" className="rounded-full">
                      <a href={ytLive} target="_blank" rel="noopener noreferrer">
                        <SocialIcon platform="youtube-live" size={16} />
                        قناة اللايف
                      </a>
                    </Button>
                  ) : null}
                  {kick ? (
                    <Button asChild variant="outline" className="rounded-full">
                      <a href={kick} target="_blank" rel="noopener noreferrer">
                        <SocialIcon platform="kick" size={16} />
                        Kick
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={120}>
            <article className="card-hover flex h-full flex-col items-start rounded-3xl border border-border bg-card p-7">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
                <SocialIcon platform="discord" size={26} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold">Discord Community</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                سيرفر مروان الرسمي: العب مع الشلة، تابع مواعيد البث، واتكلم مع باقي المتابعين.
              </p>
              {discord ? (
                <Button asChild className="mt-5 rounded-full">
                  <a href={discord} target="_blank" rel="noopener noreferrer">
                    انضم إلى Discord
                  </a>
                </Button>
              ) : (
                <p className="mt-5 rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground">
                  أضف رابط سيرفر الديسكورد الرسمي من لوحة التحكم ليظهر الزر هنا.
                </p>
              )}
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
