import { z } from 'zod';
export const roles = ['Cybersecurity student','Self-learner / career switcher','Security researcher / bug bounty','SOC / blue team','Pentest / red team','Security engineer','CTI / threat researcher','Educator / academic','Other'] as const;
export const interests = ['Research with evidence','Contradiction detection','Monitoring important changes','Persistent cybersecurity knowledge','Learning + research workflow','Security tool integrations'] as const;
export const waitlistSchema = z.object({
 name: z.string().trim().max(100, 'Use 100 characters or fewer.').optional(),
 email: z.string().trim().email('Enter a valid work email.').max(255).transform(v => v.toLowerCase()),
 role: z.enum(roles, { errorMap: () => ({ message: 'Choose your role.' }) }),
 main_interest: z.enum(interests, { errorMap: () => ({ message: 'Choose your main interest.' }) }),
 open_to_feedback: z.boolean().default(false),
 source: z.enum(['website','landing','waitlist']).default('website'),
});