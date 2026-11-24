import type { Metadata, Viewport } from 'next'
import { Shrikhand, Karla } from 'next/font/google'
import Link from 'next/link'
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate'
import NewsletterForm from '@/components/NewsletterForm'
import SocialIcons from '@/components/SocialIcons'
import CookieConsent from '@/components/CookieConsent'
import ToastProvider from '@/components/ToastProvider'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import Logo from '@/components/Logo'
import { getSocialLinks, hasSpecialOffers, getCategories, getBonusArea } from '@/lib/api'
import { buildOrganizationSchema, buildWebSiteSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { SITE_URL } from '@/lib/config'
import { COPY } from '@/constants/copy'
import NavDropdown from '@/components/NavDropdown'
import FooterNavGroup from '@/components/FooterNavGroup'
import MobileNav from '@/components/MobileNav'
import { resolveImageUrl } from '@/lib/images'
import { LEGAL_PAGES } from '@/constants/legalPages'
import type { SocialLink } from '@shared/types/socialLink'
import './globals.css'

// The two faces of sites/spinsunny.html.
//
// Shrikhand ships exactly ONE weight, 400, and that is why it is here: it is a
// fat reverse-contrast display face, and a synthetic bold closes its counters
// into blobs. `.font-display` pins the weight, so no caller can ask for one
// the family does not have.
//
// Karla carries everything read as text, and goes up to 800 — which this
// design needs, because every button label and every eyebrow on the page is
// set at it. 800 on a poster-weight headline is the mockup's own pairing.
const shrikhand = Shrikhand({ variable: '--font-shrikhand', subsets: ['latin'], weight: ['400'] })
const karla = Karla({ variable: '--font-karla', subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })

/**
 * Subscribe capture: every entry point on this site — the newsletter form and,
 * where the site has one, the timed subscribe modal.
 *
 * The components, the /api/newsletter route and the backend double-opt-in flow
 * are never touched by this; it only decides whether they are rendered. That is
 * the point of a flag rather than deleted markup: turning capture off and back
 * on is one edit, and nothing has to be rebuilt from memory.
 */
const SUBSCRIBE_ENABLED = true

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'SpinSunny'

// Both strings live in COPY so this site's wording is defined in exactly one
// place — the same place the page-level titles and descriptions come from.
// The previous SITE_DESCRIPTION here was byte-identical to a sibling domain's,
// which made this site's default meta/og/twitter description duplicate content
// on every page that falls back to it.
const SITE_TITLE = `${SITE_NAME} — ${COPY.site.titleTail}`
const SITE_DESCRIPTION = `${SITE_NAME} ${COPY.site.description}`

export const metadata: Metadata = {
  // THE origin every relative canonical and og:url in the app resolves
  // against. `SITE_URL` is validated at module load (see lib/config), so the
  // old `|| 'https://…'` literal is gone: a second hardcoded host here is
  // exactly how the canonical and the sitemap drifted onto different hosts.
  metadataBase: new URL(SITE_URL),
  // Root default. Every page overrides it with its own path, so each URL
  // gets a SELF-referencing canonical rather than inheriting the homepage's.
  alternates: { canonical: '/' },
  title: {
    // Home & inner pages set their own; this is the SEO-friendly fallback title.
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Terms that describe what THIS site publishes. The generic set that was
  // here was shared with a sibling domain and described neither in particular.
  keywords: [...COPY.site.keywords, SITE_NAME],
  // Tab icon.
  //
  // This used to offer ONLY icon.svg. Browsers that do not take an SVG favicon
  // — Safari most visibly — then had nothing to fall back to, because
  // /favicon.ico 404'd, so they showed a placeholder or a stale cached icon
  // instead of this site's own mark. app/favicon.ico now holds 16/32/48 rasters
  // cut from that same artwork, and Next links it automatically from the file
  // convention, so it is deliberately NOT repeated here.
  //
  // `apple` DOES have to be listed: an explicit icons object suppresses the
  // apple-icon file convention, so app/apple-icon.tsx was generating a 180x180
  // PNG at /apple-icon that no page ever linked to.
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Relative on purpose: Next resolves it against metadataBase, so og:url
    // and the canonical can never disagree about the host.
    url: '/',
    images: SHARE_IMAGES,
  },
  // The card TYPE only. A title and description here were inherited by every
  // page that does not set `twitter` itself — nearly all of them — so a shared
  // /casinos or /about went out on X under the HOME page's title. With these
  // tags absent, X reads the page's own og:title, og:description and og:image.
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Search-engine ownership verification, supplied per environment. Absent env
  // vars simply produce no tag, so nothing has to be committed to the repo.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION
        ? { 'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION }
        : {}),
    },
  },
}

