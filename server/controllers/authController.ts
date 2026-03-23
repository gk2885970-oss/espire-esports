import { Request, Response } from 'express';
import crypto from 'crypto';

// In-memory OTP store (production mein Redis use karo)
const otpStore = new Map<string, { otp: string; expires: number }>();
const guestStore = new Map<string, string>();

// Simple token generator
const makeToken = (id: string) =>
  Buffer.from(`${id}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`).toString('base64');

// Send OTP
export const sendOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || phone.length !== 10)
    return res.status(400).json({ error: 'Invalid phone number' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min

  // TODO: Real SMS service (Twilio/MSG91) yahan add karo
  console.log(`OTP for ${phone}: ${otp}`); // Dev mode

  res.json({ success: true, otp }); // Production mein otp remove karna!
};

// Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  const stored = otpStore.get(phone);

  if (!stored) return res.status(400).json({ error: 'OTP nahi mila' });
  if (Date.now() > stored.expires) return res.status(400).json({ error: 'OTP expire ho gaya' });
  if (stored.otp !== otp) return res.status(400).json({ error: 'Galat OTP' });

  otpStore.delete(phone);
  const userId = `user_${phone}`;
  const token = makeToken(userId);

  res.json({ success: true, token, userId });
};

// Guest Login
export const guestLogin = async (req: Request, res: Response) => {
  const guestId = `guest_${crypto.randomBytes(8).toString('hex')}`;
  const token = makeToken(guestId);
  guestStore.set(guestId, token);
  res.json({ success: true, token, userId: guestId });
};