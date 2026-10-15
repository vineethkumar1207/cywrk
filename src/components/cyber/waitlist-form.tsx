import { useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { interests, roles, waitlistSchema } from '@/lib/waitlist-schema';
import { joinWaitlist } from '@/lib/waitlist.functions';
export function WaitlistForm({source='waitlist'}: {source?: 'landing'|'waitlist'}) {
 const submitSignup = useServerFn(joinWaitlist);
 const [state,setState] = useState('idle');
 const [errors,setErrors] = useState<Record<string,string>>({});
 async function submit(e:FormEvent<HTMLFormElement>) {
  e.preventDefault(); const form = new FormData(e.currentTarget);
  const parsed = waitlistSchema.safeParse({name: form.get('name'),email:form.get('email'),role:form.get('role'),main_interest:form.get('main_interest'),open_to_feedback:form.get('open_to_feedback')==='on',waitlist_consent:form.get('waitlist_consent')==='on',terms_accepted:form.get('terms_accepted')==='on',product_updates_consent:form.get('product_updates_consent')==='on',source});
  if (!parsed.success) { setErrors(Object.fromEntries(parsed.error.issues.map(i=>[String(i.path[0]),i.message]))); return; }
  setErrors({}); setState('loading');
  try { const result = await submitSignup({data:parsed.data}); setState(result.status); } catch { setState('error'); }
 }
 if(state==='success') return <div className="signup-success" role="status"><span className="success-icon"><Check/></span><h2>You’re on the list.</h2><p>Thanks for helping shape Cywrk. We’ll reach out as private beta spots open.</p><Button asChild variant="outline"><Link to="/demo">Explore the demo <ArrowRight/></Link></Button></div>;
 return <form onSubmit={submit} noValidate className="waitlist-form"><div className="form-grid"><div className="field"><label htmlFor={`${source}-name`}>Name <span>Optional</span></label><input id={`${source}-name`} name="name" autoComplete="name" placeholder="Your name" maxLength={100}/></div><div className="field"><label htmlFor={`${source}-email`}>Work email <span>Required</span></label><input id={`${source}-email`} name="email" type="email" autoComplete="email" placeholder="you@company.com" maxLength={255} required aria-invalid={!!errors["email"]} aria-describedby={errors["email"]?`${source}-email-error`:undefined}/>{errors["email"]&&<p id={`${source}-email-error`} className="field-error">{errors["email"]}</p>}</div><div className="field"><label htmlFor={`${source}-role`}>Role <span>Required</span></label><select id={`${source}-role`} name="role" required aria-invalid={!!errors["role"]} defaultValue=""><option value="" disabled>Select your role</option>{roles.map(r=><option key={r}>{r}</option>)}</select>{errors["role"]&&<p className="field-error">{errors["role"]}</p>}</div><div className="field"><label htmlFor={`${source}-interest`}>Main interest <span>Required</span></label><select id={`${source}-interest`} name="main_interest" required aria-invalid={!!errors["main_interest"]} defaultValue=""><option value="" disabled>What matters most to you?</option>{interests.map(r=><option key={r}>{r}</option>)}</select>{errors["main_interest"]&&<p className="field-error">{errors["main_interest"]}</p>}</div></div>
  <div className="consent-group">
   <label className="checkbox-label"><input type="checkbox" name="waitlist_consent" required aria-invalid={!!errors["waitlist_consent"]}/> <span>I consent to Cywrk processing my details to manage the early-access waitlist and contact me about access. I can withdraw this consent at any time. <em>(Required)</em></span></label>{errors["waitlist_consent"]&&<p className="field-error">{errors["waitlist_consent"]}</p>}
   <label className="checkbox-label"><input type="checkbox" name="terms_accepted" required aria-invalid={!!errors["terms_accepted"]}/> <span>I agree to the <Link to="/terms">Terms of Use</Link> and acknowledge the <Link to="/privacy">Privacy Notice</Link>. <em>(Required)</em></span></label>{errors["terms_accepted"]&&<p className="field-error">{errors["terms_accepted"]}</p>}
   <label className="checkbox-label"><input type="checkbox" name="product_updates_consent"/> <span>Optional: send me occasional Cywrk product and news updates.</span></label>
   <label className="checkbox-label"><input type="checkbox" name="open_to_feedback"/> <span>Optional: I’m open to a 15-minute beta feedback call.</span></label>
  </div>
  {state==='duplicate'&&<p className="form-notice" role="status">This email is already on the list. You’re all set — we’ll be in touch as beta spots open.</p>}{state==='error'&&<p className="field-error" role="alert">We couldn’t save your signup. Please try again in a moment.</p>}<Button type="submit" size="lg" disabled={state==='loading'}>{state==='loading'?<><Loader2 className="animate-spin"/>Joining…</>:<>Join Early Access <ArrowRight/></>}</Button><p className="privacy-line"><ShieldCheck size={14}/> No spam or sales calls. You can withdraw consent or unsubscribe at any time.</p><Link to="/privacy" className="privacy-link">Read the Privacy Notice</Link></form>;
}