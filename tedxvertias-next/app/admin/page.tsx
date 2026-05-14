'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cursor from '@/components/Cursor';

const API_URL = 'http://localhost:5000/api';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: {}, certificatesSent: 0, certificatesPending: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [batchStatus, setBatchStatus] = useState(null);
  const [error, setError] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/admin/registrations?status=${filter}`, {
        headers: { email, password }
      });
      
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
        setIsLoggedIn(true);
        fetchStats();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Could not connect to server. Make sure it\'s running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { email, password }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchRegistrations = async () => {
    try {
      const url = `${API_URL}/admin/registrations?status=${filter}${search ? `&search=${search}` : ''}`;
      const res = await fetch(url, {
        headers: { email, password }
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      }
    } catch (err) {
      console.error('Failed to fetch registrations');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRegistrations();
    }
  }, [filter, search, isLoggedIn]);

  const sendCertificate = async (userId) => {
    setSendingId(userId);
    try {
      const res = await fetch(`${API_URL}/certificate/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', email, password },
        body: JSON.stringify({ userId })
      });
      
      if (res.ok) {
        alert('Certificate sent successfully!');
        fetchRegistrations();
        fetchStats();
      } else {
        const data = await res.json();
        alert('Failed: ' + data.error);
      }
    } catch (err) {
      alert('Error sending certificate');
    } finally {
      setSendingId(null);
    }
  };

  const sendAllCertificates = async () => {
    const categoryLabel = filter !== 'all' ? ` (${filter} category)` : '';
    if (!confirm(`Send certificates to all pending participants${categoryLabel}? This may take a while.`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/certificate/send-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', email, password },
        body: JSON.stringify({ category: filter })
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        // Poll for status
        const interval = setInterval(async () => {
          const statusRes = await fetch(`${API_URL}/certificate/status`, {
            headers: { email, password }
          });
          if (statusRes.ok) {
            const status = await statusRes.json();
            setBatchStatus(status);
            if (!status.isRunning) {
              clearInterval(interval);
              fetchRegistrations();
              fetchStats();
              setLoading(false);
            }
          }
        }, 3000);
      }
    } catch (err) {
      alert('Error starting batch send');
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Cursor />
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: 400, background: '#111', padding: 40, borderRadius: 12, border: '1px solid #222' }}>
            <h1 style={{ color: '#EB0028', fontSize: 28, textAlign: 'center', marginBottom: 8, fontFamily: 'Montserrat, sans-serif' }}>
              TED<span style={{ color: '#fff' }}>x</span>Admin
            </h1>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: 30, fontSize: 14 }}>Sign in to manage registrations</p>
            
            {error && <div style={{ background: 'rgba(235,0,40,0.1)', border: '1px solid #EB0028', color: '#EB0028', padding: 12, marginBottom: 20, borderRadius: 4, fontSize: 13 }}>{error}</div>}
            
            <form onSubmit={login}>
              <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #222', color: '#fff', fontSize: 14, marginBottom: 12, borderRadius: 4 }} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #222', color: '#fff', fontSize: 14, marginBottom: 20, borderRadius: 4 }} />
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: 14, background: '#EB0028', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, borderRadius: 4, cursor: 'pointer' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: 20, color: '#666', textDecoration: 'none', fontSize: 13 }}>← Back to Home</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Cursor />
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
        {/* Header */}
        <header style={{ background: '#111', padding: '20px 40px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link href="/" style={{ color: '#EB0028', textDecoration: 'none', fontSize: 20, fontWeight: 700 }}>TED<span style={{ color: '#fff' }}>x</span>VeritasUniversity</Link>
            <span style={{ color: '#666', marginLeft: 20, fontSize: 14 }}>Admin Dashboard</span>
          </div>
          <button onClick={() => setIsLoggedIn(false)} style={{ background: 'transparent', border: '1px solid #333', color: '#666', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Sign Out</button>
        </header>

        {/* Stats */}
        <div style={{ padding: '30px 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <div style={{ background: '#111', padding: 24, borderRadius: 8, border: '1px solid #222' }}>
            <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>TOTAL REGISTRATIONS</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#EB0028' }}>{stats.total}</div>
          </div>
          <div style={{ background: '#111', padding: 24, borderRadius: 8, border: '1px solid #222' }}>
            <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>CERTIFICATES SENT</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#00c853' }}>{stats.certificatesSent}</div>
          </div>
          <div style={{ background: '#111', padding: 24, borderRadius: 8, border: '1px solid #222' }}>
            <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>PENDING</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#ffab00' }}>{stats.certificatesPending}</div>
          </div>
          <div style={{ background: '#111', padding: 24, borderRadius: 8, border: '1px solid #222' }}>
            <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>ACTIONS</div>
            <button onClick={sendAllCertificates} disabled={loading || stats.certificatesPending === 0}
              style={{ background: '#EB0028', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600 }}>
              {loading ? 'Sending...' : 'Send All Pending'}
            </button>
          </div>
        </div>

        {/* Batch Status */}
        {batchStatus?.isRunning && (
          <div style={{ margin: '0 40px', background: '#1a1a1a', padding: 20, borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: '#EB0028', fontWeight: 600 }}>Sending Certificates...</span>
              <span style={{ color: '#666' }}>{batchStatus.processed} / {batchStatus.total}</span>
            </div>
            <div style={{ background: '#333', height: 8, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ background: '#EB0028', height: '100%', width: `${(batchStatus.processed / batchStatus.total) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ padding: '0 40px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '10px 16px', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: 4, fontSize: 13 }}>
            <option value="all">All Categories</option>
            <option value="UnderGraduate">UnderGraduate</option>
            <option value="PostGraduate">PostGraduate</option>
            <option value="Staff">Staff</option>
            <option value="Guest">Guest</option>
            <option value="Alumni">Alumni</option>
          </select>
          
          <input type="text" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '10px 16px', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: 4, fontSize: 13, width: 250 }} />
        </div>

        {/* Table */}
        <div style={{ padding: '0 40px 40px' }}>
          <div style={{ background: '#111', borderRadius: 8, border: '1px solid #222', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#161616', borderBottom: '1px solid #222' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Department</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Certificate</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '14px 16px', fontSize: 14 }}>{r.full_name}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#888' }}>{r.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: '#EB0028', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#888' }}>{r.department || '-'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#666' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {r.certificate_sent ? (
                        <span style={{ color: '#00c853', fontSize: 12 }}>✓ Sent</span>
                      ) : (
                        <span style={{ color: '#ffab00', fontSize: 12 }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button onClick={() => sendCertificate(r.id)} disabled={sendingId === r.id || r.certificate_sent}
                        style={{ background: r.certificate_sent ? '#222' : '#EB0028', color: r.certificate_sent ? '#666' : '#fff', border: 'none', padding: '6px 14px', borderRadius: 4, cursor: r.certificate_sent ? 'default' : 'pointer', fontSize: 11, fontWeight: 600 }}>
                        {sendingId === r.id ? 'Sending...' : r.certificate_sent ? 'Sent' : 'Send'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {registrations.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>No registrations found</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}