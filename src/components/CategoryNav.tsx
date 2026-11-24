import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * SpinSunny category tabs, from sites/spinsunny.html (`.filters` / `.tab`): a
 * wrapping row of 14px-cornered card-cream slots, each carrying its casino
 * count beside the label. The current one FILLS INK and puts its count in sun
 * yellow — the one place in the row where the yellow appears.
 *
 * The resting border is `line-strong`, not the mockup's `--line`: a tab is a
 * CONTROL, and that hairline is 1.30:1 where a control boundary needs 3:1.
 *
 * THE MOCKUP'S COUNTRY SELECT IS NOT HERE. Its filter row opens with an "All
 * Countries" dropdown driven by a hard-coded `geo` field on each casino in its
 * demo data. The API has countries, but nothing scopes a casino LIST by one —
 * /countries/<slug> is its own page with its own rules — so a select here
 * would either do nothing or quietly filter on a field that does not mean what
 * its label says. Removing it also returns the tabs to the full width of the
 * row, which is what lets seven of them wrap onto two lines instead of three.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories" className="mb-7">
      {/* WRAPS rather than scrolling sideways. The mockup's row is
          `flex-wrap`, and with seven categories plus their counts a single
          scrolling line on a phone hides most of the set behind a gesture with
          no affordance saying so. */}
      <ul className="flex flex-wrap gap-2" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id} className="min-w-0">
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`tab flex min-h-12 items-center gap-2.5 whitespace-nowrap px-4 text-[15px] font-bold ${
                  active ? 'tab-on' : 'text-ink'
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
                )}
                <span>{c.name}</span>
                {typeof c.casinos_count === 'number' && (
                  /* The mockup's `.tab .n`: a bare number, not a chip — the
                     active tab turns it sun yellow (8.01:1 on the ink) and the
                     rest leave it in the muted teal (5.64:1 on the cream). */
                  <span className={`tab-count text-[12.5px] font-extrabold tabular-nums ${active ? '' : 'text-muted'}`}>
                    {c.casinos_count}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
