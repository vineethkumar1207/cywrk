import { Link, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { BrainCircuit, ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function Brand() { return <Link to="/" className="brand" aria-label="Cywrk home"><span className="brand-mark"><BrainCircuit size={23}/></span><span>Cywrk<span className="brand-dot">.</span></span></Link>; }
export function SiteHeader() {
 const [open,setOpen] = useState(false);
 const path = useRouterState({select: s => s.location.pathname});
 return <header className="site-header"><div className="site-container header-inner"><Brand/><nav className={open ? 'site-nav open' : 'site-nav'} aria-label="Main navigation">{([{to:'/product',label:'Product'},{to:'/how-it-works',label:'How It Works'},{to:'/demo',label:'Demo'},{to:'/waitlist',label:'Early Access'}] as const).map(item => <Link key={item.to} to={item.to} className={path===item.to?'active':''} onClick={()=>setOpen(false)}>{item.label}</Link>)}</nav><Button asChild className="header-cta"><Link to="/waitlist">Join Early Access <ArrowUpRight/></Link></Button><Button variant="ghost" size="icon" className="mobile-menu" onClick={()=>setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open}>{open?<X/>:<Menu/>}</Button></div></header>;
}
export function SiteFooter() { return <footer className="site-footer site-container"><Brand/><p>Evidence over noise.</p><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/contact">Contact</Link><span>© 2026 Cywrk</span></div></footer>; }