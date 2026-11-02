import { WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink, WHATSAPP_GREETING } from "@/lib/site";

/** Floating WhatsApp shortcut — bottom-left on every public page. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(WHATSAPP_GREETING)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ARCHIARTIX on WhatsApp"
      className="group fixed bottom-5 left-5 z-40 flex items-center gap-0 sm:bottom-6 sm:left-6"
    >
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" aria-hidden />
        <WhatsAppIcon size={28} className="relative" />
      </span>
      <span className="ml-3 hidden max-w-0 overflow-hidden whitespace-nowrap bg-ink px-0 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white opacity-0 shadow-lg transition-all duration-300 group-hover:max-w-[200px] group-hover:px-4 group-hover:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
