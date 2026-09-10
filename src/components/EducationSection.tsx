import './EducationSection.css'


const HIGHLIGHTS = [
  {
    num: '01',
    title: 'Software Engineering & Architecture',
    desc: 'Core principles of Object-Oriented Design, System Architecture, Software Development Life Cycle (SDLC), and Agile/Scrum methodologies.',
  },
  {
    num: '02',
    title: 'Data Structures & Algorithms',
    desc: 'Advanced problem-solving, complexity analysis (Big-O), search/sort optimization, tree & graph data structures.',
  },
  {
    num: '03',
    title: 'Web Engineering & API Architecture',
    desc: 'Full-stack application development, RESTful web services, database schema design, and asynchronous event-driven systems.',
  },
  {
    num: '04',
    title: 'Database Management Systems & Security',
    desc: 'Relational & NoSQL database management, query optimization, data security, encryption, and authorization protocols.',
  },
] as const

// Public-folder asset — set via BASE_URL here (rather than a hardcoded
// leading "/" in the CSS url()) so it still resolves once the site is
// deployed under a subpath, e.g. GitHub Pages' /<repo>/.
const EDUCATION_BG_URL = `${import.meta.env.BASE_URL}assets/Gemini_Generated_Image_fv75m2fv75m2fv75.jpg`

export function EducationSection() {
  return (
    <section className="education" id="education" aria-label="Education">
      <div
        className="education__bg"
        aria-hidden="true"
        style={{ backgroundImage: `url(${EDUCATION_BG_URL})` }}
      />
      <div className="education__vignette" aria-hidden="true" />

      {/* Hero title at the very top */}
      <div className="education__hero">
        <p className="education__eyebrow">Academic Foundation</p>
        <h2 className="education__title">
          Federal Urdu University of Arts, Science &amp; Technology
        </h2>
      </div>

      {/* Content panel */}
      <div className="education__panel">
        <div className="education__card-badge">BSCS · Computer Science</div>
        <h3 className="education__degree">
          Bachelor of Science in Computer Science (BSCS)
        </h3>
        <p className="education__meta">
          <span>Karachi, Sindh, Pakistan</span>
          <span className="education__sep">|</span>
          <span>2016 — 2020</span>
        </p>

        <div className="education__highlights-title">
          Key Academic Focus &amp; Core Modules
        </div>

        <div className="education__grid">
          {HIGHLIGHTS.map((item) => (
            <div key={item.num} className="education__item">
              <span className="education__num" aria-hidden="true">■</span>
              <div className="education__item-body">
                <h4 className="education__item-title">{item.title}</h4>
                <p className="education__item-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
