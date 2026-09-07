import { useEffect, useState } from "react";

import { Menu, Moon, Sun, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { settingsQuery, DEFAULT_SETTINGS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "عن مروان" },
  { href: "#videos", label: "الفيديوهات" },
  { href: "#channels", label: "القنوات" },
  { href: "#social", label: "السوشيال ميديا" },
  { href: "#gallery", label: "الصور" },
  { href: "#contact", label: "تواصل" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: settings } = useQuery(settingsQuery);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const logo = settings?.logo_url;
  const siteName = settings?.site_name ?? DEFAULT_SETTINGS.site_name;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass py-2" : "py-4",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="التنقل الرئيسي">
        <a href="#home" className="flex items-center gap-3">
          {logo ? (
            <img src={logo} alt={siteName} className="h-10 w-10 rounded-xl object-cover" width={40} height={40} />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
              L
            </span>
          )}
          <span className="font-display text-sm font-bold sm:text-base">{siteName}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="glass mt-2 lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base transition-colors hover:bg-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
