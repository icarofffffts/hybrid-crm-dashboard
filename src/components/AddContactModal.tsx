'use client';

import React, { useState } from 'react';
import { createContact } from '@/app/actions/contacts';
import { useRouter } from 'next/navigation';

export default function AddContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    category: 'clientes',
    priority: 'media',
    email: '',
    phone: '',
    birthday: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await createContact(formData);
    
    if (result.success) {
      setIsOpen(false);
      setFormData({
        name: '',
        category: 'cliente',
        priority: 'media',
        email: '',
        phone: '',
        birthday: '',
      });
      router.refresh();
    } else {
      alert('Erro ao cadastrar: ' + result.error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center gap-2 transform active:scale-95"
      >
        <span>+</span> Prospectar VIP
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.1)] animate-scale-in">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="p-8 border-b border-white/5 relative z-10 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Novo Executivo VIP</h2>
                <p className="text-zinc-500 text-sm mt-1">Indexar novas conexões estratégicas no sistema.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                  placeholder="Ex: Vitor Arxdevs"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Categoria</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner cursor-pointer hover:bg-white/[0.05]"
                  >
                    <option value="clientes" className="bg-[#0a0a0a]">Clientes VIP</option>
                    <option value="parceiros" className="bg-[#0a0a0a]">Parceiros Estratégicos</option>
                    <option value="conhecidos" className="bg-[#0a0a0a]">Conhecidos / Leads</option>
                    <option value="outros" className="bg-[#0a0a0a]">Outros / Board</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Prioridade</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner cursor-pointer hover:bg-white/[0.05]"
                  >
                    <option value="alta" className="bg-[#0a0a0a]">Alta Intensidade</option>
                    <option value="media" className="bg-[#0a0a0a]">Média Recomendada</option>
                    <option value="baixa" className="bg-[#0a0a0a]">Baixa Manutenção</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Nascimento (Trigger n8n)</label>
                <input 
                  type="date" 
                  value={formData.birthday}
                  onChange={e => setFormData({...formData, birthday: e.target.value})}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 py-4 rounded-2xl text-white font-bold text-sm shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all transform active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? 'Indexando...' : 'Confirmar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
