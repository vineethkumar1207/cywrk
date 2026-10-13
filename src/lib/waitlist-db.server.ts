import postgres from 'postgres';
import type { z } from 'zod';
import type { waitlistSchema } from './waitlist-schema';

type Signup = z.infer<typeof waitlistSchema>;
export type InsertResult = 'success' | 'duplicate' | 'error';

// A fresh short-lived client per call: Workers cannot share sockets across requests.
function connect() {
  const url = process.env['DATABASE_URL'];
  if (!url) return null;
  return postgres(url, { ssl: 'require', max: 1, prepare: false, idle_timeout: 5, connect_timeout: 10 });
}

export async function insertWaitlistSignup(data: Signup): Promise<InsertResult> {
  const sql = connect();
  if (!sql) { console.error('Waitlist insert failed: DATABASE_URL not configured'); return 'error'; }
  try {
    await sql`
      insert into public.waitlist_signups (name, email, role, main_interest, open_to_feedback, source)
      values (${data.name || null}, ${data.email.trim().toLowerCase()}, ${data.role}, ${data.main_interest}, ${data.open_to_feedback}, ${data.source})`;
    return 'success';
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === '23505') return 'duplicate';
    console.error('Waitlist insert failed', code ?? 'unknown');
    return 'error';
  } finally {
    await sql.end({ timeout: 2 }).catch(() => {});
  }
}

// Server-only connectivity check; returns no data from any table.
export async function checkWaitlistDb(): Promise<boolean> {
  const sql = connect();
  if (!sql) return false;
  try { await sql`select 1`; return true; } catch { return false; } finally { await sql.end({ timeout: 2 }).catch(() => {}); }
}