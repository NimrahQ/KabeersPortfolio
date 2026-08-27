import { Suspense, useEffect, useRef, useState } from 'react'
import { WorldScene } from './components/HeroScene'
import { ArcCuts } from './components/ArcCuts'
import { SmoothCircularBanner } from './components/BannerRibbon'
import { SceneLoader } from './components/SceneLoader'
import { ArcReactorTimeline } from './components/ArcReactorTimeline'
import { EducationSection } from './components/EducationSection'
import './App.css'

const TICKER_ITEMS = [
  'SYED KABEER AHMED',
  'AI ENGINEER',
  'MERN STACK',
] as const

const SKILLS_MARQUEE = [
  'TOOLS',
  'TECHNOLOGIES',
  'MEAN',
  'MERN',
  'REACT',
  'ANGULAR',
  'NODE',
  'AI',
] as const

const STORY_LINES = [
  'A developer is a real life survival heros',
  'dealing with challenges',
  'meetings',
  'dead lines',
  'managers',
  'QA bashing',
] as const

const WORD_MS = 420
const HOLD_MS = 1600
const FADE_MS = 500

const SUMMARY =
  'Experienced MEAN and MERN Stack Developer with over 5+ years of experience spearheading complex web applications and ERP systems. Implemented cutting-edge solutions in Multiple product, and UI/UX optimization, while engineering robust integrations with third-party APIs. Developed data-driven strategies to enhance system performance and security, showcasing strong problem-solving skills across diverse projects in fintech, recruitment, and e-commerce sectors.'





const TOOLS = [
  {
    title: 'Programming Languages',
    items: 'JavaScript, HTML5, CSS',
  },
  {
    title: 'Frameworks and Libraries',
    items:
      'Angular, React.js, Next.js, Node.js, Express.js, NestJS, GSAP, Ng Zorro, Elastic UI',
  },
  {
    title: 'Databases',
    items: 'MongoDB',
  },
  {
    title: 'Development Stacks',
    items: 'MEAN, MERN',
  },
  {
    title: 'Web Technologies',
    items: 'RESTful APIs, Responsive Web Design',
  },
  {
    title: 'Development Tools',
    items: 'ESLint, VS Code',
  },
  {
    title: 'Software Practices',
    items: 'Test-Driven Development (TDD), Code Reviews',
  },
  {
    title: 'Data Technologies',
    items: 'Big Data, Data Analysis',
  },
  {
    title: 'AI Development',
    items: 'Claude, Codex, Cursor',
  },
] as const

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function HeroMarkTicker() {
  return (
    <h1 className="hero__mark" aria-label={TICKER_ITEMS.join(' · ')}>
      <div className="hero__ticker hero__ticker--3d" aria-hidden="true">
        <Suspense fallback={null}>
          <SmoothCircularBanner />
        </Suspense>
      </div>
    </h1>
  )
}



