import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * "Browse by bonus type", from sites/spinsunny.html (`.btypes` / `.btype`):
 * ONE outlined block ruled into cells, each cell a row — an icon disc, the
 * type's name over its offer count, and an arrow — which fills SUN YELLOW when
 * you point at it.
 *
 * Rows rather than the siblings' cards, and one block rather than a grid of
 * them, because this design's unit is the OUTLINE: eight separate outlined
 * cards here would put eight more 3px boxes on a page that already has a
 * dozen, where one box ruled into eight reads as a single object — a timetable
 * on the wall of the station.
 *
 * THE RULES ARE DRAWN BY NEGATIVE MARGIN, not by `:nth-child`. The mockup
 * knows it has exactly six and rewrites its border-killing rules at every
 * breakpoint; the API serves however many types this site publishes, so that
 * arithmetic leaves a stray rule down the middle or a hole in the last row the
 * moment the count changes — which is exactly what it did on a sibling. Every
 * cell draws its right and bottom rule unconditionally and the grid is pulled
 * 2px past the container's clip, which comes out right for ANY count at ANY
 * column span. See `.btypes` in globals.css.
 *
 * The three disc tints cycle like the card skies, and ink reads on all three
 * (9.91 / 10.17 / 8.98). There is no per-type colour beyond that rhythm: a
 * type is marked by its place in the block, not by a swatch.
 *
 * This component renders NO HEADING. The section's head — its bar, title and
 * "view all" — is drawn by the page's own `SectionHead`, and a second <h2>
 * carrying the same id as that one is a duplicate id, not a heading.
 *
 * Each row opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  return (
    <div className="btypes">
      <ul className="btypes-grid grid grid-cols-1 min-[46rem]:grid-cols-2 min-[67.5rem]:grid-cols-3" role="list">
        {types.map((section) => (
          <li key={section.id} className="min-w-0">
            <Link
              href={`/bonuses/${section.slug}`}
              className="btype flex h-full items-center gap-4 px-6 py-[22px] text-ink"
            >
              <span aria-hidden className="btype-plate grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full">
                {/* The type's own icon, as in the Bonus menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {section.icon_path && (
                  <img src={resolveImageUrl(section.icon_path)!} alt="" width={26} height={26} className="h-[26px] w-[26px]" />
                )}
              </span>
              <span className="min-w-0">
                <b className="block text-[17px] font-extrabold leading-[1.2] [overflow-wrap:anywhere] sm:text-[18px]">
                  {section.name}
                </b>
                <span className="text-[14px] font-semibold text-muted">
                  {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
                </span>
              </span>
              <span aria-hidden className="ml-auto shrink-0 text-[22px] font-extrabold">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
