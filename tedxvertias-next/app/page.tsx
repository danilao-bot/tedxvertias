'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroCanvas from '@/components/HeroCanvas';
import Countdown from '@/components/Countdown';
import Cursor from '@/components/Cursor';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Cursor />
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <HeroCanvas />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-eyebrow reveal">Veritas University Abuja &nbsp;</div>
          <h1 className="hero-headline">
            <span className="line-neo glitch reveal rd2" data-text="NEO-">NEO-</span>
            <span className="line-intel glitch reveal rd3" data-text="INTELLIGENCE">INTELLIGENCE</span>
          </h1>
          <p className="hero-sub reveal rd3">...Shaping an Intelligent Africa Through Innovation and Culture.</p>
          <p className="hero-date reveal rd4">
            <strong>Saturday, 16th May 2026</strong><br className="mobile-break" /> New Lecture Theatre, Veritas University, Abuja
          </p>
          <div className="hero-buttons reveal rd5">
            <Link href="/register" className="btn-primary">Register to attend<i className="fa fa-arrow-right" style={{fontSize: '10px'}}></i></Link>
          </div>
        </div>
        <div className="scroll-ind">
          <span>Scroll</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* THEME SECTION */}
      <section className="theme-section" id="theme">
        <div className="max-w">
          <div className="theme-header">
            <div className="theme-tag reveal">The Theme</div>
            <div className="theme-title reveal rd1">
              <span className="t1">Neo-</span>
              <span className="t2">Intelligence</span>
            </div>
            <p className="theme-tagline reveal rd2">Shaping an Intelligent Africa Through Innovation and Culture</p>
          </div>

          <div className="theme-body reveal">
            <p>Africa is at a pivotal moment — where intelligence is no longer limited to logic or machines. Neo-Intelligence is the fusion of human creativity, cultural depth, and technological innovation. A new African mindset that blends the brilliance of our people with the power of intelligent systems.</p>
            <p>It is a call for Africa to rethink how it thinks — and build a future where our intelligence, innovation, and imagination define our destiny.</p>
          </div>

          <div className="theme-questions reveal rd1">
            <h4>Essential Questions We Must Confront</h4>
            <ul>
              <li>What does intelligence mean for a continent with the world's youngest population?</li>
              <li>How can Africa use data, AI, and innovation to transform governance, development, and daily life?</li>
              <li>What mindsets, skills, and values must our students and leaders develop to thrive in an intelligent future?</li>
              <li>How do we ensure that African identity, creativity, and community wisdom guide — not follow — the rise of new technologies?</li>
            </ul>
          </div>

          <div className="pillars">
            <div className="pillar-card reveal">
              <span className="pillar-num">PILLAR 01</span>
              <div className="pillar-title">Neo-Governance & Civic Intelligence</div>
              <ul className="pillar-items">
                <li>Smart governance & digital accountability</li>
                <li>Technology for transparency and anti-corruption</li>
                <li>Citizen participation & digital democracy</li>
                <li>Data-driven policy, public services, and security</li>
                <li>Strengthening African institutions through intelligent tools</li>
              </ul>
            </div>
            <div className="pillar-card reveal rd1">
              <span className="pillar-num">PILLAR 02</span>
              <div className="pillar-title">Intelligent Development & Economic Transformation</div>
              <ul className="pillar-items">
                <li>AI for economic growth and job creation</li>
                <li>Transforming SMEs and informal markets with digital tools</li>
                <li>Smart agriculture, fintech, logistics, and manufacturing</li>
                <li>Future of work for African youth</li>
                <li>Building resilient, tech-enabled African economies</li>
              </ul>
            </div>
            <div className="pillar-card reveal rd2">
              <span className="pillar-num">PILLAR 03</span>
              <div className="pillar-title">Human Potential, Education & Talent Evolution</div>
              <ul className="pillar-items">
                <li>AI-enhanced learning and the future classroom</li>
                <li>Bridging Africa's digital and skills gap</li>
                <li>Cognitive intelligence, problem-solving, creativity</li>
                <li>Youth empowerment and tech readiness</li>
                <li>Mental agility, leadership, and human brilliance in the AI age</li>
              </ul>
            </div>
            <div className="pillar-card reveal rd3">
              <span className="pillar-num">PILLAR 04</span>
              <div className="pillar-title">Culture, Creativity & Artistic Intelligence</div>
              <ul className="pillar-items">
                <li>African creativity in an intelligence-driven world</li>
                <li>Cultural intelligence as a driver of development</li>
                <li>Preserving and evolving African identity in a global digital age</li>
                <li>Creative imagination in shaping intelligent systems</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COLLAB / ABOUT */}
      <section className="collab" id="about">
        <div className="max-w">
          <div className="collab-header">
            <span className="section-label reveal">Why This Matters</span>
            <h2 className="section-headline reveal rd1">Where Global Ideas Meet<br/>Academic Truth</h2>
            <p className="section-sub reveal rd2">Two institutions. One unstoppable mission.</p>
          </div>
          <div className="collab-grid" style={{marginBottom: '72px'}}>
            <div className="collab-col reveal">
              <span className="col-badge badge-r">TEDx Global</span>
              <h3>The Platform That Moves the World</h3>
              <p>TEDx is the independently organized arm of TED — the global platform trusted by over 3,000 communities in 170+ countries. It exists to spread ideas that challenge, inspire, and change the way we see the world.</p>
            </div>
            <div className="collab-col reveal rd2">
              <span className="col-badge badge-g">Veritas University</span>
              <h3>Truth. Growth. African Excellence.</h3>
              <p>TEDx Veritas University is an independent, staff and student-driven platform dedicated to spreading ideas that shape the future. Rooted in the global TED mission of "ideas worth spreading," TEDxVeritasUniversity brings together some of the brightest thinkers, innovators, creators, and change-makers.</p>
            </div>
          </div>
          <div className="stats-bar reveal">
            <div className="stat-card">
              <span className="stat-num">3<span className="a">,</span>000<span className="a">+</span></span>
              <span className="stat-desc">TEDx Events Worldwide</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">1<span className="a">∞</span></span>
              <span className="stat-desc">University. Infinite Ideas.</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">ABJ<span className="a">·</span>1</span>
              <span className="stat-desc">Abuja's Premier TEDx Stage</span>
            </div>
          </div>
        </div>
      </section>

      {/* SPEAKER CATEGORIES */}
      <section className="speakers" id="speakers">
        <div className="max-w">
          <div className="speakers-header">
            <span className="section-label reveal">The Voices</span>
            <h2 className="section-headline reveal rd1">Who Takes the Stage</h2>
            <p className="section-sub reveal rd2">Thinkers. Builders. Changemakers.</p>
          </div>
          <div className="spk-cats-grid">
            <div className="spk-cat-card reveal">
              <span className="spk-cat-num">01</span>
              <div className="spk-cat-title">AI & Emerging Technology Experts</div>
              <div className="spk-cat-desc">Leading professionals in AI, ML, robotics, and data science showcasing how intelligent systems reshape African industries.</div>
            </div>
            <div className="spk-cat-card reveal rd1">
              <span className="spk-cat-num">02</span>
              <div className="spk-cat-title">Human Development & Cognitive Performance</div>
              <div className="spk-cat-desc">Experts in neuroscience, psychology, education, and talent development examining how African minds can thrive in an AI-augmented world.</div>
            </div>
            <div className="spk-cat-card reveal rd2">
              <span className="spk-cat-num">03</span>
              <div className="spk-cat-title">Industry Innovators & Tech Entrepreneurs</div>
              <div className="spk-cat-desc">Founders and startup leaders driving disruptive solutions across Africa.</div>
            </div>
            <div className="spk-cat-card reveal rd1">
              <span className="spk-cat-num">04</span>
              <div className="spk-cat-title">Ethicists, Policy Leaders & Social Innovators</div>
              <div className="spk-cat-desc">Thought leaders exploring how Africa navigates the moral and societal implications of AI and emerging technologies.</div>
            </div>
            <div className="spk-cat-card reveal rd2">
              <span className="spk-cat-num">05</span>
              <div className="spk-cat-title">Creative Thinkers, Artists & Futurists</div>
              <div className="spk-cat-desc">Artists and cultural innovators at the intersection of African creativity, imagination, and intelligence.</div>
            </div>
            <div className="spk-cat-card reveal rd3">
              <span className="spk-cat-num">06</span>
              <div className="spk-cat-title">Student Innovators & Emerging Leaders</div>
              <div className="spk-cat-desc">Veritas University students presenting pioneering research, entrepreneurial projects, and creative initiatives.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="schedule" id="schedule">
        <div className="max-w">
          <div className="schedule-header">
            <span className="section-label reveal">Saturday, 16th May 2026</span>
            <h2 className="section-headline reveal rd1">Programme of Events</h2>
            <p className="section-sub reveal rd2">A day of ideas, conversations, and transformation.</p>
          </div>
          <div className="timeline">
            <div className="tl-item reveal"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-green"></div><div className="tl-content"><div className="tl-event">Registration & Welcome Reception</div><div className="tl-desc">Attendees arrive, register, and network before the programme begins.</div></div></div>
            <div className="tl-item reveal rd1"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-red"></div><div className="tl-content"><div className="tl-event">Opening Ceremony</div><div className="tl-desc">Welcome address from the TEDxVeritasUniversity organising team and the Vice Chancellor.</div></div></div>
            <div className="tl-item reveal rd1"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-red"></div><div className="tl-content"><div className="tl-event">Keynote Address 1</div><div className="tl-desc">The first keynote of the day — setting the tone for Neo-Intelligence.</div></div></div>
            <div className="tl-item reveal rd2"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-red"></div><div className="tl-content"><div className="tl-event">TEDx Talks — Session 1</div><div className="tl-desc">First series of curated TEDx talks on Neo-Governance, Civic Intelligence, and Digital Africa.</div></div></div>
            <div className="tl-item reveal rd1"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-muted"></div><div className="tl-content"><div className="tl-event">Coffee / Networking Break</div><div className="tl-desc">Refreshments, sponsor showcase, and open networking.</div></div></div>
            <div className="tl-item reveal rd2"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-red"></div><div className="tl-content"><div className="tl-event">Panel Discussion 1</div><div className="tl-desc">Speakers engage in a moderated panel on the future of African intelligence.</div></div></div>
            <div className="tl-item reveal rd1"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-red"></div><div className="tl-content"><div className="tl-event">TEDx Talks — Session 2</div><div className="tl-desc">Talks on Human Potential, Education, and Talent Evolution in the AI age.</div></div></div>
            <div className="tl-item reveal rd2"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-green"></div><div className="tl-content"><div className="tl-event">Workshop / Interactive Session 1</div><div className="tl-desc">Hands-on sessions bringing ideas into action.</div></div></div>
            <div className="tl-item reveal rd1"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-muted"></div><div className="tl-content"><div className="tl-event">Lunch & Networking</div><div className="tl-desc">Break for lunch, informal conversations, and sponsor exhibitions.</div></div></div>
            <div className="tl-item reveal rd2"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-red"></div><div className="tl-content"><div className="tl-event">Keynote Address 2</div><div className="tl-desc">The afternoon keynote — a powerful voice on the future Africa must build.</div></div></div>
            <div className="tl-item reveal rd1"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-red"></div><div className="tl-content"><div className="tl-event">TEDx Talks — Session 3</div><div className="tl-desc">Culture, Creativity, and Artistic Intelligence — the final talk session of the day.</div></div></div>
            <div className="tl-item reveal rd2"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-green"></div><div className="tl-content"><div className="tl-event">Student Showcase / Hackathon Pitch</div><div className="tl-desc">Veritas University students present pioneering research, startups, and creative projects.</div></div></div>
            <div className="tl-item reveal rd1"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-red"></div><div className="tl-content"><div className="tl-event">Panel Discussion 2</div><div className="tl-desc">Final panel — bringing together the day's themes into a unified call to action.</div></div></div>
            <div className="tl-item reveal rd2"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-green"></div><div className="tl-content"><div className="tl-event">Closing Remarks</div><div className="tl-desc">Final words, acknowledgements, and a mandate: Ideas don't end here — they begin.</div></div></div>
            <div className="tl-item reveal rd3"><div className="tl-time"><span>TBD</span></div><div className="tl-dot d-muted"></div><div className="tl-content"><div className="tl-event">Networking & Exhibition / Photo Session</div><div className="tl-desc">Celebrate, connect, and capture the moment. The conversation continues.</div></div></div>
          </div>
        </div>
      </section>

      <Countdown />

      {/* FOOTER */}
      <footer>
        <div className="max-w">
          <div className="footer-main">
            <div>
              <span className="footer-logo"><span className="r">TEDx</span>VeritasUniversity</span>
              <p className="footer-tagline">"Ideas worth spreading, from a university built on truth."</p>
              <div className="social-links">
                <a href="https://www.linkedin.com/company/101272185/admin/dashboard/" className="social-link"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://www.tiktok.com/@tedxveritas" className="social-link"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
            <div>
              <p className="footer-col-title">Quick Links</p>
              <ul className="footer-links">
                <li><a href="#about">About</a></li>
                <li><a href="#theme">Theme</a></li>
                <li><a href="#speakers">Speakers</a></li>
                <li><a href="#schedule">Schedule</a></li>
                <li><Link href="/register">Register to Attend</Link></li>
              </ul>
            </div>
            <div>
              <p className="footer-col-title">The Event</p>
              <ul className="footer-links">
                <li><a href="#">TEDx Guidelines</a></li>
                <li><Link href="/register">Volunteer</Link></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 TEDxVeritasUniversity · Licensed by TED · All rights reserved.</span>
            <span className="footer-powered">Powered by Veritas University Abuja</span>
          </div>
        </div>
      </footer>
    </>
  );
}