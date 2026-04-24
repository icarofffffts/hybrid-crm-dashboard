import AddContactModal from '@/components/AddContactModal';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function ContactsPage() {
  const { data: contacts } = await supabase.from('contacts').select('*').order('priority', { ascending: true }); 

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)] ring-1 ring-inset ring-rose-500/20';
      case 'media': return 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)] ring-1 ring-inset ring-amber-500/20';
      default: return 'text-zinc-400 bg-white/5 border-white/10 ring-1 ring-inset ring-white/5';
    }
  };

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
        <AddContactModal />
      </div>

      <div className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center bg-white/[0.02] relative z-10">
          <div className="relative flex-1 min-w-[200px]">
             <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             <input 
              type="text" 
              placeholder="Pesquisar executivo, parceiro ou prospect..." 
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
            />
          </div>
          <select className="bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-medium text-zinc-300 focus:outline-none min-w-[180px] appearance-none cursor-pointer shadow-inner hover:bg-white/5 transition-colors">
            <option>Visão Global</option>
            <option>Somente Clientes VIP</option>
            <option>Board / Sócios</option>
          </select>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
            <thead className="bg-black/40 text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Perfil Executivo</th>
                <th className="px-8 py-5">Categoria</th>
                <th className="px-8 py-5 text-center">Classificação</th>
                <th className="px-8 py-5">Contato Privado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contacts?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-zinc-500 font-light text-lg">Sem registros de contato nesta base.</td>
                </tr>
              )}
              {contacts?.map((contact: any) => (
                <tr key={contact.id} className="hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-inner transition-colors border
                        ${contact.priority === 'alta' ? 'bg-gradient-to-br from-rose-500/20 to-rose-900/40 text-rose-300 border-rose-500/30' : 
                          contact.priority === 'media' ? 'bg-gradient-to-br from-amber-500/20 to-amber-900/40 text-amber-300 border-amber-500/30' : 
                          'bg-gradient-to-br from-zinc-800 to-black text-zinc-400 border-white/10 group-hover:bg-zinc-800'}`}>
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-300 transition-colors text-base tracking-tight">{contact.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-zinc-400 capitalize bg-white/5 px-3 py-1 rounded-md text-xs border border-white/5">{contact.category}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 font-bold uppercase text-[10px] tracking-widest inline-block min-w-[90px] text-center rounded-lg ${getPriorityColor(contact.priority)}`}>
                      {contact.priority}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-mono text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {contact.email || contact.phone || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 bg-black/60 flex justify-between items-center text-xs font-medium uppercase tracking-wider text-zinc-600 relative z-10">
          <p>Total indexado: {contacts?.length || 0}</p>
          <div className="flex gap-2">
             <button className="px-4 py-2 disabled:opacity-30 hover:text-white transition-colors">Prev</button>
             <button className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
