import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";

export const metadata = {
  title: "Hybrid CRM | ArxDevs",
  description: "Next Generation CRM for Relationship Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 min-h-screen">
        <div className="flex h-screen bg-[#09090b] overflow-hidden">
          {/* Sidebar */}
          <aside className="w-72 bg-[#121217] border-r border-white/5 flex flex-col relative z-20 shadow-2xl">
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent"></div>
            <div className="h-24 flex items-center px-8">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
                HybridCRM<span className="text-white">.</span>
              </h1>
            </div>
            
            <div className="px-6 pb-6">
              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-6"></div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4 ml-2">Módulos</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              <Link href="/" className="group flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-zinc-400 hover:text-white">
                <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </span>
                Supervisão
              </Link>
              <Link href="/contacts" className="group flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-zinc-400 hover:text-white">
                <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </span>
                Carteira (CRM)
              </Link>
              <Link href="/secretary" className="relative group flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-zinc-400 hover:text-white">
                <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </span>
                Secretária n8n
                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
              </Link>
              <Link href="/history" className="group flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-zinc-400 hover:text-white">
                <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
                Auditoria / Timeline
              </Link>
            </nav>

            <div className="p-6">
              <div className="px-5 py-4 rounded-2xl bg-gradient-to-tr from-indigo-900/40 to-black border border-indigo-500/20 flex items-center justify-between group shadow-[0_0_20px_rgba(99,102,241,0.05)] hover:shadow-[0_0_25px_rgba(99,102,241,0.1)] transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex justify-center items-center font-bold text-indigo-300">
                    VA
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Vitor A.</p>
                    <p className="text-[10px] text-indigo-300/80 uppercase tracking-widest font-mono">Diretor</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col relative bg-[#09090b] z-10 overflow-y-auto">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="flex-1 p-12 relative z-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
