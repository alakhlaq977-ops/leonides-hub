import { useQuery } from "@tanstack/react-query";
import { settingsQuery, socialLinksQuery, DEFAULT_SETTINGS } from "@/lib/site-data";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: links } = useQuery(socialLinksQuery);
  const active = (links ?? []).filter((l) => l.is_active);
  const siteName = settings?.site_name ?? DEFAULT_SETTINGS.site_name;

  return (
    <footer id="contact" className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={siteName}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary font-display text-xl font-bold text-primary-foreground">
                  L
                </span>
              )}
              <p className="font-display text-lg font-bold">{siteName}</p>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              {settings?.tagline ?? DEFAULT_SETTINGS.tagline}
            </p>
            {settings?.contact_email ? (
              <a
                href={`mailto:${settings.contact_email}`}
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                {settings.contact_email}
              </a>
            ) : null}
          </div>

          <div>
            <h2 className="mb-4 font-display text-base font-bold">روابط سريعة</h2>
            {active.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد روابط مضافة بعد.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {active.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-hover flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"
                    >
                      <SocialIcon platform={link.platform} size={16} />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © Marwan Rehan – LeOniDeS. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
