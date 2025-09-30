import { NextResponse } from 'next/server';

// Prevent 404 noise when no physical favicon exists.
export async function GET() {
  return new NextResponse(null, { status: 204 });
}
