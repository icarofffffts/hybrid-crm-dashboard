import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function UsersPage() {
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestão de Equipe</h1>
          <p className="text-zinc-400">Controle de acessos e permissões dos usuários do CRM.</p>
        </div>
        <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all shadow-lg active:scale-95">
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
              <th className="px-8 py-5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center text-zinc-500 italic font-light">Nenhum membro registrado além de você.</td>
              </tr>
            )}
            {users?.map((user) => (
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
                <td className="px-8 py-5">
                   <button className="text-zinc-600 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
