'use client';

import React, { useState, useEffect } from 'react';
import { createContact, getCategories } from '@/app/actions/contacts';
import { useRouter } from 'next/navigation';

export default function AddContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState<any>({
    name: '',
    phone: '',
    email: '',
    company: '',
    job_title: '',
    city: '',
    how_met: '',
    date_met: '',
    category_id: '',
    level: 'C',
    instagram: '',
    linkedin: '',
    birthday: '',
    personal_notes: '',
    introduced_by: '',
    last_contact: '',
    next_contact: '',
  });

  const [customFields, setCustomFields] = useState<{ label: string, value: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategories).catch(console.error);
    }
  }, [isOpen]);

  const addCustomField = () => {
    setCustomFields([...customFields, { label: '', value: '' }]);
  };

  const updateCustomField = (index: number, field: 'label' | 'value', val: string) => {
    const newFields = [...customFields];
    newFields[index][field] = val;
    setCustomFields(newFields);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const customFieldsObj = customFields.reduce((acc: any, field) => {
      if (field.label) acc[field.label] = field.value;
      return acc;
    }, {});

    const result = await createContact({
      ...formData,
      custom_fields: customFieldsObj
    });
    
    if (result.success) {
      setIsOpen(false);
      setFormData({
        name: '', phone: '', email: '', company: '', job_title: '', city: '',
        how_met: '', date_met: '', category_id: '', level: 'C',
        instagram: '', linkedin: '', birthday: '', personal_notes: '',
        introduced_by: '', last_contact: '', next_contact: '',
      });
      setCustomFields([]);
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
          
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.1)] animate-scale-in max-h-[90vh] flex flex-col">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="p-8 border-b border-white/5 relative z-10 flex justify-between items-center bg-white/[0.02] flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Nova Conexão VIP</h2>
                <p className="text-zinc-500 text-sm mt-1">Indexar novas conexões estratégicas no sistema.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 relative z-10 custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest border-b border-white/5 pb-2">Informações Básicas</h3>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Nome Completo *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
                      placeholder="Ex: Vitor Arxdevs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Telefone</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                        placeholder="+55 ..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                        placeholder="contato@..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Empresa</label>
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Cargo</label>
                      <input 
                        type="text" 
                        value={formData.job_title}
                        onChange={e => setFormData({...formData, job_title: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Cidade (Ex: Juiz de Fora)</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Context & Level */}
                <div className="space-y-6">
                  <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest border-b border-white/5 pb-2">Contexto e Classificação</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Categoria</label>
                      <select 
                        value={formData.category_id}
                        onChange={e => setFormData({...formData, category_id: e.target.value})}
                        style={{ colorScheme: 'dark' }}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
                      >
                        <option value="">Selecionar...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id} className="bg-[#0a0a0a]">{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Nível Proximidade</label>
                      <select 
                        value={formData.level}
                        onChange={e => setFormData({...formData, level: e.target.value})}
                        style={{ colorScheme: 'dark' }}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
                      >
                        <option value="A" className="bg-[#0a0a0a]">Nível A - Estratégico</option>
                        <option value="B" className="bg-[#0a0a0a]">Nível B - Relevante</option>
                        <option value="C" className="bg-[#0a0a0a]">Nível C - Rede Geral</option>
                        <option value="D" className="bg-[#0a0a0a]">Nível D - Massa</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Onde conheceu</label>
                      <input 
                        type="text" 
                        value={formData.how_met}
                        onChange={e => setFormData({...formData, how_met: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Data que conheceu</label>
                      <input 
                        type="date" 
                        value={formData.date_met}
                        onChange={e => setFormData({...formData, date_met: e.target.value})}
                        style={{ colorScheme: 'dark' }}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Quem apresentou quem</label>
                    <input 
                      type="text" 
                      value={formData.introduced_by}
                      onChange={e => setFormData({...formData, introduced_by: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      placeholder="Ex: Fulano apresentou Beltrano"
                    />
                  </div>
                </div>

                {/* Social & Calendar */}
                <div className="space-y-6">
                  <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest border-b border-white/5 pb-2">Social e Agenda</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Instagram (@)</label>
                      <input 
                        type="text" 
                        value={formData.instagram}
                        onChange={e => setFormData({...formData, instagram: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">LinkedIn (URL)</label>
                      <input 
                        type="text" 
                        value={formData.linkedin}
                        onChange={e => setFormData({...formData, linkedin: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Aniversário</label>
                      <input 
                        type="date" 
                        value={formData.birthday}
                        onChange={e => setFormData({...formData, birthday: e.target.value})}
                        style={{ colorScheme: 'dark' }}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Último Contato</label>
                      <input 
                        type="datetime-local" 
                        value={formData.last_contact}
                        onChange={e => setFormData({...formData, last_contact: e.target.value})}
                        style={{ colorScheme: 'dark' }}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Próximo Contato Sugerido</label>
                    <input 
                      type="datetime-local" 
                      value={formData.next_contact}
                      onChange={e => setFormData({...formData, next_contact: e.target.value})}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Notes & Custom Fields */}
                <div className="space-y-6">
                  <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest border-b border-white/5 pb-2">Notas e Campos Extras</h3>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Observações Pessoais</label>
                    <textarea 
                      rows={3}
                      value={formData.personal_notes}
                      onChange={e => setFormData({...formData, personal_notes: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Campos Customizados</label>
                      <button 
                        type="button" 
                        onClick={addCustomField}
                        className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded"
                      >
                        + Adicionar Campo
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {customFields.map((field, i) => (
                        <div key={i} className="flex gap-2 animate-fade-in">
                          <input 
                            placeholder="Etiqueta (ex: WhatsApp)"
                            value={field.label}
                            onChange={e => updateCustomField(i, 'label', e.target.value)}
                            className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500/30"
                          />
                          <input 
                            placeholder="Valor"
                            value={field.value}
                            onChange={e => updateCustomField(i, 'value', e.target.value)}
                            className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500/30"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeCustomField(i)}
                            className="text-rose-500 hover:text-rose-400 p-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5 flex-shrink-0">
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
