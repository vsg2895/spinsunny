import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST, Stars } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

/**
 * The three picks coins, in order — the mockup's `.t3n` and its two
 * `:nth-child` overrides.
 *
 * Sun, bright orange, SEA. The mockup's third is CORAL, and it is the one
 * colour on this page that cannot carry a word: ink on #E9484F is 3.22:1, over
 * the 3:1 a graphic needs and under the 4.5 a numeral needs. Coral keeps every
 * other place it appears — the third stripe of the sun, the third stamp, the
 * footer band, the 18+ ring — because none of those puts text on it.
 *
 * An array rather than CSS `:nth-child`, because this list is exactly three
 * long and these are POSITIONS, not a repeating rhythm: `:nth-child` would
 * keep cycling if the slice ever grew, and the fourth colour it reached for
 * does not exist.
 */
const PODIUM_COIN = ['bg-accent text-ink', 'bg-orange text-ink', 'bg-sea text-cream'] as const

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero — the mockup's opening: the MINT SKY, the claim at the left
            with one phrase outlined in orange, and at the right the striped
            SUN setting behind the picks card.

            The card and the sun both end flush on the hero's bottom rule and
            the card has no bottom border of its own, so it reads as rising out
            of the horizon rather than sitting on it. That is why the section
            carries no bottom padding and the left column carries all of it:
            anything under the grid would push the card off the rule it is
            standing on. */}
        <section className="slab relative overflow-hidden pt-11 sm:pt-[72px]">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <div className="grid grid-cols-1 items-end gap-0 min-[56.25rem]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[56.25rem]:gap-10">
              <div className="pb-11 min-[56.25rem]:pb-20">
                {/* The mockup's `.stamp`: a card-cream pill under the ink
                    outline, carrying the live dot. ORANGE on the dot, which is
                    the mockup's own — a dot is a graphic, and the bright
                    orange is 4.72:1 against the pill it sits on. */}
                <p className="live inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3.5 py-1.5 text-[13.5px] font-extrabold uppercase tracking-[0.06em] text-ink [&::before]:bg-orange">
                  {COPY.home.heroEyebrow}
                </p>
                <h1 className="mt-[22px] font-display text-[clamp(40px,6.8vw,88px)] text-pretty text-ink">
                  {COPY.home.heroHeadline}{' '}
                  {/* The outlined phrase. See `.outline-word` in globals.css
                      for why the colour cannot be applied without the stroke. */}
                  <span className="outline-word">{COPY.home.heroHighlight}</span>
                  {COPY.home.heroHeadlineTail && <> {COPY.home.heroHeadlineTail}</>}
                </h1>
                <p className="mt-[22px] max-w-[540px] text-[17px] font-medium text-ink-soft sm:text-[19.5px]">{COPY.home.heroSubtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3.5">
                  <Link href="/casinos" className="btn-or min-h-[54px] px-7 text-[16px]">
                    {COPY.home.featuredCasinos}
                  </Link>
                  {anyOffersVisible && (
                    <Link href="/special-offers" className="btn-ln min-h-[54px] px-7 text-[16px]">
                      {COPY.home.specialOffers}
                    </Link>
                  )}
                </div>
              </div>

              {/* The sun and the picks card — the mockup's `.sunwrap`. The sun
                  is a striped disc with horizontal slits cut through its lower
                  half (`.sunburst`), set one pixel below the hero's rule so no
                  seam shows where the mask ends.

                  The card's rows print a rating where the mockup prints a MIN.
                  DEPOSIT and a PAYOUT TIME. Neither ships: no column in the
                  API holds either, and a payout time is the one figure this
                  site has promised not to invent. */}
              <div className="relative flex min-h-[380px] items-end justify-center min-[56.25rem]:min-h-[440px]">
                {/* 130%, NOT 100%, of its column.
                    On a wide screen `min()` picks the 520px and the sun
                    stands 60px proud of the 400px card either side — the
                    proportion the mockup draws. Stacked on a phone the column
                    is the content width and BOTH resolved to it, so the sun
                    came out exactly as wide as the card and shorter than it,
                    and the one device this hero is built on was completely
                    hidden behind the card. 130% restores the same proportion
                    at every width; the section clips it, so nothing scrolls
                    sideways. */}
                <div aria-hidden className="sunburst absolute -bottom-px left-1/2 aspect-square w-[min(520px,130%)] -translate-x-1/2" />
                {casinos.length >= 3 && (
                  <aside className="hard-gold relative w-[min(400px,100%)] px-[22px] pb-0 pt-[22px]" aria-labelledby="podium-heading">
                    <span className="live mb-2.5 inline-flex items-center gap-2 text-[12.5px] font-extrabold uppercase tracking-[0.08em] text-sea">
                      {COPY.home.podiumBadge}
                    </span>
                    <h2 id="podium-heading" className="font-display text-[24px] text-ink">
                      {COPY.home.podiumTitle}
                    </h2>
                    <p className="mt-1.5 text-[13.5px] font-semibold text-muted">{COPY.home.podiumSubtitle}</p>

                    <ol className="mt-3">
                      {casinos.slice(0, 3).map((c, i) => (
                        <li key={c.id}>
                          {/* The mockup's `.t3`: a dashed rule, a struck coin,
                              the name over its rating, and the figure on a
                              mint chip at the right. */}
                          <Link href={`/casinos/${c.slug}`} className="group grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 border-t-2 border-dashed border-line py-3 text-ink">
                            {/* The coin. Sun, orange, SEA — not the mockup's
                                sun/orange/coral: ink on coral is 3.22:1, fine
                                for a graphic and under the 4.5 this numeral
                                needs. Coral keeps every place on the page
                                where it carries no word. */}
                            <span aria-hidden className={`grid h-10 w-10 place-items-center rounded-xl border-2 border-ink font-display text-[18px] ${PODIUM_COIN[i]}`}>
                              {i + 1}
                            </span>
                            <span className="min-w-0">
                              {/* WRAPS rather than truncating: at 320px this
                                  column has about 150px, and a list of picks
                                  whose names are cut off identifies nothing. */}
                              <b className="block text-[17px] font-extrabold leading-[1.2] text-ink [overflow-wrap:anywhere] transition-colors group-hover:text-brand">{c.name}</b>
                              <span className="mt-0.5 flex items-center gap-2">
                                <Stars rating={c.rating} />
                              </span>
                            </span>
                            <span className="flex-none rounded-lg bg-sky px-2.5 py-[5px] text-[13px] font-extrabold text-ink tabular-nums">
                              <span className="sr-only">{COPY.home.podiumRatingLabel} </span>{c.rating.toFixed(1)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>

                    {/* The card's own way out, as a fourth dashed row rather
                        than a button: the card has no bottom border — it opens
                        onto the hero's rule — so a button inside it would have
                        nothing to sit on. */}
                    <Link href="/casinos" className="flex min-h-12 items-center justify-center border-t-2 border-dashed border-line text-[14.5px] font-extrabold text-sea transition-colors hover:text-brand">
                      {COPY.home.podiumAll} <span aria-hidden className="ml-1">→</span>
                    </Link>
                  </aside>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 1 — the rankings. Category tabs, then the casinos as cards. */}
        <section className="pt-16 sm:pt-[92px]" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <SectionHead
              id="top-casinos-heading"
              title={COPY.home.topCasinosTitle}
              subtitle={COPY.home.topCasinosSubtitle}
              more={casinos.length > 0 ? { href: '/casinos', label: COPY.home.viewAll, sr: ' casinos' } : undefined}
            />

            {categories.length > 0 && selected && (
              <CategoryNav categories={categories} selected={selected} />
            )}

            {casinos.length === 0 ? (
              /* The mockup's `.empty`: a dashed box in the hairline tan,
                 which is decoration around a sentence rather than a boundary
                 anything depends on — so it stays at the mockup's own value
                 while the tabs above it take `line-strong`. */
              <p className="rounded-[26px] border-[3px] border-dashed border-line p-11 text-center text-[16px] font-semibold text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={CASINO_LIST}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-7 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-ln min-h-[54px] px-7 text-[16px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 2 — the bonus types, as arched cards. Nothing at all without a
            Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pt-16 sm:pt-[92px]" aria-labelledby="bonus-types-heading">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
              <SectionHead id="bonus-types-heading" title={COPY.home.bonusTypesTitle} />
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* 3 — the offers, as fortune slips under a serif subhead per type. */}
        {bonusSections.length > 0 ? (
          <section className="pt-16 sm:pt-[92px]" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
              <SectionHead
                id="bonus-heading"
                title={COPY.home.bonus}
                subtitle={COPY.home.bonusesSubtitle}
                more={{ href: '/special-offers', label: COPY.home.seeAllBonuses, sr: '' }}
              />
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="pt-16 sm:pt-[92px]" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
              <SectionHead
                id="offers-heading"
                title={COPY.home.specialOffers}
                more={{ href: '/special-offers', label: COPY.home.viewAll, sr: ' special offers' }}
              />
              <div className={OFFER_GRID}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4 — how a casino earns its place. Not in the mockup, which ends at
            the FAQ; kept because it is the page's only account of where the
            ranking comes from, and an affiliate site that ranks operators
            without publishing its method is asking to be taken on trust. */}
        <section className="pt-16 sm:pt-[92px]" aria-labelledby="method-heading">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <SectionHead id="method-heading" title={COPY.home.methodTitle} subtitle={COPY.home.methodSubtitle} />
            <ol className="grid grid-cols-1 gap-[22px] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
              {COPY.home.methodSteps.map((step, i) => (
                <li key={step.no} className="step rounded-[26px] p-[26px]">
                  <p className="flex items-center gap-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-sea">
                    {/* The same three coins as the picks card, and the same
                        reason the third is sea rather than coral. */}
                    <span aria-hidden className={`grid h-11 w-11 place-items-center rounded-xl border-2 border-ink font-display text-[18px] ${PODIUM_COIN[i % PODIUM_COIN.length]}`}>
                      {step.no.replace(/^0/, '')}
                    </span>
                    {step.verb}
                  </p>
                  <h3 className="mt-[18px] font-display text-[21px] text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-[15.5px] font-medium text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex items-center gap-3 text-[14.5px] font-semibold text-muted">
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
              </svg>
              <span>{COPY.home.methodLoop}</span>
            </p>
          </div>
        </section>

        {/* 5 — the FAQ, two across as the mockup lays it out. Every answer is
            in the HTML, open or closed, which the FAQPage schema requires. */}
        <section className="pt-16 sm:pt-[92px]" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <SectionHead id="faq-heading" title={COPY.home.faqTitle} subtitle={COPY.home.faqSubtitle} />
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
    </>
  )
}

/**
 * The mockup's `.sec-head`: the striped BAR over the heading and its line,
 * with an optional link to the full list pushed to the right edge and aligned
 * on the heading's baseline.
 *
 * The bar is the brand's three stripes shrunk to 84x12 under a 2px ink
 * outline — the same gradient as the sun in the hero and the arch on every
 * casino card, which is what ties six unrelated sections into one page. It is
 * the whole mark here: this design numbers nothing, because the sections are
 * not a sequence and numbering a set that is not ordered is decoration.
 *
 * A local component rather than one in components/: every site in the network
 * heads its sections differently, and this shape is this design's own. Nothing
 * else renders it, so it lives where it is used.
 */
function SectionHead({
  id,
  title,
  subtitle,
  more,
}: {
  id: string
  title: string
  subtitle?: string
  more?: { href: string; label: string; sr: string }
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5 sm:mb-[30px]">
      <div className="min-w-0">
        <span aria-hidden className="bar mb-4" />
        <h2 id={id} className="font-display text-[32px] text-ink sm:text-[clamp(34px,4.6vw,56px)]">
          {title}
        </h2>
        {subtitle && <p className="mt-2.5 max-w-[640px] text-[17px] font-medium text-ink-soft">{subtitle}</p>}
      </div>
      {more && (
        <Link href={more.href} className="inline-flex min-h-11 items-center text-[15.5px] font-extrabold text-sea transition-colors hover:text-brand">
          {more.label}{more.sr && <span className="sr-only">{more.sr}</span>} <span aria-hidden className="ml-1">→</span>
        </Link>
      )}
    </div>
  )
}
