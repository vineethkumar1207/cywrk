import { createServerFn } from '@tanstack/react-start';
import { contactSchema, waitlistSchema } from './waitlist-schema';
import { insertContactMessage, insertWaitlistSignup } from './waitlist-db.server';

export const joinWaitlist = createServerFn({ method: 'POST' })
 .inputValidator((input: unknown) => waitlistSchema.parse(input))
 .handler(async ({ data }) => {
  const status = await insertWaitlistSignup(data);
  return { status };
 });

export const sendContactMessage = createServerFn({ method: 'POST' })
 .inputValidator((input: unknown) => contactSchema.parse(input))
 .handler(async ({ data }) => ({ status: await insertContactMessage(data) }));