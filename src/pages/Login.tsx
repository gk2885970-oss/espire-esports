import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  googleProvider,
  signInWithPopup,
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

  // Setup Invisible Recaptcha (No more math puzzles!)
  const setupInvisibleRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'login-button', {
        size: 'invisible',
        callback: () => { console.log('Recaptcha verified'); }
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('userId', result.user.uid);
      navigate('/home');
    } catch (e: any) {
      setError('Google login failed. Try again.');
    }
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (phone.length !== 10) return setError('Enter 10-digit number');
    setLoading(true);
    try {
      setupInvisibleRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
      setConfirm(confirmation);
      setStep('otp');
      setError('');
    } catch (e: any) {
      setError('SMS failed. Check authorized domains in Firebase.');
      if ((window as any).recaptchaVerifier) (window as any).recaptchaVerifier.clear();
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const result = await confirm.confirm(otp);
      localStorage.setItem('userId', result.user.uid);
      navigate('/home');
    } catch (e: any) {
      setError('Wrong OTP. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div id="recaptcha-container"></div>
      
      <div style={cardStyle}>
        <h1 style={logoStyle}>⚡ ESPIRE</h1>
        <p style={subtitleStyle}>Sign in to start earning</p>

        {step === 'input' ? (
          <>
            {/* Google Option First - Fastest */}
            <button onClick={handleGoogleLogin} disabled={loading} style={googleBtnStyle}>
              <img src="https://www.google.com/favicon.ico" width={18} />
              Continue with Google
            </button>

            <div style={dividerStyle}>OR</div>

            {/* Phone Option */}
            <div style={inputGroupStyle}>
              <span style={prefixStyle}>+91</span>
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
                style={inputStyle}
              />
            </div>

            <button id="login-button" onClick={handleSendOTP} disabled={loading} style={primaryBtnStyle}>
              {loading ? 'Sending...' : 'Continue with Phone'}
            </button>
          </>
        ) : (
          <>
            <h2 style={{fontSize: '18px', marginBottom: '10px'}}>Verify OTP</h2>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '20px'}}>Sent to +91 {phone}</p>
            <input
              type="tel"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{...inputStyle, textAlign: 'center', letterSpacing: '4px'}}
            />
            <button onClick={handleVerifyOTP} disabled={loading} style={primaryBtnStyle}>
              {loading ? 'Verifying...' : 'Login Now'}
            </button>
            <button onClick={() => setStep('input')} style={backLinkStyle}>Edit Number</button>
          </>
        )}

        {error && <p style={errorStyle}>{error}</p>}
      </div>
    </div>
  );
}

// --- Minimalist Styles ---
const containerStyle: any = { minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const cardStyle: any = { background: '#121212', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '380px', border: '1px solid #222', textAlign: 'center' };
const logoStyle: any = { fontSize: '2rem', fontWeight: '900', color: '#8b5cf6', marginBottom: '5px' };
const subtitleStyle: any = { color: '#666', fontSize: '14px', marginBottom: '30px' };
const googleBtnStyle: any = { width: '100%', padding: '12px', borderRadius: '12px', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' };
const dividerStyle: any = { margin: '20px 0', color: '#333', fontSize: '12px', fontWeight: 'bold' };
const inputGroupStyle: any = { display: 'flex', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', marginBottom: '15px', overflow: 'hidden' };
const prefixStyle: any = { padding: '12px', color: '#666', borderRight: '1px solid #333' };
const inputStyle: any = { flex: 1, background: 'transparent', border: 'none', padding: '12px', color: '#fff', outline: 'none' };
const primaryBtnStyle: any = { width: '100%', padding: '14px', borderRadius: '12px', background: '#8b5cf6', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' };
const backLinkStyle: any = { background: 'none', border: 'none', color: '#666', marginTop: '15px', cursor: 'pointer', fontSize: '13px' };
const errorStyle: any = { color: '#ef4444', fontSize: '13px', marginTop: '15px' };
