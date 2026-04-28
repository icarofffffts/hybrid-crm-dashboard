'use client';

import React, { useState, useEffect } from 'react';
import { getCategories } from '@/app/actions/contacts';
import { createCategory, deleteCategory } from '@/app/actions/categories';

export default function ConfigPage() {
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const result = await createCategory(newCategoryName);
    if (result.success) {
      setNewCategoryName('');
      fetchCategories();
    } else {
      alert('Erro ao criar: ' + result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza? Isso pode afetar contatos vinculados.')) return;
    const result = await deleteCategory(id);
    if (result.success) {
      fetchCategories();
    } else {
      alert('Erro ao deletar: ' + result.error);
    }
  };

  const downloadCSVTemplate = () => {
    const headers = "Name,Phone,Email,Company,Job Title,City,Category,Level,Notes,HowMet,IntroducedBy";
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'crm_template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-4 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Painel de Controle
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Configurações Estratégicas</h1>
          <p className="text-zinc-400 text-lg font-light">Gerencie metadados, categorias e parâmetros globais do CRM.</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-black/40 border border-white/5 rounded-2xl w-fit backdrop-blur-xl">
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Categorias
        </button>
        <button 
          onClick={() => setActiveTab('data')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'data' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Ferramentas de Dados
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'categories' && (
          <div className="bg-black/40 border border-white/5 rounded-[32px] p-10 backdrop-blur-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></span>
                Taxonomia de Contatos
              </h2>

              <form onSubmit={handleAdd} className="flex gap-4 mb-10 bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="Nova categoria (Ex: Parceiro Estratégico)..."
                  className="flex-1 bg-transparent border-none rounded-xl px-4 py-3 text-white outline-none focus:ring-0 placeholder:text-zinc-600"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all text-sm shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                  Adicionar
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                  <div className="col-span-full h-20 bg-white/5 animate-pulse rounded-2xl"></div>
                ) : categories.length === 0 ? (
                  <p className="text-zinc-500 text-sm italic col-span-full py-10 text-center border border-dashed border-white/10 rounded-2xl">Nenhuma categoria cadastrada.</p>
                ) : (
                  categories.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 group/item hover:bg-white/[0.06] hover:border-white/10 transition-all">
                      <span className="text-zinc-300 font-semibold">{cat.name}</span>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="text-zinc-600 hover:text-rose-500 transition-colors p-2 hover:bg-rose-500/10 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/40 border border-white/5 rounded-[32px] p-10 backdrop-blur-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
              <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Exportação e Modelos</h2>
              <p className="text-zinc-500 text-sm mb-8 relative z-10 leading-relaxed">
                Baixe o modelo oficial para importação em massa ou exporte sua base completa para backups offline.
              </p>
              <div className="space-y-4 relative z-10">
                <button 
                  onClick={downloadCSVTemplate}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all group/btn"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl group-hover/btn:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Modelo CSV Padrão</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-60 font-mono">template_crm.csv</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 text-white opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Exportar Base Completa</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-60 font-mono">Em breve</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-[32px] p-10 backdrop-blur-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-rose-500/5 rounded-full blur-[80px] pointer-events-none"></div>
               <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Segurança e Limpeza</h2>
               <p className="text-zinc-500 text-sm mb-8 relative z-10 leading-relaxed">
                 Ações destrutivas e manutenção preventiva da integridade dos dados do sistema.
               </p>
               <button className="w-full p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-500 font-bold hover:bg-rose-500/10 transition-all text-center uppercase tracking-widest text-xs">
                 Limpar Registros Órfãos
               </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-black/40 border border-white/5 rounded-[32px] p-10 backdrop-blur-2xl relative overflow-hidden">
             <div className="flex items-center gap-8">
               <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-900 flex items-center justify-center text-4xl font-black text-white shadow-2xl border border-white/20">
                 VA
               </div>
               <div>
                 <h2 className="text-3xl font-bold text-white">Vitor Arxdevs</h2>
                 <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mt-1">Diretor de Operações (Admin)</p>
                 <div className="flex gap-4 mt-6">
                    <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
                       <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Sessão Ativa</p>
                       <p className="text-sm text-zinc-300">Juiz de Fora, BR</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
                       <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Nível de Acesso</p>
                       <p className="text-sm text-indigo-300 font-bold">Total (Root)</p>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
