import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { CAREER_JOBS, ORBIT_NODES } from '../data/careerJobs'
import './ArcReactorTimeline.css'
function hudLabel(activeCount: number) {
  if (activeCount === 0) return 'Standby'
  if (activeCount >= 5) return 'All systems charged'
  return `Role 0${activeCount} online`
}


export function ArcReactorTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const driverRef = useRef<HTMLDivElement>(null)
  const [activeCount, setActiveCount] = useState(0)
  const [glowStrength, setGlowStrength] = useState(0.35)
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const onScroll = useCallback(() => {
    const driver = driverRef.current
    const section = sectionRef.current
    if (!driver || !section) return
    const rect = driver.getBoundingClientRect()
    const total = driver.offsetHeight - window.innerHeight
    const scrolled = Math.min(Math.max(-rect.top, 0), total)
    const progress = total > 0 ? scrolled / total : 0
    setGlowStrength(0.3 + progress * 0.9)
    const shouldActive = Math.min(
      5,
      Math.floor(progress * 5 + 0.001) + (progress > 0 ? 1 : 0),
    )
    setActiveCount(shouldActive)
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
  useEffect(() => {
    if (selectedJob === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedJob(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedJob])
  const selected = selectedJob !== null ? CAREER_JOBS[selectedJob] : null

 return (
    <section
      ref={sectionRef}
      className="arc-reactor"
      id="career"
      aria-label="Career timeline"
      style={{ '--arc-glow-strength': glowStrength } as CSSProperties}
    >
      <div className="arc-reactor__floor" aria-hidden="true" />
      <div className="arc-reactor__vignette" aria-hidden="true" />
      <div className="arc-reactor__driver" ref={driverRef}>
        <div className="arc-reactor__stage">
          <div className="arc-reactor__mark" aria-hidden="true">
            CAREER
          </div>
           <header className="arc-reactor__header">
            <div className="arc-reactor__eyebrow-wrap">
              <span className="arc-reactor__eyebrow-line" aria-hidden="true" />
              <p className="arc-reactor__eyebrow">Experience</p>
              <span className="arc-reactor__eyebrow-line" aria-hidden="true" />
            </div>
            <h2 className="arc-reactor__title">Career Core</h2>
            <div className="arc-reactor__title-divider" aria-hidden="true" />
            <p className="arc-reactor__subhead">
              Scroll to charge the core <span className="arc-reactor__subhead-dot" aria-hidden="true">•</span> Click a node for details
            </p>
          </header>
           <div className="arc-reactor__orbit-root">
            <svg
              className="arc-reactor__reactor"
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="arcCoreGlow" cx="50%" cy="50%" r="50%">
                 
                  <stop offset="0%" stopColor="#fffdf0" />
                  <stop offset="24%" stopColor="#ffd56a" />
                  <stop offset="60%" stopColor="#ff2a3b" />
                  <stop offset="100%" stopColor="#4a0812" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g className="arc-reactor__ring-outer">
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="rgba(255, 42, 59, 0.45)"
                  strokeWidth="2"
                  strokeDasharray="6 10"
                />

                  <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#ff2a3b"
                  strokeWidth="1.5"
                />
                  </g>
              <g className="arc-reactor__ring-mid">
                <circle
                  cx="100"
                  cy="100"
                  r="62"
                  fill="none"
                  stroke="#ffd56a"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                />
              </g>
                <circle
                className="arc-reactor__core-pulse"
                cx="100"
                cy="100"
                r="42"
                fill="url(#arcCoreGlow)"
              />
              <circle cx="100" cy="100" r="14" fill="#fff5fb" />
            </svg>
             {ORBIT_NODES.map((node, index) => (
              <div
                key={node.label}
                className={`arc-reactor__node-orbit${
                  index < activeCount ? ' arc-reactor__node-orbit--active' : ''
                }`}
                style={{
                  transform: `rotate(${node.rotation}deg)`,
                  ['--arc-counter-rot' as string]: `${node.counterRot}deg`,
                }}
              >
                <div className="arc-reactor__beam" />
                <div className="arc-reactor__node-wrap">
                  <button
                    type="button"
                    className="arc-reactor__node"
                    aria-label={`${CAREER_JOBS[index].role} at ${node.label}`}
                    onClick={() => setSelectedJob(index)}


                  >
                                        {String(index + 1).padStart(2, '0')}

                  </button>
                  <span className="arc-reactor__node-label">{node.label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="arc-reactor__hud">
            Status <strong>{hudLabel(activeCount)}</strong>
          </p>
        </div>
      </div>
      <footer className="arc-reactor__footer">
        Five roles logged · newest first
      </footer>
      <div
        className={`arc-reactor__overlay${
          selected ? ' arc-reactor__overlay--open' : ''
        }`}
        role="presentation"
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedJob(null)
        }}
      >
         {selected ? (
          <div
            className="arc-reactor__detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="arc-detail-role"
          >
            <button
              type="button"
              className="arc-reactor__close-btn"
              aria-label="Close details"
              onClick={() => setSelectedJob(null)}
            >
              ✕
            </button>
            <p className="arc-reactor__detail-kicker">Role</p>
            <div className="arc-reactor__detail-head">
              <div>
                <h3 className="arc-reactor__detail-role" id="arc-detail-role">
                  {selected.role}
                </h3>
                <p className="arc-reactor__detail-co">{selected.co}</p>
                <p className="arc-reactor__detail-loc">{selected.loc}</p>
              </div>
              <p className="arc-reactor__detail-duration">{selected.dur}</p>
            </div>
            <ul className="arc-reactor__detail-list">
              {selected.bullets.map((bullet) => (
                <li
                  key={bullet.slice(0, 48)}
                  dangerouslySetInnerHTML={{ __html: bullet }}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}