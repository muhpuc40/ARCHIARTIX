import { hashString } from "@/lib/utils";

type Tone = "dark" | "light";

/**
 * Generative architectural line-art used wherever a real photo hasn't been
 * uploaded yet. Deterministic per `seed`, on-brand (white/charcoal + yellow
 * construction lines) and never a broken image.
 */
export function PlaceholderArt({
  seed,
  tone = "dark",
  className,
}: {
  seed: string;
  tone?: Tone;
  className?: string;
}) {
  const h = hashString(seed);
  const variant = h % 6;
  const dx = ((h >> 8) % 28) - 14;
  const dy = ((h >> 14) % 24) - 12;
  const id = `art-${h.toString(36)}`;

  const dark = tone === "dark";
  const line = dark ? "rgba(255,255,255,0.62)" : "rgba(27,27,27,0.62)";
  const faint = dark ? "rgba(255,255,255,0.22)" : "rgba(27,27,27,0.2)";
  const accent = "#FADF0B";

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className ?? "h-full w-full"}
      role="presentation"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          {dark ? (
            <>
              <stop offset="0" stopColor="#343434" />
              <stop offset="1" stopColor="#1b1b1b" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#fffde9" />
              <stop offset="1" stopColor="#ffffff" />
            </>
          )}
        </linearGradient>
        <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={faint} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-bg)`} />
      <rect width="400" height="500" fill={`url(#${id}-grid)`} opacity="0.7" />

      <g transform={`translate(${dx} ${dy})`} fill="none" stroke={line} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {variant === 0 && (
          <>
            <rect x="70" y="110" width="260" height="300" strokeWidth="4" />
            <path d="M70 250H190M190 110V190M190 250V330M190 330H330M270 330V410" strokeWidth="3" />
            <path d="M190 250H218M218 250A28 28 0 0 0 190 222" strokeWidth="1.4" />
            <path d="M270 330H298M298 330A28 28 0 0 1 270 358" strokeWidth="1.4" />
            <rect x="88" y="128" width="72" height="92" strokeWidth="1.4" />
            <circle cx="262" cy="190" r="26" strokeWidth="1.4" />
            <rect x="210" y="350" width="46" height="46" strokeWidth="1.4" />
            <path d="M120 110H170M330 160V230M120 410H170" stroke={accent} strokeWidth="7" />
          </>
        )}
        {variant === 1 && (
          <>
            <path d="M40 430H360" strokeWidth="3" />
            <rect x="90" y="160" width="220" height="270" strokeWidth="3.5" />
            <path d="M80 160L200 85L320 160" strokeWidth="3.5" />
            {[0, 1, 2].flatMap((r) =>
              [0, 1, 2].map((c) => (
                <rect key={`${r}${c}`} x={112 + c * 66} y={184 + r * 78} width="46" height="56" strokeWidth="1.5" />
              )),
            )}
            <rect x="177" y="352" width="46" height="78" fill={accent} stroke="none" />
            <path d="M200 85L330 380" stroke={accent} strokeWidth="3" />
          </>
        )}
        {variant === 2 && (
          <>
            {[
              [200, 120, 90, 120],
              [120, 250, 70, 90],
              [290, 270, 60, 70],
            ].map(([cx, cy, w, ht], i) => (
              <g key={i} strokeWidth="2.2">
                <polygon points={`${cx},${cy} ${cx! + w!},${cy! + w! / 2} ${cx},${cy! + w!} ${cx! - w!},${cy! + w! / 2}`} fill={i === 0 ? accent : "none"} fillOpacity={i === 0 ? 0.9 : 0} />
                <polygon points={`${cx! - w!},${cy! + w! / 2} ${cx},${cy! + w!} ${cx},${cy! + w! + ht!} ${cx! - w!},${cy! + w! / 2 + ht!}`} />
                <polygon points={`${cx! + w!},${cy! + w! / 2} ${cx},${cy! + w!} ${cx},${cy! + w! + ht!} ${cx! + w!},${cy! + w! / 2 + ht!}`} />
              </g>
            ))}
          </>
        )}
        {variant === 3 && (
          <>
            <path d="M40 420H360M40 436H360" strokeWidth="2" />
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M${72 + i * 66} 420V235a29 29 0 0 1 58 0V420`}
                strokeWidth={i === 2 ? 3.5 : 2.2}
                fill={i === 2 ? accent : "none"}
                fillOpacity={i === 2 ? 0.85 : 0}
              />
            ))}
            <path d="M60 205H340" strokeWidth="1.5" />
            <path d="M140 150H260L200 100Z" strokeWidth="2.5" />
          </>
        )}
        {variant === 4 && (
          <>
            <circle cx="200" cy="260" r="130" strokeWidth="3.5" />
            <circle cx="200" cy="260" r="92" strokeWidth="1.6" />
            <circle cx="200" cy="260" r="48" strokeWidth="1.6" />
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * Math.PI) / 6;
              return (
                <line
                  key={i}
                  x1={(200 + Math.cos(a) * 48).toFixed(1)}
                  y1={(260 + Math.sin(a) * 48).toFixed(1)}
                  x2={(200 + Math.cos(a) * 130).toFixed(1)}
                  y2={(260 + Math.sin(a) * 130).toFixed(1)}
                  strokeWidth="1"
                />
              );
            })}
            <path d="M200 130A130 130 0 0 1 330 260" stroke={accent} strokeWidth="8" />
            <circle cx="200" cy="260" r="8" fill={accent} stroke="none" />
          </>
        )}
        {variant === 5 && (
          <>
            <path d="M60 410L200 120L340 410Z" strokeWidth="3.5" />
            <path d="M130 265H270M95 338H305M200 120V410" strokeWidth="1.6" />
            <path d="M130 265L200 410L270 265" strokeWidth="1.6" />
            <path d="M218 96L372 412" stroke={accent} strokeWidth="5" />
            <path d="M118 296H284" stroke={accent} strokeWidth="5" />
          </>
        )}
      </g>
    </svg>
  );
}
