import { NextResponse } from 'next/server';

export async function GET() {
	return NextResponse.json({
		ok: true,
		service: 'BUILDRAIL',
		timestamp: new Date().toISOString(),
	});
}
