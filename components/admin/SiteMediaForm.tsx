"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";

type Settings = { tour3d_url: string; video_url: string };

export function SiteMediaForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<Settings>(initial);
  const [saving, setSaving] = useState(false);
  const set = (key: keyof Settings) => (v: string) => setValues((s) => ({ ...s, [key]: v }));

  async function save() {
    setSaving(true);
    const res = await fetch("/api/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      toast({ title: "Couldn’t save", description: json.error, tone: "error" });
      return;
    }
    toast({ title: "Landing media saved", description: "The home page updates within a minute.", tone: "success" });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4 border border-line bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em]">3D view (default)</h2>
        <MediaUploader
          folder="models"
          kind="model"
          max={1}
          value={values.tour3d_url.toLowerCase().includes(".glb") ? [values.tour3d_url] : []}
          onChange={(urls) => set("tour3d_url")(urls[0] ?? "")}
        />
        <Field label="…or paste a link instead" htmlFor="s-3d" hint="A hosted .glb, or an embed link (Sketchfab, Matterport, Kuula…). Uploading a file above fills this in.">
          <Input id="s-3d" placeholder="https://…" value={values.tour3d_url} onChange={(e) => set("tour3d_url")(e.target.value)} />
        </Field>
      </section>

      <section className="space-y-4 border border-line bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Video (second tab)</h2>
        <MediaUploader
          folder="site"
          kind="video"
          max={1}
          value={/\.(mp4|webm|mov)(\?|$)/i.test(values.video_url) ? [values.video_url] : []}
          onChange={(urls) => set("video_url")(urls[0] ?? "")}
        />
        <Field label="…or paste a link instead" htmlFor="s-video" hint="A Cloudinary mp4 or a YouTube / Vimeo link.">
          <Input id="s-video" placeholder="https://…" value={values.video_url} onChange={(e) => set("video_url")(e.target.value)} />
        </Field>
      </section>

      <div className="flex items-center gap-4">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save changes"}
        </Button>
        <p className="text-xs text-neutral-500">Clear a field and save to remove it. Empty fields fall back to the values in .env.local.</p>
      </div>
    </div>
  );
}
