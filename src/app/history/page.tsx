import React from 'react';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function HistoryPage() {
  const { data: interactions } = await supabase
    .from('interactions')
    .select('*, contacts(name, priority)')
    .order('interaction_date', { ascending: false });

  const getInteractionIcon = (type: string) => {
     switch(type) {
       case 'mensagem_enviada': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
       case 'reuniao': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
       case 'ligacao': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
       default: return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
     }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-black/60 p-10 rounded-3xl border border-white/5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-l from-emerald-500/10 to-transparent blur-[80px] pointer-events-none"></div>
        <div className="relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-300 mb-4 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            Registro Incorruptível
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Auditoria de Relacionamento</h1>
          <p className="text-zinc-400 text-lg font-light max-w-xl">Linha do tempo consolidada. Toda ação tomada pela equipe fica documentada e atrelada estrategicamente à conta.</p>
        </div>
      </div>

      <div className="mt-12 relative border-l-2 border-white/10 ml-8 pl-12 space-y-16">
        {interactions?.length === 0 && <p className="text-zinc-500 italic">Nenhuma ação de relacionamento registrada nos relatórios recentes.</p>}
        {interactions?.map((item, id) => (
          <div key={item.id} className="relative group">
            <div className={`absolute -left-[59px] top-1.5 h-7 w-7 rounded-full border-[5px] border-[#09090b] flex items-center justify-center
              ${id === 0 ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-110' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]'}
              transition-transform group-hover:scale-125
            `}></div>
            
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400/80 mb-4">{new Date(item.interaction_date).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
            
            <div className="bg-black/50 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors shadow-2xl backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-indigo-600"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-2xl bg-white/5 text-cyan-400 shadow-inner border border-white/5">
                    {getInteractionIcon(item.interaction_type)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl flex items-center gap-3 tracking-tight">
                      {item.contacts?.name || 'Contato Desconhecido'}
                      {item.contacts?.priority === 'alta' && <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-lg text-[10px] tracking-widest uppercase border border-rose-500/20 font-black shadow-[0_0_10px_rgba(244,63,94,0.1)]">VIP</span>}
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1 block">{item.interaction_type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0f0f13] p-5 rounded-2xl border border-white/5 mb-2 shadow-inner">
                 <p className="text-sm font-light text-zinc-300 leading-relaxed italic">"{item.notes}"</p>
              </div>

              <div className="flex justify-end pt-4">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Auditor: <span className="text-zinc-400">{item.created_by}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
