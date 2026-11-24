import Link from 'next/link'

/**
 * SpinSunny brand mark, from sites/spinsunny.html: a sun with eight rays,
 * SPLIT down the middle — the left half sun-yellow, the right half orange —
 * with a cream hub where the two meet and a crosshair through it. A sun and a
 * roulette wheel at once, which is the name.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. Every stroke is teal ink, so the mark is drawn
 * in the same line the whole page is. The artwork is aria-hidden; the Link's
 * name is its visible text.
 *
 * The wordmark's second half is ORANGE on the cream header (5.06:1 at the
 * deep value) and SUN YELLOW on the ink footer (8.01:1) — the one place this
 * component needs to know which ground it is on, because the deep orange on
 * the footer's ink would be 1.7:1 and the bright orange on the cream header
 * 2.4:1. Neither value can serve both, so each ground gets the one that works
 * on it.
 *
 * `taglineClassName` lets a caller hide the tagline where the header runs out
 * of room, rather than shipping a second, shorter logo.
 */
export default function Logo({
  className = '',
  taglineClassName = '',
  onDark = false,
}: {
  className?: string
  taglineClassName?: string
  onDark?: boolean
}) {
  // The rays and the hub outline: ink on the cream header, and the page cream
  // on the footer's ink, where ink strokes would vanish.
  const line = onDark ? '#fff4e0' : '#0f3b3a'

  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        {/* The eight rays. */}
        <g stroke={line} strokeWidth="2.5" strokeLinecap="round">
          <path d="M24 3v6M24 39v6M3 24h6M39 24h6M9.2 9.2l4.2 4.2M34.6 34.6l4.2 4.2M9.2 38.8l4.2-4.2M34.6 13.4l4.2-4.2" />
        </g>
        {/* The disc: yellow, with the right half painted orange over it. */}
        <circle cx="24" cy="24" r="12" fill="#ffc93c" stroke={line} strokeWidth="2.5" />
        <path d="M24 12a12 12 0 010 24" fill="#ff7a1a" stroke={line} strokeWidth="2.5" />
        {/* The crosshair, and the hub it crosses. */}
        <path d="M24 12v24M12 24h24" stroke={line} strokeWidth="2" />
        <circle cx="24" cy="24" r="3.5" fill="#fffbf2" stroke={line} strokeWidth="2" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className={`font-display text-[24px] sm:text-[27px] ${onDark ? 'text-cream' : 'text-ink'}`}>
          Spin<span className={onDark ? 'text-night-accent' : 'text-brand'}>Sunny</span>
        </span>
        <span className={`mt-[6px] text-[11.5px] font-bold tracking-[0.06em] ${onDark ? 'text-night-faint' : 'text-muted'} ${taglineClassName}`.trim()}>
          Bright casinos, sunny bonuses
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
