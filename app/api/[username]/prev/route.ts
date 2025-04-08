import { NextResponse } from 'next/server';
import ring from '@/public/RingItems.json'; // Static data for the query

export async function GET(req: Request) {

  const url = new URL(req.url);

  const username = url.pathname.split('/')[2]; // Extract username from the URL path eg /api/username/prev 

  if (!username) {
    return NextResponse.json({ error: 'Username not found' }, { status: 404 });
  }

  // Find index of ring item matching the username
  const index = ring.findIndex(entry => entry.username === username);

  if (index === -1) {
    return NextResponse.json({ error: 'Username not found' }, { status: 404 });
  }

  const prev = ring[(index - 1 + ring.length) % ring.length];

  return NextResponse.redirect(prev.url, { status: 302 });
}

