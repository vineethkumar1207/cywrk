import { createClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import { LEGAL_VERSION, type contactSchema, type waitlistSchema } from './waitlist-schema';

type Signup = z.infer<typeof waitlistSchema>;
type Contact = z.infer<typeof contactSchema>;
export type InsertResult = 'success' | 'duplicate' | 'error';

// Server-only client created per call; RLS (insert-only for anon) is the protection boundary.
function connect() {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      // Opaque sb_ keys are not JWTs: send only the apikey header.
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith('sb_') && h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization');
        h.set('apikey', key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

async function insertRow(table: 'waitlist_signups' | 'contact_messages', row: Record<string, unknown>): Promise<InsertResult> {
  const client = connect();
  if (!client) { console.error(`${table} insert failed: database not configured`); return 'error'; }
  try {
    // No .select(): there is no public read access, so request no returned rows.
    const { error } = await client.from(table).insert(row as never);
    if (!error) return 'success';
    if (error.code === '23505') return 'duplicate';
    console.error(`${table} insert failed`, error.code || 'unknown');
    return 'error';
  } catch {
    console.error(`${table} insert failed`, 'network');
    return 'error';
  }
}

export function insertWaitlistSignup(data: Signup, now = new Date().toISOString()) {
  return insertRow('waitlist_signups', {
    name: data.name || null,
    email: data.email.trim().toLowerCase(),
    role: data.role,
    main_interest: data.main_interest,
    open_to_feedback: data.open_to_feedback,
    source: data.source,
    terms_version: LEGAL_VERSION,
    terms_accepted_at: now,
    waitlist_consent_version: LEGAL_VERSION,
    waitlist_consented_at: now,
    product_updates_consent: data.product_updates_consent,
    product_updates_consented_at: data.product_updates_consent ? now : null,
    privacy_notice_version: LEGAL_VERSION,
  });
}

export async function insertContactMessage(data: Contact): Promise<'success' | 'error'> {
  const r = await insertRow('contact_messages', {
    name: data.name, email: data.email, subject: data.subject, message: data.message,
    privacy_notice_version: LEGAL_VERSION, acknowledged_at: new Date().toISOString(),
  });
  return r === 'success' ? 'success' : 'error';
}