import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/cyber/site-shell';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/metadata';
import { contactSchema } from '@/lib/waitlist-schema';
import { sendContactMessage } from '@/lib/waitlist.functions';
export const Route = createFileRoute('/contact')({head:()=>pageHead('Contact','Contact Cywrk with questions about early access, privacy requests or the product.'),component:Contact});
function Contact(){
 const send=useServerFn(sendContactMessage);
 const [state,setState]=useState<'idle'|'loading'|'success'|'error'>('idle');
 const [errors,setErrors]=useState<Record<string,string>>({});
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);
  const parsed=contactSchema.safeParse({name:f.get('name'),email:f.get('email'),subject:f.get('subject'),message:f.get('message'),privacy_acknowledged:f.get('privacy_acknowledged')==='on'});
  if(!parsed.success){setErrors(Object.fromEntries(parsed.error.issues.map(i=>[String(i.path[0]),i.message])));return;}
  setErrors({});setState('loading');
  try{const r=await send({data:parsed.data});setState(r.status);}catch{setState('error');}}
 const err=(k:string)=>errors[k]&&<p id={`contact-${k}-error`} className="field-error">{errors[k]}</p>;
 return <><SiteHeader/><main className="site-container prose-page"><span className="eyebrow">CONTACT</span><h1>Contact Cywrk</h1><p>Questions about early access, privacy or data requests, or the product? Send us a message and we’ll reply by email. Please don’t include credentials or confidential security findings.</p>
 <section className="signup-panel contact-panel">{state==='success'?<div className="signup-success" role="status"><span className="success-icon"><Check/></span><h2>Message sent.</h2><p>Thanks for getting in touch. We’ll reply to the email address you provided.</p><Button variant="outline" onClick={()=>setState('idle')}>Send another message</Button></div>:
 <form onSubmit={submit} noValidate className="waitlist-form"><div className="form-grid">
  <div className="field"><label htmlFor="contact-name">Name <span>Required</span></label><input id="contact-name" name="name" autoComplete="name" maxLength={100} required aria-invalid={!!errors["name"]} aria-describedby={errors["name"]?'contact-name-error':undefined}/>{err('name')}</div>
  <div className="field"><label htmlFor="contact-email">Email <span>Required</span></label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={255} required aria-invalid={!!errors["email"]} aria-describedby={errors["email"]?'contact-email-error':undefined}/>{err('email')}</div>
  <div className="field"><label htmlFor="contact-subject">Subject <span>Required</span></label><input id="contact-subject" name="subject" maxLength={160} required aria-invalid={!!errors["subject"]} aria-describedby={errors["subject"]?'contact-subject-error':undefined}/>{err('subject')}</div>
  <div className="field"><label htmlFor="contact-message">Message <span>Required</span></label><textarea id="contact-message" name="message" maxLength={5000} required aria-invalid={!!errors["message"]} aria-describedby={errors["message"]?'contact-message-error':undefined}/><p className="field-hint">Up to 5,000 characters.</p>{err('message')}</div>
 </div><div className="consent-group"><label className="checkbox-label"><input type="checkbox" name="privacy_acknowledged" required aria-invalid={!!errors["privacy_acknowledged"]}/> <span>I understand Cywrk will use these details to respond to my enquiry, as described in the <Link to="/privacy">Privacy Notice</Link>. <em>(Required)</em></span></label>{err('privacy_acknowledged')}</div>
 {state==='error'&&<p className="field-error" role="alert">We couldn’t send your message. Please try again in a moment.</p>}
 <Button type="submit" size="lg" disabled={state==='loading'}>{state==='loading'?<><Loader2 className="animate-spin"/>Sending…</>:<>Send message <ArrowRight/></>}</Button></form>}</section></main><SiteFooter/></>;}