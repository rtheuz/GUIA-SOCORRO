import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="mx-4 mb-4 flex items-center gap-3 rounded-lg bg-accent p-3 shadow-sm">
      <Download className="w-5 h-5 text-accent-foreground flex-shrink-0" />
      <p className="flex-1 text-sm font-medium text-accent-foreground">
        Instale o app no seu celular
      </p>
      <button
        onClick={handleInstall}
        className="px-4 py-2 text-sm font-bold rounded-lg bg-accent-foreground text-accent transition-colors active:opacity-80"
      >
        Instalar
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="text-accent-foreground/60 text-xs"
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  );
};

export default InstallBanner;
