import React, { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Clock3, Search, HeartPulse, ShieldCheck, Stethoscope, Activity } from 'lucide-react';

type Article = { id: string; category: string; title: string; summary: string; readTime: string; date: string; icon: React.ReactNode; image: string; body: string[] };

const articles: Article[] = [
  { id: 'preventive-checkups', category: 'Preventive Care', title: 'Why regular health checkups matter', summary: 'A practical guide to preventive visits, screening conversations, and staying informed about your health.', readTime: '5 min read', date: 'October 2026', icon: <ShieldCheck size={28} />, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85', body: ['Preventive appointments are a chance to discuss your health history, medications, lifestyle, and any new symptoms with a qualified clinician.', 'The right screening schedule depends on your age, medical history, and individual risk factors. Ask your healthcare professional which tests and vaccinations are appropriate for you.', 'Keep a record of your questions and previous reports so your next appointment is more productive.'] },
  { id: 'prepare-for-appointment', category: 'Appointments', title: 'How to prepare for your next doctor visit', summary: 'Simple steps to make consultations smoother, from preparing questions to organizing your reports.', readTime: '4 min read', date: 'October 2026', icon: <Stethoscope size={28} />, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1400&q=85', body: ['Write down your main concerns and when your symptoms began. Bring a list of current medications, allergies, and relevant medical reports.', 'Arrive with enough time for registration. If you have several concerns, mention the most important ones early in the consultation.', 'Before leaving, confirm the follow-up plan and ask for clarification about anything you do not understand.'] },
  { id: 'understanding-vitals', category: 'Wellness', title: 'Understanding everyday health vitals', summary: 'Learn what measurements like blood pressure, heart rate, and temperature can tell your care team.', readTime: '6 min read', date: 'September 2026', icon: <Activity size={28} />, image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=85', body: ['Vital signs provide a snapshot of how your body is functioning. A single reading may be affected by activity, stress, illness, or the measurement method.', 'Record measurements consistently and share unusual patterns with a healthcare professional rather than interpreting them in isolation.', 'Seek urgent medical care for severe symptoms, regardless of what a home monitor displays.'] },
  { id: 'choosing-specialist', category: 'Patient Guides', title: 'Finding the right specialist for your care', summary: 'Understand referrals, specialties, and what to ask when choosing a doctor.', readTime: '5 min read', date: 'September 2026', icon: <HeartPulse size={28} />, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1400&q=85', body: ['A primary care clinician can often help determine whether a specialist visit is needed and which specialty is appropriate.', 'Consider relevant experience, appointment availability, and whether you can share previous reports securely.', 'For severe or rapidly worsening symptoms, seek urgent medical attention rather than waiting for a routine specialist appointment.'] },
];

const categories = ['All Stories', ...Array.from(new Set(articles.map(article => article.category)))];

export const BlogPage: React.FC = () => {
  const [category, setCategory] = useState('All Stories');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const visible = useMemo(() => articles.filter(article =>
    (category === 'All Stories' || article.category === category) &&
    (article.title + ' ' + article.summary + ' ' + article.category).toLowerCase().includes(search.toLowerCase())
  ), [category, search]);
  const activeArticle = articles.find(article => article.id === selected);
  const featured = visible[0];
  const remaining = visible.slice(1);

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pt-20">
        <header className="mb-12 flex flex-col justify-between gap-4 border-b border-[#d2d2d7] pb-9 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-tight text-[#b70302]">G-One Health Care</p>
            <h1 className="text-[clamp(3rem,7vw,5.75rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Newsroom.</h1>
          </div>
          <p className="max-w-sm text-[17px] leading-7 text-[#6e6e73]">The latest stories, insights and helpful guides for a healthier tomorrow.</p>
        </header>

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Newsroom categories" className="flex flex-wrap gap-2">
            {categories.map(item => (
              <button key={item} type="button" onClick={() => { setCategory(item); setSelected(null); }} aria-current={category === item ? 'page' : undefined} className={`rounded-[4px] px-5 py-2.5 text-sm transition-colors ${category === item ? 'bg-[#1d1d1f] font-semibold text-white' : 'bg-white font-medium text-[#6e6e73] hover:text-[#1d1d1f]'}`}>
                {item}
              </button>
            ))}
          </nav>
          <div className="flex w-full shrink-0 items-center gap-3 border-b border-[#b8b8bd] bg-transparent px-1 py-2.5 transition-colors focus-within:border-[#b70302] sm:w-64">
            <Search size={19} className="shrink-0 text-[#6e6e73]" aria-hidden="true" />
            <input type="search" value={search} onChange={event => { setSearch(event.target.value); setSelected(null); }} placeholder="Search Newsroom" aria-label="Search Newsroom stories" className="min-w-0 w-full appearance-none border-0 bg-transparent p-0 text-[15px] text-[#1d1d1f] outline-none ring-0 placeholder:text-[#86868b] focus:border-0 focus:outline-none focus:ring-0" />
          </div>
        </div>
        <div>
          <section aria-label="Newsroom stories" className="min-w-0">
            {activeArticle ? (
              <article className="overflow-hidden rounded-[4px] bg-white">
                <img src={activeArticle.image} alt={activeArticle.title} loading="eager" className="h-[240px] w-full object-cover sm:h-[370px]" />
                <div className="px-6 py-9 sm:px-12 sm:py-12">
                  <button type="button" onClick={() => setSelected(null)} className="mb-9 text-sm font-medium text-[#b70302] hover:underline">← Back to Newsroom</button>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#b70302]">{activeArticle.category}</p>
                  <h2 className="max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-[-0.04em]">{activeArticle.title}</h2>
                  <div className="mt-5 flex flex-wrap gap-5 text-xs text-[#86868b]"><span className="inline-flex items-center gap-2"><CalendarDays size={15}/>{activeArticle.date}</span><span className="inline-flex items-center gap-2"><Clock3 size={15}/>{activeArticle.readTime}</span></div>
                  <p className="mt-9 max-w-3xl text-xl leading-8 text-[#424245]">{activeArticle.summary}</p>
                  <div className="mt-8 max-w-3xl space-y-6 border-t border-[#e5e5e7] pt-8">{activeArticle.body.map((paragraph,i)=><p key={i} className="text-[16px] leading-8 text-[#424245]">{paragraph}</p>)}</div>
                  <p className="mt-10 max-w-3xl border-t border-[#e5e5e7] pt-6 text-sm leading-7 text-[#86868b]">This story is educational and does not replace professional medical advice.</p>
                </div>
              </article>
            ) : visible.length ? (
              <>
                <div className="mb-6 flex items-end justify-between gap-3"><h2 className="text-[28px] font-semibold tracking-[-0.035em]">{category === 'All Stories' ? 'Latest stories' : category}</h2><span className="text-sm text-[#86868b]">{visible.length} stories</span></div>
                {featured && <button type="button" onClick={() => { setSelected(featured.id); window.scrollTo({top:0,behavior:'smooth'}); }} className="group mb-8 block w-full overflow-hidden rounded-[4px] bg-white text-left shadow-sm transition-shadow hover:shadow-xl hover:shadow-black/5">
                  <img src={featured.image} alt={featured.title} loading="eager" className="h-[250px] w-full object-cover sm:h-[370px]" />
                  <div className="p-7 sm:p-9">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#b70302]">{featured.category} <span className="mx-2 text-[#d2d2d7]">•</span> {featured.date}</p>
                    <h3 className="max-w-3xl text-[clamp(1.7rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.035em]">{featured.title}</h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6e6e73]">{featured.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#b70302]">Read story <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></span>
                  </div>
                </button>}
                {remaining.length > 0 && <div className="grid gap-6 md:grid-cols-2">{remaining.map(article => (
                  <button key={article.id} type="button" onClick={() => { setSelected(article.id); window.scrollTo({top:0,behavior:'smooth'}); }} className="group flex flex-col overflow-hidden rounded-[4px] bg-white text-left shadow-sm transition-shadow hover:shadow-lg hover:shadow-black/5">
                    <img src={article.image} alt={article.title} loading="lazy" className="h-48 w-full object-cover" />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#b70302]">{article.category}</p>
                      <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.025em]">{article.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-7 text-[#6e6e73]">{article.summary}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-[#f0f0f2] pt-4 text-xs text-[#86868b]"><span>{article.date}</span><span className="inline-flex items-center gap-1.5 font-semibold text-[#b70302]">Read story <ArrowRight size={15}/></span></div>
                    </div>
                  </button>
                ))}</div>}
              </>
            ) : <div className="rounded-[4px] bg-white p-12 text-center text-sm text-[#6e6e73]">No stories match your search.</div>}
          </section>
        </div>
      </div>
    </main>
  );
};
