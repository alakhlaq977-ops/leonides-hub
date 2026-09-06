import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | Marwan Rehan – LeOniDeS" },
      { name: "description", content: "تسجيل دخول مدير الموقع لإدارة محتوى موقع مروان ريحان." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "تسجيل الدخول | Marwan Rehan – LeOniDeS" },
      { property: "og:description", content: "دخول لوحة تحكم موقع مروان ريحان." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب. لو طُلب تأكيد البريد، افتح رسالة التأكيد ثم سجّل الدخول.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("أهلًا بك 👋");
        navigate({ to: "/admin" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-16">
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <h1 className="font-display text-2xl font-bold">
          {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب المدير"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          أول حساب يتم إنشاؤه يحصل تلقائيًا على صلاحيات إدارة الموقع.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? "جارٍ التنفيذ..." : mode === "signin" ? "دخول" : "إنشاء الحساب"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 w-full text-sm text-primary hover:underline"
        >
          {mode === "signin" ? "ليس لديك حساب؟ أنشئ حساب المدير" : "لديك حساب بالفعل؟ سجّل الدخول"}
        </button>

        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:underline">
          العودة للموقع
        </Link>
      </div>
    </main>
  );
}
