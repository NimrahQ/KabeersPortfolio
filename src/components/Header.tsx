import { useEffect, useState } from 'react'
import './Header.css'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#skills', label: 'Stack' },
  { href: '#career', label: 'Career' },
  { href: '#education', label: 'Education' },
] as const

const CONTACT_HREF = 'mailto:syedkabeerahmed12@gmail.com'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep the mobile drawer from being stuck open if the viewport grows back
  // past the breakpoint (e.g. rotating a tablet, or resizing a browser).
  useEffect(() => {
    if (!menuOpen) return
    const onResize = () => {
      if (window.innerWidth > 820) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`site-header${scrolled ? ' site-header--scrolled' : ''}${
        menuOpen ? ' site-header--menu-open' : ''
      }`}
    >
      <div className="site-header__inner">
        <a className="site-header__brand" href="#home" onClick={closeMenu}>
          <span className="site-header__brand-mark" aria-hidden="true">
            SKA
          </span>
          <span className="site-header__brand-name">Syed Kabeer Ahmed</span>
        </a>

        <nav className="site-header__nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="site-header__link">
              {link.label}
            </a>
          ))}
        </nav>

        <a className="site-header__cta" href={CONTACT_HREF}>
          Let&rsquo;s Talk
        </a>

        <button
          type="button"
          className="site-header__toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className="site-header__mobile-nav" aria-label="Mobile">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="site-header__mobile-link"
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}
        <a className="site-header__mobile-cta" href={CONTACT_HREF} onClick={closeMenu}>
          Let&rsquo;s Talk
        </a>
      </nav>
    </header>
  )
}
