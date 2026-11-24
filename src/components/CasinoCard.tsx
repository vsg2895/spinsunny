import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many region chips a card shows before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

/**
 * Exported so the home page's picks list shows the same stars as a card.
 *
 * The gold is `--color-gold` #B84A00, deeper than the mockup's #FF7A1A, which
 * is 2.53:1 on a card — a filled star and an empty one would read as the same
 * shape at the same weight, which is the only thing a star rating has to do.
 * The exact figure is printed beside the stars everywhere they appear, so the
 * colour is never the only carrier.
 */
export function Stars({ rating, onDark = false }: { rating: number; onDark?: boolean }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 16px reads as a rendering fault.
  const filled = Math.round(rating)
  const on = onDark ? 'text-night-accent' : 'text-gold'
  const off = onDark ? 'text-night-line' : 'text-line'

  return (
    <span
      className="inline-flex items-center tracking-[2px] text-[16px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? on : off} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The grid the cards sit in — the mockup's `.list`: THREE across on a wide
 * screen, two on a tablet, one on a phone. Callers render
 * `<ol className={CASINO_LIST}>`; the order of the list is the ranking.
 *
 * `casino-list` is what drives the three-tone cycle on the cards' sky bands
 * (globals.css). It is on the LIST rather than inside the card because
 * `:nth-child` can only be written where the siblings are.
 */
export const CASINO_LIST = 'casino-list grid grid-cols-1 gap-[22px] min-[42.5rem]:grid-cols-2 min-[67.5rem]:grid-cols-3'

/**
 * A casino as a CARD — `.cc` in sites/spinsunny.html: an outlined slab opening
 * on a coloured SKY band, with the logo under a striped ARCH standing on that
 * band's rule, then the name and score, the welcome bonus, the regions, and
 * the two actions.
 *
 * The arch is the mockup's own device and the reason the card reads as a
 * seaside poster rather than a listing row: a bandstand, or a beach hut, cut
 * from the same three stripes as the sun in the hero.
 *
 * The card LIFTS when pointed at (4px, plus an 8px hard ink drop) where every
 * button on the page PRESSES DOWN. That inversion is deliberate and it is how
 * a reader tells the card from the controls inside it — see globals.css.
 *
 * `rank` only decides the "Top pick" badge; it is never printed as a numeral.
 * A "1" on a card invites reading it as a score, and the list order already is
 * the ranking. The rule the siblings follow holds.
 *
 * The mockup's "Min. deposit" and "Avg. payout time" pair is NOT shipped: no
 * column in the API holds either, and a payout time is the one figure this
 * site has promised not to invent. The row carries `countries`, which is real.
 */
export default function CasinoCard({
  casino,
  rank,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length
  const isLeader = rank === 1

  return (
    <li className="rw flex flex-col overflow-hidden rounded-[26px]">
      {/* The sky band. Its tint cycles across the grid — see CASINO_LIST. */}
      <div className="cc-sky relative flex h-[150px] items-end justify-center overflow-hidden">
        {isLeader && (
          <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-ink px-3 py-[5px] text-[12px] font-extrabold uppercase tracking-[0.08em] text-accent">
            {COPY.casinos.topPick}
          </span>
        )}
        {/* The arch, standing on the band's bottom rule. */}
        <div className="arch grid h-[120px] w-[200px] max-w-full place-items-center px-5 pt-6">
          {/* The plate. A FIXED height at every breakpoint, never `auto`:
              operator artwork ranges from square to wide banner, and an auto
              box sizes itself to whichever it happens to get.
              `object-contain` letterboxes a wide banner rather than cropping
              it. The plate is WHITE because operator logos arrive with their
              own white ground baked into the file — see `.plate`. */}
          <span className="plate grid h-[70px] w-full place-items-center overflow-hidden rounded-[14px] p-1.5 text-center">
            {image ? (
              <Image src={image} alt={`${casino.name} logo`} width={320} height={160} sizes="160px" className="max-h-[56px] w-full object-contain" />
            ) : (
              <span className="font-display text-[15px] leading-[1.05] text-ink [overflow-wrap:anywhere]">{casino.name}</span>
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 px-[22px] pb-[22px] pt-5">
        <div className="flex items-center justify-between gap-2.5">
          <h3 className="font-display text-[23px] text-ink [overflow-wrap:anywhere] sm:text-[26px]">{casino.name}</h3>
          {/* The score chip — the mockup's `.score`: sun yellow under the ink
              outline, at 8.01:1. */}
          <span className="flex-none rounded-[10px] border-2 border-ink bg-accent px-2.5 py-[3px] text-[14px] font-extrabold text-ink tabular-nums">
            {casino.rating.toFixed(1)}
          </span>
        </div>

        <Stars rating={casino.rating} />

        {/* The welcome bonus. Dropped entirely when the operator has none,
            rather than left as an empty line. */}
        {casino.bonuses && (
          <p className="text-[18px] font-extrabold leading-[1.3] text-ink [overflow-wrap:anywhere]">
            <small className="mb-[3px] block text-[12px] font-extrabold uppercase tracking-[0.1em] text-sea">Welcome bonus</small>
            {casino.bonuses}
          </p>
        )}

        {shownRegions.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Accepts players from">
            {shownRegions.map((country) => (
              <li key={country.id} className="rounded-full bg-sky px-[11px] py-1 text-[12.5px] font-bold text-ink">
                {country.name}
              </li>
            ))}
            {extraRegions > 0 && (
              /* A count, not a tooltip: the full list is on the review page,
                 and a hover affordance is invisible on a phone. */
              <li className="rounded-full bg-surface px-[11px] py-1 text-[12.5px] font-bold text-ink-soft">+{extraRegions} more</li>
            )}
          </ul>
        )}

        {/* The mockup's `.cc-act`: the operator button over a plain centred
            link, stacked rather than side by side. On a three-up grid a
            column is about 340px, and two buttons in it leave each one too
            narrow to read its own label. */}
        <div className="mt-auto grid gap-2.5 pt-1">
          <a
            href={casino.attachment.affiliate_url}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="btn-or min-h-12 w-full px-5 text-[15px]"
          >
            {COPY.casinos.visitCasino}
          </a>
          <Link href={`/casinos/${casino.slug}`} className="inline-flex min-h-11 items-center justify-center text-center text-[15px] font-bold text-sea transition-colors hover:text-brand">
            {COPY.casinos.readReview} <span aria-hidden className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </li>
  )
}
