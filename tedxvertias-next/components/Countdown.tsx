'use client';
import { useState, useEffect } from 'react';

export default function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const eventDate = new Date('2026-05-16T09:00:00');
    
    function updateCD() {
      const diff = eventDate.getTime() - Date.now();
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({ days: d, hours: h, mins: m, secs: s });
    }
    
    updateCD();
    const interval = setInterval(updateCD, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="countdown-section">
      <span className="cd-eyebrow reveal">The Clock Is Running</span>
      <h2 className="cd-title reveal rd1">THE COUNTDOWN HAS BEGUN</h2>
      <p className="cd-date-line reveal rd2">Saturday, 16th May 2026 · New Lecture Theatre, Veritas University, Abuja</p>
      <div className="cd-grid reveal rd3">
        <div className="cd-block"><span className="cd-num">{String(time.days).padStart(3, '0')}</span><span className="cd-unit">Days</span></div>
        <div className="cd-block"><span className="cd-num">{String(time.hours).padStart(2, '0')}</span><span className="cd-unit">Hours</span></div>
        <div className="cd-block"><span className="cd-num">{String(time.mins).padStart(2, '0')}</span><span className="cd-unit">Minutes</span></div>
        <div className="cd-block"><span className="cd-num">{String(time.secs).padStart(2, '0')}</span><span className="cd-unit">Seconds</span></div>
      </div>
    </section>
  );
}