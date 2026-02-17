import React from 'react';
import { NODES, EDGES } from '../constants';
import { NodeType } from '../types';

interface PipelineVisualizerProps {
  activeNode: NodeType | null;
  onNodeClick: (node: NodeType) => void;
  activeFlow: 'ingestion' | 'query' | null;
  animatingEdge: { from: string; to: string } | null;
}

const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ 
  activeNode, 
  onNodeClick, 
  activeFlow,
  animatingEdge 
}) => {
  return (
    <div className="relative w-full h-[500px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {EDGES.map((edge, idx) => {
          const fromNode = NODES.find(n => n.id === edge.from)!;
          const toNode = NODES.find(n => n.id === edge.to)!;
          
          // Determine if this edge is active in the current flow context
          const isActiveFlow = activeFlow && (edge.activeInFlow === activeFlow || edge.activeInFlow === 'both');
          // Determine if this specific edge is currently animating a packet
          const isAnimating = animatingEdge?.from === edge.from && animatingEdge?.to === edge.to;

          return (
            <g key={`${edge.from}-${edge.to}-${idx}`}>
              {/* Base Line */}
              <line
                x1={fromNode.x + 40} // Center offset (node width/2 approx)
                y1={fromNode.y + 40}
                x2={toNode.x + 40}
                y2={toNode.y + 40}
                stroke={isActiveFlow ? "#3b82f6" : "#334155"}
                strokeWidth={isActiveFlow ? 3 : 2}
                markerEnd={isActiveFlow ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                className="transition-colors duration-500"
              />
              
              {/* Animated Packet */}
              {isAnimating && (
                <circle r="6" fill="#60a5fa" filter="url(#glow)">
                  <animateMotion 
                    dur="0.8s" 
                    repeatCount="1"
                    path={`M${fromNode.x + 40},${fromNode.y + 40} L${toNode.x + 40},${toNode.y + 40}`}
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((node) => {
        const Icon = node.icon;
        const isActive = activeNode === node.id;
        const isFlowActive = activeFlow && EDGES.some(e => 
          (e.from === node.id || e.to === node.id) && 
          (e.activeInFlow === activeFlow || e.activeInFlow === 'both')
        );

        return (
          <div
            key={node.id}
            onClick={() => onNodeClick(node.id)}
            className={`absolute w-20 h-20 -ml-10 -mt-10 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-110 z-10
              ${isActive ? 'bg-blue-600 shadow-lg shadow-blue-500/50 scale-110 border-2 border-white' : 
                isFlowActive ? 'bg-slate-800 border-2 border-blue-500/50' : 'bg-slate-800 border border-slate-600 hover:border-slate-400'}
            `}
            style={{ left: node.x + 40, top: node.y + 40 }}
          >
            <Icon className={`w-8 h-8 mb-1 ${isActive ? 'text-white' : 'text-blue-400'}`} />
            <span className="text-[10px] font-bold text-center leading-tight px-1 text-slate-200">
              {node.label}
            </span>
          </div>
        );
      })}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-700">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div> Selected
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-blue-500 rounded-full"></div> Active Flow
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-800 border border-slate-600 rounded-full"></div> Idle
         </div>
      </div>
    </div>
  );
};

export default PipelineVisualizer;