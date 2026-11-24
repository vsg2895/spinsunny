import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/**
 * The grid offer cards sit in — the mockup's `.offers`:
 * `minmax(min(100%,320px),1fr)`.
 *
 * `offer-grid` is what drives the three-tone cycle on the stamps
 * (globals.css). A CSS `:nth-child` cycle is right HERE and wrong on the bonus
 * types: a stamp's colour is rhythm and carries no meaning, so repainting when
 * the set changes costs nothing.
 */
export const OFFER_GRID = 'offer-grid grid grid-cols-1 gap-[22px] sm:grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))]'

/** The sun mark that sits on every stamp — the mockup's `sunIc`. */
function StampSun() {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true" focusable="false">
      <g stroke="#0f3b3a" strokeWidth="2.2" strokeLinecap="round">
        <path d="M20 4v5M20 31v5M4 20h5M31 20h5M8.7 8.7l3.5 3.5M27.8 27.8l3.5 3.5M8.7 31.3l3.5-3.5M27.8 12.2l3.5-3.5" />
      </g>
      <circle cx="20" cy="20" r="8" fill="#fffbf2" stroke="#0f3b3a" strokeWidth="2.2" />
    </svg>
  )
}

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * An offer card for the listing grids — `.offer` in sites/spinsunny.html: a
 * POSTCARD. An outlined card split by a dashed fold, the terms written on the
 * left and a perforated STAMP franked into the right-hand edge, carrying the
 * site's own sun mark.
 *
 * It TILTS a degree and lifts onto a hard ink drop when pointed at — a card
 * being picked up off a table. It is the only rotation on the site, which is
 * what keeps it from reading as a tic.
 *
 * The stamp's three tones cycle by position — see OFFER_GRID. All three carry
 * nothing but the sun mark, whose ink strokes are 8.01:1 on the yellow, 4.72:1
 * on the orange and 3.22:1 on the coral: over the 3:1 a graphic needs on all
 * three, which is exactly why no word is ever set on the coral.
 *
 * `logo` is ACCEPTED AND UNUSED, on purpose. A casino page passes its own
 * logo down because the offers it lists arrive without their casino attached,
 * and every sibling's card paints that mark somewhere. This one does not: the
 * mockup's postcard carries a franked stamp where a logo would go, and the
 * operator is named in words above the amount instead. The prop stays in the
 * signature so a caller written against any site in the network still
 * compiles, and it is not destructured so nothing reads a value this card has
 * no place to put.
 */
export default function SpecialOfferCard({ offer }: { offer: SpecialOffer; logo?: string | null }) {
  const casinoName = offer.casino?.name ?? ''
  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    /* The fold runs vertically down the card and lies DOWN below 26rem: at
       320px the stamp column takes a third of the width and leaves the terms
       in a gutter, so the stamp drops under them and the dashed fold becomes
       the horizontal one a postcard actually has. */
    <article className="offer relative grid grid-cols-1 overflow-hidden rounded-[20px] min-[26rem]:grid-cols-[minmax(0,1fr)_auto]">
      <div className="offer-fold flex flex-col gap-2 border-b-2 border-r-0 border-dashed border-line p-[22px] min-[26rem]:border-b-0 min-[26rem]:border-r-2">
        <span className="text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-sea [overflow-wrap:anywhere]">
          {casinoName || offer.bonus_category_name || 'Bonus'}
        </span>
        <h3 className="font-display text-[22px] leading-[1.12] text-ink [overflow-wrap:anywhere] sm:text-[24px]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.bonuses || offer.title}
          </Link>
        </h3>
        {/* When the headline above is the AMOUNT, the offer's own name still
            has to appear somewhere — otherwise two different offers of the
            same size are indistinguishable in a grid. */}
        {offer.bonuses && <p className="text-[14.5px] font-semibold text-ink-soft [overflow-wrap:anywhere]">{offer.title}</p>}
        <span
          className="mt-0.5 text-[15px] leading-none tracking-[2px] text-gold"
          role="img"
          aria-label={`${offer.rating} out of 5`}
        >
          {'★'.repeat(offer.rating)}
          <span className="text-line" aria-hidden>
            {'★'.repeat(5 - offer.rating)}
          </span>
        </span>
      </div>

      {/* The stamp column — the mockup's `.o-side`: the frank above the way
          in. A row rather than a column below 26rem, where it sits under the
          terms instead of beside them. */}
      <div className="relative z-10 flex items-center justify-between gap-3 p-3.5 min-[26rem]:w-[108px] min-[26rem]:flex-col min-[26rem]:justify-between min-[26rem]:px-3.5 min-[26rem]:py-4">
        <span aria-hidden className="pstamp block h-[88px] w-[76px] flex-none p-1.5">
          <span className="grid h-full w-full place-items-center">
            <StampSun />
          </span>
        </span>
        {/*
          * Claim belongs to the Special Offers bonus type and to nothing else.
          *
          *   Special Offers + link   →  Claim → the casino
          *   Special Offers, NO link →  Claim, leading to the offer's own page,
          *                              where the terms and the operator are.
          *   any other bonus type    →  "See offer", the plain way in.
          */}
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-11 whitespace-nowrap px-3.5 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-11 whitespace-nowrap px-3.5 text-sm">Claim</Link>
          )
        ) : (
          <Link href={`/special-offers/${offer.slug}`} className="inline-flex min-h-11 items-center whitespace-nowrap text-[14.5px] font-bold text-sea transition-colors hover:text-brand">
            See offer <span aria-hidden className="ml-1">→</span>
          </Link>
        )}
      </div>
    </article>
  )
}

/**
 * An offer as a row inside a group card: the logo, whose offer it is, its name
 * and amount, and on the right the way in. The whole row opens the offer (the
 * title link is stretched over it) and takes the deeper cream on hover.
 *
 * The SAME Claim rule as the card: Claim only for the Special Offers type —
 * to the casino when the offer has a link, to its own page when it has none.
 * Any other type shows "Details →".
 *
 * `heading` is the title's level: `h4` under a group card's `h3` (the home
 * page), `h3` where the rows sit straight under a section's `h2`.
 */
export function OfferRow({ offer, logo: logoOverride, heading: Heading = 'h4' }: { offer: SpecialOffer; logo?: string | null; heading?: 'h3' | 'h4' }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const kicker = offer.casino?.name ?? offer.bonus_category_name ?? ''

  return (
    <li className="of relative grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2.5 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5">
      {/* The plate stays WHITE: operator logos arrive with their own white
          ground baked in, and any other fill behind one shows as a hard
          rectangle inside the circle. */}
      <span aria-hidden className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-white p-1.5 text-xs font-extrabold text-ink">
        {logo ? (
          <Image src={logo} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />
        ) : (
          initials(kicker || offer.title)
        )}
      </span>
      <div className="min-w-0">
        {kicker && <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-sea">{kicker}</p>}
        <Heading className="text-[15px] font-bold leading-[1.3] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </Heading>
        {offer.bonuses && <p className="text-sm font-extrabold text-brand [overflow-wrap:anywhere]">{offer.bonuses}</p>}
      </div>
      <div className="relative z-10 col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-11 px-4 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-11 px-4 text-sm">Claim</Link>
          )
        ) : (
          <span aria-hidden className="text-[13px] font-extrabold text-sea">Details →</span>
        )}
      </div>
    </li>
  )
}
