import { useEffect, useState } from 'react'
import './BackToTop.css'

// Replaces the old floating "Connect" orb now that the real Contact section
// (with its own LinkedIn/WhatsApp/Email links) covers that job — this is
// just a quick way back to the top after a long scroll.
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="#home"
      className={`back-to-top${visible ? ' back-to-top--visible' : ''}`}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </a>
  )
}