function SkillsMarquee() {
  const sequence = [...SKILLS_MARQUEE, ...SKILLS_MARQUEE, ...SKILLS_MARQUEE]
  return (
    <div className="skills__mark" aria-hidden="true">
      <div className="skills__ticker">
        <div className="skills__ticker-track">
          {sequence.map((item, index) => (
            <span className="skills__ticker-item" key={`${item}-${index}`}>
              {item}
              <span className="skills__ticker-sep">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}


export default function App() {
  const scrollProgress = useRef(0)
  const [progress, setProgress] = useState(0)
  const [stageClip, setStageClip] = useState(0)
  useEffect(() => {
    const update = () => {
      const skillsEl = document.getElementById('skills')
      const endTop = skillsEl
        ? skillsEl.offsetTop + skillsEl.offsetHeight
        : 0
      const next =
        endTop > 0
          ? clamp01(window.scrollY / endTop)
          : (() => {
              const max =
document.documentElement.scrollHeight - window.innerHeight
              return max > 0 ? clamp01(window.scrollY / max) : 0
            })()
      scrollProgress.current = next
      setProgress(next)
      // Hard stop: particles never draw below skills
      if (skillsEl) {
        const bottom = skillsEl.getBoundingClientRect().bottom
        setStageClip(Math.max(0, window.innerHeight - bottom))
      } else {
        setStageClip(0)
      }
    }
    update()
        window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  const summaryVisible =
    clamp01((progress - 0.06) / 0.22) * (1 - clamp01((progress - 0.32) / 0.16))
  const heroChrome = 1 - clamp01((progress - 0.38) / 0.12)
  const showMarquee = summaryVisible < 0.08
  const marqueeOpacity = showMarquee ? heroChrome : 0
  const worldFade = 1 - clamp01((progress - 0.72) / 0.18)
  return (
    <main className="page">
      <div
        className="world-stage"
        aria-hidden="true"
        style={{
          opacity: worldFade,
          visibility: worldFade < 0.02 ? 'hidden' : 'visible',
          pointerEvents: 'none',
          clipPath:
            stageClip > 0 ? `inset(0 0 ${stageClip}px 0)` : undefined,
        }}
      >
        <Suspense fallback={null}>
          <WorldScene scrollProgress={scrollProgress} />
        </Suspense>
      </div>
      <SceneLoader />

       <section className="scroll-story" aria-label="Syed Kabeer Ahmed">
        <div className="scroll-story__sticky">
          <div className="hero">
            <div className="hero__watermark" aria-hidden="true">
              <svg
                className="hero__watermark-svg"
                viewBox="0 0 100 36"
                preserveAspectRatio="none"
              >

            <defs>
                  <mask id="heroGlassTextMask">
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
                   <linearGradient id="heroGlassGlintBeam" x1="0%" y1="0%" x2="100%" y2="100%">
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
                 <g mask="url(#heroGlassTextMask)">
                  <rect
                    className="hero__watermark-glint"
                    x="-60"
                    y="-10"
                    width="70"
                    height="60"
                    fill="url(#heroGlassGlintBeam)"
                  />
                </g>
              </svg>
            </div>
            <div
              className="hero__carousel-chrome"
              style={{
                opacity: marqueeOpacity,
                visibility: showMarquee ? 'visible' : 'hidden',
              }}
              aria-hidden={!showMarquee}
            >
              <ArcCuts />
              {showMarquee ? <HeroMarkTicker /> : null}
            </div>
            <div className="hero__vignette" aria-hidden="true" style={{ opacity: heroChrome }} />
             <aside
              className="hero__panel hero__panel--left"
              style={{
                opacity: summaryVisible,
                transform: `translateY(-50%) translateX(${(1 - summaryVisible) * -2.5}rem)`,
              }}
            >
              <h2 className="hero__panel-title">Summary</h2>
              <p className="hero__panel-text">{SUMMARY}</p>
            </aside>
            <p className="hero__contacts" style={{ opacity: Math.max(heroChrome, 0.35) }}>
             <a className="hero__contacts-phone" href="tel:+923142070876">
                <svg
                  className="hero__contacts-phone-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M7.2 3.5c.4-.4 1-.5 1.5-.3l2.2.9c.5.2.8.7.7 1.2l-.4 2.3c-.1.4.1.8.4 1.1l1.5 1.5c.3.3.7.5 1.1.4l2.3-.4c.5-.1 1 .2 1.2.7l.9 2.2c.2.5.1 1.1-.3 1.5l-1.1 1.1c-.9.9-2.2 1.2-3.4.8-2.5-.8-4.8-2.5-6.6-4.9-1.1-1.5-1.8-3.2-2-4.9-.2-1.2.3-2.3 1.2-3.1l1.1-1.1z"
                  />
                </svg>
                +92-314-2070876
              </a>
               <span className="hero__contacts-sep" aria-hidden="true">
                ·
              </span>
              <a href="mailto:syedkabeerahmed12@gmail.com">syedkabeerahmed12@gmail.com</a>
              <span className="hero__contacts-sep" aria-hidden="true">
                ·
              </span>
              <a
                href="https://www.linkedin.com/in/syedkabeerahmed/"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/syedkabeerahmed
              </a>
            </p>
             <p className="hero__credit" style={{ opacity: heroChrome }}>
              Model: iron-man_mark_85__rigged.glb
            </p>
          </div>
        </div>
      </section>
      <SkillsSection />
      <ArcReactorTimeline />
      <EducationSection />
    </main>
  )
}

function SkillsSection() {
  return (
    <section className="skills" id="skills" aria-label="Tools and Technologies">
      <SkillsMarquee />
      <div className="skills__content">
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
                <span className="skills__value">{tool.items}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
