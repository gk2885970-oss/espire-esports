import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  db, // MAKE SURE db IS EXPORTED FROM YOUR firebase.js FILE
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [confirm, setConfirm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear old sessions on load
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // reCAPTCHA initialization
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

  // --- 🔥 FIRESTORE DATABASE MAGIC 🔥 ---
  // Ye function naye user ko database mein save karega ₹450 ke sath
  const checkAndCreateUser = async (user: any) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log("New User Detected! Creating Database Profile...");
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || `guest_${user.uid.slice(0,5)}@espire.com`,
        displayName: user.displayName || 'ESPIRE Elite',
        photoURL: user.photoURL || 'https://picsum.photos/seed/user/200/200',
        wallet: { balance: 450 }, // 💰 Welcome Bonus
        stats: {
          tournamentsPlayed: 0,
          tournamentsWon: 0,
          aiRating: 75,
          aiRank: 'Scout',
          favGame: 'Free Fire'
        },
        gamingIds: { bgmi: '', freefire: '', valorant: '' },
        createdAt: serverTimestamp()
      });
    }
  };

  // 1. Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await checkAndCreateUser(result.user); // Database Sync
      localStorage.setItem('token', result.user.uid);
      window.location.href = '/home'; 
    } catch (e: any) { 
      setError('Google Login failed. Please try again.'); 
    }
    setLoading(false);
  };

  // 2. Phone OTP Send
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
      setError('Failed to send OTP. Check internet connection.');
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
      await checkAndCreateUser(result.user); // Database Sync
      localStorage.setItem('token', result.user.uid);
      window.location.href = '/home'; 
    } catch (e: any) {
      setError('Invalid OTP code. Try again.');
    }
    setLoading(false);
  };

  // 4. Guest Login
  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      await checkAndCreateUser(result.user); // Database Sync
      localStorage.setItem('token', result.user.uid);
      window.location.href = '/home'; 
    } catch (e: any) { 
      setError('Guest entry failed. Try another method.'); 
    }
    setLoading(false);
  };

  return (
    <div style={fullScreenContainer}>
      <div id="recaptcha-container"></div>
      
      <div style={centeredContent}>
        {/* --- BRANDING HEADER --- */}
        <div style={brandingSection}>
          <img 
            src="/logo.png" 
            alt="ESPIRE Logo" 
            style={{ 
              width: '180px', 
              height: 'auto', 
              margin: '0 auto 15px', 
              display: 'block',
              filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.4))' // Gold Shadow
            }} 
          />
          <p style={subtitleText}>Login to compete. Manage your squad.</p>
        </div>

        {/* --- MAIN LOGIN AREA --- */}
        <div style={loginMethodsStack}>
          
          <button onClick={handleGoogleLogin} style={googlePillBtn}>
            <img src="https://www.google.com/favicon.ico" width={20} alt="G" />
            Continue with Google
          </button>

          {step === 'input' ? (
            <div style={phoneInputWrapper}>
              <div style={combinedInputField}>
                <span style={phonePrefix}>+91</span>
                <input 
                  type="tel" placeholder="Mobile Number" 
                  value={phone} onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                  maxLength={10}
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
                <CheckCircle size={18} color="#facc15" />
                <span style={phoneVerifyLabel}>Verify number +91 {phone}</span>
                <span onClick={() => setStep('input')} style={editPhoneLink}>Edit</span>
              </div>
              <input 
                type="tel" placeholder="Enter OTP" 
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/, ''))} 
                maxLength={6}
                style={otpInputPill} 
              />
              <button onClick={handleVerifyOTP} disabled={loading} style={primaryActionBtn}>
                {loading ? 'Verifying...' : 'Finish Login'}
              </button>
            </div>
          )}

          {error && (
            <div style={errorCardStyle}>
              <AlertTriangle size={16} color="#ff4b4b" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* --- GUEST LOGIN --- */}
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

      {/* FOOTER */}
      <div style={loginFooter}>
        <span style={{color: '#facc15'}}>Privacy Policy</span> | <span style={{color: '#facc15'}}>Terms of Service</span>
      </div>
    </div>
  );
}

