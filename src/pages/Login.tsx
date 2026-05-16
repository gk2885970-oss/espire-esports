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

  // 1. Fixed Recaptcha initialization
  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => { console.log('Verified'); }
      });
    }
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('userId', result.user.uid);
      navigate('/home');
    } catch (e: any) { setError('Google login block hai'); }
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      localStorage.setItem('userId', result.user.uid);
      navigate('/home');
    } catch (e: any) { setError('Guest failed: Check Anonymous Setting'); }
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (phone.length !== 10) return setError('10 digit number dalo');
    setLoading(true);
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
      setConfirm(confirmation);
      setStep('otp');
      setError('');
    } catch (e: any) { 
      setError('OTP Error: Domain link check karo');
      console.error(e);
      if ((window as any).recaptchaVerifier) (window as any).recaptchaVerifier.clear();
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      {/* 2. Recaptcha container MUST be present in DOM */}
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
                 <img src="https://www.google.com/favicon.ico" width={22} />
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
              {loading ? 'Sending OTP...' : 'Continue with Phone'}
            </button>

            <div style={divider}>OR</div>

            <button onClick={handleGuestLogin} style={guestBtn}>
              Continue as Guest
            </button>
          </div>
        ) : (
          <div style={otpWrapper}>
            <input 
              type="tel" placeholder="Enter 6-digit OTP" 
              value={otp} onChange={e => setOtp(e.target.value)} 
              style={otpInput} 
            />
            <button onClick={() => confirm.confirm(otp).then(() => navigate('/home'))} style={mainActionBtn}>
              Verify OTP
            </button>
            <button onClick={() => setStep('input')} style={backLink}>Change Number</button>
          </div>
        )}
        {error && <p style={errorText}>{error}</p>}
      </div>
    </div>
  );
}

// --- Styles ---
const containerStyle: any = { minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' };
const mobileCardStyle: any = { background: '#0a0a0a', padding: '30px 20px', borderRadius: '24px', width: '100%', maxWidth: '350px', border: '1px solid #1a1a1a' };
const headerSection: any = { textAlign: 'center', marginBottom: '35px' };
const logoStyle: any = { fontSize: '28px', fontWeight: '900', color: '#fff' };
const tagline: any = { color: '#555', fontSize: '12px' };
const formWrapper: any = { display: 'flex', flexDirection: 'column', gap: '15px' };
const rowStyle: any = { display: 'flex', gap: '10px' };
const googleIconBtn: any = { background: '#fff', border: 'none', borderRadius: '15px', width: '60px', height: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const phoneInputGroup: any = { flex: 1, display: 'flex', background: '#141414', borderRadius: '15px', border: '1px solid #222', overflow: 'hidden' };
const prefix: any = { padding: '15px 10px', color: '#666', borderRight: '1px solid #222' };
const inputField: any = { flex: 1, background: 'transparent', border: 'none', padding: '15px', color: '#fff', outline: 'none' };
const mainActionBtn: any = { width: '100%', padding: '16px', borderRadius: '15px', background: '#7c3aed', color: '#fff', fontWeight: '800', border: 'none', cursor: 'pointer' };
const divider: any = { textAlign: 'center', color: '#333', fontSize: '11px', margin: '5px 0' };
const guestBtn: any = { width: '100%', padding: '14px', borderRadius: '15px', background: 'transparent', color: '#888', border: '1px solid #222', cursor: 'pointer' };
const otpWrapper: any = { textAlign: 'center' };
const otpInput: any = { width: '100%', background: '#141414', border: '1px solid #222', padding: '16px', borderRadius: '15px', color: '#fff', textAlign: 'center', letterSpacing: '8px', marginBottom: '15px', fontSize: '20px' };
const backLink: any = { background: 'none', border: 'none', color: '#555', marginTop: '15px', cursor: 'pointer' };
const errorText: any = { color: '#ff4b4b', fontSize: '12px', marginTop: '15px', textAlign: 'center' };
