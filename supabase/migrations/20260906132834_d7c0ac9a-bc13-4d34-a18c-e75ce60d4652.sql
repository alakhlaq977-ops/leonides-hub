
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.site_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  site_name text NOT NULL DEFAULT 'Marwan Rehan – LeOniDeS',
  name_ar text NOT NULL DEFAULT 'مروان ريحان',
  name_en text NOT NULL DEFAULT 'Marwan Rehan / LeOniDeS',
  tagline text NOT NULL DEFAULT 'جيمنج، أفلام، كوميديا وبثوث مباشرة — محتوى مصري بطعم مختلف.',
  bio text NOT NULL DEFAULT '',
  logo_url text,
  banner_url text,
  portrait_url text,
  accent_color text NOT NULL DEFAULT '#f5a524',
  default_theme text NOT NULL DEFAULT 'dark',
  contact_email text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings admin write" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social public read" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "social admin write" ON public.social_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.youtube_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  url text NOT NULL,
  channel_id text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.youtube_channels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.youtube_channels TO authenticated;
GRANT ALL ON public.youtube_channels TO service_role;
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "channels public read" ON public.youtube_channels FOR SELECT USING (true);
CREATE POLICY "channels admin write" ON public.youtube_channels FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  youtube_id text NOT NULL,
  thumbnail_url text,
  published_at timestamptz,
  views text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "videos public read" ON public.videos FOR SELECT USING (true);
CREATE POLICY "videos admin write" ON public.videos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt text NOT NULL DEFAULT 'صورة لمروان ريحان',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "gallery admin write" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text NOT NULL,
  value text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stats TO authenticated;
GRANT ALL ON public.stats TO service_role;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stats public read" ON public.stats FOR SELECT USING (true);
CREATE POLICY "stats admin write" ON public.stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.latest_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  platform text NOT NULL,
  url text NOT NULL,
  image_url text,
  published_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.latest_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.latest_content TO authenticated;
GRANT ALL ON public.latest_content TO service_role;
ALTER TABLE public.latest_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "latest public read" ON public.latest_content FOR SELECT USING (true);
CREATE POLICY "latest admin write" ON public.latest_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (id, bio) VALUES (true,
 'مروان ريحان، المعروف باسم LeOniDeS، صانع محتوى مصري بدأ رحلته على يوتيوب سنة 2018. القناة بتجمع بين الجيمنج والأفلام بأسلوب مختلف تمامًا عن الجيم بلاي العادي: تغطية للألعاب، تحديات، كوميديا، وبثوث مباشرة على يوتيوب وتويتش.');

INSERT INTO public.social_links (platform, label, url, sort_order) VALUES
 ('youtube', 'YouTube — القناة الأساسية', 'https://www.youtube.com/channel/UCbD4HxUyH2-sDDncYs3PjPg', 1),
 ('youtube-shorts', 'YouTube Shorts', 'https://www.youtube.com/channel/UCf4UfbDfku3e3i_qggQjPRg', 2),
 ('youtube-live', 'YouTube Live', 'https://www.youtube.com/channel/UCCXVX-w1Y0_c2NPI9cqTxFw', 3),
 ('twitch', 'Twitch', 'https://www.twitch.tv/leonides', 4),
 ('instagram', 'Instagram', 'https://www.instagram.com/marwan_rehan/', 5),
 ('facebook', 'Facebook', 'https://www.facebook.com/gaming/leonides.mr', 6),
 ('twitter', 'X / Twitter', 'https://twitter.com/MarwanRehan', 7);

INSERT INTO public.youtube_channels (name, description, url, channel_id, sort_order) VALUES
 ('LeOniDeS - مروان ريحان', 'القناة الأساسية: جيمنج، أفلام، تحديات وكوميديا.', 'https://www.youtube.com/channel/UCbD4HxUyH2-sDDncYs3PjPg', 'UCbD4HxUyH2-sDDncYs3PjPg', 1),
 ('LeOniDeS Shorts - مروان ريحان شورتس', 'مقاطع قصيرة وسريعة من أفضل اللحظات.', 'https://www.youtube.com/channel/UCf4UfbDfku3e3i_qggQjPRg', 'UCf4UfbDfku3e3i_qggQjPRg', 2),
 ('LeOniDeS Live - مروان ريحان لايف', 'قناة البثوث المباشرة وإعادة الاستريمات.', 'https://www.youtube.com/channel/UCCXVX-w1Y0_c2NPI9cqTxFw', 'UCCXVX-w1Y0_c2NPI9cqTxFw', 3);

INSERT INTO public.stats (platform, label, value, sort_order) VALUES
 ('youtube', 'مشتركو يوتيوب', NULL, 1),
 ('youtube', 'مشاهدات يوتيوب', NULL, 2),
 ('tiktok', 'متابعو تيك توك', NULL, 3),
 ('instagram', 'متابعو إنستغرام', NULL, 4),
 ('twitch', 'متابعو تويتش', NULL, 5);

CREATE POLICY "media read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
