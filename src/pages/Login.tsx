import { useState, useEffect } from 'react';
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

  // reCAPTCHA initialization
  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => { console.log('reCAPTCHA ready'); }
        });
      } catch (err) {
        console.error("reCAPTCHA Init Error:", err);
      }
    }
  }, []);

  // 1. Google Login Fix
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('token', result.user.uid); // 'token' for App.tsx
      navigate('/home');
    } catch (e: any) { 
      setError('Google Login failed'); 
    }
    setLoading(false);
  };

  // 2. Guest Login Fix
  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      localStorage.setItem('token', result.user.uid); // 'token' for App.tsx
      navigate('/home');
    } catch (e: any) { 
      setError('Guest Login failed'); 
    }
    setLoading(false);
  };

  // 3. Phone OTP Send Fix
  const handleSendOTP = async () => {
    if (phone.length !== 10) return setError('10 digit number dalo');
    setLoading(true);
    setError('');
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
      setConfirm(confirmation);
      setStep('otp');
    } catch (e: any) { 
      setError('OTP Send Error. Check Domain settings.');
      if ((window as any).recaptchaVerifier) (window as any).recaptchaVerifier.clear();
    }
    setLoading(false);
  };

  // 4. OTP Verify Fix
  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const result = await confirm.confirm(otp);
      localStorage.setItem('token', result.user.uid); // 'token' for App.tsx
      navigate('/home');
    } catch (e: any) {
      setError('Invalid OTP. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      {/* Recaptcha container outside conditional rendering to prevent crash */}
      <div id="recaptcha-container"></div>
      
      <div style={mobileCardStyle}>
        <div style={headerSection}>
          <h1 style={logoStyle}>⚡ ESPIRE</h1>
          <p style={tagline}>Ultimate Esports Experience</p>
        </div>

        {step === 'input' ? (
          <div style={formWrapper}>
            <div style={rowStyle}>
               <button onClick={handleGoogleLogin} style={googleIconBtn}>
                 <img src="https://www.google.com/favicon.ico" width={22} alt="G" />
               </button>
               <div style={phoneInputGroup}>
                 <span style={prefix}>+91</span>
                 <input 
                   type="tel" placeholder="Mobile Number" 
                   value={phone} onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                   style={inputField} 
                 />
               </div>
            </div>

            <button onClick={handleSendOTP} disabled={loading} style={mainActionBtn}>
              {loading ? 'Processing...' : 'Continue with Phone'}
            </button>

            <div style={divider}>OR</div>

            <button onClick={handleGuestLogin} style={guestBtn}>
              Explore as Guest
            </button>
          </div>
        ) : (
          <div style={otpWrapper}>
            <input 
              type="tel" placeholder="Enter 6-digit OTP" 
              value={otp} onChange={e => setOtp(e.target.value)} 
              style={otpInput} 
            />
            <button onClick={handleVerifyOTP} disabled={loading} style={mainActionBtn}>
              Verify & Login
            </button>
            <button onClick={() => setStep('input')} style={backLink}>Change Number</button>
          </div>
        )}
        
        {error && <div style={errorCard}>{error}</div>}
      </div>
    </div>
  );
}

// --- Styles (Mobile Optimized) ---
const containerStyle: any = { minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', fontFamily: 'sans-serif' };
const mobileCardStyle: any = { background: '#0a0a0a', padding: '30px 20px', borderRadius: '24px', width: '100%', maxWidth: '350px', border: '1px solid #1a1a1a', textAlign: 'center' };
const headerSection: any = { marginBottom: '35px' };
const logoStyle: any = { fontSize: '28px', fontWeight: '900', color: '#fff', margin: 0 };
const tagline: any = { color: '#555', fontSize: '12px', marginTop: '5px' };
const formWrapper: any = { display: 'flex', flexDirection: 'column', gap: '15px' };
const rowStyle: any = { display: 'flex', gap: '10px' };
const googleIconBtn: any = { background: '#fff', border: 'none', borderRadius: '15px', width: '60px', height: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const phoneInputGroup: any = { flex: 1, display: 'flex', background: '#141414', borderRadius: '15px', border: '1px solid #222', overflow: 'hidden' };
const prefix: any = { padding: '15px 10px', color: '#666', borderRight: '1px solid #222', fontSize: '14px' };
const inputField: any = { flex: 1, background: 'transparent', border: 'none', padding: '15px', color: '#fff', outline: 'none', fontSize: '14px' };
const mainActionBtn: any = { width: '100%', padding: '16px', borderRadius: '15px', background: '#7c3aed', color: '#fff', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '15px' };
const divider: any = { color: '#333', fontSize: '11px', margin: '5px 0' };
const guestBtn: any = { width: '100%', padding: '14px', borderRadius: '15px', background: 'transparent', color: '#888', border: '1px solid #222', cursor: 'pointer', fontSize: '14px' };
const otpInput: any = { width: '100%', background: '#141414', border: '1px solid #222', padding: '16px', borderRadius: '15px', color: '#fff', textAlign: 'center', letterSpacing: '8px', marginBottom: '15px', fontSize: '20px', outline: 'none' };
const otpWrapper: any = { textAlign: 'center' };
const backLink: any = { background: 'none', border: 'none', color: '#555', marginTop: '15px', cursor: 'pointer', fontSize: '13px' };
const errorCard: any = { color: '#ff4b4b', fontSize: '11px', marginTop: '15px', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '10px', border: '1px solid rgba(255,0,0,0.2)' };