/**
 * Viewport + theme colour.
 *
 * Next 14 moved these out of `metadata` into their own export; leaving
 * themeColor in `metadata` is silently ignored, which is why the sites had no
 * theme-color at all. `viewport-fit=cover` is deliberately omitted — nothing
 * here draws into the notch area.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fff4e0',
}

const NAV_LINKS = [
  { href: '/casinos', label: COPY.nav.casinos },
  { href: '/special-offers', label: COPY.nav.specialOffers },
  { href: '/categories', label: COPY.nav.categories },
]

/** A header link — the mockup's `.hdr .nav a`: a 12px-cornered slot that
 *  grows an INK OUTLINE and fills SUN YELLOW on hover. The border is there at
 *  rest in `transparent`, so taking the colour shifts nothing. */
const NAV_LINK = 'flex min-h-11 items-center whitespace-nowrap rounded-xl border-2 border-transparent px-4 py-2 text-[15.5px] font-bold text-ink transition-colors hover:border-ink hover:bg-accent hover:text-ink'

const FOOTER_LINK = 'inline-flex min-h-11 min-w-11 items-center text-[15px] font-medium text-night-ink transition-colors hover:text-night-accent'

/** A footer column head — the mockup's `.ftr h4`: Karla at 800, uppercase and
 *  tracked out, in SUN YELLOW (8.01:1 on the ink). Not the display face: four
 *  Shrikhand column heads at this size would out-shout the brand line beside
 *  them, which is the only place the footer wants the serif. */
const FOOTER_HEAD = 'text-[13px] font-extrabold uppercase tracking-[0.1em] text-night-accent'

// The 11 legal pages split into the footer's three columns, as in the mockup.
// Every page in LEGAL_PAGES lands in exactly one of them.
const FOOTER_EXPLORE = ['about', 'contact']
const FOOTER_LEGAL = ['privacy-policy', 'terms', 'cookie-policy', 'disclaimer']
const FOOTER_POLICIES = ['responsible-gambling', 'affiliate-disclosure', 'editorial-policy', 'aml-policy', 'kyc-policy']

function footerPages(slugs: string[]) {
  return LEGAL_PAGES.filter(({ slug }) => slugs.includes(slug))
}

/** The header dropdown panel, in this site's own palette. */
const NAV_PANEL = {
  // A HARD ink drop, not a blur: there is no soft shadow anywhere on this
  // page, and a blurred panel floating over outlined cards would be the one
  // thing drawn in a different medium.
  panelClassName: 'bg-paper border-2 border-ink shadow-[0_4px_0_var(--color-ink)]',
  itemClassName: 'text-ink-soft hover:bg-accent hover:text-ink',
  allItemClassName: 'text-ink hover:bg-accent hover:text-ink',
  arrowClassName: 'text-brand',
}

/** The phone menu (below `lg`), in this site's own palette — the mockup's
 *  `.burger` and `.mnav`: a 2px ink outline on the trigger, and rows parted by
 *  the hairline, each filling SUN YELLOW as it is pointed at. */
