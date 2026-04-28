'use client';

import React, { useState } from 'react';
import { createProfile, deleteProfile } from '@/app/actions/profiles';
import { useRouter } from 'next/navigation';

export default function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', role: 'user' as 'admin' | 'user' });
  const router = useRouter();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createProfile(formData);
    if (result.success) {
      setIsModalOpen(false);
      setFormData({ full_name: '', email: '', role: 'user' });
      router.refresh();
    } else {
      alert('Erro ao convidar: ' + result.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja remover este membro da equipe?')) {
      const result = await deleteProfile(id);
      if (result.success) {
        router.refresh();
      } else {
        alert('Erro ao deletar: ' + result.error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestão de Equipe</h1>
          <p className="text-zinc-400">Controle de acessos e permissões dos usuários do CRM.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
        >
          Convidar Membro
        </button>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-white/[0.02] text-[10px] uppercase text-zinc-500 font-bold tracking-widest border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Usuário</th>
              <th className="px-8 py-5">Email</th>
              <th className="px-8 py-5">Função</th>
              <th className="px-8 py-5">Entrou em</th>
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {initialUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center text-zinc-500 italic font-light">Nenhum membro registrado além de você.</td>
              </tr>
            )}
            {initialUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold text-xs ring-2 ring-violet-500/10">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    <p className="font-semibold text-white">{user.full_name || 'Usuário Sem Nome'}</p>
                  </div>
                </td>
                <td className="px-8 py-5 font-mono text-xs">{user.email}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    user.role === 'admin' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-zinc-500 bg-white/5 border-white/10'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5 text-xs">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-8 py-5 text-right">
                   <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-zinc-600 hover:text-rose-500 transition-colors p-2"
                   >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 shadow-2xl animate-scale-in">
            <h2 className="text-2xl font-bold text-white mb-6">Convidar Membro</h2>
            <form onSubmit={handleInvite} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
                  placeholder="Nome do colaborador"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Email</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
                  placeholder="email@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Função</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as any})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                >
                  <option value="user" className="bg-black">Usuário Padrão</option>
                  <option value="admin" className="bg-black">Administrador</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-zinc-500 font-bold hover:text-white transition-colors">Cancelar</button>
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-white font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                  {isSubmitting ? 'Convidando...' : 'Enviar Convite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
