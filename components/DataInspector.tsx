import React from 'react';
import { SimulationStepData } from '../types';
import { Code, Database, ArrowRight } from 'lucide-react';

interface DataInspectorProps {
  data: SimulationStepData | null;
}

const DataInspector: React.FC<DataInspectorProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/30 rounded-xl border border-slate-800 p-4">
        <Database className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs uppercase tracking-widest font-semibold">Data Inspector Idle</span>
      </div>
    );
  }

  const renderContent = () => {
    if (data.visualType === 'ranking' && typeof data.data === 'object' && 'candidates' in data.data) {
        const candidates = (data.data as any).candidates as any[];
        return (
            <div className="space-y-3 pt-2">
                <div className="flex justify-between text-[10px] text-slate-500 uppercase font-semibold border-b border-slate-800 pb-1">
                    <span>Candidate Document</span>
                    <div className="flex gap-6 pr-1">
                        <span>Rank Δ</span>
                        <span className="w-12 text-right">Score</span>
                    </div>
                </div>
                {candidates.map((doc, idx) => (
                    <div key={idx} className="relative group">
                        <div className="flex justify-between items-center text-xs mb-1 relative z-10">
                            <div className="flex flex-col">
                                <span className="truncate max-w-[200px] text-slate-200 font-medium" title={doc.text}>
                                    {doc.id}
                                </span>
                                <span className="truncate max-w-[200px] text-[10px] text-slate-500">
                                    {doc.text}
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                                    <span className="text-slate-500 opacity-60">#{doc.old_rank}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-600" />
                                    <span className="text-emerald-400 font-bold bg-emerald-950/50 px-1 rounded border border-emerald-900">
                                        #{doc.new_rank}
                                    </span>
                                </div>
                                <span className="w-12 text-right font-mono text-emerald-400 font-bold">
                                    {doc.score.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        {/* Bar */}
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                             <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${doc.score * 100}%` }}
                             />
                        </div>
                    </div>
                ))}
                <div className="mt-3 text-[10px] text-slate-500 text-center border-t border-slate-800 pt-2">
                    Model: {(data.data as any).model}
                </div>
            </div>
        );
    }

    // Default JSON/Text View
    const isObject = typeof data.data === 'object';
    return (
        <div className="bg-slate-950 p-3 rounded border border-slate-800 text-green-400 overflow-x-auto">
            {isObject ? (
              <pre>{JSON.stringify(data.data, null, 2)}</pre>
            ) : (
              <div className="whitespace-pre-wrap">{data.data}</div>
            )}
        </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Code className="w-4 h-4 text-blue-400" />
           <span className="text-sm font-bold text-slate-200">{data.title}</span>
        </div>
        <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-800 animate-pulse">
            LIVE DATA
        </span>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1 font-mono text-xs">
         <div className="mb-3 text-slate-400 border-b border-slate-800 pb-2">
            {data.description}
         </div>
         {renderContent()}
      </div>
    </div>
  );
};

export default DataInspector;