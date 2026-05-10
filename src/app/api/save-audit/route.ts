import { NextResponse } from 'next/server';
import { saveAuditToDb } from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Basic validation
    if (!data.email || !data.result || !data.tools) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to database
    const saved = await saveAuditToDb(data);

    // TODO: Here you would optionally integrate Resend/Postmark to send a transactional email
    // e.g. await sendConfirmationEmail(data.email, saved.id);

    return NextResponse.json({ id: saved.id, success: true });
  } catch (error: any) {
    console.error('Save Audit Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save' }, { status: 500 });
  }
}
