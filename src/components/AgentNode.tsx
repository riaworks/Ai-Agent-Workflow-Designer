import { Handle, Position } from '@xyflow/react';
import { Bot, Cpu, Database, Search, PenTool, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const icons: Record<string, any> = {
  classifier: Cpu,
  researcher: Search,
  writer: PenTool,
  reviewer: CheckCircle,
  trigger: Zap,
  database: Database,
  agent: Bot,
};

export function AgentNode({ data }: { data: any }) {
  const Icon = icons[data.type] || Bot;
  const isProcessing = data.isProcessing;

  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl border-2 bg-white min-w-[180px] transition-all ${isProcessing ? 'border-blue-500 ring-4 ring-blue-100' : 'border-slate-200'}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400 border-2 border-white" />
      
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isProcessing ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
          <Icon size={20} />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{data.type}</div>
          <div className="text-sm font-semibold text-slate-800">{data.label}</div>
        </div>
      </div>

      {isProcessing && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          className="h-1 bg-blue-500 absolute bottom-0 left-0 rounded-b-xl"
        />
      )}

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-slate-400 border-2 border-white" />
    </div>
  );
}
