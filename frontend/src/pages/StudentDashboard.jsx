import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Clock, QrCode, LogOut, FileText, User as UserIcon, Calendar, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = () => {
  const [passes, setPasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [selectedPass, setSelectedPass] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => { fetchPasses(); }, []);
  const fetchPasses = async () => { try { const { data } = await API.get('/passes/my'); setPasses(data); } catch (err) { console.error(err); } };
  const handleRequest = async (e) => { e.preventDefault(); try { await API.post('/passes/request', { reason, departureTime, parentPhone, relation }); setShowModal(false); fetchPasses(); } catch (err) { alert(err.response?.data?.message || 'Request failed'); } };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
            <FileText size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem' }}>GatePass <span style={{ color: 'var(--primary)' }}>Portal</span></h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
            <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.rollNumber}</p>
          </div>
          <button onClick={logout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Student Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage and track your hostel entry/exit requests</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}>
            <Plus size={20} /> New Request
          </button>
        </div>

        <div className="grid">
          {passes.map((pass) => (
            <motion.div layout key={pass._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Calendar size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>{new Date(pass.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`badge badge-${pass.status}`}>{pass.status}</div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--secondary)" />
                  {pass.reason}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <Clock size={16} />
                    <span>Departure: <strong>{new Date(pass.departureTime).toLocaleString()}</strong></span>
                  </div>
                </div>

                {(pass.status === 'approved' || pass.status === 'out') ? (
                  <button onClick={() => setSelectedPass(pass)} className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }}>
                    <QrCode size={18} /> Display Pass QR
                  </button>
                ) : (
                  <div style={{ padding: '0.8rem', background: 'var(--indigo-soft)', borderRadius: '12px', textAlign: 'center', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600' }}>
                    {pass.status === 'pending' ? 'Pending Approval' : 'Request Terminated'}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {passes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0', background: 'white', borderRadius: '24px', border: '2px dashed var(--border)' }}>
            <FileText size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text-muted)' }}>No Gate Passes Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click "New Request" to create your first pass.</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card"
            style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 style={{ marginBottom: '0.5rem' }}>Gate Pass Request</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please verify your details before submitting</p>

            <form onSubmit={handleRequest} className="modal-form">
              <div className="input-group">
                <label className="label">Student Name</label>
                <input type="text" value={user.name} disabled style={{ background: 'var(--bg-main)' }} />
              </div>
              <div className="input-group">
                <label className="label">Roll Number</label>
                <input type="text" value={user.rollNumber} disabled style={{ background: 'var(--bg-main)' }} />
              </div>
              <div className="input-group">
                <label className="label">Hostel & Room No</label>
                <input type="text" value={`${user.hostel} / ${user.roomNumber}`} disabled style={{ background: 'var(--bg-main)' }} />
              </div>
              <div className="input-group">
                <label className="label">Parent's Mobile No.</label>
                <input
                  type="text"
                  placeholder="9876543210"
                  required
                  maxLength={10}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="label">Relation (Father/Mother)</label>
                <input type="text" placeholder="e.g. Father" required onChange={(e) => setRelation(e.target.value)} />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="label">Reason for Leaving</label>
                <select required onChange={(e) => setReason(e.target.value)}>
                  <option value="">Select Category</option>
                  <option value="Home Visit">Going Home (Home Visit)</option>
                  <option value="Local Market">Local Market / Shopping</option>
                  <option value="Medical Emergency">Medical Emergency / Hospital</option>
                  <option value="Official Work">Official Academic Work</option>
                </select>
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="label">Expected Departure (Date & Time)</label>
                <input
                  type="datetime-local"
                  required
                  min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', gridColumn: 'span 2' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Discard</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Request</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* QR Code Viewer */}
      {selectedPass && (
        <div className="modal-overlay" onClick={() => setSelectedPass(null)}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="card"
            style={{ textAlign: 'center', maxWidth: '400px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1.5rem' }}>E-Pass Verification</h2>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)', marginBottom: '2rem', display: 'inline-block' }}>
              <QRCodeSVG value={selectedPass.passId} size={220} />
            </div>
            <div style={{ textAlign: 'left', background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem' }}>
              <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pass ID:</span>
                <span style={{ fontWeight: '700' }}>{selectedPass.passId}</span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{selectedPass.status.toUpperCase()}</span>
              </p>
            </div>
            <button onClick={() => setSelectedPass(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
