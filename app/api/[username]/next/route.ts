import { NextResponse } from 'next/server';
import ring from '@/public/RingItems.json'; // Static data for the query

export async function GET(req: Request) {

  const url = new URL(req.url);
  console.log('Request URL:', url); 
  const username = url.pathname.split('/')[2]; // Extract username from the URL path eg /api/username/next 
  console.log('Username:', username); 
  if (!username) {
    return NextResponse.json({ error: 'Username not found' }, { status: 404 });
  }

  const index = ring.findIndex(entry => entry.username === username);

  if (index === -1) {
    return NextResponse.json({ error: 'Username not found' }, { status: 404 });
  }

  const next = ring[(index + 1) % ring.length];

  return NextResponse.redirect(next.url, { status: 302 });
}
