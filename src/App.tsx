import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Users, Coffee, Zap, Info, Map as MapIcon } from 'lucide-react';
import { OfficeAgent, Desk, OrchestratorTable } from './components/OfficeElements';

interface AgentState {
  id: string;
  name: string;
  type: string;
  color: string;
  homePos: { x: number; y: number };
  currentPos: { x: number; y: number };
  isWalking: boolean;
  hasWork: boolean;
}

const INITIAL_AGENTS: AgentState[] = [
  { id: '1', name: 'Trigger', type: 'Reception', color: 'bg-emerald-500', homePos: { x: 150, y: 150 }, currentPos: { x: 150, y: 150 }, isWalking: false, hasWork: false },
  { id: '2', name: 'Classifier', type: 'Manager', color: 'bg-blue-500', homePos: { x: 150, y: 450 }, currentPos: { x: 150, y: 450 }, isWalking: false, hasWork: false },
  { id: '3', name: 'Researcher', type: 'Analyst', color: 'bg-purple-500', homePos: { x: 450, y: 150 }, currentPos: { x: 450, y: 150 }, isWalking: false, hasWork: false },
  { id: '4', name: 'Writer', type: 'Creative', color: 'bg-orange-500', homePos: { x: 750, y: 150 }, currentPos: { x: 750, y: 150 }, isWalking: false, hasWork: false },
  { id: '5', name: 'Reviewer', type: 'QA', color: 'bg-rose-500', homePos: { x: 750, y: 450 }, currentPos: { x: 750, y: 450 }, isWalking: false, hasWork: false },
];

const ORCHESTRATOR_POS = { x: 450, y: 450 };

