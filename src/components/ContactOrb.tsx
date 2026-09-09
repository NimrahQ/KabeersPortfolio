import { useState } from 'react'
import { CONTACTS } from '../data/contacts'
import './ContactOrb.css'

export function ContactOrb() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`contact-orb${open ? ' contact-orb--open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Circular text ring — SVG textPath */}
      <svg className="contact-orb__ring-svg" viewBox="0 0 140 140" aria-hidden="true">
        <defs>
          <path
            id="orb-circle-path"
            d="M 70,70 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
          />
        </defs>
        <text className="contact-orb__ring-text">
          <textPath href="#orb-circle-path" startOffset="0%">
            ✦ LINKEDIN · WHATSAPP · EMAIL · CONNECT ·
          </textPath>
        </text>
      </svg>

      {/* Contact icon buttons — fan UPWARD */}
      {CONTACTS.map((c, i) => (
        <a
          key={c.id}
          className={`contact-orb__item contact-orb__item--${c.id}`}
          href={c.href}
          target={c.target}
          rel="noreferrer"
          aria-label={c.label}
          style={{ '--i': i } as React.CSSProperties}
        >
          <span className="contact-orb__icon">{c.icon}</span>
          <span className="contact-orb__label">{c.label}</span>
        </a>
      ))}

      {/* Core circle */}
      <div className="contact-orb__core">
        <svg
          className="contact-orb__cursor-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
        </svg>
        <span className="contact-orb__hint">Connect</span>
      </div>
    </div>
  )
}
