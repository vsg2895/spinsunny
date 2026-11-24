import { ImageResponse } from 'next/og'
import { SHARE_IMAGE_ALT } from '@/lib/seo'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js links this file automatically on the home page only. Every other
 * page sets its own `openGraph`, which REPLACES the layout's (metadata
 * merges shallowly) and drops this card — so those pages restate it via
 * `SHARE_IMAGES` in lib/seo, which also holds the alt text below.
 */
export const alt = SHARE_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          // The MINT SKY of the hero, closed by the three stripes laid flat
          // along the bottom edge — the footer's own band, and the one place
          // on the site where the whole gradient lies in a straight line.
          //
          // The SUN is deliberately not drawn. Its slits are a mask at a fixed
          // pixel scale, and at card size they alias into a moiré; the stripes
          // carry the brand on their own, which is what they are for.
          background: '#cfede7',
          color: '#0f3b3a',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            background: '#0f3b3a',
            color: '#ffc93c',
            borderRadius: 999,
            padding: '12px 32px',
            fontFamily: 'sans-serif',
          }}
        >
          In Daylight
        </div>
        {/* Satori needs an EXPLICIT display on any element with more than one
            child — the wordmark is two coloured spans, so this one says flex
            rather than relying on the browser default it never sees. */}
        <div
          style={{
            display: 'flex',
            fontSize: 104,
            marginTop: 26,
            padding: '0 60px',
          }}
        >
          {/* One word in two colours, so the two spans must touch exactly.
              The DEEP orange, not the bright one: #B84A00 is 4.21:1 on this
              mint — over the 3:1 a 104px word needs — where the bright #FF7A1A
              would be 2.2:1 and fail even that. A card has no outline trick to
              lean on the way the hero heading does. */}
          <span>Spin</span><span style={{ color: '#b84a00' }}>Sunny</span>
        </div>
        <div style={{ display: 'flex', fontSize: 28, marginTop: 30, color: '#3c5e5c', fontFamily: 'sans-serif' }}>
          18+ · Gamble responsibly
        </div>

        {/* The three stripes. Three flex children rather than a gradient:
            Satori renders a hard-stop linear-gradient with a seam of its own
            interpolation at each stop, and three solid blocks cannot. */}
        <div style={{ display: 'flex', position: 'absolute', left: 0, right: 0, bottom: 0, height: 30 }}>
          <div style={{ display: 'flex', flex: 1, background: '#ffc93c' }} />
          <div style={{ display: 'flex', flex: 1, background: '#ff7a1a' }} />
          <div style={{ display: 'flex', flex: 1, background: '#e9484f' }} />
        </div>
      </div>
    ),
    size,
  )
}
