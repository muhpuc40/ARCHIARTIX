import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

export const projectHref = (p: Pick<Project, "slug" | "category">) =>
  p.category?.slug ? `/projects/${p.category.slug}/${p.slug}` : "/projects";

export function ProjectCard({
  project,
  priority,
  className,
  aspect = "aspect-[4/5]",
}: {
  project: Project;
  priority?: boolean;
  className?: string;
  aspect?: string;
}) {
  return (
    <Link
      href={projectHref(project)}
      className={cn(
        "group relative block overflow-hidden bg-ink",
        aspect,
        className,
      )}>
      <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]">
        <SmartImage
          src={project.cover_image_url}
          alt={`${project.title} — ${project.category?.name ?? "project"} by ARCHIARTIX`}
          seed={project.slug}
          priority={priority}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
        {project.category && (
          <span className="bg-brand-yellow px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
            {project.category.name}
          </span>
        )}
        <span className="grid h-11 w-11 -translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:bg-brand-yellow group-hover:opacity-100">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-serif text-2xl leading-tight">{project.title}</h3>
        <div className="mt-2 flex items-center gap-4 text-xs text-white/70">
          {project.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} className="text-brand-yellow" />{" "}
              {project.location}
            </span>
          )}
          {project.year && <span>{project.year}</span>}
        </div>
        <span
          className="mt-4 block h-0.5 w-0 bg-brand-yellow transition-all duration-500 group-hover:w-full"
          aria-hidden
        />
      </div>
    </Link>
  );
}
