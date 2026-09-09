import { useCallback, useEffect, useRef, useState } from 'react'
import { TOOLS } from '../data/tools'
import './SectionTransition.css'

/**
 * A short, scroll-pinned bridge between the Tools & Technologies section
 * and the Career timeline: as you scroll past Tools, a shrunk copy of the
 * REAL tools grid (same data, same classes as the actual section — not a
 * placeholder card) slides out to the left. ArcReactorTimeline gives its
 * own sticky stage a matching entrance-from-the-right slide right as it
 * engages, so the two hand off to look like one continuous pan rather than
 * a normal vertical scroll cut.
 *
 * Uses the same tall-driver + sticky-stage pattern already used by the hero
 * (.scroll-story) and the Career timeline (.arc-reactor__driver): the
 * driver has extra scroll height, the stage stays pinned to the viewport
 * while it's scrolled through, and `progress` (0→1) drives the slide.
 * Purely decorative/aria-hidden — the real Tools section above is
 * untouched and still scrolls normally.
 */
export function SectionTransition() {
  const driverRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const onScroll = useCallback(() => {
    const driver = driverRef.current
    if (!driver) return
    const rect = driver.getBoundingClientRect()
    const total = driver.offsetHeight - window.innerHeight
    const scrolled = Math.min(Math.max(-rect.top, 0), total)
    setProgress(total > 0 ? scrolled / total : 0)
  }, [])

  useEffect(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [onScroll])

  // Ease so the slide has a bit of momentum instead of moving 1:1 with scroll.
  const eased = progress * progress * (3 - 2 * progress)

  return (
    <div className="section-transition" ref={driverRef} aria-hidden="true">
      <div className="section-transition__stage">
        <div
          className="section-transition__clone-wrap"
          style={{
            transform: `translateX(${-eased * 100}%)`,
            opacity: 1 - eased * 0.9,
          }}
        >
          <div className="section-transition__clone">
            <p className="skills__eyebrow">Stack</p>
            <h2 className="skills__title">Tools and Technologies</h2>
            <ul className="skills__list">
              {TOOLS.map((tool, index) => (
                <li key={tool.title} className="skills__item">
                  <span className="skills__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="skills__body">
                    <span className="skills__label">{tool.title}</span>
                    <div className="skills__tags">
                      {tool.items.split(', ').map((tag) => (
                        <span className="skills__tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
