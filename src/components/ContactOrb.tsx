import { useState } from 'react'
import './ContactOrb.css'

const CONTACTS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/syedkabeerahmed/',
    target: '_blank',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.56V9H3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/923142070876',
    target: '_blank',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96s-.47-.15-.67.15-.77.96-.94 1.16-.35.22-.64.07a8.07 8.07 0 0 1-2.38-1.47 8.94 8.94 0 0 1-1.65-2.05c-.17-.3 0-.46.13-.6s.3-.35.44-.52.2-.3.3-.5.05-.37-.02-.52-.67-1.6-.91-2.2c-.24-.57-.48-.5-.67-.5h-.57a1.1 1.1 0 0 0-.8.37 3.34 3.34 0 0 0-1.04 2.48 5.8 5.8 0 0 0 1.2 3.07 13.26 13.26 0 0 0 5.07 4.48c.71.3 1.26.49 1.69.62a4.06 4.06 0 0 0 1.87.12 3.06 3.06 0 0 0 2.01-1.42 2.5 2.5 0 0 0 .17-1.42c-.07-.13-.27-.2-.57-.35zM12 0A12 12 0 0 0 1.08 17.6L0 24l6.59-1.73A12 12 0 1 0 12 0zm0 21.82a9.82 9.82 0 0 1-5-1.37l-.36-.21-3.72.97.99-3.62-.23-.37A9.84 9.84 0 1 1 12 21.82z" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:syedkabeerahmed12@gmail.com',
    target: '_self',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
]

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
