'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { approveTask } from '@/app/actions/tasks';

type Task = {
  id: string;
  title: string;
  description: string;
  suggested_message: string;
  status: string;
  contact_id: string;
  contacts?: { name: string, category: string, priority: string };
  selectedChannel?: 'whatsapp' | 'email'; // Client-side state
};

export default function SecretaryInboxPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tasks')
      .select('*, contacts(name, category, priority)')
      .eq('status', 'pendente')
      .order('created_at', { ascending: false });
    if (data) {
      // Add default channel state
      const tasksWithChannel = (data as any).map((t: any) => ({ ...t, selectedChannel: 'whatsapp' }));
      setTasks(tasksWithChannel);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleApprove = async (task: Task) => {
    setProcessingId(task.id);
    const result = await approveTask({
      taskId: task.id,
      contactId: task.contact_id,
      channel: task.selectedChannel || 'whatsapp',
      message: task.suggested_message,
    });

    if (result.success) {
      setTasks(prev => prev.filter(t => t.id !== task.id));
    } else {
      alert('Erro ao processar: ' + result.error);
    }
    setProcessingId(null);
  };

  const toggleChannel = (taskId: string, channel: 'whatsapp' | 'email') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, selectedChannel: channel } : t));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></span>
            Aprovação Humana Requerida
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Central de Aprovações</h1>
          <p className="text-zinc-400 text-lg font-light">O n8n sugere, o relacionamento decide. Revise as ações pendentes.</p>
        </div>
        <button className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors bg-black/40 border border-white/5 px-5 py-3 rounded-xl shadow-inner hover:bg-white/5" onClick={fetchTasks}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Sincronizar n8n
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading && <div className="h-48 bg-white/5 animate-pulse rounded-3xl border border-white/10 backdrop-blur-xl"></div>}
        
        {!loading && tasks.length === 0 && (
          <div className="p-16 text-center bg-emerald-950/20 border border-emerald-500/10 rounded-3xl backdrop-blur-xl relative overflow-hidden flex flex-col items-center shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-2 relative z-10 drop-shadow-md">Tudo Atualizado!</h3>
            <p className="text-emerald-100/60 relative z-10 max-w-lg text-lg font-light">Nenhuma tarefa pendente neste momento. A automação está varrendo os dados e em breve novas oportunidades estratégicas aparecerão aqui.</p>
          </div>
        )}

        {tasks.map(task => (
          <div key={task.id} className="bg-black/60 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-3xl relative shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-indigo-500/60 hover:shadow-[0_10px_60px_rgba(99,102,241,0.15)] transition-all group">
            <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-indigo-600/10 to-transparent pointer-events-none rounded-r-3xl"></div>
            
            <div className="flex flex-col xl:flex-row gap-10 relative z-10">
              <div className="flex-1">
                <div className="flex gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-amber-500/20 shadow-inner">
                    Ação Sugerida
                  </span>
                  {task.contacts?.priority === 'alta' && (
                    <span className="px-4 py-1.5 bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                      Cliente VIP Crítico
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight">{task.title}</h2>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 mb-4 shadow-inner">
                   <p className="text-zinc-300 text-sm font-medium flex items-start gap-4">
                     <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 inline-block text-xl">
                       🧠
                     </span>
                     <span className="leading-relaxed font-light">{task.description}</span>
                   </p>
                </div>

                <div className="mt-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Canal de Envio</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleChannel(task.id, 'whatsapp')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-xs ${task.selectedChannel === 'whatsapp' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'}`}
                    >
                      <span className="text-lg">📱</span> WhatsApp
                    </button>
                    <button 
                      onClick={() => toggleChannel(task.id, 'email')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-xs ${task.selectedChannel === 'email' ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'}`}
                    >
                      <span className="text-lg">📧</span> Email Corporativo
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-[1.2] flex flex-col justify-between">
                <div className="bg-[#0f0f13] border border-white/5 rounded-2xl p-6 relative shadow-inner group-focus-within:border-indigo-500/50 transition-colors h-full flex flex-col">
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-black px-3 text-[10px] font-bold text-indigo-400 tracking-widest uppercase border border-indigo-500/20 rounded-lg py-1 shadow-sm">Draft de Mensagem</div>
                  <textarea 
                    className="w-full h-full bg-transparent border-none text-zinc-300 font-mono text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed custom-scrollbar" 
                    rows={6}
                    defaultValue={task.suggested_message}
                    onChange={(e) => { task.suggested_message = e.target.value; }}
                  />
                </div>
                
                <div className="flex items-center gap-4 mt-6 justify-end">
                  <button className="px-6 py-3.5 text-sm uppercase tracking-widest font-bold text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
                    Ignorar
                  </button>
                  <button 
                    disabled={processingId === task.id}
                    onClick={() => handleApprove(task)}
                    className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center gap-3 transform active:scale-95 disabled:opacity-50"
                  >
                    {processingId === task.id ? 'Processando...' : 'Ativar Comunicação'}
                    <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
