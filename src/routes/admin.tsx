import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, LogOut, Plus, Trash2, Upload } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import {
  channelsQuery,
  galleryQuery,
  latestContentQuery,
  settingsQuery,
  socialLinksQuery,
  statsQuery,
  uploadMedia,
  videosQuery,
} from "@/lib/site-data";
import { PLATFORM_OPTIONS } from "@/components/site/SocialIcon";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | Marwan Rehan – LeOniDeS" },
      { name: "description", content: "إدارة محتوى وروابط وصور موقع مروان ريحان LeOniDeS." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة التحكم | Marwan Rehan – LeOniDeS" },
      { property: "og:description", content: "إدارة محتوى موقع مروان ريحان." },
    ],
  }),
  component: AdminPage,
});

function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, ready };
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="mb-5 font-display text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadMedia(file, "site"));
      toast.success("تم رفع الصورة");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر رفع الصورة");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <img src={value} alt={label} className="h-16 w-16 rounded-xl object-cover" width={64} height={64} />
        ) : null}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent">
          {busy ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          رفع صورة
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        {value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            إزالة
          </Button>
        ) : null}
      </div>
      <Input
        dir="ltr"
        placeholder="أو ألصق رابط الصورة هنا"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      />
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const { session, ready } = useSession();
  const qc = useQueryClient();

  const roleQuery = useQuery({
    queryKey: ["is-admin", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session!.user.id);
      if (error) throw new Error(error.message);
      return (data ?? []).some((r) => r.role === "admin");
    },
  });

  useEffect(() => {
    if (ready && !session) navigate({ to: "/auth" });
  }, [ready, session, navigate]);

  const settings = useQuery(settingsQuery);
  const socials = useQuery(socialLinksQuery);
  const channels = useQuery(channelsQuery);
  const videos = useQuery(videosQuery);
  const gallery = useQuery(galleryQuery);
  const stats = useQuery(statsQuery);
  const latest = useQuery(latestContentQuery);

  const [form, setForm] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    if (settings.data && !form) setForm({ ...settings.data });
  }, [settings.data, form]);

  const saveSettings = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("site_settings") as any).update(values).eq("id", true);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("تم حفظ الإعدادات");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function tableMutation(table: string, key: string) {
    return {
      async insert(values: Record<string, unknown>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from(table as any) as any).insert(values);
        if (error) throw new Error(error.message);
        qc.invalidateQueries({ queryKey: [key] });
      },
      async update(id: string, values: Record<string, unknown>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from(table as any) as any).update(values).eq("id", id);
        if (error) throw new Error(error.message);
        qc.invalidateQueries({ queryKey: [key] });
      },
      async remove(id: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from(table as any) as any).delete().eq("id", id);
        if (error) throw new Error(error.message);
        qc.invalidateQueries({ queryKey: [key] });
      },
    };
  }

  const socialApi = tableMutation("social_links", "social_links");
  const channelApi = tableMutation("youtube_channels", "youtube_channels");
  const videoApi = tableMutation("videos", "videos");
  const galleryApi = tableMutation("gallery_images", "gallery_images");
  const statsApi = tableMutation("stats", "stats");
  const latestApi = tableMutation("latest_content", "latest_content");

  async function guard(action: () => Promise<void>, message: string) {
    try {
      await action();
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ");
    }
  }

  if (!ready || (session && roleQuery.isLoading)) {
    return (
      <main className="grid min-h-screen place-items-center">
        <Loader2 className="animate-spin text-primary" aria-label="جارٍ التحميل" />
      </main>
    );
  }

  if (!session) return null;

  if (roleQuery.data === false) {
    return (
      <main className="grid min-h-screen place-items-center px-4 text-center">
        <div className="glass max-w-md rounded-3xl p-8">
          <h1 className="font-display text-xl font-bold">لا تملك صلاحية الدخول</h1>
          <p className="mt-2 text-sm text-muted-foreground">هذا الحساب ليس حساب مدير الموقع.</p>
          <Button className="mt-5 rounded-full" onClick={() => supabase.auth.signOut()}>
            تسجيل الخروج
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/">عرض الموقع</Link>
          </Button>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
          >
            <LogOut size={16} aria-hidden="true" />
            خروج
          </Button>
        </div>
      </header>

      <Tabs defaultValue="settings" dir="rtl">
        <TabsList className="mb-6 flex h-auto flex-wrap justify-start gap-1">
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="social">الروابط</TabsTrigger>
          <TabsTrigger value="channels">القنوات</TabsTrigger>
          <TabsTrigger value="videos">الفيديوهات</TabsTrigger>
          <TabsTrigger value="gallery">الصور</TabsTrigger>
          <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
          <TabsTrigger value="latest">أحدث المحتوى</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Panel title="بيانات الموقع">
            {form ? (
              <form
                className="grid gap-5 md:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const { id: _id, updated_at: _u, ...rest } = form as Record<string, unknown>;
                  saveSettings.mutate(rest);
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="site_name">اسم الموقع</Label>
                  <Input
                    id="site_name"
                    value={String(form["site_name"] ?? "")}
                    onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ar">الاسم بالعربية</Label>
                  <Input
                    id="name_ar"
                    value={String(form["name_ar"] ?? "")}
                    onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
                  <Input
                    id="name_en"
                    dir="ltr"
                    value={String(form["name_en"] ?? "")}
                    onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">بريد التواصل</Label>
                  <Input
                    id="contact_email"
                    dir="ltr"
                    value={String(form["contact_email"] ?? "")}
                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tagline">النبذة القصيرة</Label>
                  <Input
                    id="tagline"
                    value={String(form["tagline"] ?? "")}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">نبذة مروان</Label>
                  <Textarea
                    id="bio"
                    rows={5}
                    value={String(form["bio"] ?? "")}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </div>
                <ImageField
                  label="الشعار (Logo)"
                  value={(form["logo_url"] as string | null) ?? null}
                  onChange={(url) => setForm({ ...form, logo_url: url })}
                />
                <ImageField
                  label="خلفية الموقع (Channel Banner)"
                  value={(form["banner_url"] as string | null) ?? null}
                  onChange={(url) => setForm({ ...form, banner_url: url })}
                />
                <ImageField
                  label="صورة مروان الشخصية"
                  value={(form["portrait_url"] as string | null) ?? null}
                  onChange={(url) => setForm({ ...form, portrait_url: url })}
                />
                <div className="space-y-2">
                  <Label htmlFor="accent_color">اللون المميز</Label>
                  <Input
                    id="accent_color"
                    type="color"
                    className="h-11 w-24 p-1"
                    value={String(form["accent_color"] ?? "#f5a524")}
                    onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="rounded-full" disabled={saveSettings.isPending}>
                    {saveSettings.isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </div>
              </form>
            ) : (
              <Loader2 className="animate-spin text-primary" />
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="social">
          <Panel title="روابط السوشيال ميديا">
            <div className="space-y-3">
              {(socials.data ?? []).map((link) => (
                <div key={link.id} className="grid gap-3 rounded-2xl border border-border p-4 md:grid-cols-[160px_1fr_1fr_auto_auto]">
                  <select
                    className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
                    value={link.platform}
                    aria-label="المنصة"
                    onChange={(e) => guard(() => socialApi.update(link.id, { platform: e.target.value }), "تم التحديث")}
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <Input
                    defaultValue={link.label}
                    aria-label="الاسم"
                    onBlur={(e) =>
                      e.target.value !== link.label &&
                      guard(() => socialApi.update(link.id, { label: e.target.value }), "تم التحديث")
                    }
                  />
                  <Input
                    dir="ltr"
                    defaultValue={link.url}
                    aria-label="الرابط"
                    onBlur={(e) =>
                      e.target.value !== link.url &&
                      guard(() => socialApi.update(link.id, { url: e.target.value }), "تم التحديث")
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={link.is_active}
                      aria-label="تفعيل الرابط"
                      onCheckedChange={(v) => guard(() => socialApi.update(link.id, { is_active: v }), "تم التحديث")}
                    />
                    <span className="text-xs text-muted-foreground">ظاهر</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف الرابط"
                    onClick={() => guard(() => socialApi.remove(link.id), "تم الحذف")}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  guard(
                    () =>
                      socialApi.insert({
                        platform: "tiktok",
                        label: "TikTok",
                        url: "https://",
                        sort_order: (socials.data?.length ?? 0) + 1,
                      }),
                    "تمت الإضافة",
                  )
                }
              >
                <Plus size={16} /> إضافة رابط
              </Button>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="channels">
          <Panel title="قنوات يوتيوب">
            <div className="space-y-3">
              {(channels.data ?? []).map((channel) => (
                <div key={channel.id} className="space-y-3 rounded-2xl border border-border p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      defaultValue={channel.name}
                      aria-label="اسم القناة"
                      onBlur={(e) => guard(() => channelApi.update(channel.id, { name: e.target.value }), "تم التحديث")}
                    />
                    <Input
                      dir="ltr"
                      defaultValue={channel.url}
                      aria-label="رابط القناة"
                      onBlur={(e) => guard(() => channelApi.update(channel.id, { url: e.target.value }), "تم التحديث")}
                    />
                  </div>
                  <Textarea
                    defaultValue={channel.description}
                    aria-label="وصف القناة"
                    onBlur={(e) =>
                      guard(() => channelApi.update(channel.id, { description: e.target.value }), "تم التحديث")
                    }
                  />
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="w-full max-w-sm">
                      <ImageField
                        label="صورة القناة"
                        value={channel.image_url}
                        onChange={(url) => guard(() => channelApi.update(channel.id, { image_url: url }), "تم التحديث")}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => guard(() => channelApi.remove(channel.id), "تم الحذف")}
                      aria-label="حذف القناة"
                    >
                      <Trash2 size={16} className="text-destructive" /> حذف
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  guard(
                    () =>
                      channelApi.insert({
                        name: "قناة جديدة",
                        url: "https://",
                        description: "",
                        sort_order: (channels.data?.length ?? 0) + 1,
                      }),
                    "تمت الإضافة",
                  )
                }
              >
                <Plus size={16} /> إضافة قناة
              </Button>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="videos">
          <Panel title="الفيديوهات المختارة">
            <p className="mb-4 text-sm text-muted-foreground">
              أحدث الفيديوهات تُجلب تلقائيًا من قناة يوتيوب. الفيديوهات المضافة هنا تظهر أولًا.
            </p>
            <div className="space-y-3">
              {(videos.data ?? []).map((video) => (
                <div key={video.id} className="grid gap-3 rounded-2xl border border-border p-4 md:grid-cols-[1fr_200px_auto]">
                  <Input
                    defaultValue={video.title}
                    aria-label="عنوان الفيديو"
                    onBlur={(e) => guard(() => videoApi.update(video.id, { title: e.target.value }), "تم التحديث")}
                  />
                  <Input
                    dir="ltr"
                    defaultValue={video.youtube_id}
                    aria-label="معرف الفيديو على يوتيوب"
                    onBlur={(e) => guard(() => videoApi.update(video.id, { youtube_id: e.target.value }), "تم التحديث")}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف الفيديو"
                    onClick={() => guard(() => videoApi.remove(video.id), "تم الحذف")}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  guard(
                    () =>
                      videoApi.insert({
                        title: "فيديو جديد",
                        youtube_id: "",
                        sort_order: (videos.data?.length ?? 0) + 1,
                      }),
                    "تمت الإضافة",
                  )
                }
              >
                <Plus size={16} /> إضافة فيديو
              </Button>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="gallery">
          <Panel title="معرض الصور">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(gallery.data ?? []).map((image) => (
                <div key={image.id} className="overflow-hidden rounded-2xl border border-border">
                  <img src={image.url} alt={image.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <div className="flex items-center gap-2 p-3">
                    <Input
                      defaultValue={image.alt}
                      aria-label="وصف الصورة"
                      onBlur={(e) => guard(() => galleryApi.update(image.id, { alt: e.target.value }), "تم التحديث")}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="حذف الصورة"
                      onClick={() => guard(() => galleryApi.remove(image.id), "تم الحذف")}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 max-w-md">
              <ImageField
                label="إضافة صورة جديدة"
                value={null}
                onChange={(url) =>
                  url &&
                  guard(
                    () => galleryApi.insert({ url, sort_order: (gallery.data?.length ?? 0) + 1 }),
                    "تمت إضافة الصورة",
                  )
                }
              />
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="stats">
          <Panel title="إحصائيات الحسابات">
            <p className="mb-4 text-sm text-muted-foreground">
              اترك الخانة فارغة لإخفاء الإحصائية من الموقع. لا تُعرض أي أرقام تلقائية غير موثوقة.
            </p>
            <div className="space-y-3">
              {(stats.data ?? []).map((stat) => (
                <div key={stat.id} className="grid gap-3 rounded-2xl border border-border p-4 md:grid-cols-[1fr_1fr_auto]">
                  <Input
                    defaultValue={stat.label}
                    aria-label="اسم الإحصائية"
                    onBlur={(e) => guard(() => statsApi.update(stat.id, { label: e.target.value }), "تم التحديث")}
                  />
                  <Input
                    defaultValue={stat.value ?? ""}
                    dir="ltr"
                    placeholder="3M"
                    aria-label="قيمة الإحصائية"
                    onBlur={(e) => guard(() => statsApi.update(stat.id, { value: e.target.value || null }), "تم التحديث")}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف الإحصائية"
                    onClick={() => guard(() => statsApi.remove(stat.id), "تم الحذف")}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  guard(
                    () =>
                      statsApi.insert({
                        platform: "youtube",
                        label: "إحصائية جديدة",
                        sort_order: (stats.data?.length ?? 0) + 1,
                      }),
                    "تمت الإضافة",
                  )
                }
              >
                <Plus size={16} /> إضافة إحصائية
              </Button>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="latest">
          <Panel title="أحدث المحتوى">
            <div className="space-y-3">
              {(latest.data ?? []).map((item) => (
                <div key={item.id} className="grid gap-3 rounded-2xl border border-border p-4 md:grid-cols-[1fr_140px_1fr_auto]">
                  <Input
                    defaultValue={item.title}
                    aria-label="العنوان"
                    onBlur={(e) => guard(() => latestApi.update(item.id, { title: e.target.value }), "تم التحديث")}
                  />
                  <select
                    className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
                    defaultValue={item.platform}
                    aria-label="المنصة"
                    onChange={(e) => guard(() => latestApi.update(item.id, { platform: e.target.value }), "تم التحديث")}
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <Input
                    dir="ltr"
                    defaultValue={item.url}
                    aria-label="الرابط"
                    onBlur={(e) => guard(() => latestApi.update(item.id, { url: e.target.value }), "تم التحديث")}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف العنصر"
                    onClick={() => guard(() => latestApi.remove(item.id), "تم الحذف")}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  guard(
                    () =>
                      latestApi.insert({
                        title: "محتوى جديد",
                        platform: "youtube",
                        url: "https://",
                        sort_order: (latest.data?.length ?? 0) + 1,
                      }),
                    "تمت الإضافة",
                  )
                }
              >
                <Plus size={16} /> إضافة عنصر
              </Button>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </main>
  );
}