// --- Styles (Dark & Gold Optimized) ---

const fullScreenContainer: any = { 
  minHeight: '100vh', 
  background: '#0a0a0a', 
  display: 'flex', 
  flexDirection: 'column',
  alignItems: 'center', 
  justifyContent: 'space-between',
  padding: '16px', 
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  boxSizing: 'border-box'
};

const centeredContent: any = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '380px',
  boxSizing: 'border-box'
};

const brandingSection: any = { marginBottom: '50px', textAlign: 'center' };
const subtitleText: any = { color: '#facc15', fontSize: '11px', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' };

const loginMethodsStack: any = { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' };

const commonPillBtn: any = { 
  width: '100%', 
  padding: '18px', 
  borderRadius: '15px', 
  cursor: 'pointer', 
  fontSize: '15px', 
  fontWeight: '800', 
  border: 'none', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '12px',
  boxSizing: 'border-box',
  textTransform: 'uppercase'
};

const googlePillBtn: any = { ...commonPillBtn, background: '#fff', color: '#000' };
// PRIMARY COLOR CHANGED TO GOLD (#facc15)
const primaryActionBtn: any = { ...commonPillBtn, background: '#facc15', color: '#000', boxShadow: '0 0 15px rgba(250, 204, 21, 0.3)' };

const phoneInputWrapper: any = { display: 'flex', flexDirection: 'column', gap: '10px' };
const combinedInputField: any = { display: 'flex', background: '#111', borderRadius: '15px', border: '1px solid #333', overflow: 'hidden', boxSizing: 'border-box' };
const phonePrefix: any = { padding: '18px 12px', color: '#888', fontSize: '15px', fontWeight: 'bold' };

const textInputField: any = { 
  flex: 1, 
  background: 'transparent', 
  backgroundColor: 'transparent', 
  border: 'none', 
  padding: '18px', 
  color: '#fff', 
  outline: 'none', 
  fontSize: '15px', 
  letterSpacing: '0.5px',
  boxSizing: 'border-box',
  margin: 0,
  WebkitAppearance: 'none', 
  MozAppearance: 'none',
  appearance: 'none',
  WebkitBoxShadow: '0 0 0px 1000px #111 inset', 
  textFillColor: '#fff',
  WebkitTextFillColor: '#fff'
};

const otpVerifyWrapper: any = { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'center' };
const verifyHeaderFlex: any = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' };
const phoneVerifyLabel: any = { color: '#ccc', fontSize: '12px', fontWeight: '600' };
const editPhoneLink: any = { color: '#facc15', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' };
const otpInputPill: any = { ...textInputField, background: '#111', borderRadius: '15px', border: '1px solid #facc15', textAlign: 'center', fontSize: '24px', fontWeight: 'bold', letterSpacing: '10px', padding: '18px 10px', color: '#facc15' };

const errorCardStyle: any = { color: '#ff4b4b', fontSize: '12px', marginTop: '10px', padding: '12px', background: 'rgba(255,0,0,0.1)', borderRadius: '15px', border: '1px solid rgba(255,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' };

const guestLoginRow: any = { marginTop: '60px', width: '100%', textAlign: 'center' };
const dividerFlex: any = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' };
const dividerLine: any = { flex: 1, height: '1px', background: '#333' };
const orText: any = { color: '#666', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' };
const guestOutlinedBtn: any = { width: '100%', padding: '16px', borderRadius: '15px', background: '#111', color: '#888', border: '1px solid #333', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', boxSizing: 'border-box', textTransform: 'uppercase' };

const loginFooter: any = { width: '100%', textAlign: 'center', color: '#444', fontSize: '11px', paddingBottom: '10px', marginTop: '30px', fontWeight: 'bold' };
