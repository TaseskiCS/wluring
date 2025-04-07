import NodeCache from 'node-cache';
export default async function POST(request: Request) {
    const {otp, email} = await request.json();
    const otpCache = new NodeCache();
    if (otp === otpCache.get(email)) {
        return new Response(JSON.stringify({success: true}), {status: 200});
    }
    return new Response(JSON.stringify({success: false}), {status: 401});
}