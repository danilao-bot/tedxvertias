'use client';

import Cursor from '@/components/Cursor';

export default function EmailContent() {
  const handleSync = () => {
    const title = "TEDxVeritasUni — The Stage Is Set";
    const location = "Veritas NLT (New Lecture Theater)";
    const description = "You are on the list. The dialogue begins soon.";
    const startDate = "20260516T090000";
    const endDate = "20260516T120000";

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        "SUMMARY:" + title,
        "DESCRIPTION:" + description,
        "LOCATION:" + location,
        "DTSTART:" + startDate,
        "DTEND:" + endDate,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\n");
      const blob = new Blob([ics], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "TEDxVeritasUni.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      window.open(
        "https://calendar.google.com/calendar/render?action=TEMPLATE"
        + "&text=" + encodeURIComponent(title)
        + "&dates=" + startDate + "/" + endDate
        + "&location=" + encodeURIComponent(location)
        + "&details=" + encodeURIComponent(description)
      );
    }
  };

  return (
    <>
      <Cursor />
      <div style={{ background: 'radial-gradient(circle at center, #1a0205 0%, #000000 70%)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480, backgroundColor: '#050505', borderRadius: 40, boxShadow: '0 0 120px rgba(0,0,0,0.95)' }}>
        <div style={{ border: '2px solid #c9a86a', borderRadius: 38, padding: 8 }}>
          <div style={{ border: '1px solid rgba(201,168,106,0.25)', borderRadius: 30, padding: '38px 32px 50px', position: 'relative', overflow: 'hidden', background: '#070707' }}>
            
            {/* Spotlight */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 480, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, left: '28%', width: 80, height: 80, background: 'radial-gradient(circle, rgba(255,255,220,0.25) 0%, transparent 70%)', filter: 'blur(10px)' }}></div>
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-55%)', width: 0, height: 0, borderLeft: '230px solid transparent', borderRight: '100px solid transparent', borderTop: '460px solid rgba(255,252,235,0.055)', filter: 'blur(18px)' }}></div>
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-60%)', width: 0, height: 0, borderLeft: '110px solid transparent', borderRight: '50px solid transparent', borderTop: '320px solid rgba(255,255,255,0.07)', filter: 'blur(8px)' }}></div>
            </div>

            {/* Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: 8, position: 'relative', zIndex: 10 }}>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1, marginBottom: 10 }}>
                <span style={{ color: '#EB0028' }}>TED</span><span style={{ color: '#EB0028', fontSize: 14, verticalAlign: 'super', fontWeight: 700 }}>x</span><span style={{ color: '#ffffff' }}>VeritasUni</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 8.5, fontWeight: 500, letterSpacing: 1.8, color: '#888', textTransform: 'uppercase' }}>
                <span style={{ flex: 1, maxWidth: 55, height: 1, background: 'rgba(255,255,255,0.2)' }}></span>
                Independently Organized TED Event
                <span style={{ flex: 1, maxWidth: 55, height: 1, background: 'rgba(255,255,255,0.2)' }}></span>
              </div>
            </div>

            {/* Logo */}
            <div style={{ position: 'relative', width: 220, height: 220, margin: '15px auto 22px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
              <div style={{ position: 'absolute', width: 210, height: 210, borderRadius: '50%', background: 'radial-gradient(circle, rgba(235,0,40,0.22) 0%, transparent 68%)', animation: 'pulse 4s ease-in-out infinite' }}></div>
              <div style={{ position: 'absolute', width: 170, height: 170, borderRadius: '50%', border: '1.5px solid rgba(235,0,40,0.4)', boxShadow: '0 0 18px rgba(235,0,40,0.18), inset 0 0 18px rgba(235,0,40,0.08)' }}></div>
              <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', border: '1px solid rgba(235,0,40,0.2)' }}></div>
              <img src="/tv-logo.svg" alt="TV Logo" style={{ width: 128, height: 128, position: 'relative', zIndex: 3, filter: 'drop-shadow(0 0 28px rgba(235,0,40,0.55)) drop-shadow(0 0 55px rgba(235,0,40,0.2))' }} />
            </div>

            {/* Title */}
            <h2 style={{ fontSize: 58, fontWeight: 900, lineHeight: 0.88, textAlign: 'center', letterSpacing: -2, textTransform: 'uppercase', position: 'relative', zIndex: 4, marginBottom: 0 }}>
              <span style={{ display: 'block', color: '#ffffff', textShadow: '0 2px 30px rgba(255,255,255,0.08)' }}>THE STAGE</span>
              <span style={{ display: 'block', color: '#c8c8c8' }}>IS SET<span style={{ color: '#EB0028' }}>.</span></span>
            </h2>

            {/* Stage Arcs */}
            <div style={{ position: 'relative', height: 130, margin: '-10px -32px 0', overflow: 'hidden', zIndex: 3 }}>
              {[680, 600, 520, 440, 360, 280, 200].map((w, i) => (
                <div key={i} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', width: w, height: 240 - i * 20, top: 28 + i * 10, border: `${2 - i * 0.15}px solid rgba(${90 - i * 15},${90 - i * 15},${90 - i * 15},${0.55 - i * 0.05})` }}></div>
              ))}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 55, background: 'linear-gradient(to top, rgba(20,2,2,0.75) 0%, transparent 100%)' }}></div>
            </div>

            {/* Subtitle */}
            <p style={{ textAlign: 'center', fontSize: 17, color: '#999', fontWeight: 500, margin: '22px 0', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
              You are on the list.<br/>The dialogue begins soon.
            </p>

            {/* Body */}
            <p style={{ textAlign: 'center', fontSize: 12.5, color: '#5f5f5f', lineHeight: 1.75, maxWidth: 360, margin: '0 auto 32px', position: 'relative', zIndex: 2 }}>
              Preparation is in the final stages. The lights are being positioned, the speakers are ready, and the ideas are set to collide. You've secured your place in the room where the status quo is challenged. Stay sharp.
            </p>

            {/* Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '24px 0', marginBottom: 32, position: 'relative', zIndex: 2 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 9.5, fontWeight: 700, color: '#EB0028', letterSpacing: 2, marginBottom: 9, textTransform: 'uppercase' }}>01 / DATE</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#c0c0c0', lineHeight: 1.5 }}>Saturday,<br/>May 16, 2026</span>
              </div>
              <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ display: 'block', fontSize: 9.5, fontWeight: 700, color: '#EB0028', letterSpacing: 2, marginBottom: 9, textTransform: 'uppercase' }}>02 / DOORS</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#c0c0c0', lineHeight: 1.5 }}>09:00 AM<br/>Prompt</span>
              </div>
              <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ display: 'block', fontSize: 9.5, fontWeight: 700, color: '#EB0028', letterSpacing: 2, marginBottom: 9, textTransform: 'uppercase' }}>03 / VENUE</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#c0c0c0', lineHeight: 1.5 }}>Veritas NLT<br/>(New Lecture Theater)</span>
              </div>
            </div>

            {/* Button */}
            <button onClick={handleSync} style={{ width: '100%', background: 'linear-gradient(90deg, #EB0028 0%, #9b001a 100%)', color: 'white', border: 'none', padding: 20, borderRadius: 10, fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 800, letterSpacing: 2.5, cursor: 'pointer', boxShadow: '0 8px 28px rgba(235,0,40,0.38)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', textTransform: 'uppercase', position: 'relative', zIndex: 2 }}>
              SYNC TO CALENDAR
            </button>

            <p style={{ textAlign: 'center', fontSize: 10.5, color: '#3d3d3d', marginTop: 18, letterSpacing: 0.3, position: 'relative', zIndex: 2 }}>No ticket required. Your registration is your access.</p>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 50, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 2 }}>
              <svg style={{ width: 13, height: 13, marginBottom: 14, opacity: 0.4, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
              <p style={{ fontSize: 11, color: '#3c3c3c', letterSpacing: 1.8, textTransform: 'uppercase' }}>Ideas worth spreading. See you at Veritas.</p>
            </div>

          </div>
        </div>
      </div>
      </div>
    </>
  );
}