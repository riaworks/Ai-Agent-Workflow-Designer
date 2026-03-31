import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Shield, 
  Cpu, 
  Database, 
  Zap, 
  Play, 
  Square, 
  Terminal, 
  BarChart3, 
  Layers,
  ChevronRight,
  Server,
  Globe,
  Lock,
  Palette,
  RotateCcw
} from 'lucide-react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { socket } from '../lib/socket';
import { OfficeAgent, Desk, OrchestratorTable, Decoration, ThemeType, PixelBalloon } from './OfficeElements';

const data = [
  { time: '00:00', value: 400 },
  { time: '01:00', value: 300 },
  { time: '02:00', value: 600 },
  { time: '03:00', value: 800 },
  { time: '04:00', value: 500 },
  { time: '05:00', value: 900 },
  { time: '06:00', value: 1100 },
];

export function EnterpriseDashboard() {
  const [themeType, setThemeType] = useState<ThemeType>('office');
  const [missionActive, setMissionActive] = useState(false);
  const [stats, setStats] = useState({
    completedTasks: 0,
    activeAgents: 0,
    throughput: 0,
    uptime: '00:00:00',
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const agentsRef = React.useRef<any[]>([]);
  const [workflowConfig, setWorkflowConfig] = useState<any>(null);
  const [balloons, setBalloons] = useState<{ id: string; x: number; y: number; color: string }[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    agentsRef.current = agents;
  }, [agents]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log('Connected to socket, requesting init...');
      socket.emit('request-init');
    };
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('init', (data) => {
      console.log('Received init data:', data);
      if (data && data.agents) {
        setAgents(data.agents);
        setMissionActive(data.missionActive);
        setWorkflowConfig(data.workflowConfig);
        setStats(prev => ({ 
          ...prev, 
          completedTasks: data.missionStats.completedTasks, 
          activeAgents: data.agents.length 
        }));
        addLog('Nexus Core connection established. System ready.');
      }
    });

    // Request initial state if we're already connected
    if (socket.connected) {
      onConnect();
    }

    socket.on('agent:update', (updatedAgent) => {
      console.log('Agent update received:', updatedAgent);
      setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
    });

    socket.on('agents:reset', (resetAgents) => {
      setAgents(resetAgents);
      setShowComplete(false);
    });

    socket.on('task:completed', (data) => {
      setStats(prev => ({ ...prev, completedTasks: data.stats.completedTasks }));
      addLog(data.log || `Task ${data.taskId} finalized by ${data.agentId}.`);
      
      // Trigger balloon at handover point
      const agent = agentsRef.current.find(a => a.id === data.targetId);
      if (agent) {
        triggerBalloon(agent.home.x, agent.home.y, agent.color);
      }
    });

    socket.on('mission:started', () => {
      setMissionActive(true);
      setShowComplete(false);
      addLog('Mission sequence initiated. All systems nominal.');
    });

    socket.on('mission:stopped', () => {
      setMissionActive(false);
      addLog('Mission sequence terminated. Systems on standby.');
    });

    socket.on('mission:complete', () => {
      setShowComplete(true);
      addLog('MISSION SUCCESSFUL. ALL OBJECTIVES ACHIEVED.');
      // Celebration balloons
      agentsRef.current.forEach((a, i) => {
        setTimeout(() => {
          triggerBalloon(a.pos.x, a.pos.y, a.color);
        }, i * 200);
      });
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('init');
      socket.off('agent:update');
      socket.off('agents:reset');
      socket.off('task:completed');
      socket.off('mission:started');
      socket.off('mission:stopped');
      socket.off('mission:complete');
    };
  }, []);

  const triggerBalloon = (x: number, y: number, color: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setBalloons(prev => [...prev, { id, x, y, color }]);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 50));
  };

  const toggleMission = async () => {
    const endpoint = missionActive ? '/api/mission/stop' : '/api/mission/start';
    console.log('Toggling mission:', endpoint);
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      console.log('Mission toggle response:', data);
    } catch (err) {
      console.error('Failed to toggle mission:', err);
    }
  };

  const resetMission = async () => {
    try {
      await fetch('/api/mission/stop', { method: 'POST' });
    } catch (err) {
      console.error('Failed to reset mission:', err);
    }
  };

  const isBlocky = themeType === 'blocky';

  return (
    <div className={`min-h-screen ${isBlocky ? 'bg-slate-950' : 'bg-[#050505]'} text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden transition-colors duration-500`}>
      {/* Grid Background */}
      <div className={`fixed inset-0 ${isBlocky ? 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]'} bg-[size:24px_24px]`} />
      <div className="fixed inset-0 bg-radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_100%)" />

      {/* Header */}
      <header className={`relative z-10 border-b ${isBlocky ? 'border-black bg-slate-900' : 'border-white/10 bg-black/50'} backdrop-blur-xl px-8 py-4 flex items-center justify-between transition-colors duration-500`}>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 ${isBlocky ? 'bg-indigo-900 rounded-none border-2 border-black' : 'bg-indigo-600 rounded-lg'} flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]`}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight uppercase ${isBlocky ? 'font-mono' : ''}`}>Nexus Core</h1>
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono uppercase tracking-widest">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              Operational Status: {isConnected ? 'Nominal' : 'Disconnected'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Theme Switcher */}
          <div className={`flex items-center gap-1 p-1 ${isBlocky ? 'bg-black border-white/10' : 'bg-white/5 border-white/10'} border rounded-full`}>
            <button 
              onClick={() => setThemeType('office')}
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${themeType === 'office' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/40 hover:text-white'}`}
            >
              Office
            </button>
            <button 
              onClick={() => setThemeType('blocky')}
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${themeType === 'blocky' ? 'bg-indigo-600 text-white shadow-md' : 'text-white/40 hover:text-white'}`}
            >
              Blocky
            </button>
          </div>

          <div className="flex items-center gap-8 px-6 py-2 bg-white/5 rounded-full border border-white/10">
            <StatItem icon={<Cpu className="w-4 h-4" />} label="CPU" value="24%" />
            <StatItem icon={<Database className="w-4 h-4" />} label="Memory" value="4.2GB" />
            <StatItem icon={<Globe className="w-4 h-4" />} label="Network" value="12ms" />
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMission}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold uppercase text-xs tracking-widest transition-all ${
                missionActive 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' 
                  : 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95'
              }`}
            >
              {missionActive ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              {missionActive ? 'Terminate' : 'Initialize'}
            </button>
            <button 
              onClick={resetMission}
              className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-8 grid grid-cols-12 gap-8 h-[calc(100vh-88px)]">
        {/* Left Column: Stats & Charts */}
        <div className="col-span-3 flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-4">
            <MetricCard 
              label="Completed Operations" 
              value={stats.completedTasks.toString()} 
              icon={<Activity className="text-indigo-400" />}
              trend="+12.5%"
              isBlocky={isBlocky}
            />
            <MetricCard 
              label="Active Agents" 
              value={stats.activeAgents.toString()} 
              icon={<Layers className="text-emerald-400" />}
              trend="Stable"
              isBlocky={isBlocky}
            />
            <MetricCard 
              label="System Throughput" 
              value="1.2k/s" 
              icon={<Zap className="text-amber-400" />}
              trend="+5.2%"
              isBlocky={isBlocky}
            />
          </div>

          <div className={`${isBlocky ? 'bg-slate-900 border-black' : 'bg-white/5 border-white/10'} border rounded-2xl p-6 flex flex-col`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Network Load</h3>
              <BarChart3 className="w-4 h-4 text-white/40" />
            </div>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Center Column: Map Visualization */}
        <div className="col-span-6 flex flex-col gap-8">
          <div className={`flex-1 ${isBlocky ? 'bg-slate-900 border-black' : 'bg-white/5 border-white/10'} border rounded-2xl relative overflow-hidden group`}>
            {/* Map Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Live Node Monitoring</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Sector: 7G-Delta</span>
              </div>
            </div>

            {/* Agent Visualization Area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative p-12">
                {!isBlocky && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[80%] h-[80%] relative border border-white/5 rounded-full">
                      <div className="absolute inset-0 border border-white/5 rounded-full scale-75" />
                      <div className="absolute inset-0 border border-white/5 rounded-full scale-50" />
                      <div className="absolute inset-0 border border-white/5 rounded-full scale-25" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent origin-center rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Map Elements */}
                {workflowConfig?.decorations?.map((dec: any, i: number) => (
                  <Decoration 
                    key={`dec-${i}`} 
                    type={dec.type}
                    x={dec.x + "%"}
                    y={dec.y + "%"}
                    themeType={themeType} 
                  />
                ))}
                {workflowConfig?.agents.map((agent: any) => (
                  <Desk 
                    key={`desk-${agent.id}`} 
                    x={agent.home.x + "%"} 
                    y={agent.home.y + "%"} 
                    label={agent.role} 
                    themeType={themeType}
                  />
                ))}
                {workflowConfig && (
                  <OrchestratorTable 
                    x={workflowConfig.orchestrator.x + "%"} 
                    y={workflowConfig.orchestrator.y + "%"} 
                    name={workflowConfig.orchestrator.name}
                    color={workflowConfig.theme.orchestratorColor}
                    themeType={themeType}
                  />
                )}
                {agents.map((agent) => (
                  <OfficeAgent 
                    key={agent.id}
                    {...agent}
                    position={{ x: agent.pos.x + "%", y: agent.pos.y + "%" }}
                    isWalking={agent.status === 'moving'}
                    themeType={themeType}
                  />
                ))}

                {/* Balloons Overlay */}
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

            {/* Mission Complete Overlay */}
            <AnimatePresence>
              {showComplete && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-12"
                >
                  <motion.div 
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className={`p-12 ${isBlocky ? 'bg-slate-900 border-4 border-white/20 rounded-none' : 'bg-white/10 border border-white/20 rounded-3xl backdrop-blur-xl'} text-center shadow-2xl`}
                  >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${isBlocky ? 'font-mono' : ''}`}>Mission Successful</h2>
                    <p className="text-white/60 text-sm mb-8">All workflow objectives have been synchronized.</p>
                    <button 
                      onClick={resetMission}
                      className="px-8 py-3 bg-indigo-600 text-white font-bold uppercase text-xs tracking-widest rounded-full hover:bg-indigo-700 transition-all"
                    >
                      Restart Protocol
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Map Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between z-20">
              <div className="flex gap-2">
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: [-48, 48] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-full h-full bg-indigo-500"
                  />
                </div>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: [-48, 48] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 0.5 }}
                    className="w-full h-full bg-emerald-500"
                  />
                </div>
              </div>
              <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                System Time: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className={`${isBlocky ? 'bg-slate-900 border-black' : 'bg-white/5 border-white/10'} border h-48 rounded-2xl p-6 flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">System Log</h3>
              </div>
              <div className="text-[10px] font-mono text-white/20">v2.4.0-nexus</div>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-1 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                  >
                    <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                    <span className={i === 0 ? 'text-indigo-400' : 'text-white/60'}>
                      {i === 0 && <span className="mr-2">›</span>}
                      {log}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Infrastructure & Security */}
        <div className="col-span-3 flex flex-col gap-8">
          <div className={`${isBlocky ? 'bg-slate-900 border-black' : 'bg-white/5 border-white/10'} border rounded-2xl p-6`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-6">Infrastructure</h3>
            <div className="space-y-4">
              <InfraItem icon={<Server />} label="Primary Node" status="Online" color="text-emerald-500" />
              <InfraItem icon={<Lock />} label="Encryption" status="AES-256" color="text-indigo-500" />
              <InfraItem icon={<Globe />} label="CDN Edge" status="Active" color="text-emerald-500" />
              <InfraItem icon={<Database />} label="Database" status="Synced" color="text-emerald-500" />
            </div>
          </div>

          <div className={`flex-1 ${isBlocky ? 'bg-slate-900 border-black' : 'bg-white/5 border-white/10'} border rounded-2xl p-6 flex flex-col`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-6">Security Protocol</h3>
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className={`w-32 h-32 ${isBlocky ? 'rounded-none border-black' : 'rounded-full border-indigo-500/20'} border-4 flex items-center justify-center`}>
                  <Shield className="w-12 h-12 text-indigo-500" />
                </div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute -inset-4 border-t-4 border-indigo-500 rounded-full"
                />
              </div>
              <div className="text-center">
                <div className="text-lg font-bold uppercase tracking-tighter">Level 4 Clearance</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Biometric Verified</div>
              </div>
              <button className={`w-full py-3 ${isBlocky ? 'bg-black border-white/10 rounded-none' : 'bg-white/5 border-white/10 rounded-xl'} border text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors`}>
                View Audit Logs
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-white/40">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[8px] uppercase tracking-widest text-white/40">{label}</span>
        <span className="text-[10px] font-bold font-mono">{value}</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, trend, isBlocky }: { label: string, value: string, icon: React.ReactNode, trend: string, isBlocky?: boolean }) {
  return (
    <div className={`${isBlocky ? 'bg-slate-900 border-black' : 'bg-white/5 border-white/10'} border rounded-2xl p-5 hover:bg-white/[0.07] transition-colors group`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${isBlocky ? 'bg-black' : 'bg-white/5'} rounded-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          trend === 'Stable' ? 'bg-white/5 text-white/40' : 'bg-emerald-500/10 text-emerald-500'
        }`}>
          {trend}
        </span>
      </div>
      <div className={`text-2xl font-bold tracking-tighter mb-1 ${isBlocky ? 'font-mono' : ''}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-white/40 font-medium">{label}</div>
    </div>
  );
}

function InfraItem({ icon, label, status, color }: { icon: React.ReactNode, label: string, status: string, color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-white/20">{icon}</div>
        <span className="text-xs font-medium text-white/60">{label}</span>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{status}</span>
    </div>
  );
}
