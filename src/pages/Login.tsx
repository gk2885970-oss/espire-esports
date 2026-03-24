import { useState, useEffect, useRef } from 'react';
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
  const [step, setStep] = useState<'landing' | 'phone' | 'otp'>('landing');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [captchaNum, setCaptchaNum] = useState({ a: 0, b: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<any>(null);

  useEffect(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaNum({ a, b });
  }, []);

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('token', await result.user.getIdToken());
      localStorage.setItem('userId', result.user.uid);
      navigate('/home');
    } catch (e: any) {
      setError('Google sign in failed. Please try again.');
    }
    setLoading(false);
  };

  // Guest Login
  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      localStorage.setItem('token', await result.user.getIdToken());
      localStorage.setItem('userId', result.user.uid);
      navigate('/home');
    } catch (e: any) {
      setError('Guest login failed. Please try again.');
    }
    setLoading(false);
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (phone.length !== 10) return setError('Please enter a valid 10-digit number');
    if (parseInt(captchaInput) !== captchaNum.a + captchaNum.b)
      return setError('Captcha answer is incorrect!');

    setLoading(true);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
      const confirmation = await signInWithPhoneNumber(
        auth, `+91${phone}`, recaptchaRef.current
      );
      setConfirm(confirmation);
      setStep('otp');
      setError('');
    } catch (e: any) {
      setError('Failed to send OTP. Check your number and try again.');
      console.error(e);
    }
    setLoading(false);
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return setError('Please enter the 6-digit OTP');
    setLoading(true);
    try {
      const result = await confirm.confirm(otp);
      localStorage.setItem('token', await result.user.getIdToken());
      localStorage.setItem('userId', result.user.uid);
      navigate('/home');
    } catch (e: any) {
      setError('Incorrect OTP. Please try again.');
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
      <div id="recaptcha-container" />

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

        {/* LANDING */}
        {step === 'landing' && (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome to Espire</h2>

            <button onClick={handleGoogleLogin} disabled={loading} style={btnStyle('#fff', '#000')}>
              <img src="https://www.google.com/favicon.ico" width={18} style={{ marginRight: 8 }} />
              Continue with Google
            </button>

            <div style={{ textAlign: 'center', margin: '16px 0', color: '#555' }}>— or —</div>

            <button onClick={() => setStep('phone')} style={btnStyle('#7c3aed', '#fff')}>
               Continue with Mobile Number
            </button>

            <div style={{ textAlign: 'center', margin: '16px 0', color: '#555' }}>— or —</div>

            <button onClick={handleGuestLogin} disabled={loading} style={btnStyle('#1a1a2e', '#666', '1px solid #333')}>
               Continue as Guest
            </button>

            {error && <p style={errorStyle}>{error}</p>}
          </>
        )}

        {/* PHONE + CAPTCHA */}
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

            {/* Math Captcha */}
            <div style={{
              background: '#0a0a1a', borderRadius: '8px',
              padding: '16px', margin: '16px 0', textAlign: 'center'
            }}>
              <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '8px' }}>Solve to verify:</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#7c3aed' }}>
                {captchaNum.a} + {captchaNum.b} = ?
              </p>
              <input
                type="number" value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                placeholder="Enter answer"
                style={{ ...inputStyle, textAlign: 'center', marginTop: '8px' }}
              />
            </div>

            {error && <p style={errorStyle}>{error}</p>}
            <button onClick={handleSendOTP} disabled={loading} style={btnStyle('#7c3aed', '#fff')}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <button onClick={() => setStep('landing')} style={backBtn}>← Back</button>
          </>
        )}

        {/* OTP */}
        {step === 'otp' && (
          <>
            <h2 style={{ marginBottom: '8px' }}>🔐 Verify OTP</h2>
            <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
              Sent to +91 {phone}
            </p>
            <input
              type="tel" maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
              placeholder="Enter 6-digit OTP"
              style={{ ...inputStyle, letterSpacing: '8px', fontSize: '20px', textAlign: 'center' }}
            />
            {error && <p style={errorStyle}>{error}</p>}
            <button onClick={handleVerifyOTP} disabled={loading} style={btnStyle('#7c3aed', '#fff')}>
              {loading ? 'Verifying...' : ' Verify & Login'}
            </button>
            <button onClick={() => { setStep('phone'); setOtp(''); }} style={backBtn}>← Back</button>
          </>
        )}
      </div>
    </div>
  );
}

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
const errorStyle: any = { color: '#f87171', fontSize: '13px', marginBottom: '8px', marginTop: '8px' };
const backBtn: any = {
  background: 'none', border: 'none', color: '#888',
  cursor: 'pointer', marginTop: '12px', fontSize: '14px'
};