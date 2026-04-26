import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import API from '../utils/api';
import { Shield, CheckCircle, XCircle, LogOut, ScanLine, User as UserIcon, Clock, Phone, Home, Keyboard, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const GuardScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [manualId, setManualId] = useState('');
  const [passDetails, setPassDetails] = useState(null);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { 
      fps: 10, 
      qrbox: { width: 300, height: 300 },
      rememberLastUsedCamera: true
    });

    scanner.render((result) => { 
      scanner.clear(); 
      handleVerify(result); 
    }, (err) => {});
    
    return () => scanner.clear();
  }, []);

  const handleVerify = async (passId) => {
    const idToVerify = passId || manualId;
    if (!idToVerify) return;
    
    setScanResult(idToVerify);
    setError('');
    setPassDetails(null);
    try { 
      const { data } = await API.get(`/passes/details/${idToVerify}`); 
      setPassDetails(data); 
    } catch (err) { 
      setError('System Error: Invalid or Unrecognized Pass ID'); 
    }
  };

  const confirmPass = async () => {
    try { 
      await API.patch(`/passes/verify/${scanResult}`); 
      alert('Action Logged Successfully!'); 
      window.location.reload(); 
    } catch (err) { 
      const msg = err.response?.data?.message || 'Verification Failed';
      const techError = err.response?.data?.error || '';
      alert(`⚠️ Verification Error: ${msg}\n\nTechnical Detail: ${techError}`); 
    }
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <nav className="guard-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Shield size={32} color="#4f46e5" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>Security Panel <span className="hide-on-mobile" style={{ color: '#4f46e5' }}>Terminal</span></h1>
        </div>
        <button onClick={logout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', background: 'transparent' }}>
          <LogOut size={18} /><span className="hide-on-mobile">Exit Terminal</span>
        </button>
      </nav>

      <div className="container guard-container">
        <div className="guard-grid">
          
          {/* Scanner & Manual Input */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem' }}>
              <ScanLine size={48} color="#4f46e5" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Gate Verification</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Scan QR or type Pass ID below</p>
            </div>
            
            <div className="glass" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '32px', border: '2px solid #4f46e5', overflow: 'hidden', marginBottom: '2rem' }}>
              <div id="reader"></div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                <Keyboard size={20} />
                <span style={{ fontWeight: '600' }}>Manual Entry Override</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <input 
                  type="text" 
                  placeholder="Enter Pass ID (GP-XXXX)" 
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value.toUpperCase())}
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', flex: 1, padding: '1rem', borderRadius: '12px' }}
                />
                <button onClick={() => handleVerify()} className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: '12px' }}>
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <AnimatePresence mode="wait">
            {(passDetails || error) && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card guard-card" style={{ background: '#fff', color: '#0f172a' }}>
                {error ? (
                  <div style={{ textAlign: 'center' }}>
                    <XCircle size={64} color="var(--error)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Verification Failed</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ width: '100%' }}>Reset Terminal</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                      <div style={{ background: 'var(--indigo-soft)', padding: '0.8rem', borderRadius: '50%' }}>
                        <CheckCircle size={32} color="var(--primary)" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.5rem' }}>Student Authenticated</h2>
                        <div className={`badge badge-${passDetails.status}`}>{passDetails.status}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                      <div className="guard-flex-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px', flex: 1 }}>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.4rem' }}>STUDENT NAME</p>
                          <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>{passDetails.student?.name}</p>
                        </div>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px', flex: 1 }}>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.4rem' }}>ROLL NUMBER</p>
                          <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>{passDetails.student?.rollNumber}</p>
                        </div>
                      </div>

                      <div className="guard-flex-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="flex" style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', flex: 1, fontSize: '0.9rem' }}>
                          <Home size={16} color="var(--primary)" /> {passDetails.student?.hostel} - {passDetails.student?.roomNumber}
                        </div>
                        <div className="flex" style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', flex: 1, fontSize: '0.9rem' }}>
                          <Phone size={16} color="var(--primary)" /> {passDetails.student?.phone}
                        </div>
                      </div>

                      <div style={{ background: 'var(--indigo-soft)', padding: '1.5rem', borderRadius: '16px', marginTop: '1rem' }}>
                        <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', marginBottom: '0.5rem' }}>PARENT CONTACT ({passDetails.relation})</p>
                        <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{passDetails.parentPhone}</p>
                      </div>
                    </div>

                    {passDetails.status === 'approved' ? (
                      <button 
                        onClick={confirmPass} 
                        className="btn btn-primary" 
                        style={{ width: '100%', marginTop: '2.5rem', height: '60px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '800' }}
                      >
                        CONFIRM STUDENT EXIT
                      </button>
                    ) : (
                      <div style={{ padding: '1.5rem', background: '#fee2e2', color: '#991b1b', borderRadius: '16px', marginTop: '2rem', textAlign: 'center', fontWeight: '800' }}>
                        ⛔ EXPIRED / ALREADY USED
                      </div>
                    )}
                    
                    <button onClick={() => window.location.reload()} className="btn-outline" style={{ border: 'none', color: 'var(--text-muted)', width: '100%', marginTop: '1rem' }}>
                       Reset Console
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GuardScanner;
