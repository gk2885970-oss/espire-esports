import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/index';

type Step = 'landing' | 'phone' | 'otp' | 'captcha';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('landing');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState('');
  const [captchaQ, setCaptchaQ] = useState({ q: '', answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate math captcha
  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaQ({ q: `${a} + ${b} = ?`, answer: a + b });
  };

  // STEP 1 — Send OTP
  const handleSendOTP = async () => {
    if (phone.length !== 10) return setError('Valid 10-digit number daalo');
    setLoading(true);
    try {
      const res = await api.sendOTP(phone);
      setOtpSent(res.otp); // dev mode mein otp return hoga
      generateCaptcha();
      setStep('otp');
      setError('');
    } catch {
      setError('OTP bhejne mein error aaya');
    }
    setLoading(false);
  };

  // STEP 2 — Verify OTP + Captcha
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return setError('6 digit OTP daalo');
    if (parseInt(captchaInput) !== captchaQ.answer)
      return setError('Captcha galat hai!');
    setLoading(true);
    try {
      const res = await api.verifyOTP(phone, otp);
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.userId);
      navigate('/dashboard');
    } catch {
      setError('OTP galat hai ya expire ho gaya');
    }
    setLoading(false);
  };

  // Google OAuth
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  // Guest Login
  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const res = await api.guestLogin();
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.userId);
      navigate('/dashboard');
    } catch {
      setError('Guest login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a1a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', color: 'white', padding: '20px'
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#7c3aed', margin: 0 }}>⚡ ESPIRE</h1>
        <p style={{ color: '#888', marginTop: '8px' }}>Esports ka next level</p>
      </div>

      <div style={{
        background: '#13131f', borderRadius: '16px',
        padding: '32px', width: '100%', maxWidth: '400px',
        border: '1px solid #2a2a3a'
      }}>

        {/* LANDING STEP */}
        {step === 'landing' && (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome Back!</h2>

            {/* Google Login */}
            <button onClick={handleGoogleLogin} style={btnStyle('#fff', '#000')}>
              <img src="https://www.google.com/favicon.ico" width={18} style={{ marginRight: 8 }} />
              Google se Login karo
            </button>

            <div style={{ textAlign: 'center', margin: '16px 0', color: '#555' }}>— ya —</div>

            {/* Phone Login */}
            <button onClick={() => setStep('phone')} style={btnStyle('#7c3aed', '#fff')}>
              📱 Mobile Number se Login
            </button>

            <div style={{ textAlign: 'center', margin: '16px 0', color: '#555' }}>— ya —</div>

            {/* Guest Login */}
            <button onClick={handleGuestLogin} style={btnStyle('#1a1a2e', '#888', '1px solid #333')}>
              👤 Guest ke taur pe continue karo
            </button>
          </>
        )}

        {/* PHONE STEP */}
        {step === 'phone' && (
          <>
            <h2 style={{ marginBottom: '24px' }}>📱 Mobile Number</h2>
            <div style={{ display: 'flex', marginBottom: '12px' }}>
              <span style={prefixStyle}>+91</span>
              <input
                type="tel" maxLength={10} value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                placeholder="10 digit number"
                style={inputStyle}
              />
            </div>
            {error && <p style={errorStyle}>{error}</p>}
            <button onClick={handleSendOTP} disabled={loading} style={btnStyle('#7c3aed', '#fff')}>
              {loading ? 'Bhej raha hun...' : 'OTP Bhejo'}
            </button>
            <button onClick={() => setStep('landing')} style={backBtn}>← Wapas</button>
          </>
        )}

        {/* OTP + CAPTCHA STEP */}
        {step === 'otp' && (
          <>
            <h2 style={{ marginBottom: '8px' }}>🔐 OTP Verify karo</h2>
            <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
              +91 {phone} pe bheja gaya
            </p>

            <input
              type="tel" maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
              placeholder="6 digit OTP"
              style={{ ...inputStyle, letterSpacing: '8px', fontSize: '20px', textAlign: 'center' }}
            />

            {/* Captcha */}
            <div style={{
              background: '#0a0a1a', borderRadius: '8px',
              padding: '16px', margin: '16px 0', textAlign: 'center'
            }}>
              <p style={{ color: '#aaa', marginBottom: '8px', fontSize: '13px' }}>Captcha solve karo:</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#7c3aed' }}>{captchaQ.q}</p>
              <input
                type="number" value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                placeholder="Answer"
                style={{ ...inputStyle, textAlign: 'center', marginTop: '8px' }}
              />
            </div>

            {error && <p style={errorStyle}>{error}</p>}

            <button onClick={handleVerifyOTP} disabled={loading} style={btnStyle('#7c3aed', '#fff')}>
              {loading ? 'Verify ho raha hai...' : '✅ Verify & Login'}
            </button>
            <button onClick={() => { setStep('phone'); setOtp(''); }} style={backBtn}>← Wapas</button>
          </>
        )}
      </div>
    </div>
  );
}

// Styles
const btnStyle = (bg: string, color: string, border = 'none'): any => ({
  width: '100%', padding: '14px', borderRadius: '10px',
  background: bg, color, border, fontSize: '15px',
  cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', marginBottom: '8px', fontWeight: '600'
});
const inputStyle: any = {
  flex: 1, padding: '12px', borderRadius: '8px',
  background: '#0a0a1a', border: '1px solid #333',
  color: 'white', fontSize: '16px', width: '100%', outline: 'none'
};
const prefixStyle: any = {
  padding: '12px', background: '#1a1a2e', borderRadius: '8px 0 0 8px',
  border: '1px solid #333', borderRight: 'none', color: '#aaa'
};
const errorStyle: any = { color: '#f87171', fontSize: '13px', marginBottom: '8px' };
const backBtn: any = {
  background: 'none', border: 'none', color: '#888',
  cursor: 'pointer', marginTop: '12px', fontSize: '14px'
};