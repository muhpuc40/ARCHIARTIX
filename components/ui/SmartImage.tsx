import Image from "next/image";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";
import { cn } from "@/lib/utils";

/**
 * Renders the real photo when one exists, otherwise on-brand generative art.
 * The parent must be `relative` with a fixed aspect ratio / height.
 */
export function SmartImage({
  src,
  alt,
  seed,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
  priority,
  tone = "dark",
}: {
  src?: string | null;
  alt: string;
  seed: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  tone?: "dark" | "light";
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }
  return <PlaceholderArt seed={seed} tone={tone} className={cn("h-full w-full", className)} />;
}
