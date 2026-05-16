import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [confirm, setConfirm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setupInvisibleRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'login-btn', {
        size: 'invisible'
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('userId', result.user.uid);
      navigate('/home');
    } catch (e: any) { setError('Google failed'); }
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      localStorage.setItem('userId', result.user.uid);
      navigate('/home');
    } catch (e: any) { setError('Guest failed'); }
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (phone.length !== 10) return setError('Enter 10 digits');
    setLoading(true);
    try {
      setupInvisibleRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, (window as any).recaptchaVerifier);
      setConfirm(confirmation);
      setStep('otp');
      setError('');
    } catch (e: any) { 
      setError('SMS limit reached or domain not added');
      if ((window as any).recaptchaVerifier) (window as any).recaptchaVerifier.clear();
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div id="recaptcha-container"></div>
      <div style={cardStyle}>
        <h1 style={logoStyle}>⚡ ESPIRE</h1>
        <p style={subtitleStyle}>Ultimate Esports Platform</p>

        {step === 'input' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* ROW 1: Google & Phone Number Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
               <button onClick={handleGoogleLogin} style={smallGoogleBtn}>
                 <img src="https://www.google.com/favicon.ico" width={20} />
               </button>
               <div style={inputGroupStyle}>
                 <span style={prefixStyle}>+91</span>
                 <input 
                   type="tel" placeholder="Mobile Number" 
                   value={phone} onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                   style={inputStyle} 
                 />
               </div>
            </div>

            {/* ROW 2: Primary Action Button */}
            <button id="login-btn" onClick={handleSendOTP} disabled={loading} style={primaryBtnStyle}>
              {loading ? 'Processing...' : 'Continue with Phone'}
            </button>

            {/* ROW 3: Guest Login (Visual Distinction) */}
            <div style={{ margin: '8px 0', borderTop: '1px solid #222', paddingTop: '12px' }}>
              <button onClick={handleGuestLogin} style={guestBtnStyle}>
                Explore as Guest
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <input 
              type="tel" placeholder="6-digit OTP" value={otp} 
              onChange={e => setOtp(e.target.value)} style={otpInputStyle} 
            />
            <button onClick={() => confirm.confirm(otp).then(() => navigate('/home'))} style={primaryBtnStyle}>
              Verify & Login
            </button>
            <button onClick={() => setStep('input')} style={{background:'none', border:'none', color:'#666', marginTop:'10px', cursor:'pointer'}}>Edit Number</button>
          </div>
        )}
        {error && <p style={{color:'#ff4444', fontSize:'12px', marginTop:'10px'}}>{error}</p>}
      </div>
    </div>
  );
}

// --- Premium Styles ---
const containerStyle: any = { minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' };
const cardStyle: any = { background: '#0f0f12', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '360px', border: '1px solid #1f1f23', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const logoStyle: any = { fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '1px', marginBottom: '4px' };
const subtitleStyle: any = { color: '#555', fontSize: '13px', marginBottom: '24px' };

const smallGoogleBtn: any = { background: '#fff', border: 'none', borderRadius: '12px', width: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const inputGroupStyle: any = { flex: 1, display: 'flex', background: '#16161a', borderRadius: '12px', border: '1px solid #26262c', overflow: 'hidden' };
const prefixStyle: any = { padding: '12px 8px', color: '#555', borderRight: '1px solid #26262c', fontSize: '14px' };
const inputStyle: any = { flex: 1, background: 'transparent', border: 'none', padding: '12px', color: '#fff', outline: 'none', fontSize: '14px' };

const primaryBtnStyle: any = { width: '100%', padding: '14px', borderRadius: '12px', background: '#8b5cf6', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: '0.2s' };
const guestBtnStyle: any = { width: '100%', padding: '12px', borderRadius: '12px', background: '#1a1a1f', color: '#888', border: '1px solid #26262c', cursor: 'pointer', fontSize: '14px' };
const otpInputStyle: any = { width: '100%', background: '#16161a', border: '1px solid #26262c', padding: '14px', borderRadius: '12px', color: '#fff', textAlign: 'center', letterSpacing: '4px', marginBottom: '12px', outline: 'none' };
