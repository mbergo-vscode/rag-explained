import React from 'react';
import { SimulationStepData } from '../types';
import { Code, Database } from 'lucide-react';

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

  const isObject = typeof data.data === 'object';

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Code className="w-4 h-4 text-blue-400" />
           <span className="text-sm font-bold text-slate-200">{data.title}</span>
        </div>
        <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
            LIVE DATA
        </span>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1 font-mono text-xs">
         <div className="mb-3 text-slate-400 border-b border-slate-800 pb-2">
            {data.description}
         </div>
         
         <div className="bg-slate-950 p-3 rounded border border-slate-800 text-green-400 overflow-x-auto">
            {isObject ? (
              <pre>{JSON.stringify(data.data, null, 2)}</pre>
            ) : (
              <div className="whitespace-pre-wrap">{data.data}</div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DataInspector;