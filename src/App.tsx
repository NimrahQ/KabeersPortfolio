import { Suspense, useEffect, useRef, useState } from 'react'
import { WorldScene } from './components/HeroScene'
import { ArcCuts } from './components/ArcCuts'
import { SmoothCircularBanner } from './components/BannerRibbon'
import { SceneLoader } from './components/SceneLoader'
import { Header } from './components/Header'
import { ArcReactorTimeline } from './components/ArcReactorTimeline'
import { EducationSection } from './components/EducationSection'
import { ContactOrb } from './components/ContactOrb'
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
  // Was fading 0.72→0.90, which overlapped the particle dissolve window
  // (0.68→0.92 in HeroScene) and hid the scattered particles before they'd
  // actually spread out. Now the canvas stays fully opaque through the
  // whole scatter and only fades right at the end of the Skills section.
  const worldFade = 1 - clamp01((progress - 0.9) / 0.1)
  return (
    <main className="page">
      <Header />
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

       <section className="scroll-story" id="home" aria-label="Syed Kabeer Ahmed">
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


          </div>
        </div>
      </section>
      <SkillsSection />
      <ArcReactorTimeline />
      <EducationSection />
      <ContactOrb />
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
                <div className="skills__tags">
                  {tool.items.split(', ').map((tag) => (
                    <span className="skills__tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
