import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { brandIdentity as brand } from '@/lib/brandIdentity';

export function FounderIdentity({ launch = false }: { launch?: boolean }) {
  const canonical = `https://coexterreaiqzzio.lovable.app/${launch ? 'official-launch' : 'about'}`;
  const image = `https://coexterreaiqzzio.lovable.app${brand.portrait}`;
  const title = launch ? brand.announcement : 'Prem Prasad — CoreAI founder & CEO';
  const description = `${brand.credit}. Owned and led by Prem Prasad. ${brand.announcement}. Official website: ${brand.website}`;
  const person = {
    '@type': 'Person', '@id': `${brand.website}#prem-prasad`, name: brand.founder,
    jobTitle: 'Founder & CEO', image, url: `${brand.website}about`,
    worksFor: { '@id': `${brand.website}#organization` },
  };
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@graph': [person, {
            '@type': 'Organization', '@id': `${brand.website}#organization`,
            name: brand.name, url: brand.website, founder: { '@id': `${brand.website}#prem-prasad` },
            description: brand.credit,
          }, {
            '@type': launch ? 'WebPage' : 'ProfilePage', '@id': canonical,
            url: canonical, name: title, description,
            mainEntity: { '@id': `${brand.website}#prem-prasad` },
          }],
        })}</script>
      </Helmet>
      <section className="border-b border-border pb-10">
        <div className="flex items-center justify-between gap-4 text-xs font-mono uppercase text-muted-foreground mb-8">
          <span>CoreAI / The founder</span><span>Independent vision</span>
        </div>
        <img src={brand.portrait} alt="Prem Prasad, CoreAI founder & CEO" width="768" height="768"
          className="w-56 h-56 sm:w-72 sm:h-72 object-contain rounded-full mx-auto ring-1 ring-border shadow-xl" />
        <div className="text-center mt-8">
          <p className="text-primary text-sm font-medium mb-3">{brand.role}</p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Prem Prasad</h1>
          <p className="text-lg text-muted-foreground mt-4">{brand.credit}</p>
          <Button asChild variant="outline" className="mt-6 gap-2">
            <a href={brand.website}>Official CoreAI website <ArrowUpRight className="h-4 w-4" /></a>
          </Button>
        </div>
      </section>
      <section className="py-10 border-b border-border">
        <p className="font-mono text-xs uppercase text-primary mb-4">Official announcement / Future launch</p>
        <h2 className="text-2xl sm:text-3xl font-semibold leading-snug max-w-2xl">{brand.announcement}</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">2028–30 is the announced future launch window. The official launch has not yet taken place.</p>
        {!launch && <Button asChild variant="link" className="px-0 mt-3"><Link to="/official-launch">View official announcement <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>}
      </section>
      <section className="pt-10">
        <h2 className="text-xl font-semibold mb-4">One founder. One CoreAI.</h2>
        <p className="text-muted-foreground leading-relaxed">CoreAI is owned and led by Prem Prasad. This is his AI assistant project for chat, learning, writing and coding in English and Hindi, available at coreaii.vercel.app. It is not affiliated with unrelated apps or companies using the CoreAI name.</p>
      </section>
    </>
  );
}