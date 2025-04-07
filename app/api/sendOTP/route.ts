import NodeCache from 'node-cache';
import nodemailer from 'nodemailer';


const otpCache = new NodeCache({ stdTTL: 300 }); // OTP expires after 5 minutes

export async function POST(req: Request) {
  const { email } = await req.json();
  
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  // random OTP
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  
  // cache otp with email as kvp
  otpCache.set(email, otp);

  const transporter = nodemailer.createTransport({
    service: 'gmail',  // 
    auth: {
      user: process.env.EMAIL_USER,  
      pass: process.env.EMAIL_PASS,  
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your 2FA OTP Code',
      text: `Your OTP is: ${otp}`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send OTP' }), { status: 500 });
  }
}
