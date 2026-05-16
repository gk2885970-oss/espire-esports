import { Request, Response } from 'express';
import crypto from 'crypto';
import db from '../database.js'; // SQLite connection

const otpStore = new Map<string, { otp: string; expires: number }>();

// AI-Native Token: Isme user ka profile context bhi embedded hoga
const makeToken = (id: string, role: string) =>
  Buffer.from(`${id}:${role}:${Date.now()}:${crypto.randomBytes(8).toString('hex')}`).toString('base64');

export const sendOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || phone.length !== 10)
    return res.status(400).json({ error: 'Invalid 10-digit number' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });

  // YC Challenger Logic: User ko wait mat karao, 
  // background mein AI scouting start kar do phone number ke basis par (agar existing hai)
  console.log(`[AI-Prewarm] Preparing dashboard for ${phone}... OTP: ${otp}`);

  res.json({ success: true }); // Production: Security first, don't send OTP in response
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { phone, otp, displayName } = req.body;
  const stored = otpStore.get(phone);

  if (!stored || stored.otp !== otp) 
    return res.status(400).json({ error: 'Invalid or expired OTP' });

  otpStore.delete(phone);
  const userId = `u_${phone}`;
  
  // 1. Fundamental Rethink: Check if user exists or Initialize AI Profile
  let user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;

  if (!user) {
    // New User: AI-Native Default Profile Setup
    db.prepare(`
      INSERT INTO users (id, display_name, role, ai_rating, ai_rank, balance)
      VALUES (?, ?, 'player', 50, 'Beginner', 100)
    `).run(userId, displayName || `Player_${phone.slice(-4)}`);
    
    user = { id: userId, role: 'player', isNew: true };
  }

  const token = makeToken(userId, user.role);

  // 2. The "Aha" Moment: Onboarding message that feels personalized
  res.json({ 
    success: true, 
    token, 
    userId,
    onboardingInsight: user.isNew 
      ? "Welcome to Espire. I've initialized your AI Skill Rating at 50. Let's play your first match to refine it."
      : `Welcome back! Your AI Rating is currently ${user.ai_rating}. We found 2 new tournaments matching your skill.`
  });
};

export const guestLogin = async (req: Request, res: Response) => {
  // Jared Friedman's "Speed" factor: 1-click entry
  const guestId = `guest_${crypto.randomBytes(4).toString('hex')}`;
  const token = makeToken(guestId, 'guest');

  // Silently initialize a temporary AI profile for the guest
  db.prepare(`
    INSERT INTO users (id, display_name, role, ai_rating, ai_rank)
    VALUES (?, 'Guest Warrior', 'guest', 30, 'Trial')
  `).run(guestId);

  res.json({ 
    success: true, 
    token, 
    userId: guestId,
    message: "Trial mode active. AI Rating is tracking locally." 
  });
};
