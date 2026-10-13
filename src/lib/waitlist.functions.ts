import { createServerFn } from '@tanstack/react-start';
import { waitlistSchema } from './waitlist-schema';
import { insertWaitlistSignup } from './waitlist-db.server';

export const joinWaitlist = createServerFn({ method: 'POST' })
 .inputValidator((input: unknown) => waitlistSchema.parse(input))
 .handler(async ({ data }) => {
  const status = await insertWaitlistSignup(data);
  return { status };
 });