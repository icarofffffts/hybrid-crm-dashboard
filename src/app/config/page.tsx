'use client';

import React, { useState, useEffect } from 'react';
import { getCategories } from '@/app/actions/contacts';
import { createCategory, deleteCategory, updateCategory } from '@/app/actions/categories';

export default function ConfigPage() {
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações do Sistema</h1>
        <p className="text-zinc-400">Gerencie metadados, categorias e parâmetros globais do CRM.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Gestão de Categorias
          </h2>

          <form onSubmit={handleAdd} className="flex gap-4 mb-8">
            <input 
              type="text" 
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="Nova categoria..."
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500/50"
            />
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition-all text-sm"
            >
              Adicionar
            </button>
          </form>

          <div className="space-y-3">
            {isLoading ? (
              <p className="text-zinc-500 text-sm italic">Carregando...</p>
            ) : categories.length === 0 ? (
              <p className="text-zinc-500 text-sm">Nenhuma categoria cadastrada.</p>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                  <span className="text-zinc-300 font-medium">{cat.name}</span>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="text-zinc-600 hover:text-rose-500 transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl opacity-50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Logs e Auditoria
          </h2>
          <p className="text-zinc-500 text-sm">Configurações de retenção de dados e logs de sistema (Em breve).</p>
        </div>
      </div>
    </div>
  );
}
