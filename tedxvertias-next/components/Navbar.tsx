'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="nav-logo">
          <span className="r">TEDx</span><span className="w">VeritasUniverity</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="/register" className="btn-primary">Register to attend</Link></li>
          <li><a href="#about">About</a></li>
          <li><a href="#theme">Theme</a></li>
          <li><a href="#speakers">Speakers</a></li>
          <li><a href="#schedule">Schedule</a></li>
        </ul>
        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </div>
      </nav>
      
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobileMenu">
        <Link href="/register" className="btn-nav" onClick={() => setMenuOpen(false)}>Register to attend</Link>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#theme" onClick={() => setMenuOpen(false)}>Theme</a>
        <a href="#speakers" onClick={() => setMenuOpen(false)}>Speakers</a>
        <a href="#schedule" onClick={() => setMenuOpen(false)}>Schedule</a>
      </div>
    </>
  );
}