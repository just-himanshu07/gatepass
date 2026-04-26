import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Check, X, LogOut, LayoutDashboard, ListFilter, Users, 
  Phone, Inbox, BarChart3, TrendingUp, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const { user, logout } = useAuth();

  useEffect(() => { 
    if (activeTab === 'analytics') {
      fetchStats();
    } else {
      fetchRequests(); 
    }
  }, [activeTab]);

  const fetchRequests = async () => { 
    try { 
      const { data } = await API.get(activeTab === 'pending' ? '/passes/pending' : '/passes/all'); 
      setRequests(data); 
    } catch (err) { console.error(err); } 
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/passes/stats');
      setStats(data);
    } catch (err) { console.error(err); }
  };

  const handleStatus = async (id, status) => { 
    try { 
      await API.patch(`/passes/${id}/status`, { status }); 
      fetchRequests(); 
    } catch (err) { alert('Failed to update status'); } 
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'white', borderRight: '1px solid var(--border)', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
            <LayoutDashboard size={20} />
          </div>
          <h2 style={{ fontSize: '1.2rem' }}>Hostel <span style={{ color: 'var(--primary)' }}>Admin</span></h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('pending')} 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              background: activeTab === 'pending' ? 'var(--indigo-soft)' : 'transparent',
              color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <Inbox size={18} /> New Requests
          </button>
          <button 
            onClick={() => setActiveTab('all')} 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              background: activeTab === 'all' ? 'var(--indigo-soft)' : 'transparent',
              color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <ListFilter size={18} /> History Logs
          </button>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              background: activeTab === 'analytics' ? 'var(--indigo-soft)' : 'transparent',
              color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <BarChart3 size={18} /> Analytics
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="var(--secondary)" />
            </div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>Admin Staff</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Superuser</p>
            </div>
          </div>
          <button onClick={logout} className="btn-outline" style={{ width: '100%', borderRadius: '10px', color: 'var(--error)' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            {activeTab === 'pending' ? 'Pending Requests' : activeTab === 'all' ? 'All Pass History' : 'System Analytics'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Gate activity and statistical overview</p>
        </header>

        {activeTab === 'analytics' && stats ? (
          <div className="grid">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ background: 'var(--indigo-soft)', padding: '1rem', borderRadius: '12px', color: 'var(--primary)' }}><TrendingUp size={28} /></div>
              <div><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Requests</p><h2 style={{ fontSize: '2rem' }}>{stats.total}</h2></div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
              <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '12px', color: 'var(--warning)' }}><AlertCircle size={28} /></div>
              <div><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending</p><h2 style={{ fontSize: '2rem' }}>{stats.pending || 0}</h2></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--success)' }}>
              <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '12px', color: 'var(--success)' }}><CheckCircle2 size={28} /></div>
              <div><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Approved</p><h2 style={{ fontSize: '2rem' }}>{stats.approved || 0}</h2></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', color: 'var(--secondary)' }}><LogOut size={28} /></div>
              <div><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Already Used</p><h2 style={{ fontSize: '2rem' }}>{stats.used || 0}</h2></div>
            </motion.div>
          </div>
        ) : (
          <div className="grid">
            {requests.map((req) => (
              <motion.div layout key={req._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{req.student?.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.student?.email}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`badge badge-${req.status}`} style={{ display: 'block', marginBottom: '0.3rem' }}>{req.status}</div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Req: {new Date(req.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-main)', padding: '0.8rem', borderRadius: '12px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hostel Info</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{req.student?.hostel} - {req.student?.roomNumber}</p>
                  </div>
                  <div style={{ background: 'var(--bg-main)', padding: '0.8rem', borderRadius: '12px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Roll No</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{req.student?.rollNumber}</p>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.6rem' }}>
                  <div className="flex" style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}><Phone size={14} /> Student: {req.student?.phone}</div>
                  <div className="flex" style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}><Phone size={14} /> {req.relation}: {req.parentPhone}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                  <div style={{ padding: '1rem', borderLeft: '4px solid var(--primary)', background: 'var(--bg-main)', borderRadius: '0 8px 8px 0' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>REASON</p>
                    <p style={{ fontWeight: '600' }}>{req.reason}</p>
                  </div>
                  <div style={{ padding: '1rem', borderLeft: '4px solid var(--warning)', background: 'var(--bg-main)', borderRadius: '0 8px 8px 0' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>EXPECTED DEPARTURE</p>
                    <p style={{ fontWeight: '600' }}>{new Date(req.departureTime).toLocaleString()}</p>
                  </div>
                </div>

                {req.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button onClick={() => handleStatus(req._id, 'approved')} className="btn btn-primary" style={{ flex: 1, background: 'var(--success)' }}>
                      <Check size={18} /> Approve
                    </button>
                    <button onClick={() => handleStatus(req._id, 'rejected')} className="btn btn-outline" style={{ flex: 1, color: 'var(--error)' }}>
                      <X size={18} /> Reject
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab !== 'analytics' && requests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '10rem 0' }}>
            <Inbox size={64} color="var(--border)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ color: 'var(--text-muted)' }}>All Clear!</h2>
            <p style={{ color: 'var(--text-muted)' }}>{activeTab === 'pending' ? 'No new gate pass requests at the moment.' : 'No pass logs found in the archives.'}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
