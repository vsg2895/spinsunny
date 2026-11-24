type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/spinsunny.html (`.faq` / `.fq`): ONE COLUMN of
 * outlined cards, each opening on a bordered plus mark that rotates 45° into a
 * cross, with the summary row filling SUN YELLOW and closing off under a 3px
 * rule while the answer is open. The first is open.
 *
 * One column, not the siblings' two: the mockup puts this section in its
 * `.narrow` 800px track, and these answers run to four or five lines each —
 * two columns of them at 1200px would set a wall of small text across the full
 * width, which is the one place on the page that wants to be read rather than
 * scanned.
 *
 * The question is set in KARLA at 800, not the display face. Shrikhand is a
 * reverse-contrast poster type: it carries a four-word heading and defeats a
 * nine-word question, and the mockup makes the same exception here
 * (`.fq summary h3{font-family:var(--body)}`).
 *
 * The mark is drawn from two pseudo-elements rather than a "+" character.
 * A glyph's cross-bar sits off-centre in most faces, which is invisible until
 * it rotates 45° and the × comes out lopsided. The rotation is `.pm` in
 * globals.css, driven by `details[open]`.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 * `[&::-webkit-details-marker]:hidden` and `list-none` drop the browser's own
 * triangle so only this mark shows.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="grid max-w-[840px] grid-cols-1 gap-3">
      {items.map((item, i) => (
        <details key={item.question} open={i === 0} className="fq">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-[18px] px-6 py-5 [&::-webkit-details-marker]:hidden">
            <h3 className="text-[18px] font-extrabold leading-[1.3] text-ink [overflow-wrap:anywhere] sm:text-[19px]">{item.question}</h3>
            {/* Decoration: the <summary> already announces its own state. */}
            <span
              aria-hidden
              className="pm relative grid h-[38px] w-[38px] flex-none place-items-center rounded-xl text-ink
                before:absolute before:h-[2px] before:w-4 before:rounded-sm before:bg-current before:content-['']
                after:absolute after:h-[2px] after:w-4 after:rotate-90 after:rounded-sm after:bg-current after:content-['']"
            />
          </summary>
          <p className="px-6 pb-[22px] pt-5 text-[16.5px] font-medium leading-[1.7] text-ink-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
