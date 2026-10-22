import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CalendarDays, Clock3, Search, HeartPulse, ShieldCheck, Stethoscope, Activity } from 'lucide-react';

type Article = { id: string; category: string; title: string; summary: string; readTime: string; date: string; icon: React.ReactNode; body: string[] };

const articles: Article[] = [
  { id: 'preventive-checkups', category: 'Preventive Care', title: 'Why regular health checkups matter', summary: 'A practical guide to preventive visits, screening conversations, and staying informed about your health.', readTime: '5 min read', date: 'October 2026', icon: <ShieldCheck size={28} />, body: ['Preventive appointments are a chance to discuss your health history, medications, lifestyle, and any new symptoms with a qualified clinician.', 'The right screening schedule depends on your age, medical history, and individual risk factors. Ask your healthcare professional which tests and vaccinations are appropriate for you.', 'Keep a record of your questions and previous reports so your next appointment is more productive.'] },
  { id: 'prepare-for-appointment', category: 'Appointments', title: 'How to prepare for your next doctor visit', summary: 'Simple steps to make consultations smoother, from preparing questions to organizing your reports.', readTime: '4 min read', date: 'October 2026', icon: <Stethoscope size={28} />, body: ['Write down your main concerns and when your symptoms began. Bring a list of current medications, allergies, and relevant medical reports.', 'Arrive with enough time for registration. If you have several concerns, mention the most important ones early in the consultation.', 'Before leaving, confirm the follow-up plan and ask for clarification about anything you do not understand.'] },
  { id: 'understanding-vitals', category: 'Wellness', title: 'Understanding everyday health vitals', summary: 'Learn what measurements like blood pressure, heart rate, and temperature can tell your care team.', readTime: '6 min read', date: 'September 2026', icon: <Activity size={28} />, body: ['Vital signs provide a snapshot of how your body is functioning. A single reading may be affected by activity, stress, illness, or the measurement method.', 'Record measurements consistently and share unusual patterns with a healthcare professional rather than interpreting them in isolation.', 'Seek urgent medical care for severe symptoms, regardless of what a home monitor displays.'] },
  { id: 'choosing-specialist', category: 'Patient Guides', title: 'Finding the right specialist for your care', summary: 'Understand referrals, specialties, and what to ask when choosing a doctor.', readTime: '5 min read', date: 'September 2026', icon: <HeartPulse size={28} />, body: ['A primary care clinician can often help determine whether a specialist visit is needed and which specialty is appropriate.', 'Consider relevant experience, appointment availability, and whether you can share previous reports securely.', 'For severe or rapidly worsening symptoms, seek urgent medical attention rather than waiting for a routine specialist appointment.'] },
];

const categories = ['All Articles', ...Array.from(new Set(articles.map(article => article.category)))];

export const BlogPage: React.FC = () => {
  const [category, setCategory] = useState('All Articles');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const visible = useMemo(() => articles.filter(article =>
    (category === 'All Articles' || article.category === category) &&
    (article.title + ' ' + article.summary + ' ' + article.category).toLowerCase().includes(search.toLowerCase())
  ), [category, search]);
  const activeArticle = articles.find(article => article.id === selected);

  return (
    <main className="min-h-screen bg-[#faf7f6] text-slate-900">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold tracking-wide text-[#b70302]"><BookOpen size={15} /> G-ONE HEALTH JOURNAL</div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Health insights & patient guides</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500">Helpful reading for better-informed healthcare decisions, from preventive care to making the most of your appointments.</p>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
            <h2 className="mb-5 text-base font-semibold">Explore blogs</h2>
            <label className="mb-5 flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
              <Search size={17} className="shrink-0 text-slate-400" />
              <input value={search} onChange={event => { setSearch(event.target.value); setSelected(null); }} placeholder="Search articles..." aria-label="Search blog articles" className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </label>
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</p>
            <nav aria-label="Blog categories" className="space-y-1">
              {categories.map(item => (
                <button key={item} type="button" onClick={() => { setCategory(item); setSelected(null); }} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${category === item ? 'bg-red-50 font-semibold text-[#b70302]' : 'font-medium text-slate-600 hover:bg-slate-50'}`}>
                  <span>{item}</span><span className="text-xs opacity-70">{item === 'All Articles' ? articles.length : articles.filter(a => a.category === item).length}</span>
                </button>
              ))}
            </nav>
            <div className="mt-7 rounded-2xl bg-[#fff5f4] p-5">
              <HeartPulse size={23} className="mb-3 text-[#b70302]" />
              <p className="text-sm font-semibold">Your health, your priority</p>
              <p className="mt-2 text-xs leading-6 text-slate-500">Educational content only. For personal medical advice, consult a qualified healthcare professional.</p>
            </div>
          </aside>

          <section aria-label="Blog articles" className="min-w-0">
            {activeArticle ? (
              <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
                <button type="button" onClick={() => setSelected(null)} className="mb-7 text-sm font-medium text-[#b70302] hover:underline">← All articles</button>
                <span className="mb-4 block text-xs font-semibold uppercase tracking-wider text-[#b70302]">{activeArticle.category}</span>
                <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{activeArticle.title}</h2>
                <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><CalendarDays size={15} /> {activeArticle.date}</span><span className="inline-flex items-center gap-2"><Clock3 size={15} /> {activeArticle.readTime}</span></div>
                <p className="mt-8 text-lg leading-8 text-slate-600">{activeArticle.summary}</p>
                <div className="mt-7 space-y-5 border-t border-slate-100 pt-7">{activeArticle.body.map((paragraph, i) => <p key={i} className="max-w-3xl text-[15px] leading-8 text-slate-600">{paragraph}</p>)}</div>
                <p className="mt-10 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-500">This article is for general education and does not replace professional medical advice.</p>
              </article>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{category === 'All Articles' ? 'Latest articles' : category}</h2><span className="text-sm text-slate-500">{visible.length} articles</span></div>
                {visible.length ? <div className="grid gap-5 md:grid-cols-2">{visible.map(article => (
                  <article key={article.id} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-shadow hover:shadow-lg hover:shadow-slate-200/60">
                    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-[#fff2f1] via-[#fdf7f7] to-[#f1f5f9] text-[#b70302]">{article.icon}</div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#b70302]">{article.category}</span>
                      <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight">{article.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">{article.summary}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-xs text-slate-400"><span className="inline-flex items-center gap-1.5"><Clock3 size={14}/>{article.readTime}</span><button type="button" onClick={() => { setSelected(article.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="inline-flex items-center gap-1.5 font-semibold text-[#b70302]">Read article <ArrowRight size={15}/></button></div>
                    </div>
                  </article>
                ))}</div> : <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">No articles match your search.</div>}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};
