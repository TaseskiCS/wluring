import { NextResponse } from 'next/server';
import ring from '@/public/RingItems.json'; // jus need static data for the url query rn

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  const index = ring.findIndex(entry => entry.username === username);
  if (index === -1) {
    return NextResponse.json({ error: 'Username not found' }, { status: 404 });
  }

  const prev = ring[(index - 1 + ring.length) % ring.length];
  return NextResponse.redirect(prev.url, 302);
}
