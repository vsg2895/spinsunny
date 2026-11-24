/**
 * Frequently asked questions for this site.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data from
 * this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * argue one thing — that nothing about a bonus is secret, it is just kept
 * somewhere you only reach AFTER depositing, and that moving it to the front
 * is the whole job. Its siblings answer the neighbouring questions
 * (affliliate: what an offer is worth in money; slottering: the slot rules;
 * bettingbetway: which casino to trust; bonanzasmile: the catch in a bonus;
 * gladjackpot: how the money gets out; luckycatsmile: that luck is the wrong
 * word) and none of them may be echoed.
 *
 * NOTHING BELOW CLAIMS A FIGURE THIS SITE CANNOT SHOW. The mockup's FAQ opens
 * with "we open real accounts, deposit, claim the bonus and request a
 * withdrawal" and closes with "we publish the times we observed". Neither
 * ships, in any wording: nothing in this project records a funded account or a
 * timed payment. The second question below is asked precisely so the answer
 * can say so outright, rather than leaving the impression unaddressed — and
 * the last one answers the payout question honestly, by naming whose
 * commitment the figure is.
 */
export const FAQ_ITEMS = [
  {
    question: 'How do you rank casinos?',
    answer:
      'On what an operator is willing to put in writing, and how reasonable it is once written. A casino that states its wagering multiplier, what that multiplier applies to, the cap on a bonus win, the expiry and the regulator — plainly, on a page you can reach before opening an account — ranks above one that leaves any of them to be discovered later, however large the number on its banner. Vagueness is not neutral here; it counts against.',
  },
  {
    question: 'Do you actually play at these casinos?',
    answer:
      'No, and we will not print a figure we did not measure. Everything on this site is read from what the operator publishes — the offer terms, the bonus policy, the cashier page, the licence — and quoted so you can check it against the source. A review site that claims its own deposits and withdrawals is asking to be believed about the one thing nobody can verify, and we would rather be checkable than impressive.',
  },
  {
    question: 'If the terms are published anyway, what is this site for?',
    answer:
      'Order. None of it is hidden, but it is arranged so that you meet the headline first and the conditions last — typically after the account is open and the money is in. We read the three or four documents an offer actually depends on and put the result on the front of the card, before the sign-up, in the operator’s own words. Nothing is revealed. It is moved to where someone deciding can read it.',
  },
  {
    question: 'What makes one wagering requirement worse than another?',
    answer:
      'The multiplier is only half of it. 30x on the bonus alone and 30x on deposit plus bonus are different obligations for the same number, and a requirement that excludes the games with the best published returns is harder than it looks. A low multiplier beside a seven-day expiry can be worse than a high one with ninety days. We record the multiplier, what it applies to, which games count and how long you have, because the combination is the offer.',
  },
  {
    question: 'Why does the licence matter so much here?',
    answer:
      'Because it decides what happens when something goes wrong. A licence names the body you can complain to, the rules the operator agreed to follow and, in most jurisdictions, a free dispute service that can order a payment. Without one there is no route at all beyond the operator’s own support desk. We name the regulator on every review so the claim can be checked rather than taken on trust.',
  },
  {
    question: 'Do you earn money from these links?',
    answer:
      'Yes. We may earn a commission when someone signs up through a link on this site, and that is how it is funded. It does not buy a position: the ranking comes from what each operator publishes, every one is read the same way, and a casino that quietly tightens its terms moves down whether or not it pays us.',
  },
] as const
