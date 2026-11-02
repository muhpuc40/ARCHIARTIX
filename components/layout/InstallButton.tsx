"use client";

import { Download } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** "Install App" — uses the browser's PWA install prompt when it is available. */
export function InstallButton({ className }: { className?: string }) {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const toast = useToast();

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      deferred.current = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function install() {
    const evt = deferred.current;
    if (evt) {
      await evt.prompt();
      const { outcome } = await evt.userChoice;
      if (outcome === "accepted") toast({ title: "ARCHIARTIX installed", tone: "success" });
      deferred.current = null;
      return;
    }
    if (window.matchMedia("(display-mode: standalone)").matches) {
      toast({ title: "Already installed", description: "You're using the ARCHIARTIX app." });
      return;
    }
    toast({
      title: "Install ARCHIARTIX",
      description: "Open your browser menu and choose “Add to Home Screen” (iPhone: Share → Add to Home Screen).",
    });
  }

  return (
    <Button variant="outline-light" size="md" onClick={install} className={className}>
      <Download size={16} /> Install App
    </Button>
  );
}
