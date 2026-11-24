/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * brands are separate domains serving the same catalogue, and if they shipped
 * the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * spinsunny's angle: IN DAYLIGHT. Not which figures matter — WHEN you get to
 * see them. A bonus is designed to be read in the dark: the headline number on
 * the banner, everything that qualifies it two clicks away in a terms page, in
 * grey, after the account is open and the deposit is in. This site does one
 * thing with that order — it turns it round. Whatever an operator puts in its
 * small print is printed here on the front of the card, before anyone signs up
 * to anything, in the same words the operator used. Nothing is revealed; it is
 * just moved to where it can be read.
 *
 * Its siblings answer the neighbouring questions — affliliate decodes an offer
 * in MONEY, slottering reads the SLOT rules, bettingbetway ranks CASINOS on
 * their terms, bonanzasmile names the CATCH, gladjackpot asks how the money
 * gets OUT, luckycatsmile argues LUCK IS THE WRONG WORD — and none of them may
 * be echoed. The nearest neighbour is luckycatsmile, and the line between them
 * holds: it argues about WHICH numbers decide a casino, this one about WHERE
 * those numbers are kept and WHEN a reader is allowed to see them.
 *
 * ── Three lines this file does not cross ────────────────────────────────────
 * 1. The mockup's lead says "we sign up, deposit, spin and cash out at every
 *    casino we list", its eyebrow says "tested in the sunshine", and its FAQ
 *    promises "the times we observed". NONE OF IT SHIPS, in any wording:
 *    nothing in this project records a funded account, a played bonus or a
 *    timed withdrawal, and a review site inventing its own test results is the
 *    one failure that cannot be walked back. What the site can honestly say is
 *    that it reads what each operator publishes and prints it up front, which
 *    is what the copy says — and it is a stronger claim than a vague one about
 *    testing, because a reader can check it against the operator's own page.
 * 2. The mockup also sells "casinos and sportsbooks". The API serves casinos,
 *    so every line here says casinos.
 * 3. The mockup prints a "Min. deposit" and an "Avg. payout time" per casino,
 *    per podium row and in its review panel. There is no column for either, so
 *    no wording promises one; the slot carries the rating, which is real.
 */
