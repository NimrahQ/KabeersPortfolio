import { CONTACTS } from '../data/contacts'
import './ContactSection.css'

const EMAIL_HREF = 'mailto:syedkabeerahmed12@gmail.com'
const EMAIL_LABEL = 'syedkabeerahmed12@gmail.com'

export function ContactSection() {
  const year = new Date().getFullYear()

  return (
    <section className="contact-section" id="contact" aria-label="Contact">
      <div className="contact-section__bg" aria-hidden="true" />
      <div className="contact-section__vignette" aria-hidden="true" />

      <div className="contact-section__content">
        <p className="contact-section__eyebrow">Get In Touch</p>
        <h2 className="contact-section__title">Let&rsquo;s Build Something Great</h2>
        <p className="contact-section__text">
          Open to new opportunities, collaborations, and interesting
          conversations. Reach out through any of the channels below, or
          drop an email directly.
        </p>

        <a className="contact-section__cta" href={EMAIL_HREF}>
          {EMAIL_LABEL}
        </a>

        <ul className="contact-section__links">
          {CONTACTS.map((c) => (
            <li key={c.id}>
              <a
                className={`contact-section__link contact-section__link--${c.id}`}
                href={c.href}
                target={c.target}
                rel="noreferrer"
              >
                <span className="contact-section__link-icon">{c.icon}</span>
                <span className="contact-section__link-label">{c.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="contact-section__footer">
        <span>&copy; {year} Syed Kabeer Ahmed. All rights reserved.</span>
      </footer>
    </section>
  )
}
