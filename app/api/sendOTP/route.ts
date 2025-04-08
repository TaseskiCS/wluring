import redis from '../../lib/redis';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  await redis.set(email, otp, { ex: 300 }); // expires in 5 min



  const transporter = nodemailer.createTransport({
    service: 'gmail',
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

    console.log('OTP sent to:', email);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return new Response(JSON.stringify({ error: 'Failed to send OTP' }), { status: 500 });
  }
}
