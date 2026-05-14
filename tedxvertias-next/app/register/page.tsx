'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Cursor from '@/components/Cursor';

export default function RegisterPage() {
  const [status, setStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const deptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatus(val);

    const deptInput = deptInputRef.current;
    const alumniMsg = document.getElementById('alumniMessage');

    if (val === 'Guest' || val === 'Alumni') {
      if (deptInput) {
        deptInput.style.display = 'none';
        deptInput.required = false;
        deptInput.value = 'N/A';
      }
      if (alumniMsg) {
        alumniMsg.style.display = 'block';
        alumniMsg.innerText = val === 'Alumni'
          ? 'Welcome back! Alumni do not need to specify a department.'
          : 'Welcome guest! Guests do not need to specify a department.';
      }
    } else {
      if (deptInput) {
        deptInput.style.display = 'block';
        deptInput.required = true;
        deptInput.value = '';
      }
      if (alumniMsg) {
        alumniMsg.style.display = 'none';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { error: supabaseError } = await supabase
        .from('registrations')
        .insert([data]);

      if (supabaseError) throw new Error(supabaseError.message);

      setShowSuccess(true);
      setTimeout(() => setSuccessVisible(true), 50);

      setTimeout(() => {
        window.location.href = '/email';
      }, 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Cursor />
      <style dangerouslySetInnerHTML={{ __html: `
        .register-page a {
          text-decoration: none;
          color: inherit;
        }
        .register-page nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 20px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .register-page .logo {
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: 18px;
          color: #fff;
        }
        .register-page .logo span {
          color: #EB0028;
        }
        .register-page .back-btn {
          color: #9a9a9a;
          font-size: 13px;
          transition: 0.3s;
        }
        .register-page .back-btn:hover {
          color: #fff;
        }
        .register-page .main {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 60px;
          position: relative;
        }
        .register-page .main::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(235, 0, 40, 0.08), transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(235, 0, 40, 0.06), transparent 40%);
        }
        .register-page .wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .register-page .left-panel {
          padding: 20px;
        }
        .register-page .label {
          color: #EB0028;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 4px;
          font-weight: 700;
          margin-bottom: 18px;
          display: block;
        }
        .register-page .hero-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 54px;
          font-weight: 900;
          line-height: 0.95;
          margin-bottom: 22px;
          color: #fff;
        }
        .register-page .hero-title span:first-child {
          color: #EB0028;
        }
        .register-page .hero-title .theme-text {
          display: block;
          color: #fff;
          margin-top: 8px;
        }
        .register-page .glitch {
          position: relative;
          display: inline-block;
        }
        .register-page .glitch::before,
        .register-page .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          opacity: 0;
        }
        .register-page .glitch::before {
          color: #ff0040;
          animation: glitch1 4s infinite;
        }
        .register-page .glitch::after {
          color: #00ff88;
          animation: glitch2 4s infinite;
        }
        @keyframes glitch1 {
          0%, 90%, 100% { opacity: 0; transform: none; }
          91% { opacity: 0.7; transform: translate(-3px, 0) skewX(-2deg); }
          93% { opacity: 0; }
        }
        @keyframes glitch2 {
          0%, 94%, 100% { opacity: 0; transform: none; }
          95% { opacity: 0.5; transform: translate(3px, 0) skewX(1deg); }
          97% { opacity: 0; }
        }
        .register-page .hero-title .theme-text .red-text {
          color: #fff;
        }
        .register-page .hero-sub {
          font-size: 16px;
          line-height: 1.9;
          color: #9a9a9a;
          margin-bottom: 18px;
        }
        .register-page .meta {
          margin-top: 28px;
          font-size: 14px;
          color: #fff;
          line-height: 2;
        }
        .register-page .form-card {
          background: #121212;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 42px;
          position: relative;
        }
        .register-page .form-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 40px;
          right: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #EB0028, transparent);
        }
        .register-page .form-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 8px;
        }
        .register-page .form-sub {
          color: #9a9a9a;
          font-size: 14px;
          margin-bottom: 28px;
          line-height: 1.7;
        }
        .register-page .form-group {
          margin-bottom: 20px;
        }
        .register-page .form-group label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #777;
          margin-bottom: 8px;
        }
        .register-page .form-group input,
        .register-page .form-group select {
          width: 100%;
          padding: 15px 16px;
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 14px;
          font-family: 'Space Grotesk', sans-serif;
          transition: 0.3s;
        }
        .register-page .form-group select option {
          background: #000;
          color: #fff;
        }
        .register-page .form-group input:focus,
        .register-page .form-group select:focus {
          outline: none;
          border-color: #EB0028;
          box-shadow: 0 0 40px rgba(235, 0, 40, 0.18);
          background: rgba(235, 0, 40, 0.03);
        }
        .register-page .form-group input::placeholder {
          color: #666;
          transition: 0.3s;
        }
        .register-page .form-group input:focus::placeholder {
          opacity: 0.5;
          transform: translateX(5px);
        }
        .register-page button[type="submit"] {
          width: 100%;
          padding: 16px;
          border: none;
          background: #EB0028;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
        }
        .register-page button[type="submit"]:hover {
          transform: scale(1.02);
          box-shadow: 0 0 40px rgba(235, 0, 40, 0.18);
        }
        .register-page .success {
          display: none;
          text-align: center;
          padding: 30px 0;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }
        .register-page .success.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .register-page .success i {
          font-size: 48px;
          color: #EB0028;
          margin-bottom: 18px;
        }
        .register-page .success h2 {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .register-page .success p {
          color: #9a9a9a;
          line-height: 1.8;
        }
        .register-page .register-btn {
          display: inline-block;
          margin-top: 24px;
          background: #EB0028;
          color: #fff;
          padding: 14px 32px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          transition: 0.3s;
          text-decoration: none;
        }
        .register-page .register-btn:hover {
          box-shadow: 0 0 40px rgba(235, 0, 40, 0.18);
          transform: scale(1.02);
        }
        .register-page #errorMessage {
          display: none;
          background: rgba(235, 0, 40, 0.1);
          border: 1px solid #EB0028;
          color: #EB0028;
          padding: 12px;
          margin-bottom: 20px;
          font-size: 13px;
          border-radius: 4px;
        }
        .register-page #errorMessage.visible {
          display: block;
        }
        @media(max-width: 900px) {
          .register-page .wrapper {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .register-page .left-panel {
            text-align: center;
            padding: 0;
          }
          .register-page .hero-title {
            font-size: 38px;
          }
        }
        @media(max-width: 600px) {
          .register-page nav {
            padding: 16px 20px;
          }
          .register-page .form-card {
            padding: 28px 20px;
          }
          .register-page .hero-title {
            font-size: 30px;
          }
          .register-page .hero-sub {
            font-size: 14px;
          }
        }
      ` }} />

      <div className="register-page">
        <nav>
          <Link href="/" className="logo"><span>TEDx</span>VeritasUni</Link>
          <Link href="/" className="back-btn">
            <i className="fa fa-arrow-left"></i> Back Home
          </Link>
        </nav>

        <section className="main">
          <div className="wrapper">

            <div className="left-panel reveal">
              <span className="label rd1">Register to Attend</span>

              <h1 className="hero-title rd2">
                <span>TEDx</span> Veritas Uni
                <span className="theme-text">
                  <span className="glitch" data-text="NEO-">NEO-</span>
                  <span className="red-text glitch" data-text="INTELLIGENCE">INTELLIGENCE</span>
                </span>
              </h1>

              <p className="hero-sub rd2">
                Shaping an Intelligent Africa Through Innovation and Culture.
              </p>

              <p className="hero-sub rd3">
                Step into a transformative experience where bold ideas meet Africa&apos;s future.
                Explore how intelligence — human, artificial, cultural, and emotional —
                can be harnessed to drive innovation and reshape the African narrative.
              </p>

              <p className="hero-sub rd3">
                Join thinkers, creators, and leaders building a smarter,
                more adaptive Africa.
              </p>

              <div className="meta rd4">
                Veritas University, Abuja <br/>
                Saturday, 16th May 2026
              </div>
            </div>

            <div className="form-card reveal rd2">
              <div id="formSection" style={{ display: showSuccess ? 'none' : 'block' }}>
                <h2 className="form-title">Reserve Your Seat</h2>
                <p className="form-sub">
                  Complete your registration to attend TEDx Veritas University.
                </p>

                <form id="registrationForm" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="full_name" placeholder="e.g Daniel Chibuike" required />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="e.g daniel@email.com" required />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" placeholder="+234..." required />
                  </div>

                  <div className="form-group" id="statusGroup">
                    <label>Status</label>
                    <select name="status" id="statusSelect" value={status} onChange={handleStatusChange} required>
                      <option value="">Select your category</option>
                      <option value="UnderGraduate">UnderGraduate</option>
                      <option value="PostGraduate">PostGraduate</option>
                      <option value="Staff">Staff</option>
                      <option value="Guest">Guest</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>

                  <div className="form-group" id="departmentGroup">
                    <label>Department / Unit</label>
                    <input
                      ref={deptInputRef}
                      type="text"
                      name="department"
                      id="departmentInput"
                      placeholder="e.g Computer Science"
                      required
                    />
                    <div id="alumniMessage" style={{ display: 'none', fontSize: 12, color: '#9a9a9a', marginTop: 8 }}></div>
                  </div>

                  <div id="errorMessage" className={error ? 'visible' : ''}>
                    <i className="fa fa-triangle-exclamation"></i> <span id="errorText">{error}</span>
                  </div>

                  <button type="submit" id="submitBtn" disabled={loading}>
                    {loading ? <><i className="fa fa-spinner fa-spin"></i> Processing...</> : 'Register Now'}
                  </button>
                </form>
              </div>

              <div className={`success ${successVisible ? 'visible' : ''}`} id="successMessage" style={{ display: showSuccess ? 'block' : 'none' }}>
                <i className="fa fa-circle-check"></i>
                <h2>Registration Successful</h2>
                <p>
                  Thank you for registering to attend TEDx Veritas University.
                  We look forward to seeing you there.
                </p>
                <Link href="/email" className="register-btn">
                  Sync to Calendar
                </Link>
              </div>
            </div>

          </div>
        </section>
      </div>


    </>
  );
}
