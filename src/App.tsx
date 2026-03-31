import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Users, Cpu, Zap, Info, Map as MapIcon, Terminal, LayoutDashboard, ShieldCheck, Activity, Box, Palette } from 'lucide-react';
import { OfficeAgent, Desk, OrchestratorTable, Decoration, ThemeType, PixelBalloon } from './components/OfficeElements';
import workflowConfig from './workflow.json';

interface AgentState {
  id: string;
  name: string;
  role: string;
  color: string;
  homePos: { x: number; y: number };
  currentPos: { x: number; y: number };
  isWalking: boolean;
  hasWork: boolean;
  direction: 'left' | 'right';
}

interface BalloonState {
  id: string;
  x: number;
  y: number;
  color: string;
}

export default function App() {
  const [themeType, setThemeType] = useState<ThemeType>('office');
  const [balloons, setBalloons] = useState<BalloonState[]>([]);
  
  // Initialize agents from JSON config
  const initialAgents: AgentState[] = useMemo(() => 
    workflowConfig.agents.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      color: a.color,
      homePos: a.home,
      currentPos: a.home,
      isWalking: false,
      hasWork: false,
      direction: 'right'
    })), []);

  const [agents, setAgents] = useState<AgentState[]>(initialAgents);
  const [status, setStatus] = useState<'idle' | 'running' | 'meeting'>('idle');
  const [currentStep, setCurrentStep] = useState(-1);
  const [logs, setLogs] = useState<string[]>(["System initialized. Awaiting mission start..."]);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 8));

  const reset = () => {
    setAgents(initialAgents);
    setStatus('idle');
    setCurrentStep(-1);
    setLogs(["Environment reset. All agents returned to home stations."]);
  };

  const triggerBalloon = (x: number, y: number, color: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setBalloons(prev => [...prev, { id, x, y, color }]);
  };

  const runWorkflow = async () => {
    if (status !== 'idle') return;
    setStatus('running');
    
    const { sequence } = workflowConfig;

    for (let i = 0; i < sequence.length; i++) {
      const step = sequence[i];
      setCurrentStep(i);
      addLog(step.log);

      // 1. Agent starts with work
      setAgents(prev => prev.map(a => a.id === step.from ? { ...a, hasWork: true } : a));
      await new Promise(r => setTimeout(r, 1000));

      // 2. Agent walks to target desk
      const targetAgent = workflowConfig.agents.find(a => a.id === step.to);
      if (!targetAgent) continue;

      setAgents(prev => prev.map(a => {
        if (a.id === step.from) {
          const direction = targetAgent.home.x > a.currentPos.x ? 'right' : 'left';
          return { ...a, isWalking: true, currentPos: targetAgent.home, direction };
        }
        return a;
      }));
      await new Promise(r => setTimeout(r, 2000));
      
      // 3. Handover work and return home
      // Trigger balloon at handover point
      const fromAgent = agents.find(a => a.id === step.from);
      if (fromAgent) {
        triggerBalloon(targetAgent.home.x, targetAgent.home.y, fromAgent.color);
      }

      setAgents(prev => prev.map(a => {
        if (a.id === step.from) {
          const direction = a.homePos.x > a.currentPos.x ? 'right' : 'left';
          return { ...a, isWalking: true, currentPos: a.homePos, hasWork: false, direction };
        }
        if (a.id === step.to) return { ...a, hasWork: true };
        return a;
      }));
      await new Promise(r => setTimeout(r, 2000));
      
      // 4. Stop walking
      setAgents(prev => prev.map(a => a.id === step.from ? { ...a, isWalking: false } : a));
    }

    // Final Step: All to Orchestrator for Meeting
    addLog("Workflow complete. Initiating Nexus Core synchronization...");
    setStatus('meeting');
    setCurrentStep(sequence.length);
    
    const orchPos = workflowConfig.orchestrator;
    
    setAgents(prev => prev.map((a, i) => {
      const targetX = orchPos.x + Math.cos(i * (Math.PI * 2) / workflowConfig.agents.length) * 120;
      const targetY = orchPos.y + Math.sin(i * (Math.PI * 2) / workflowConfig.agents.length) * 120;
      const direction = targetX > a.currentPos.x ? 'right' : 'left';
      
      return {
        ...a,
        isWalking: true,
        hasWork: false,
        direction,
        currentPos: { x: targetX, y: targetY }
      };
    }));
    
    await new Promise(r => setTimeout(r, 3000));
    setAgents(prev => prev.map(a => ({ ...a, isWalking: false })));
    
    // Celebration balloons
    addLog("Mission successful. All systems synchronized.");
    agents.forEach((a, i) => {
      setTimeout(() => {
        triggerBalloon(a.currentPos.x, a.currentPos.y, a.color);
      }, i * 200);
    });
  };

  const isBlocky = themeType === 'blocky';

  return (
    <div className={`w-full h-screen ${isBlocky ? 'bg-slate-900' : workflowConfig.theme.floor} flex flex-col font-sans overflow-hidden text-slate-900 transition-colors duration-500`}>
      {/* Enterprise Header */}
      <header className={`h-24 ${isBlocky ? 'bg-slate-800 border-black' : 'bg-white border-slate-200'} border-b-4 flex items-center justify-between px-12 z-50 shadow-sm transition-colors duration-500`}>
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className={`w-16 h-16 ${isBlocky ? 'bg-indigo-900 rounded-none border-4 border-black' : 'bg-indigo-600 rounded-2xl'} flex items-center justify-center shadow-lg transform -rotate-3 transition-all`}>
              <ShieldCheck className="text-white" size={32} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
              <Activity size={10} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className={`text-3xl font-black ${isBlocky ? 'text-white font-mono' : 'text-slate-900'} tracking-tight uppercase italic`}>Nexus Station</h1>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 ${isBlocky ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-700'} text-[10px] font-black rounded uppercase tracking-widest`}>v2.5 Enterprise</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status: <span className="text-emerald-500">Optimal</span></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Theme Switcher */}
          <div className={`flex items-center gap-2 p-2 ${isBlocky ? 'bg-slate-900 border-black' : 'bg-slate-100 border-slate-200'} border-2 rounded-2xl`}>
            <button 
              onClick={() => setThemeType('office')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${themeType === 'office' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Office
            </button>
            <button 
              onClick={() => setThemeType('blocky')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${themeType === 'blocky' ? 'bg-indigo-600 shadow-md text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Blocky
            </button>
          </div>

          <div className={`flex flex-col items-end border-r-2 ${isBlocky ? 'border-slate-700' : 'border-slate-100'} pr-8`}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Protocol</span>
            <span className={`text-xl font-black ${isBlocky ? 'text-indigo-400' : 'text-indigo-600'} uppercase tracking-tighter`}>
              {status === 'idle' ? 'Standby' : status === 'running' ? 'Active Mission' : 'Core Sync'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={runWorkflow}
              disabled={status !== 'idle'}
              className={`group relative flex items-center gap-3 px-10 py-5 ${isBlocky ? 'rounded-none border-4 border-black' : 'rounded-3xl'} font-black text-sm transition-all shadow-xl ${
                status !== 'idle' 
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0'
              }`}
            >
              <Play size={20} fill="currentColor" />
              EXECUTE MISSION
            </button>

            <button 
              onClick={reset}
              className={`p-5 ${isBlocky ? 'bg-slate-700 border-4 border-black rounded-none' : 'bg-white border-2 border-slate-200 rounded-3xl'} text-slate-400 hover:text-rose-500 transition-all active:scale-95 shadow-sm`}
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Office Floor */}
        <main className={`flex-1 relative overflow-hidden ${isBlocky ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-500`}>
          {/* Grid Pattern */}
          <div 
            className={`absolute inset-0 ${isBlocky ? 'opacity-[0.1]' : 'opacity-[0.03]'}`} 
            style={{ 
              backgroundImage: `linear-gradient(to right, ${isBlocky ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(to bottom, ${isBlocky ? '#fff' : '#000'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} 
          />
          
          {/* Canvas Container */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className={`relative w-full h-full max-w-[1100px] max-h-[700px] ${isBlocky ? 'bg-slate-800 border-4 border-black rounded-none' : 'bg-white rounded-[80px] border-2 border-slate-100'} shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500`}>
              
              {/* Floor Texture */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(${isBlocky ? '#475569' : '#cbd5e1'} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

              {/* Decorations */}
              {workflowConfig.decorations?.map((dec, i) => (
                <Decoration key={`dec-${i}`} {...dec as any} themeType={themeType} />
              ))}
              
              {/* Desks */}
              {workflowConfig.agents.map(agent => (
                <Desk 
                  key={`desk-${agent.id}`} 
                  x={agent.home.x} 
                  y={agent.home.y} 
                  label={agent.role} 
                  themeType={themeType}
                />
              ))}

              {/* Central Hub */}
              <OrchestratorTable 
                x={workflowConfig.orchestrator.x} 
                y={workflowConfig.orchestrator.y} 
                name={workflowConfig.orchestrator.name}
                color={workflowConfig.theme.orchestratorColor}
                themeType={themeType}
              />

              {/* Agents */}
              {agents.map(agent => (
                <OfficeAgent 
                  key={agent.id}
                  {...agent}
                  position={agent.currentPos}
                  themeType={themeType}
                />
              ))}

              {/* Balloons */}
              <AnimatePresence>
                {balloons.map(balloon => (
                  <PixelBalloon 
                    key={balloon.id}
                    x={balloon.x}
                    y={balloon.y}
                    color={balloon.color}
                    onComplete={() => setBalloons(prev => prev.filter(b => b.id !== balloon.id))}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Activity Log Panel */}
          <div className="absolute bottom-12 left-12 w-96 z-50">
            <div className={`${isBlocky ? 'bg-black border-4 border-white/20' : 'bg-slate-900/95 backdrop-blur-2xl rounded-[40px] border border-white/10'} shadow-2xl overflow-hidden transition-all duration-500`}>
              <div className={`flex items-center justify-between px-8 py-5 border-b ${isBlocky ? 'border-white/10 bg-white/5' : 'border-white/5 bg-white/5'}`}>
                <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-indigo-400" />
                  <span className={`text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] ${isBlocky ? 'font-mono' : ''}`}>Mission Control Log</span>
                </div>
                <div className="flex gap-1.5">
                  <div className={`w-2 h-2 ${isBlocky ? 'rounded-none' : 'rounded-full'} bg-rose-500/50`} />
                  <div className={`w-2 h-2 ${isBlocky ? 'rounded-none' : 'rounded-full'} bg-amber-500/50`} />
                  <div className={`w-2 h-2 ${isBlocky ? 'rounded-none' : 'rounded-full'} bg-emerald-500/50`} />
                </div>
              </div>
              <div className="p-8 h-64 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, i) => (
                    <motion.div
                      key={log + i}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1 - (i * 0.12), x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-start gap-4"
                    >
                      <div className={`mt-1.5 w-2 h-2 ${isBlocky ? 'rounded-none' : 'rounded-full'} bg-indigo-500/40 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.5)]`} />
                      <span className={`text-[12px] font-medium text-slate-300 leading-relaxed font-mono tracking-tight`}>{log}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>

        {/* Deployment Sidebar */}
        <aside className={`w-[400px] ${isBlocky ? 'bg-slate-800 border-black' : 'bg-white border-slate-100'} border-l-4 p-12 z-50 hidden xl:flex flex-col gap-12 transition-colors duration-500`}>
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Users size={24} className="text-indigo-600" />
                <h3 className={`text-sm font-black ${isBlocky ? 'text-white font-mono' : 'text-slate-900'} uppercase tracking-widest`}>Active Roster</h3>
              </div>
              <span className={`px-3 py-1 ${isBlocky ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded-full text-[10px] font-black`}>{agents.length} Units</span>
            </div>
            
            <div className="space-y-5">
              {agents.map(agent => (
                <div key={`roster-${agent.id}`} className={`group flex items-center justify-between p-5 ${isBlocky ? 'bg-slate-900 border-black rounded-none' : 'bg-slate-50 border-transparent rounded-[32px] hover:border-indigo-100 hover:bg-white'} border-2 transition-all shadow-sm hover:shadow-md`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 ${isBlocky ? 'rounded-none border-2 border-black' : 'rounded-2xl'} ${agent.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <UserIcon size={24} />
                    </div>
                    <div>
                      <div className={`text-base font-black ${isBlocky ? 'text-white font-mono' : 'text-slate-900'} tracking-tight`}>{agent.name}</div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{agent.role}</div>
                    </div>
                  </div>
                  {agent.hasWork ? (
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`flex items-center gap-2 ${isBlocky ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-700'} px-4 py-1.5 rounded-full`}
                    >
                      <Box size={12} className={isBlocky ? 'text-amber-400' : 'text-amber-600'} />
                      <span className="text-[10px] font-black uppercase">Processing</span>
                    </motion.div>
                  ) : (
                    <div className={`w-2 h-2 ${isBlocky ? 'rounded-none' : 'rounded-full'} bg-slate-200`} />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-auto">
            <div className={`p-10 ${isBlocky ? 'bg-black border-4 border-white/10 rounded-none' : 'bg-slate-900 rounded-[48px] shadow-2xl'} relative overflow-hidden transition-all duration-500`}>
              {!isBlocky && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />}
              
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Mission Progress</h4>
                    <span className="text-sm font-bold text-slate-400 uppercase">Phase {Math.max(0, currentStep + 1)} / {workflowConfig.sequence.length + 1}</span>
                  </div>
                  <span className={`text-4xl font-black text-white tracking-tighter ${isBlocky ? 'font-mono' : ''}`}>
                    {Math.round(((currentStep + 1) / (workflowConfig.sequence.length + 1)) * 100)}<span className="text-indigo-500 text-xl">%</span>
                  </span>
                </div>
                
                <div className={`h-5 w-full ${isBlocky ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'} rounded-full overflow-hidden p-1.5 border`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / (workflowConfig.sequence.length + 1)) * 100}%` }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                  />
                </div>
              </div>
            </div>
          </section>
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