export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Bonus Terms, Out In The Open',
    description:
      'prints what the small print says before you sign up — the wagering, the cap, the expiry and the licence, in the operator’s own words and on the front of the card.',
    keywords: [
      'casino bonus small print',
      'wagering requirements before you deposit',
      'casino bonus terms up front',
      'licensed online casinos compared',
      'honest casino bonus reviews',
    ],
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it. winpalack keeps "Special Offers": its page is the
    // grouped bonus-area view and is a different thing.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    bonus: 'Bonuses',
    // The line under the Bonuses heading. The mockup calls these cards
    // "postcards from our favourite offers", which is what they are shaped
    // like — so the line keeps the postcard and drops the favouritism.
    bonusesSubtitle: 'Postcards, with the terms written on the front.',
    seeMore: 'See more',
    seeAllBonuses: 'See All Bonuses',
    /**
     * The VISIBLE heading over the bonus-type row.
     *
     * The row used to carry no heading at all — the chips were taken to
     * speak for themselves. They do not: arriving mid-page at a band of
     * unlabelled buttons between the hero and the casino list, there is
     * nothing saying what the set IS, and nothing a screen reader can
     * announce for the landmark beyond a generic label nobody wrote for
     * this page.
     *
     * Worded differently on every domain, like every other <h2> here:
     * eleven sites serve one catalogue, and a shared heading is
     * duplicate content.
     */
    bonusTypesTitle: 'Browse by bonus type',
    // The mockup's eyebrow is "Tested in the sunshine, weekly". There is no
    // testing here, so this says the part that is true: the terms are re-read
    // every week, and that is what the dot beside it is claiming.
    heroEyebrow: 'Terms re-read every week',
    // Split in three so the JSX can set the middle phrase in the display
    // face's outlined treatment, which is the hero's whole device.
    heroHeadline: 'The small print,',
    heroHighlight: 'in daylight.',
    heroHeadlineTail: '',
    heroSubtitle:
      'Every bonus is written to be read in the dark: the big number on the banner, everything that qualifies it buried two clicks deep and discovered after the deposit. We print the whole of it on the front of the card instead — the wagering, the cap, the expiry and the licence — in the operator’s own words, before you sign up to anything.',
    // The badge above the picks card, and the line under it. Both are the
    // mockup's own; the badge carries the live dot.
    podiumBadge: 'Updated weekly',
    podiumTitle: 'Today’s bright spots',
    // The mockup says "three casinos that paid out fastest in our latest
    // tests". There are no tests and no payout times here, so this says what
    // the list actually is: the top of the current ranking.
    podiumSubtitle: 'The three highest-placed casinos in this week’s ranking.',
    // The label over the picks card's right-hand column. The mockup's is
    // "Min. deposit"; nothing in the API holds one, so the slot carries the
    // rating.
    podiumRatingLabel: 'Rating',
    podiumAll: 'See full rankings',
    topCasinosTitle: 'Casinos with nothing in the footnotes',
    topCasinosSubtitle: 'Ranked on how plainly an operator states its terms, and how reasonable they are once stated. Filter by category.',
    featuredCasinos: 'See top casinos',
    specialOffers: 'Browse bonuses',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Casino Bonuses With The Terms Up Front',
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'What we read, what we will not claim, and how a casino earns its place here.',
    metaDescription:
      'Casino bonuses with the small print moved to the front — the wagering multiplier, the withdrawal cap, the expiry and the regulator, quoted from each operator’s own terms before you sign up.',
    // ── The "How a casino earns its place" band ───────────────────────────
    // Three steps, numbered, because they ARE a sequence: each one happens
    // after the one before it. Numbering a set that is not ordered is
    // decoration; numbering this one is information.
    methodTitle: 'How a bonus gets onto the board',
    methodSubtitle: 'Three passes over the operator’s own pages, in this order.',
    methodSteps: [
      {
        no: '01',
        verb: 'Open',
        title: 'The terms, not the banner',
        body:
          'The banner is the headline number and nothing else. The work starts on the page it links to: the full offer terms, the bonus policy they refer out to, and the cashier page where the limits actually live. Three documents, read before a single figure is written down.',
      },
      {
        no: '02',
        verb: 'Print',
        title: 'Everything that qualifies it',
        body:
          'The wagering multiplier and what it is applied to, the cap on what a bonus win can become, the days you have to clear it, the games that do not count, and the regulator behind the licence. All of it on the card, in the operator’s wording, so it can be checked against the source.',
      },
      {
        no: '03',
        verb: 'Re-read',
        title: 'Weekly, and after any change',
        body:
          'Terms are revised quietly and offers lapse without an announcement. Expired bonuses come off the board, rewritten ones are read again from the top, and a casino moves when its own pages move — up as readily as down.',
      },
    ],
    methodLabel: 'How it works',
    // Under the three stages: the cycle closes back on the first.
    methodLoop: 'And back to the first pass whenever an operator rewrites its terms',
    // ── The hero monitor: what one pass covers ──────────────────────────
    // The same things the FAQ and the method name — no figure this site does
    // not hold. Kept in the shared key structure though this design has no
    // monitor panel; see the file header.
    monitorTitle: 'What each pass covers',
    monitorStatus: 'Weekly',
    monitorReads: [
      { label: '01 · The offer terms', text: 'The multiplier, and what it applies to' },
      { label: '02 · The cashier', text: 'The cap per payment, and the window' },
      { label: '03 · The licence', text: 'Which regulator the operator names' },
    ],
    monitorNote: 'Lapsed bonuses come off the board. A casino moves when its own pages move.',
    rankingLabel: 'The rankings',
    bonusTypesKicker: 'By type',
    bonusesLabel: 'The offers',
    faqLabel: 'Answered',
  },
  casinos: {
    pageTitle: 'Every Casino On The Board',
    pageDescription:
      'The full list, each casino shown with the bonus it is running, the terms that qualify it, and where it places in its category.',
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Bonuses Running Here',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    moreHeading: 'Other casinos worth a look',
    reviewTitleTail: 'Bonus Terms, Limits And Licence',
    reviewSignature: 'Every figure here quoted from this operator’s own terms and cashier pages.',
    reviewSummary: 'with the terms that qualify its bonus — the wagering, the cap, the expiry and the regulator — quoted from the operator’s own pages rather than its banner.',
    // The ribbon on the leading casino card. A WORD, not a numeral: the list
    // order already is the ranking, and a "1" on every card invites reading it
    // as a score.
    topPick: 'Top pick',
    visitCasino: 'Open Casino',
    readReview: 'Read review',
    rating: 'Sunny score',
    noResults: 'No casinos match this filter yet. Try another category.',
  },
  /**
   * The page behind one bonus type (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the type's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix: 'every bonus of this kind on the board right now, with whose offer it is and the terms that decide what it is actually worth.',
    countOne: 'offer',
    countMany: 'offers',
  },

  specialOffers: {
    pageTitle: 'Every Bonus, Small Print Included',
    pageDescription:
      'Every bonus in one place, each with the casino behind it and the wagering, the cap and the expiry printed wherever the operator prints them.',
    // Appended to an offer's (shared) bonus text so the sibling sites do not
    // ship an identical meta description for the same offer.
    offerMetaSuffix: 'Read from the operator’s own terms page before it went on the board.',
    claim: 'Claim Bonus',
    noResults: 'No bonuses to show right now.',
  },
  categories: {
    pageTitle: 'Casinos By Category',
    pageDescription: 'The same three passes behind every list — pick the category you came for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the nine sites distinct there.
    categoryMetaSuffix: 'ordered by how plainly each operator states the terms behind its bonus, and how reasonable those terms are once stated.',
    noResults: 'Nothing to show here yet.',
  },
  newsletter: {
    title: 'Sunny alerts.',
    subtitle: 'One email a week: what moved on the board, and whose terms changed under it.',
    placeholder: 'Your email address',
    button: 'Subscribe',
    // The two halves of the line beside the TOP BAR's field — the mockup's
    // own "Sunny alerts: new casinos and hot bonuses, once a week." Split so
    // the lead can take the sun yellow while the rest stays readable grey.
    barLead: 'Sunny alerts:',
    barTail: 'new casinos and rewritten terms, once a week.',
    // The mint band above the footer — the site's second capture point, so its
    // heading is a real <h2> rather than the form's own label.
    bandTitle: 'A little sunshine, once a week.',
    bandSubtitle: 'New reviews, the bonuses worth claiming this week, and every move on the board — one short email, no filler.',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column. The mockup gives that
    // column 1.6fr of a four-track grid — roughly 360px — so this runs to two
    // or three lines there by design, unlike the two-column siblings where the
    // same string had to stay on one.
    tagline:
      'Independent casino reviews and rankings, read from each operator’s own terms and cashier pages. We may earn a commission from links on this site; it never changes a score or a position.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    //
    // Supplied 2026-11-23, and written to this site's `registered_address`
    // in the same change (`php artisan sites:set-legal-identity <slug>
    // --address=...`). THE TWO MUST STAY IDENTICAL: that column is what the
    // legal pages and the email templates print, and two different addresses
    // for one brand is a compliance problem, not a typo. The footer omits the
    // whole <address> element while this is blank, which is why it was.
    postalAddress: '16 Sycamore Close, Swansea, SA2 9HJ, United Kingdom',
    disclaimer:
      'Gambling is for adults aged 18 or over and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'That page is not here.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'What Players Report',
    empty: 'No reports yet — be the first to say how it went.',
    formTitle: 'Add Your Report',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    namePlaceholder: 'First name or nickname',
    emailPlaceholder: 'you@example.com',
    titlePlaceholder: 'One line on whether the terms matched the banner',
    bodyPlaceholder: 'How did it actually go — wagering, cap, verification, withdrawal?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'Bonus types',
  },
} as const
