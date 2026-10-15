import { z } from 'zod';
export const LEGAL_VERSION = '2026-10-15';
export const roles = ['Cybersecurity student','Self-learner / career switcher','Security researcher / bug bounty','SOC / blue team','Pentest / red team','Security engineer','CTI / threat researcher','Educator / academic','Other'] as const;
export const interests = ['Research with evidence','Contradiction detection','Monitoring important changes','Persistent cybersecurity knowledge','Learning + research workflow','Security tool integrations'] as const;
export const waitlistSchema = z.object({
 name: z.string().trim().max(100, 'Use 100 characters or fewer.').optional(),
 email: z.string().trim().email('Enter a valid work email.').max(255).transform(v => v.toLowerCase()),
 role: z.enum(roles, { errorMap: () => ({ message: 'Choose your role.' }) }),
 main_interest: z.enum(interests, { errorMap: () => ({ message: 'Choose your main interest.' }) }),
 open_to_feedback: z.boolean().default(false),
 waitlist_consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required to join the waitlist.' }) }),
 terms_accepted: z.literal(true, { errorMap: () => ({ message: 'Please accept the Terms of Use and acknowledge the Privacy Notice.' }) }),
 product_updates_consent: z.boolean().default(false),
 source: z.enum(['website','landing','waitlist']).default('website'),
});
export const contactSchema = z.object({
 name: z.string().trim().min(1, 'Enter your name.').max(100, 'Use 100 characters or fewer.'),
 email: z.string().trim().email('Enter a valid email.').max(255).transform(v => v.toLowerCase()),
 subject: z.string().trim().min(1, 'Enter a subject.').max(160, 'Use 160 characters or fewer.'),
 message: z.string().trim().min(1, 'Enter a message.').max(5000, 'Use 5000 characters or fewer.'),
 privacy_acknowledged: z.literal(true, { errorMap: () => ({ message: 'Please acknowledge the Privacy Notice.' }) }),
});