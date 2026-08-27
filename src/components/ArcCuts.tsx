export function ArcCuts() {
  return (
    <div className="hero__cuts" aria-hidden="true">
      <svg
        className="hero__cuts-svg"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="cuts-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer segmented ring */}
        <circle
          cx="100"
          cy="100"
          r="78"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.2"
          strokeDasharray="28 14 22 14 30 14 22 14"
          filter="url(#cuts-glow)"
        />
        <circle
          cx="100"
          cy="100"
          r="68"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.8"
          strokeDasharray="10 8"
        />

        {/* Top center wedge */}
        <path
          d="M88 42 L100 22 L112 42 L104 70 L96 70 Z"
          stroke="white"
          strokeWidth="2.4"
          fill="rgba(255,255,255,0.06)"
          filter="url(#cuts-glow)"
        />
        {/* Top-left wedge */}
        <path
          d="M52 58 L72 38 L84 56 L74 78 L58 72 Z"
          stroke="white"
          strokeWidth="2.2"
          fill="rgba(255,255,255,0.05)"
          filter="url(#cuts-glow)"
        />
        {/* Top-right wedge */}
        <path
          d="M148 58 L128 38 L116 56 L126 78 L142 72 Z"
          stroke="white"
          strokeWidth="2.2"
          fill="rgba(255,255,255,0.05)"
          filter="url(#cuts-glow)"
        />

        {/* Upper side cuts */}
        <path
          d="M34 96 L48 78 L62 90 L54 108 L38 108 Z"
          stroke="white"
          strokeWidth="2"
          fill="rgba(255,255,255,0.04)"
          filter="url(#cuts-glow)"
        />
        <path
          d="M166 96 L152 78 L138 90 L146 108 L162 108 Z"
          stroke="white"
          strokeWidth="2"
          fill="rgba(255,255,255,0.04)"
          filter="url(#cuts-glow)"
        />

        {/* Center horizontal bar */}
        <rect
          x="46"
          y="96"
          width="108"
          height="8"
          rx="1"
          stroke="white"
          strokeWidth="2.4"
          fill="rgba(255,255,255,0.12)"
          filter="url(#cuts-glow)"
        />

        {/* Bottom inverted triangle / chevron */}
        <path
          d="M70 118 L130 118 L100 168 Z"
          stroke="white"
          strokeWidth="2.4"
          fill="rgba(255,255,255,0.05)"
          filter="url(#cuts-glow)"
        />
        <path
          d="M82 122 L118 122 L100 152 Z"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.4"
          fill="none"
        />
      </svg>
    </div>
  )
}
