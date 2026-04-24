import React from 'react';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function DashboardPage() {
  const { count: contactsCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
  const { count: pendingTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'pendente');
  const { count: interactionsCount } = await supabase.from('interactions').select('*', { count: 'exact', head: true });

  const stats = [
    { label: 'Network Total', value: contactsCount || 0, trend: '+12 na semana', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'from-blue-600/20 to-blue-900/10', border: 'border-blue-500/20', text: 'text-blue-400' },
    { label: 'Ações n8n Pendentes', value: pendingTasks || 0, trend: 'Aguardando validação', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', color: 'from-amber-600/20 to-amber-900/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    { label: 'Interações Humanas', value: interactionsCount || 0, trend: 'Últimos 30 dias', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: 'from-rose-600/20 to-rose-900/10', border: 'border-rose-500/20', text: 'text-rose-400' },
    { label: 'Saúde da Carteira', value: '98%', trend: 'Classificação Premium', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-emerald-600/20 to-emerald-900/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      <div className="relative rounded-3xl overflow-hidden p-10 bg-black/60 border border-white/5 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-600/20 via-transparent to-transparent opacity-80 pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Núcleo de Inteligência Online
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Gestão Híbrida de <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Alto Valor</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed font-light">
            O n8n opera no background vigiando sua base. A tomada de decisão final é sempre sua.
            Foque apenas no impacto e deixe a triagem com a automação.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border bg-black/40 backdrop-blur-xl p-6 group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${stat.border}`}>
            <div className={`absolute inset-0 bg-gradient-to-tr ${stat.color} opacity-40 group-hover:opacity-70 transition-opacity`}></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-black/50 border ${stat.border} ${stat.text} shadow-inner`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} /></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{stat.trend}</span>
              </div>
              <div>
                <h3 className="text-4xl font-black text-white mb-1 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Automations Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl p-8 relative overflow-hidden group">
           <div className="absolute -inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none"></div>
           <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-2">Monitoramento Ativo (n8n)</h2>
                <p className="text-sm text-zinc-400">Trigger automáticos sendo observados na base de contatos VIP.</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded border border-indigo-500/20">Avaliando Tarefas...</div>
              </div>
           </div>
           
           <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                 <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner">
                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div className="flex-1">
                    <h4 className="font-semibold text-white">Aniversários da Diretoria</h4>
                    <p className="text-xs text-zinc-400 mt-1">Gera drafts humanizados para você aprovar diariamente.</p>
                 </div>
                 <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                 <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <div className="flex-1">
                    <h4 className="font-semibold text-white">Conquistas Corporativas (Scraping)</h4>
                    <p className="text-xs text-zinc-400 mt-1">Mapeia menções na mídia sobre o cliente para "touchpoints" táticos.</p>
                 </div>
                 <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              </div>
           </div>
        </div>
        
        <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-xl p-8 relative flex flex-col justify-between items-center text-center overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-20"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none"></div>
           <svg className="w-16 h-16 text-emerald-400 mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
           <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Base Segura</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-[200px] mx-auto">
                Não usamos bots para falar direto com o contato. A autenticidade está segura na sua aprovação manual.
              </p>
           </div>
        </div>
      </div>
      
    </div>
  );
}
