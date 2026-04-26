import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { LogIn, UserPlus, ShieldCheck, GraduationCap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student', 
    rollNumber: '', phone: '', parentPhone: '', hostel: '', roomNumber: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const { data } = await API.post('/auth/login', { 
          email: formData.email, 
          password: formData.password 
        });
        login(data);
      } else {
        await API.post('/auth/register', formData);
        setIsLogin(true);
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* Left Side: Branding & Image */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(99, 102, 241, 0.8)), url("/hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <Building2 size={80} style={{ marginBottom: '2rem' }} />
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1, color: '#fff' }}>Hostel GatePass Portal</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Digital management system for modern university hostels. Secure, fast, and easy for students and staff.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'var(--bg-main)' }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card" 
          style={{ width: '100%', maxWidth: '480px', padding: '3rem' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{isLogin ? 'Login to manage your gate passes' : 'Register to simplify hostel entry/exit'}</p>
          </div>

          {error && <div style={{ color: 'var(--error)', background: '#fee2e2', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="input-group">
                <label className="label">Full Name</label>
                <input type="text" placeholder="Johnathan Doe" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            )}
            
            <div className="input-group">
              <label className="label">Email Address</label>
              <input type="email" placeholder="example@univ.edu" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            {!isLogin && (
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="label">User Role</label>
                <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="admin">Hostel Admin</option>
                  <option value="guard">Security Personnel</option>
                </select>
              </div>
            )}

            {!isLogin && formData.role === 'student' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="label">Roll Number</label>
                    <input type="text" placeholder="2021-CS-12" onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label className="label">Hostel No</label>
                    <input type="text" placeholder="Block A" onChange={(e) => setFormData({...formData, hostel: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="label">Room Number</label>
                    <input type="text" placeholder="Room 402" onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label className="label">Student Mobile</label>
                    <input type="text" placeholder="+91 98765 43210" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <label className="label">Password</label>
              <input type="password" placeholder="••••••••" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
              {isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {isLogin ? "New student?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', marginLeft: '0.5rem', cursor: 'pointer' }}
              >
                {isLogin ? 'Register Here' : 'Login Back'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
