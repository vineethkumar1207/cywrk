import { createClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import type { waitlistSchema } from './waitlist-schema';

type Signup = z.infer<typeof waitlistSchema>;
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

export async function insertWaitlistSignup(data: Signup): Promise<InsertResult> {
  const client = connect();
  if (!client) { console.error('Waitlist insert failed: database not configured'); return 'error'; }
  try {
    // No .select(): there is no public read access, so request no returned rows.
    const { error } = await client.from('waitlist_signups').insert({
      name: data.name || null,
      email: data.email.trim().toLowerCase(),
      role: data.role,
      main_interest: data.main_interest,
      open_to_feedback: data.open_to_feedback,
      source: data.source,
    });
    if (!error) return 'success';
    if (error.code === '23505') return 'duplicate';
    console.error('Waitlist insert failed', error.code || 'unknown');
    return 'error';
  } catch {
    console.error('Waitlist insert failed', 'network');
    return 'error';
  }
}