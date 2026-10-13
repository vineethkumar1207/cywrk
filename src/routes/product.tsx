import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/cyber/site-shell';
import { ValueSection, ComparisonSection, ProblemSection } from '@/components/cyber/product-sections';
import { ResearchPreview } from '@/components/cyber/research-preview';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/product')({head:()=>pageHead('The evidence-first research workspace','Cywrk connects cybersecurity claims, sources and changes into a living technical knowledge state.'),component:Product});
function Product(){return <><SiteHeader/><main><section className="site-container page-intro"><span className="eyebrow">THE PRODUCT</span><h1>Cywrk</h1><p>Fragmented cybersecurity research, connected into a living map of what is established, disputed, changing, and still unresolved.</p><Button asChild size="lg"><Link to="/demo">Explore Interactive Demo <ArrowRight/></Link></Button></section><div className="site-container"><ResearchPreview/></div><ProblemSection/><ValueSection/><ComparisonSection/></main><SiteFooter/></>;}