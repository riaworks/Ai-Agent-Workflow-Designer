import React from 'react';
import { motion } from 'motion/react';
import { User, FileText, Coffee, Monitor, Cpu, Laptop, HardDrive, TreePine, GlassWater, Archive, Briefcase, Pickaxe, Sword, Box, Zap, Heart } from 'lucide-react';

export type ThemeType = 'office' | 'blocky';

interface AgentProps {
  id: string;
  name: string;
  role: string;
  position: { x: number; y: number };
  isWalking: boolean;
  hasWork: boolean;
  color: string;
  themeType?: ThemeType;
  direction?: 'left' | 'right';
}

export function OfficeAgent({ name, role, position, isWalking, hasWork, color, themeType = 'office', direction = 'right' }: AgentProps) {
  const isBlocky = themeType === 'blocky';

  if (isBlocky) {
    return (
      <motion.div
        animate={{ 
          left: position.x, 
          top: position.y,
          zIndex: isWalking ? 50 : 30,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 12 }}
        className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        {/* Name Tag */}
        <div className="bg-black border-2 border-white/20 px-2 py-0.5 mb-1 shadow-lg">
          <span className="text-[8px] font-mono font-black text-white uppercase tracking-tighter">{name}</span>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Head */}
          <motion.div 
            animate={isWalking ? { 
              y: [0, -4, 0],
              rotate: [0, -2, 2, 0]
            } : {}}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className={`w-10 h-10 ${color} border-4 border-black relative z-20`}
          >
            {/* Pixel Texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[size:4px_4px]" />
            
            {/* Eyes */}
            <div className={`absolute top-3 ${direction === 'right' ? 'right-1' : 'left-1'} flex gap-1`}>
              <div className="w-2 h-2 bg-white border-2 border-black flex items-center justify-center">
                <div className="w-1 h-1 bg-black" />
              </div>
              <div className="w-2 h-2 bg-white border-2 border-black flex items-center justify-center">
                <div className="w-1 h-1 bg-black" />
              </div>
            </div>
            
            {/* Mouth/Nose area */}
            <div className={`absolute bottom-1 ${direction === 'right' ? 'right-1' : 'left-1'} w-4 h-2 bg-black/20`} />
          </motion.div>

          {/* Body & Arms */}
          <div className="relative flex -mt-1">
            {/* Left Arm */}
            <motion.div 
              animate={isWalking ? { 
                rotate: direction === 'right' ? [30, -30, 30] : [-30, 30, -30],
                y: [0, -2, 0]
              } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              className={`w-4 h-10 ${color} border-4 border-black -mr-1 origin-top brightness-110 z-10`}
            />
            
            {/* Torso */}
            <div className={`w-10 h-10 ${color} border-4 border-black border-t-0 relative z-20`}>
              {/* Pixel Texture */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[size:4px_4px]" />
              
              {/* Item being carried */}
              {hasWork && (
                <motion.div
                  animate={{ 
                    y: [-4, 4, -4], 
                    rotate: [0, 10, -10, 0],
                    x: direction === 'right' ? 10 : -10
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute top-0 bg-amber-600 border-4 border-black w-8 h-8 flex items-center justify-center shadow-lg z-30"
                >
                  <Box size={16} className="text-white" />
                </motion.div>
              )}
            </div>

            {/* Right Arm */}
            <motion.div 
              animate={isWalking ? { 
                rotate: direction === 'right' ? [-30, 30, -30] : [30, -30, 30],
                y: [0, -2, 0]
              } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              className={`w-4 h-10 ${color} border-4 border-black -ml-1 origin-top brightness-90 z-10`}
            />
          </div>

          {/* Legs */}
          <div className="flex -mt-1">
            <motion.div 
              animate={isWalking ? { rotate: [-40, 40, -40] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              className={`w-5 h-8 ${color} border-4 border-black border-t-0 origin-top brightness-75`}
            />
            <motion.div 
              animate={isWalking ? { rotate: [40, -40, 40] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              className={`w-5 h-8 ${color} border-4 border-black border-t-0 origin-top brightness-50`}
            />
          </div>
        </div>

        {/* Role */}
        <div className="mt-2 px-2 bg-black/80 text-[7px] font-mono text-white uppercase tracking-widest border border-white/10">
          {role}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ 
        left: position.x, 
        top: position.y,
        scale: isWalking ? 1.1 : 1,
        rotate: isWalking ? [0, -1, 1, 0] : 0,
        zIndex: isWalking ? 50 : 30
      }}
      transition={{ 
        type: "spring", 
        stiffness: 60, 
        damping: 15,
        rotate: { repeat: Infinity, duration: 0.4, ease: "easeInOut" }
      }}
      className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      {/* Name Tag */}
      <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border-2 border-slate-200 shadow-xl mb-2 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color} ${isWalking ? 'animate-pulse' : ''}`} />
        <span className="text-[10px] font-black text-slate-800 whitespace-nowrap uppercase tracking-wider">{name}</span>
      </div>

      {/* Character Body */}
      <div className="relative">
        <div 
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] border-4 border-white/80 ${color} transition-all duration-300`}
        >
          <User size={28} className="text-white drop-shadow-md" />
        </div>

        {/* Work Item */}
        {hasWork && (
          <motion.div
            initial={{ scale: 0, y: 10, rotate: -10 }}
            animate={{ scale: 1, y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{ 
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }}
            className="absolute -right-4 -top-4 bg-amber-400 p-2 rounded-xl shadow-2xl border-2 border-white z-50"
          >
            <FileText size={18} className="text-amber-900" />
          </motion.div>
        )}

        {/* Shadow */}
        {isWalking && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-black rounded-full blur-lg"
          />
        )}
      </div>
      
      {/* Role Badge */}
      <div className="mt-2 px-2 py-0.5 bg-slate-800/80 backdrop-blur-sm rounded text-[8px] font-bold text-white uppercase tracking-widest border border-white/10">
        {role}
      </div>
    </motion.div>
  );
}

export function Desk({ x, y, label, themeType = 'office' }: { x: number; y: number; label: string; themeType?: ThemeType; key?: any }) {
  const isBlocky = themeType === 'blocky';
  
  return (
    <div 
      className="absolute flex flex-col items-center pointer-events-none"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div className={`w-28 h-20 ${isBlocky ? 'bg-amber-900 border-4 border-black' : 'bg-slate-50 rounded-2xl border-2 border-slate-200 border-b-8 border-b-slate-300'} shadow-xl flex items-center justify-center relative overflow-hidden`}>
        {isBlocky ? (
          <div className="flex gap-2">
            <Pickaxe size={24} className="text-amber-200/40" />
            <Sword size={24} className="text-amber-200/40" />
          </div>
        ) : (
          <>
            <div className="absolute top-0 left-0 w-full h-1 bg-white/50" />
            <div className="absolute top-2 left-2 w-8 h-6 bg-slate-800/5 rounded-sm" /> 
            <div className="flex gap-2 items-center">
              <Monitor size={24} className="text-slate-400" />
              <div className="w-10 h-8 bg-slate-200 rounded-sm flex items-center justify-center">
                <Laptop size={16} className="text-slate-400" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 opacity-60">
              <Coffee size={14} className="text-amber-700/40" />
            </div>
          </>
        )}
      </div>
      <div className={`mt-3 px-3 py-1 ${isBlocky ? 'bg-black text-white rounded-none border-2 border-white/20' : 'bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full'} shadow-sm text-[10px] font-black uppercase tracking-widest`}>
        {label}
      </div>
    </div>
  );
}

export function Decoration({ type, x, y, themeType = 'office' }: { type: 'plant' | 'water' | 'archive'; x: number; y: number; themeType?: ThemeType; key?: any }) {
  const isBlocky = themeType === 'blocky';

  return (
    <div 
      className="absolute pointer-events-none opacity-60"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      {type === 'plant' && (
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 ${isBlocky ? 'bg-green-700 border-4 border-black' : 'bg-emerald-100 rounded-full border-4 border-emerald-200 shadow-inner'} flex items-center justify-center`}>
            <TreePine size={24} className={isBlocky ? 'text-green-400' : 'text-emerald-500'} />
          </div>
          <div className={`w-6 h-3 ${isBlocky ? 'bg-amber-950 border-2 border-black' : 'bg-amber-800/40 rounded-full'} mt-1`} />
        </div>
      )}
      {type === 'water' && (
        <div className={`w-12 h-16 ${isBlocky ? 'bg-blue-600 border-4 border-black' : 'bg-blue-50 rounded-lg border-2 border-blue-100'} flex flex-col items-center p-1 shadow-md`}>
          <div className={`w-8 h-8 ${isBlocky ? 'bg-blue-400 border-2 border-black' : 'bg-blue-400/20 rounded-full'} flex items-center justify-center`}>
            <GlassWater size={20} className={isBlocky ? 'text-white' : 'text-blue-400'} />
          </div>
          <div className={`mt-auto w-full h-4 ${isBlocky ? 'bg-blue-900 border-t-2 border-black' : 'bg-slate-200 rounded-sm'}`} />
        </div>
      )}
      {type === 'archive' && (
        <div className={`w-14 h-14 ${isBlocky ? 'bg-slate-700 border-4 border-black' : 'bg-slate-100 rounded-md border-2 border-slate-200'} flex flex-col gap-1 p-1.5 shadow-md`}>
          <div className={`h-2 w-full ${isBlocky ? 'bg-black/40' : 'bg-slate-300 rounded-full'}`} />
          <div className={`h-2 w-full ${isBlocky ? 'bg-black/40' : 'bg-slate-300 rounded-full'}`} />
          <div className={`h-2 w-full ${isBlocky ? 'bg-black/40' : 'bg-slate-300 rounded-full'}`} />
          <Archive size={16} className="text-slate-400 self-center mt-1" />
        </div>
      )}
    </div>
  );
}

export function OrchestratorTable({ x, y, name, color, themeType = 'office' }: { x: number; y: number; name: string; color?: string; themeType?: ThemeType }) {
  const isBlocky = themeType === 'blocky';

  if (isBlocky) {
    return (
      <div 
        className="absolute flex flex-col items-center pointer-events-none"
        style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative flex flex-col items-center">
          {/* Minecraft Boss Character */}
          <div className="w-24 h-24 bg-slate-800 border-4 border-black relative">
            {/* Pixel Texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:8px_8px]" />
            
            {/* Crown/Head detail */}
            <div className="absolute -top-4 left-0 w-full flex justify-around">
              <div className="w-4 h-4 bg-amber-500 border-2 border-black" />
              <div className="w-4 h-4 bg-amber-500 border-2 border-black" />
              <div className="w-4 h-4 bg-amber-500 border-2 border-black" />
            </div>
            {/* Glowing Eyes */}
            <div className="absolute top-6 left-4 flex gap-6">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-4 h-4 bg-indigo-400 border-2 border-black shadow-[0_0_10px_rgba(129,140,248,0.8)]" 
              />
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-4 h-4 bg-indigo-400 border-2 border-black shadow-[0_0_10px_rgba(129,140,248,0.8)]" 
              />
            </div>
          </div>
          
          {/* Torso */}
          <div className="w-24 h-24 bg-slate-700 border-4 border-black border-t-0 relative">
            {/* Sword Hand */}
            <motion.div 
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -right-12 top-0 w-8 h-24 flex flex-col items-center origin-top"
            >
              <div className="w-8 h-8 bg-slate-800 border-2 border-black" />
              <div className="w-4 h-24 bg-indigo-500 border-2 border-black relative">
                <div className="absolute top-0 left-0 w-full h-full bg-white/20" />
                <Sword size={24} className="text-white absolute top-4 left-1/2 -translate-x-1/2" />
              </div>
            </motion.div>
            
            {/* Other Arm */}
            <div className="absolute -left-8 top-0 w-8 h-20 bg-slate-800 border-2 border-black" />
          </div>

          {/* Legs */}
          <div className="flex">
            <div className="w-12 h-16 bg-slate-900 border-4 border-black border-t-0" />
            <div className="w-12 h-16 bg-slate-900 border-4 border-black border-t-0" />
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-indigo-500 border-2 border-black animate-pulse" />
            <span className="text-[12px] font-mono font-black text-slate-400 uppercase tracking-[0.4em]">Nexus Overlord</span>
          </div>
          <span className="text-3xl font-mono font-black text-slate-900 uppercase tracking-tighter">{name}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="absolute flex flex-col items-center pointer-events-none"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div className={`w-48 h-48 ${color || 'bg-indigo-600'} rounded-[56px] border-b-[12px] border-black/20 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:16px_16px]" />
        
        <div className="relative z-10 bg-white/10 p-8 rounded-[40px] backdrop-blur-md border border-white/20 shadow-inner">
          <Cpu size={64} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </div>
        
        {/* Animated HUD Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-6 border-4 border-dashed border-white/10 rounded-[45px]"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-12 border-2 border-white/5 rounded-full"
        />
        
        {/* Pulsing Core */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-white/5 rounded-full blur-3xl"
        />
      </div>
      
      <div className="mt-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Central Orchestrator</span>
        </div>
        <span className="text-2xl font-black text-slate-900 uppercase tracking-tighter drop-shadow-sm">{name}</span>
      </div>
    </div>
  );
}

export function PixelBalloon({ x, y, color, onComplete }: { x: number; y: number; color: string; onComplete?: () => void; key?: any }) {
  return (
    <motion.div
      initial={{ y: y, opacity: 0, x: x, scale: 0.5 }}
      animate={{ 
        y: y - 600, 
        opacity: [0, 1, 1, 0],
        x: [x, x + 40, x - 40, x + 20],
        scale: 1.2
      }}
      transition={{ 
        duration: 4 + Math.random() * 2, 
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
      className="absolute pointer-events-none z-[100] -translate-x-1/2"
      style={{ left: 0, top: 0 }}
    >
      <div className="flex flex-col items-center">
        {/* Square Balloon */}
        <div className={`w-14 h-14 ${color} border-4 border-black relative shadow-2xl`}>
          {/* Shine */}
          <div className="absolute top-2 left-2 w-4 h-4 bg-white/40" />
          {/* Pixel Detail */}
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-black/20" />
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-black/10" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart size={16} className="text-white/30" />
          </div>
        </div>
        {/* String - Pixelated */}
        <div className="flex flex-col items-center">
          <div className="w-1 h-4 bg-black/60" />
          <div className="w-1 h-4 bg-black/40 translate-x-1" />
          <div className="w-1 h-4 bg-black/20 -translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
}
