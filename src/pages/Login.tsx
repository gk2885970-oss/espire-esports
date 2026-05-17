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
import { Mail, CheckCircle, AlertTriangle } from 'lucide-react'; // Icons load karo for look

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

  // 1. Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('token', result.user.uid);
      navigate('/home');
    } catch (e: any) { 
      setError('Google Login failed. Please try again.'); 
    }
    setLoading(false);
  };

  // 2. Combined Phone + OTP Send
  const handleSendOTP = async () => {
    if (phone.length !== 10) return setError('Please enter a valid 10-digit mobile number.');
    setLoading(true);
    setError('');
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
      setConfirm(confirmation);
      setStep('otp');
    } catch (e: any) { 
      console.error("OTP Send Error:", e);
      if (e.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format.');
      } else {
        setError('Failed to send OTP. Check internet connection.');
      }
      if ((window as any).recaptchaVerifier) (window as any).recaptchaVerifier.clear();
    }
    setLoading(false);
  };

  // 3. OTP Verify
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return setError('Please enter 6-digit OTP.');
    setLoading(true);
    setError('');
    try {
      const result = await confirm.confirm(otp);
      localStorage.setItem('token', result.user.uid);
      navigate('/home');
    } catch (e: any) {
      setError('Invalid OTP code. Try again.');
    }
    setLoading(false);
  };

  // 4. Guest Login (Move to second row style)
  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      localStorage.setItem('token', result.user.uid);
      navigate('/home');
    } catch (e: any) { 
      setError('Guest entry failed. Try another method.'); 
    }
    setLoading(false);
  };

  return (
    <div style={fullScreenContainer}>
      <div id="recaptcha-container"></div>
      
      <div style={centeredContent}>
        {/* --- BRANDING HEADER (Top Section) --- */}
        <div style={brandingSection}>
          <img 
            src="/logo.png" // Apni transparent logo image Root (ya public) mein upload karo
            alt="ESPIRE Logo" 
            style={{ 
              width: '180px', 
              height: 'auto', 
              margin: '0 auto 15px', 
              display: 'block',
              filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))' // Add slight purple glow to logo
            }} 
          />
          <p style={subtitleText}>Login to compete. Manage your squad.</p>
        </div>

        {/* --- MAIN LOGIN AREA (Middle Section) --- */}
        <div style={loginMethodsStack}>
          
          {/* A. Continue with Google */}
          <button onClick={handleGoogleLogin} style={googlePillBtn}>
            <img src="https://www.google.com/favicon.ico" width={20} alt="G" />
            Continue with Google
          </button>

          {/* B. Phone Input & OTP Combined Logic */}
          {step === 'input' ? (
            <div style={phoneInputWrapper}>
              <div style={combinedInputField}>
                <span style={phonePrefix}>+91</span>
                <input 
                  type="tel" placeholder="Mobile Number" 
                  value={phone} onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                  style={textInputField} 
                />
              </div>
              <button onClick={handleSendOTP} disabled={loading} style={primaryActionBtn}>
                {loading ? 'Processing...' : 'Get OTP Code'}
              </button>
            </div>
          ) : (
            <div style={otpVerifyWrapper}>
              <div style={verifyHeaderFlex}>
                <CheckCircle size={18} color="#7c3aed" />
                <span style={phoneVerifyLabel}>Verify number +91 {phone}</span>
                <span onClick={() => setStep('input')} style={editPhoneLink}>Edit</span>
              </div>
              <input 
                type="tel" placeholder="Enter 6-digit OTP" 
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/, ''))} 
                maxLength={6}
                style={otpInputPill} 
              />
              <button onClick={handleVerifyOTP} disabled={loading} style={primaryActionBtn}>
                {loading ? 'Verifying...' : 'Finish Login'}
              </button>
            </div>
          )}

          {/* Error Message Card */}
          {error && (
            <div style={errorCardStyle}>
              <AlertTriangle size={16} color="#ff4b4b" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* --- SECONDARY ROW GUEST LOGIN (Bottom Section) --- */}
        <div style={guestLoginRow}>
          <div style={dividerFlex}>
            <div style={dividerLine}></div>
            <span style={orText}>Or</span>
            <div style={dividerLine}></div>
          </div>
          <button onClick={handleGuestLogin} style={guestOutlinedBtn}>
            Explore as Guest
          </button>
        </div>
      </div>

      {/* FOOTER (YC style links) - optional */}
      <div style={loginFooter}>
        <span>Privacy Policy</span> | <span>Terms of Service</span>
      </div>
    </div>
  );
}

