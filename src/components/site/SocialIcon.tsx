import { Facebook, Instagram, Link2, MessageCircle, Twitch, Twitter, Youtube } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

function TikTokIcon(props: LucideProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={props.size ?? 24} height={props.size ?? 24} {...props}>
      <path d="M16.5 3c.4 2.2 1.9 3.9 4 4.2v3c-1.5.1-2.9-.3-4.2-1.1v6.4c0 3.4-2.6 5.9-5.9 5.9S4.5 18.9 4.5 15.6c0-3.2 2.6-5.8 5.8-5.8.3 0 .6 0 .9.1v3.1c-.3-.1-.6-.1-.9-.1-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.8-1.1 2.8-2.8V3h3.4Z" />
    </svg>
  );
}

function DiscordIcon(props: LucideProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={props.size ?? 24} height={props.size ?? 24} {...props}>
      <path d="M19.3 5.4A16.7 16.7 0 0 0 15.2 4l-.3.6c1.4.3 2.6.8 3.7 1.5A13.6 13.6 0 0 0 12 5c-2.4 0-4.6.4-6.6 1.1a11 11 0 0 1 3.7-1.5L8.8 4C7.3 4.3 5.9 4.8 4.7 5.4 2.4 8.8 1.7 12.2 2 15.5A16.9 16.9 0 0 0 7.2 18l1-1.5c-.8-.3-1.6-.7-2.3-1.2l.5-.4a12 12 0 0 0 11.2 0l.5.4c-.7.5-1.5.9-2.3 1.2l1 1.5c1.9-.6 3.6-1.4 5.2-2.5.4-3.9-.6-7.3-2.7-10.1ZM8.9 13.9c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2c0 1.1-.8 2-1.8 2Zm6.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2c0 1.1-.8 2-1.8 2Z" />
    </svg>
  );
}

function KickIcon(props: LucideProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={props.size ?? 24} height={props.size ?? 24} {...props}>
      <path d="M3 3h5v5h2V5.5h2V3h6v5h-2v2.5h-2V13h2v2.5h2V21h-6v-2.5h-2V16H8v5H3V3Z" />
    </svg>
  );
}

const ICONS: Record<string, ComponentType<LucideProps>> = {
  youtube: Youtube,
  "youtube-shorts": Youtube,
  "youtube-live": Youtube,
  tiktok: TikTokIcon,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  x: Twitter,
  twitch: Twitch,
  kick: KickIcon,
  discord: DiscordIcon,
  whatsapp: MessageCircle,
};

export function SocialIcon({ platform, size = 22 }: { platform: string; size?: number }) {
  const Icon = ICONS[platform] ?? Link2;
  return <Icon size={size} aria-hidden="true" />;
}

export const PLATFORM_OPTIONS = Object.keys(ICONS);
