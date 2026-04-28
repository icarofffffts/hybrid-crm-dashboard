'use client';

import React, { useState } from 'react';
import ContactModal from '@/components/ContactModal';
import ImportCSVModal from '@/components/ImportCSVModal';
import { deleteContact } from '@/app/actions/contacts';
import { useRouter } from 'next/navigation';

export default function ContactListClient({ initialContacts }: { initialContacts: any[] }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const router = useRouter();

  const handleEdit = (contact: any) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente remover este contato estrategico?')) {
      const result = await deleteContact(id);
      if (result.success) {
        router.refresh();
      } else {
        alert('Erro ao deletar: ' + result.error);
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A': return 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)] ring-1 ring-inset ring-rose-500/20';
      case 'B': return 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)] ring-1 ring-inset ring-amber-500/20';
      case 'C': return 'text-blue-400 bg-blue-500/10 border-blue-500/30 ring-1 ring-inset ring-blue-500/20';
      default: return 'text-zinc-400 bg-white/5 border-white/10 ring-1 ring-inset ring-white/5';
    }
  };

  const filteredContacts = initialContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(search.toLowerCase()) || 
                          contact.company?.toLowerCase().includes(search.toLowerCase()) ||
                          contact.email?.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || contact.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            CRM Dinâmico
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Carteira de Relacionamento</h1>
          <p className="text-zinc-400 text-lg font-light">Visão centralizada de conexões estratégicas e parceiros B2B.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white/5 text-white hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Importar CSV
          </button>
          <button 
            onClick={() => { setSelectedContact(null); setIsContactModalOpen(true); }}
            className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2"
          >
            <span>+</span> Prospectar VIP
          </button>
        </div>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl relative">
        <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center bg-white/[0.02] relative z-10">
          <div className="relative flex-1 min-w-[200px]">
             <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             <input 
              type="text" 
              placeholder="Pesquisar executivo, parceiro ou prospect..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
            />
          </div>
          <select 
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-medium text-zinc-300 focus:outline-none min-w-[180px] appearance-none cursor-pointer shadow-inner hover:bg-white/5 transition-colors"
          >
            <option value="all">Visão Global</option>
            <option value="A">Nível A - Estratégicos</option>
            <option value="B">Nível B - Relevantes</option>
            <option value="C">Nível C - Rede Geral</option>
            <option value="D">Nível D - Massa</option>
          </select>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
            <thead className="bg-black/40 text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Perfil Executivo</th>
                <th className="px-8 py-5">Categoria</th>
                <th className="px-8 py-5 text-center">Nível</th>
                <th className="px-8 py-5">Empresa / Cargo</th>
                <th className="px-8 py-5">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-zinc-500 font-light text-lg">Sem registros encontrados.</td>
                </tr>
              )}
              {filteredContacts.map((contact: any) => (
                <tr key={contact.id} className="hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <td className="px-8 py-5" onClick={() => handleEdit(contact)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-inner transition-colors border
                        ${contact.level === 'A' ? 'bg-gradient-to-br from-rose-500/20 to-rose-900/40 text-rose-300 border-rose-500/30' : 
                          contact.level === 'B' ? 'bg-gradient-to-br from-amber-500/20 to-amber-900/40 text-amber-300 border-amber-500/30' : 
                          'bg-gradient-to-br from-zinc-800 to-black text-zinc-400 border-white/10 group-hover:bg-zinc-800'}`}>
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-300 transition-colors text-base tracking-tight">{contact.name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">{contact.city || 'Cidade não inf.'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5" onClick={() => handleEdit(contact)}>
                    <span className="text-zinc-400 capitalize bg-white/5 px-3 py-1 rounded-md text-xs border border-white/5">
                      {contact.categories?.name || 'Sem Categoria'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center" onClick={() => handleEdit(contact)}>
                    <span className={`px-4 py-1.5 font-bold uppercase text-[10px] tracking-widest inline-block min-w-[40px] text-center rounded-lg ${getLevelColor(contact.level)}`}>
                      {contact.level}
                    </span>
                  </td>
                  <td className="px-8 py-5" onClick={() => handleEdit(contact)}>
                    <p className="text-white font-medium text-xs">{contact.company || '—'}</p>
                    <p className="text-[10px] text-zinc-500">{contact.job_title || '—'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => handleEdit(contact)}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(contact.id)}
                        className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 bg-black/60 flex justify-between items-center text-xs font-medium uppercase tracking-wider text-zinc-600 relative z-10">
          <p>Total indexado: {filteredContacts.length}</p>
          <div className="flex gap-2 text-[10px] items-center">
             <span>Filtrando resultados ativos</span>
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        contact={selectedContact}
      />
      
      <ImportCSVModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