export default function App() {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [status, setStatus] = useState<'idle' | 'running' | 'meeting'>('idle');
  const [currentStep, setCurrentStep] = useState(-1);
  const [logs, setLogs] = useState<string[]>(["System ready. Waiting for trigger..."]);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const reset = () => {
    setAgents(INITIAL_AGENTS);
    setStatus('idle');
    setCurrentStep(-1);
    setLogs(["System reset. Ready."]);
  };

  const runWorkflow = async () => {
    if (status !== 'idle') return;
    setStatus('running');
    
    // Step 1: Trigger starts
    addLog("Trigger received input...");
    setCurrentStep(0);
    setAgents(prev => prev.map(a => a.id === '1' ? { ...a, hasWork: true } : a));
    await new Promise(r => setTimeout(r, 1000));

    // Step 2: Trigger walks to Classifier
    addLog("Trigger delivering to Manager...");
    setAgents(prev => prev.map(a => a.id === '1' ? { ...a, isWalking: true, currentPos: INITIAL_AGENTS[1].homePos } : a));
    await new Promise(r => setTimeout(r, 1500));
    
    // Handover
    setAgents(prev => prev.map(a => {
      if (a.id === '1') return { ...a, isWalking: true, currentPos: a.homePos, hasWork: false };
      if (a.id === '2') return { ...a, hasWork: true };
      return a;
    }));
    await new Promise(r => setTimeout(r, 1500));
    setAgents(prev => prev.map(a => a.id === '1' ? { ...a, isWalking: false } : a));

    // Step 3: Classifier to Researcher
    addLog("Manager assigning Research task...");
    setAgents(prev => prev.map(a => a.id === '2' ? { ...a, isWalking: true, currentPos: INITIAL_AGENTS[2].homePos } : a));
    await new Promise(r => setTimeout(r, 1500));
    setAgents(prev => prev.map(a => {
      if (a.id === '2') return { ...a, isWalking: true, currentPos: a.homePos, hasWork: false };
      if (a.id === '3') return { ...a, hasWork: true };
      return a;
    }));
    await new Promise(r => setTimeout(r, 1500));
    setAgents(prev => prev.map(a => a.id === '2' ? { ...a, isWalking: false } : a));

    // Step 4: Researcher to Writer
    addLog("Research complete. Sending to Creative...");
    setAgents(prev => prev.map(a => a.id === '3' ? { ...a, isWalking: true, currentPos: INITIAL_AGENTS[3].homePos } : a));
    await new Promise(r => setTimeout(r, 1500));
    setAgents(prev => prev.map(a => {
      if (a.id === '3') return { ...a, isWalking: true, currentPos: a.homePos, hasWork: false };
      if (a.id === '4') return { ...a, hasWork: true };
      return a;
    }));
    await new Promise(r => setTimeout(r, 1500));
    setAgents(prev => prev.map(a => a.id === '3' ? { ...a, isWalking: false } : a));

    // Step 5: Writer to Reviewer
    addLog("Content drafted. Quality check needed...");
    setAgents(prev => prev.map(a => a.id === '4' ? { ...a, isWalking: true, currentPos: INITIAL_AGENTS[4].homePos } : a));
    await new Promise(r => setTimeout(r, 1500));
    setAgents(prev => prev.map(a => {
      if (a.id === '4') return { ...a, isWalking: true, currentPos: a.homePos, hasWork: false };
      if (a.id === '5') return { ...a, hasWork: true };
      return a;
    }));
    await new Promise(r => setTimeout(r, 1500));
    setAgents(prev => prev.map(a => a.id === '4' ? { ...a, isWalking: false } : a));

    // Final Step: All to Orchestrator
    addLog("Workflow complete. Gathering for debrief...");
    setStatus('meeting');
    setAgents(prev => prev.map((a, i) => ({
      ...a,
      isWalking: true,
      hasWork: false,
      // Arrange in a circle around orchestrator
      currentPos: {
        x: ORCHESTRATOR_POS.x + Math.cos(i * (Math.PI * 2) / 5) * 80,
        y: ORCHESTRATOR_POS.y + Math.sin(i * (Math.PI * 2) / 5) * 80,
      }
    })));
    await new Promise(r => setTimeout(r, 2000));
    setAgents(prev => prev.map(a => ({ ...a, isWalking: false })));
    addLog("Session finalized at Core.");
  };

  return (
    <div className="w-full h-screen bg-[#f0f2f5] flex flex-col font-sans overflow-hidden">
      {/* Gamified Header */}
      <header className="h-20 bg-white border-b-4 border-slate-200 flex items-center justify-between px-8 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight italic">OFFICE AGENTS</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Simulation v2.0</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-slate-400 uppercase">Current Status</span>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-tighter">
              {status === 'idle' ? 'Ready to Start' : status === 'running' ? 'Workflow Active' : 'Meeting in Progress'}
            </span>
          </div>
          
          <button 
            onClick={runWorkflow}
            disabled={status !== 'idle'}
            className={`group relative flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all overflow-hidden ${
              status !== 'idle' 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_6px_0_0_#1e40af] active:shadow-none active:translate-y-[6px]'
            }`}
          >
            <Play size={18} fill="currentColor" />
            START SHIFT
          </button>

          <button 
            onClick={reset}
            className="p-3 bg-white border-2 border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 rounded-2xl transition-all active:scale-95"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Office Floor */}
        <main className="flex-1 relative bg-[#e5e7eb] overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Office Decorations */}
          <div className="absolute top-10 right-10 flex gap-4 opacity-40">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center border-2 border-green-300"><Coffee size={20} className="text-green-600" /></div>
            <div className="w-12 h-12 bg-slate-300 rounded-lg flex items-center justify-center border-2 border-slate-400"><Zap size={20} className="text-slate-500" /></div>
          </div>

          <div className="absolute bottom-10 left-10 opacity-20">
            <MapIcon size={120} className="text-slate-400" />
          </div>

          {/* Elements Container (Centered) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[900px] h-[600px] bg-white/40 rounded-[40px] border-4 border-dashed border-slate-300/50">
              
              {/* Desks */}
              {INITIAL_AGENTS.map(agent => (
                <Desk 
                  key={agent.id} 
                  x={agent.homePos.x} 
                  y={agent.homePos.y} 
                  label={agent.type} 
                  icon={null} 
                />
              ))}

              {/* Central Hub */}
              <OrchestratorTable x={ORCHESTRATOR_POS.x} y={ORCHESTRATOR_POS.y} />

              {/* Agents */}
              {agents.map(agent => (
                <OfficeAgent 
                  key={agent.id}
                  {...agent}
                  position={agent.currentPos}
                />
              ))}
            </div>
          </div>

          {/* Floating Logs */}
          <div className="absolute bottom-8 right-8 w-72 flex flex-col gap-2 z-40">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={log + i}
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1 - (i * 0.2), x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[11px] font-bold text-slate-600 leading-tight">{log}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>

        {/* Side Info */}
        <aside className="w-80 bg-white border-l-4 border-slate-200 p-6 z-30 hidden lg:flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info size={16} className="text-blue-500" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Roster</h3>
            </div>
            <div className="space-y-3">
              {agents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${agent.color} flex items-center justify-center text-white shadow-sm`}>
                      <UserIcon size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800">{agent.name}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{agent.type}</div>
                    </div>
                  </div>
                  {agent.hasWork && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity }}
                      className="bg-yellow-400 px-2 py-0.5 rounded text-[8px] font-black text-yellow-900 uppercase"
                    >
                      Working
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-5 bg-blue-50 rounded-2xl border-2 border-blue-100">
              <h4 className="text-xs font-black text-blue-800 mb-2 uppercase tracking-widest">Shift Progress</h4>
              <div className="h-3 w-full bg-blue-200 rounded-full overflow-hidden mb-2">
                <motion.div 
                  animate={{ width: `${(currentStep + 1) * 20}%` }}
                  className="h-full bg-blue-600"
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-blue-400 uppercase">
                <span>Phase {Math.max(0, currentStep + 1)}/5</span>
                <span>{Math.round((currentStep + 1) * 20)}%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function UserIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