// --- Styles (Full Mobile Optimized, Inline Styles) ---

// Main full screen dark container (matches image_9 texture but dark)
const fullScreenContainer: any = { 
  minHeight: '100vh', 
  background: '#0a0a0a', // Deep dark background
  display: 'flex', 
  flexDirection: 'column',
  alignItems: 'center', 
  justifyContent: 'space-between', // Push footer to bottom
  padding: '16px', 
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' // San serif stack
};

const centeredContent: any = {
  flex: 1, // Take available vertical space
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Center middle section
  width: '100%',
  maxWidth: '380px' // Mobile constraint
};

// Top section (Logo)
const brandingSection: any = { marginBottom: '50px', textAlign: 'center' };
const subtitleText: any = { color: '#888', fontSize: '13px', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' };

// Middle stacked methods (Google, Phone)
const loginMethodsStack: any = { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' };

// Pill Buttons styles
const commonPillBtn: any = { 
  width: '100%', 
  padding: '18px', 
  borderRadius: '24px', // Rounded corners
  cursor: 'pointer', 
  fontSize: '15px', 
  fontWeight: '600', 
  border: 'none', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '12px',
  transition: 'background 0.2s'
};

const googlePillBtn: any = { ...commonPillBtn, background: '#fff', color: '#000' };
const primaryActionBtn: any = { ...commonPillBtn, background: '#7c3aed', color: '#fff' }; // ESPIRE Purple

// Phone combined Input style
const phoneInputWrapper: any = { display: 'flex', flexDirection: 'column', gap: '10px' };
const combinedInputField: any = { display: 'flex', background: '#111', borderRadius: '24px', border: '1px solid #333', overflow: 'hidden' };
const phonePrefix: any = { padding: '18px 12px', color: '#888', fontSize: '15px', fontWeight: 'bold' };
const textInputField: any = { flex: 1, background: 'transparent', border: 'none', padding: '18px', color: '#fff', outline: 'none', fontSize: '15px', letterSpacing: '0.5px' };

// OTP Verification style (like verification screen flow)
const otpVerifyWrapper: any = { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'center' };
const verifyHeaderFlex: any = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' };
const phoneVerifyLabel: any = { color: '#ccc', fontSize: '12px', fontWeight: '600' };
const editPhoneLink: any = { color: '#7c3aed', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' };
const otpInputPill: any = { ...textInputField, background: '#111', borderRadius: '24px', border: '1px solid #7c3aed', textAlign: 'center', fontSize: '24px', fontWeight: 'bold', letterSpacing: '15px', padding: '18px 10px' }; // Purple border for attention

const errorCardStyle: any = { 
  color: '#ff4b4b', fontSize: '12px', marginTop: '10px', padding: '12px', 
  background: 'rgba(255,0,0,0.1)', borderRadius: '16px', border: '1px solid rgba(255,0,0,0.2)',
  display: 'flex', alignItems: 'center', gap: '8px'
};

// Bottom Row Guest style
const guestLoginRow: any = { marginTop: '60px', width: '100%', textAlign: 'center' };
const dividerFlex: any = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' };
const dividerLine: any = { flex: 1, height: '1px', background: '#333' };
const orText: any = { color: '#444', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' };
const guestOutlinedBtn: any = { width: '100%', padding: '16px', borderRadius: '24px', background: 'transparent', color: '#aaa', border: '1px solid #333', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };

// Simple bottom links footer
const loginFooter: any = { 
  width: '100%', 
  textAlign: 'center', 
  color: '#444', 
  fontSize: '11px', 
  paddingBottom: '10px',
  marginTop: '30px'
};
