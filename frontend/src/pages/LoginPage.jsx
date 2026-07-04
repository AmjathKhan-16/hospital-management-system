import { useState } from 'react';
import api from '../services/api.js';

const emptyRegister = {
  name: '',
  email: '',
  password: '',
  age: '',
  gender: 'male',
  medicalHistory: ''
};

const LoginPage = ({ onAuth }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const resetAlerts = () => {
    setMessage('');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetAlerts();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuth(data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetAlerts();
    try {
      const { data } = await api.post('/auth/register', { ...registerForm, role: 'patient' });
      setOtpEmail(data.email);
      setMode('verify');
      setRegisterForm(emptyRegister);
      setMessage(`OTP sent to ${data.email}. Development OTP: ${data.devOtp}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    resetAlerts();
    try {
      const { data } = await api.post('/auth/verify-otp', { email: otpEmail, otp });
      setMessage(data.message);
      setEmail(otpEmail);
      setMode('login');
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Online Hospital Management</p>
        <h1>Book care, verify patients, and manage appointments from one secure portal.</h1>
        <div className="feature-list">
          <span>OTP email verification</span>
          <span>Patient appointment booking</span>
          <span>Admin and doctor approvals</span>
        </div>
      </section>

      <section className="auth-panel card">
        <div className="tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Patient Signup</button>
          <button className={mode === 'verify' ? 'active' : ''} onClick={() => setMode('verify')}>Verify OTP</button>
        </div>

        {message && <p className="notice success">{message}</p>}
        {error && <p className="notice error">{error}</p>}

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <h2>Welcome back</h2>
            <div className="form-group">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn" type="submit">Login</button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <h2>Patient registration</h2>
            <div className="two-column">
              <div className="form-group"><label>Name</label><input value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required /></div>
              <div className="form-group"><label>Password</label><input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required /></div>
              <div className="form-group"><label>Age</label><input type="number" value={registerForm.age} onChange={(e) => setRegisterForm({ ...registerForm, age: e.target.value })} required /></div>
              <div className="form-group"><label>Gender</label><select value={registerForm.gender} onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            </div>
            <div className="form-group"><label>Medical history</label><textarea value={registerForm.medicalHistory} onChange={(e) => setRegisterForm({ ...registerForm, medicalHistory: e.target.value })} rows="3" /></div>
            <button className="btn" type="submit">Create patient account</button>
          </form>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerify}>
            <h2>Email OTP verification</h2>
            <div className="form-group"><label>Email</label><input type="email" value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)} required /></div>
            <div className="form-group"><label>OTP number</label><input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required /></div>
            <button className="btn" type="submit">Verify email</button>
          </form>
        )}
      </section>
    </div>
  );
};

export default LoginPage;