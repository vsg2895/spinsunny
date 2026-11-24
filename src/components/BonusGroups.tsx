import Link from 'next/link'
import { COPY } from '@/constants/copy'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's Bonuses — the mockup's `.subh` + `.offers` pairs: one
 * DISPLAY-FACE subhead per bonus type over a grid of that type's postcards.
 *
 * Built in this site's own language rather than the sibling sites' — which is
 * the point, since they all serve the same catalogue and a reader comparing
 * them should not meet the same block four times. The siblings wrap each type
 * in a card with a coloured head; here the type is a plain Shrikhand line and
 * the POSTCARDS carry the colour, which is the arrangement the mockup draws
 * and the reason its stamps cycle three tones.
 *
 * The count sits beside the subhead and the link is pushed to the right edge,
 * with nothing between them — no trailing rule. This page has a striped bar
 * over every section head already, and a second horizontal line four times
 * down one section would read as the page being ruled into a form.
 *
 * Each subhead carries the type's name, this site's own `offers_count` for it,
 * and a link to the type's page. The count is resolved server-side over the
 * unlimited set, so it is the number of offers of this kind on the whole site
 * rather than the number of cards under it.
 *
 * Every type's offers are in the server HTML, and each group keeps the
 * `#bonus-<slug>` anchor the bonus-type rows land on.
 *
 * Each grid is its own `offer-grid`, so the three-tone cycle RESTARTS per
 * type: the colours are rhythm within a run of cards, and a cycle carried
 * across group boundaries would make the first stamp of each group a different
 * colour for no reason a reader could name.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  return (
    <div className="flex flex-col gap-12">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="scroll-mt-28"
        >
          <div className="mb-[18px] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 id={`bonus-${section.slug}-heading`} className="min-w-0 font-display text-[22px] text-ink sm:text-[26px]">
              <span className="[overflow-wrap:anywhere]">{section.name}</span>
              <span className="sr-only">
                {' '}— {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
              </span>
              {/* `font-sans` is load-bearing: this span is INSIDE the h3, so
                  without it the digit inherits Shrikhand — a reverse-contrast
                  display face whose numerals at 14px read as a stray glyph
                  rather than a number. */}
              <span aria-hidden className="ml-2.5 align-middle font-sans text-[14px] font-extrabold text-muted tabular-nums">{section.offers_count}</span>
            </h3>
            <Link
              href={`/bonuses/${section.slug}`}
              className="-my-3 inline-flex min-h-11 items-center py-3 text-[15px] font-extrabold text-sea transition-colors hover:text-brand"
            >
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
          {section.description && <p className="mb-[18px] max-w-[640px] text-[15px] font-medium text-ink-soft">{section.description}</p>}
          <div className={OFFER_GRID}>
            {section.offers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