const NAV_MOBILE = {
  triggerClassName: 'border-2 border-ink text-ink hover:bg-accent hover:text-ink',
  panelClassName: 'bg-cream border-ink border-t-[3px]',
  rowClassName: 'text-ink hover:bg-accent hover:text-ink',
  rowExpandedClassName: 'bg-accent text-ink',
  allClassName: 'text-ink hover:bg-accent hover:text-ink',
  childClassName: 'text-ink-soft hover:bg-accent hover:text-ink',
  guideClassName: 'border-line',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /*
   * Widened to `string` deliberately.
   *
   * COPY is `as const`, so this would otherwise carry the LITERAL type of
   * whatever address is written in copy.ts — and TypeScript then rejects
   * `!== ''` as a comparison that can never be true. The check is not
   * pointless: a freshly cloned site ships with this blank, and the footer has
   * to omit the whole <address> element rather than print an empty one.
   */
  const postalAddress: string = COPY.footer.postalAddress

  let socialLinks: SocialLink[] = []
  try {
    socialLinks = (await getSocialLinks()).data
  } catch {
    socialLinks = []
  }

  // "Special Offers" only earns its slot in the nav when this site actually has
  // a visible offer to show; with none, the link would lead to an empty page,
  // so both the header and the footer drop it.
  const showSpecialOffers = await hasSpecialOffers()
  const navLinks = NAV_LINKS.filter(({ href }) => href !== '/special-offers' || showSpecialOffers)

  // Children for the Casinos and Bonuses entries, header and footer
  // alike. Each carries the icon its chip shows, resolved here on the server so
  // the client menus never need the storage URL. A failed fetch yields no
  // items, and the entry then stays the plain link it always was.
  const categoryMenuItems = await getCategories()
    .then((res) => res.data.map((c) => ({ slug: c.slug, name: c.name, icon: resolveImageUrl(c.logo_path) })))
    .catch(() => [])
  // Bonus types with at least one visible offer on this site (the API drops
  // empty ones). getBonusArea already falls back to [] on failure.
  const bonusMenuItems = (await getBonusArea()).map((section) => ({
    slug: section.slug,
    name: section.name,
    icon: resolveImageUrl(section.icon_path),
  }))

  // Site-wide structured data, rendered once here so every page carries it.
  // Next.js manages the document <head> (manual <head> tags in a root layout are
  // discouraged), so per the framework's JSON-LD guide the <script> is rendered
  // in the layout body — crawlers read JSON-LD from anywhere in the document.
  // The `<` escaping keeps the payload XSS-safe.
  //
  // Two nodes, cross-referenced by @id: the publisher (Organization) and the
  // site (WebSite). socialLinks is already fetched above for the footer, so
  // `sameAs` costs no extra request.
  const siteGraph = [buildOrganizationSchema(socialLinks), buildWebSiteSchema()]

  return (
    <html lang="en" className={`${karla.variable} ${shrikhand.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {/* Opens every page at its top — see the component. */}
        <ScrollToTopOnNavigate />
        <ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(siteGraph),
          }}
        />
        {/* THE TOP BAR — the mockup's `.topbar`, and this site's primary
            subscribe point. The teal ink, a line of copy at the left and the
            field at the right, above the sticky header rather than inside it.

            This is why the header has room to breathe: on the siblings the
            form has to fight the nav for the same 1200px row and gets dropped
            below `xl`, leaving a phone with the band above the footer as its
            only way in. Here the bar is its own row, so the form is present at
            EVERY width — the mockup hides only the sentence beside it, which
            is what has to give when the row narrows. */}
        {SUBSCRIBE_ENABLED && (
          <div className="deep-panel">
            <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-5 gap-y-3 px-4 py-2.5 sm:px-[22px]">
              <p className="hidden min-w-0 flex-1 text-[14.5px] font-semibold text-night-ink md:block">
                <b className="font-extrabold text-accent">{COPY.newsletter.barLead}</b>{' '}
                {COPY.newsletter.barTail}
              </p>
              {/* `compact` = no intro: the sentence beside it is the intro. */}
              <NewsletterForm compact tone="dark" className="w-full md:w-auto md:flex-[0_1_400px]" />
            </div>
          </div>
        )}

        {/* Header — the mockup's `.hdr`: the page cream, sticky, closed by a
            3px INK rule, with the mark at its left and the nav at its right.

            OPAQUE, with no blur. Every other site in the network floats a
            translucent header over the page; here the whole design is flat
            screen-print, and a frosted bar would be the only blurred surface
            on it. The 3px rule is what separates it instead, and it is the
            same rule the hero closes on. */}
        <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-cream">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-[22px] sm:py-3.5">
            <Logo taglineClassName="hidden sm:block" />
            <nav aria-label="Main navigation" className="hidden lg:block">
              <ul className="flex items-center gap-1.5" role="list">
                {navLinks.map(({ href, label }) =>
                  href === '/casinos' && categoryMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : (
                    <li key={href}>
                      <Link href={href} className={NAV_LINK}>
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* NO FORM HERE. The top bar above carries it at every width —
                see the comment there — so the header is the mark and the nav
                and nothing else, which is how the mockup draws it. */}

            {/* Below lg the nav strip above is hidden and this menu replaces it. */}
            <MobileNav
              links={navLinks}
              hideFrom="lg"
              groups={{
                '/casinos': { allLabel: COPY.nav.allCasinos, items: categoryMenuItems, itemBasePath: '/categories' },
                '/special-offers': { allLabel: COPY.nav.allOffers, items: bonusMenuItems, itemBasePath: '/bonuses' },
              }}
              theme={NAV_MOBILE}
            />
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* Subscribe, a SECOND time, directly above the footer.

            The mockup has only the top bar, and the top bar scrolls away: on
            a page this long, someone who reads to the end has no way in
            without going back up. So the band stays — but on the MINT SKY,
            closed top and bottom by the same 3px ink rule the hero uses, so
            the page opens and closes on one ground rather than introducing a
            third. The footer's striped band lands immediately under it, which
            is the brightest thing on the page and wants a quiet neighbour. */}
        {SUBSCRIBE_ENABLED && (
          <section className="mt-24 border-y-[3px] border-ink bg-sky" aria-label="Newsletter">
            <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-[22px]">
              <div className="min-w-[260px] flex-[1_1_340px]">
                <span aria-hidden className="bar mb-4" />
                <h2 className="font-display text-[clamp(28px,3.8vw,42px)] text-ink">
                  {COPY.newsletter.bandTitle}
                </h2>
                <p className="mt-3 max-w-[440px] text-[16.5px] font-medium text-ink-soft">{COPY.newsletter.bandSubtitle}</p>
              </div>
              {/* `compact` = no intro: the band carries the heading itself. */}
              <NewsletterForm compact className="min-w-[260px] flex-[1_1_380px] lg:max-w-[440px]" />
            </div>
          </section>
        )}

        {/* Footer — the mockup's `.ftr`: the INK ground, opened by a solid
            30px band of the THREE STRIPES, carrying the brand and its line,
            Explore / Legal / Policies, and the legal bar.

            The band is at the top, not the bottom: it is the horizon the cream
            page sets behind, so the footer reads as the water under it. It is
            also the only full-width run of the stripes on the page — the sun,
            the bars and the arches are all pieces of it, and this is where the
            whole gradient finally lies flat. */}
        <footer className="deep-panel relative text-night-ink">
          <div aria-hidden className="stripes absolute inset-x-0 top-0 h-[30px]" />
          <div className="relative mx-auto max-w-[1200px] px-4 pb-7 pt-[88px] sm:px-[22px]">
            <div className="flex flex-wrap justify-between gap-10">
              <div className="max-w-[360px] flex-[1_1_260px]">
                {/* The Logo component itself, so the mark and wordmark here can
                    never drift from the header's. */}
                <Logo onDark />
                <p className="mt-4 text-[15px] font-medium text-night-ink">{COPY.footer.tagline}</p>
                {socialLinks.length > 0 && (
                  <div className="mt-5">
                    <p className={`${FOOTER_HEAD} mb-3`}>Follow us</p>
                    <SocialIcons links={socialLinks} onDark />
                  </div>
                )}
              </div>

              <div className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6">
                <div>
                  <p className={FOOTER_HEAD}>Explore</p>
                  <ul className="mt-2.5 flex flex-col">
                    {navLinks.map(({ href, label }) =>
                      href === '/casinos' && categoryMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : (
                        <li key={href}>
                          <Link href={href} className={FOOTER_LINK}>{label}</Link>
                        </li>
                      ),
                    )}
                    {footerPages(FOOTER_EXPLORE).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
                <nav aria-label="Legal">
                  <p className={FOOTER_HEAD}>Legal</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_LEGAL).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                    <li>
                      <CookieSettingsButton className={FOOTER_LINK} />
                    </li>
                  </ul>
                </nav>
                <nav aria-label="Policies">
                  <p className={FOOTER_HEAD}>Policies</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_POLICIES).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* The 18+ mark and the legal line, on one rule — the mockup's
                `.legal`. Not `aria-hidden`: the sentence beside it never says
                the age, so a screen reader needs the "18+" too.

                The mockup's own ring: a CORAL border with the numerals in the
                lighter rose inside it. Coral on the ink is 3.22:1 — over the
                3:1 a graphical boundary needs and under the 4.5 any text
                needs, so the ring is drawn in it and the "18+" is not. The
                rose carries that at 5.44:1. */}
            <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-[22px] text-[14px] font-medium text-night-ink">
              <p className="flex min-w-0 flex-[1_1_320px] items-center gap-2.5">
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border-2 border-coral text-[12px] font-extrabold text-[#ff8a8f]">18+</span>
                <span>
                  <b className="text-cream">Gamble responsibly.</b> {COPY.footer.disclaimer}
                </span>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-between gap-3 text-[14px] text-night-faint">
              <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
              {/* Rendered only when an address exists: a freshly cloned site
                  ships with this blank, and an empty <address> is worse than
                  none. `not-italic` is load-bearing — Preflight does not reset
                  the tag's italic default. */}
              {postalAddress !== '' && <address className="not-italic">{postalAddress}</address>}
            </div>
          </div>
        </footer>

        <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
