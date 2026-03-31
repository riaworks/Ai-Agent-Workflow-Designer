import React from 'react';
import { motion } from 'motion/react';
import { User, FileText, Coffee, Monitor, Briefcase } from 'lucide-react';

interface AgentProps {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  isWalking: boolean;
  hasWork: boolean;
  color: string;
}

export function OfficeAgent({ name, type, position, isWalking, hasWork, color }: AgentProps) {
  return (
    <motion.div
      animate={{ 
        left: position.x, 
        top: position.y,
        scale: isWalking ? 1.1 : 1,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 50, 
        damping: 15,
        duration: 1.5 
      }}
      className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
    >
      {/* Name Tag */}
      <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-200 shadow-sm mb-1">
        <span className="text-[9px] font-bold text-slate-700 whitespace-nowrap uppercase tracking-tighter">{name}</span>
      </div>

      {/* Character Body */}
      <div className="relative">
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${color}`}
        >
          <User size={20} className="text-white" />
        </div>

        {/* Work Item (Document) */}
        {hasWork && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -right-2 -top-2 bg-yellow-400 p-1 rounded shadow-md border border-yellow-600"
          >
            <FileText size={12} className="text-yellow-900" />
          </motion.div>
        )}

        {/* Walking Animation (Shadow) */}
        {isWalking && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/10 rounded-full blur-[2px]"
          />
        )}
      </div>
    </motion.div>
  );
}

export function Desk({ x, y, label, icon: Icon }: { x: number; y: number; label: string; icon?: any; key?: string }) {
  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div className="w-20 h-14 bg-slate-200 rounded-lg border-b-4 border-slate-300 shadow-inner flex items-center justify-center relative">
        <div className="absolute top-1 left-1 w-4 h-4 bg-slate-300 rounded-sm" /> {/* Monitor base */}
        <Monitor size={24} className="text-slate-400" />
        <div className="absolute bottom-1 right-1">
          <Coffee size={10} className="text-slate-400" />
        </div>
      </div>
      <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function OrchestratorTable({ x, y }: { x: number; y: number }) {
  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div className="w-32 h-32 bg-blue-600 rounded-full border-b-8 border-blue-800 shadow-2xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:10px_10px]" />
        <Briefcase size={40} className="text-white" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-dashed border-blue-400/30 rounded-full"
        />
      </div>
      <span className="mt-4 text-sm font-black text-blue-600 uppercase tracking-widest">Core Orchestrator</span>
    </div>
  );
}
