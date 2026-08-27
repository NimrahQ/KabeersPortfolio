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
export function EducationSection() {
  return (
    <section className="education" id="education" aria-label="Education">
      <div className="education__bg" aria-hidden="true" />
      <div className="education__vignette" aria-hidden="true" />
      <div className="education__container">
        <header className="education__header">
          <div className="education__eyebrow-wrap">
            <span className="education__eyebrow-line" aria-hidden="true" />
            <p className="education__eyebrow">Academic Foundation</p>
            <span className="education__eyebrow-line" aria-hidden="true" />
          </div>
          <h2 className="education__title">Education</h2>
          <div className="education__title-divider" aria-hidden="true" />
        </header>
        <div className="education__card">
          <div className="education__card-header">
            <div className="education__card-badge">BSCS · Computer Science</div>
            <h3 className="education__institution">
              Federal Urdu University of Arts, Science &amp; Technology
            </h3>
            <p className="education__degree">
              Bachelor of Science in Computer Science (BSCS)
            </p>
            <p className="education__meta">
              <span className="education__location">Karachi, Sindh, Pakistan</span>
              <span className="education__sep">•</span>
              <span className="education__period">2016 — 2020</span>
            </p>
          </div>
          <div className="education__highlights-title">
            <span>Key Academic Focus &amp; Core Modules</span>
          </div>
          <div className="education__grid">
            {HIGHLIGHTS.map((item) => (
              <div key={item.num} className="education__item">
                <span className="education__num">{item.num}</span>
                <div className="education__item-body">
                  <h4 className="education__item-title">{item.title}</h4>
                  <p className="education__item-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
