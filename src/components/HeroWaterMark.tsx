/** Large background watermark text behind the hero carousel. */
export function HeroWatermark() {
  return (
    <div className="hero__watermark" aria-hidden="true">
      <svg
        className="hero__watermark-svg"
        viewBox="0 0 100 36"
        preserveAspectRatio="none"
      >


        <defs>
          <mask id="heroGlassTextMaskComp">
            <text
              x="2"
              y="50%"
              textAnchor="start"
              dominantBaseline="middle"
              textLength="96"
              lengthAdjust="spacingAndGlyphs"
              fill="#ffffff"
              fontFamily="var(--font-poster)"
              fontSize="30px"
              fontWeight="400"
            >
              AVENGERS OF TECH
            </text>
          </mask>
          <linearGradient id="heroGlassGlintBeamComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="38%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="48%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="50%" stopColor="rgba(255, 230, 245, 1)" />
            <stop offset="52%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="62%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
 <text
          className="hero__watermark-text"
          x="2"
          y="50%"
          textAnchor="start"
          dominantBaseline="middle"
          textLength="96"
          lengthAdjust="spacingAndGlyphs"
        >
          AVENGERS OF TECH
        </text>
        <g mask="url(#heroGlassTextMaskComp)">
          <rect
            className="hero__watermark-glint"
            x="-60"
            y="-10"
            width="70"
            height="60"
            fill="url(#heroGlassGlintBeamComp)"
          />
        </g>
      </svg>
    </div>
  )
}
