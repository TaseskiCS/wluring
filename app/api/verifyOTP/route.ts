import { redis } from "../../lib/redis"; 

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return new Response(JSON.stringify({ success: false, error: "Missing OTP or email" }), {
      status: 400,
    });
  }

  const storedOtp = await redis.get(email);

  if (storedOtp === otp || storedOtp === Number(otp)) {
    // clear the OTP after use
    await redis.del(email);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ success: false, error: "Invalid OTP" }), { status: 401 });
}
