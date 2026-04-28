'use client';

import React, { useState } from 'react';
import { bulkCreateContacts, getCategories } from '@/app/actions/contacts';
import { useRouter } from 'next/navigation';

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportCSVModal({ isOpen, onClose }: ImportCSVModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview/Map, 3: Success
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return;

      const detectedHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      setHeaders(detectedHeaders);

      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const obj: any = {};
        detectedHeaders.forEach((header, i) => {
          obj[header] = values[i];
        });
        return obj;
      });

      setCsvData(rows);
      setStep(2);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setIsSubmitting(true);
    
    // Simple mapping logic - expects specific headers or tries to match
    // Template Headers: Name, Phone, Email, Company, Job Title, City, Level
    const categories = await getCategories();
    
    const formattedContacts = csvData.map(row => {
      const catName = row.Category || row.Categoria;
      const category = categories.find(c => c.name.toLowerCase() === catName?.toLowerCase());
      
      return {
        name: row.Name || row.Nome,
        phone: row.Phone || row.Telefone,
        email: row.Email,
        company: row.Company || row.Empresa,
        job_title: row.JobTitle || row.Cargo || row['Job Title'],
        city: row.City || row.Cidade,
        level: row.Level || row.Nivel || 'C',
        category_id: category?.id || null,
        personal_notes: row.Notes || row.Notas || row.Observacoes,
        how_met: row.HowMet || row.ComoConheceu || row['How Met'],
        introduced_by: row.IntroducedBy || row.QuemApresentou || row['Introduced By'],
        custom_fields: {}
      };
    }).filter(c => c.name);

    const result = await bulkCreateContacts(formattedContacts);
    
    if (result.success) {
      setStep(3);
      router.refresh();
    } else {
      alert('Erro na importação: ' + result.error);
    }
    
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.1)] animate-scale-in max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Importação de Inteligência</h2>
            <p className="text-zinc-500 text-sm mt-1">Carregue dados em massa para sua carteira VIP.</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          {step === 1 && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Selecione seu Arquivo CSV</h3>
              <p className="text-zinc-500 text-sm mb-8 text-center max-w-sm">Use o modelo padrão para garantir que todos os campos estratégicos sejam indexados corretamente.</p>
              
              <label className="cursor-pointer bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-lg">
                Procurar Arquivo
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
              
              <button className="mt-6 text-xs text-indigo-400 hover:underline font-medium">Download do Modelo CSV</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
                <p className="text-sm text-indigo-300 font-medium">{csvData.length} registros detectados para importação.</p>
                <button onClick={() => setStep(1)} className="text-xs text-zinc-400 hover:text-white underline">Trocar arquivo</button>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-white/5 text-zinc-500 uppercase font-bold tracking-widest border-b border-white/5">
                    <tr>
                      {headers.slice(0, 5).map(h => <th key={h} className="px-4 py-3">{h}</th>)}
                      <th className="px-4 py-3">...</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-400 font-mono">
                    {csvData.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {headers.slice(0, 5).map(h => <td key={h} className="px-4 py-3 truncate max-w-[120px]">{row[h]}</td>)}
                        <td className="px-4 py-3">...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                <p className="text-xs text-amber-200/70 leading-relaxed italic flex items-start gap-2">
                  <span>⚠️</span>
                  Certifique-se que as colunas 'Name', 'Email' e 'Level' estão presentes para melhor performance.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Importação Concluída</h3>
              <p className="text-zinc-500 text-sm max-w-sm">Sua carteira de relacionamento foi atualizada com sucesso. A automação n8n começará a processar os novos perfis em breve.</p>
              <button 
                onClick={onClose}
                className="mt-8 bg-white text-black px-10 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all"
              >
                Fechar
              </button>
            </div>
          )}
        </div>

        {step === 2 && (
          <div className="p-8 border-t border-white/5 flex gap-4 bg-white/[0.02]">
            <button onClick={() => setStep(1)} className="flex-1 py-4 text-sm font-bold text-zinc-500 hover:text-white transition-colors">Voltar</button>
            <button 
              disabled={isSubmitting}
              onClick={handleImport}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-white font-bold text-sm shadow-[0_0_30px_rgba(79,70,229,0.2)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Processando Inteligência...' : 'Confirmar Importação'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
