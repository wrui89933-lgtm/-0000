
import React from 'react';
import { GAME_STEPS, MODULE_COLORS, CARD_COLORS } from '../constants';
import { GameStep, ModuleType, StepType, PlayerState } from '../types';
import { 
  Trophy, Brush, Palette, Droplets, ScrollText, 
  Flag, AlertOctagon, Anchor, Lock, 
  Lightbulb, Skull, Coins, Stamp, Flower2,
  MapPin, Coffee, Sparkles, Star
} from 'lucide-react';

interface GameBoardProps {
  playerState: PlayerState;
  onStepClick: (step: GameStep) => void;
  showRewardEffect: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ playerState, onStepClick, showRewardEffect }) => {

  const getGridPosition = (index: number) => {
    if (index >= 0 && index <= 9) return { col: 10 - index, row: 10 };
    if (index >= 9 && index <= 18) return { col: 1, row: 10 - (index - 9) };
    if (index >= 18 && index <= 27) return { col: 1 + (index - 18), row: 1 };
    if (index >= 27) return { col: 10, row: 1 + (index - 27) };
    return { col: 1, row: 1 };
  };

  const renderTileContent = (step: GameStep) => {
    const isProp = step.type === StepType.PROPERTY;
    const isOwned = playerState.completedSteps.includes(step.id);
    const color = MODULE_COLORS[step.module] || '#999';

    if (isProp) {
      return (
        <div className="w-full h-full flex flex-col bg-white border-[0.5px] border-gray-200 relative overflow-hidden group hover:border-[#55AEEF] hover:border-2 transition-all">
          <div className="h-[25%] w-full border-b border-gray-100 transition-colors group-hover:brightness-105" style={{ backgroundColor: color }}></div>
          <div className="flex-1 flex flex-col items-center justify-between p-1 text-center bg-white">
             <span className="text-[9px] leading-tight font-bold text-gray-700 line-clamp-2 scale-90 md:scale-100">{step.taskType}</span>
             {isOwned ? (
               <Stamp size={20} className="text-red-400 opacity-80 rotate-12 absolute bottom-4" />
             ) : (
               <div className="opacity-40 grayscale-[0.5] group-hover:grayscale-0 group-hover:opacity-80 transition-all text-gray-400">
                 {step.module === ModuleType.BRUSH && <Brush size={16} />}
                 {step.module === ModuleType.INK && <Droplets size={16} />}
                 {step.module === ModuleType.PAPER && <ScrollText size={16} />}
                 {step.module === ModuleType.COLOR && <Palette size={16} />}
               </div>
             )}
             <span className="text-[8px] font-mono text-gray-400 bg-gray-50 px-1 rounded-sm mt-1">
               {isOwned ? '已习得' : `₵${step.price}`}
             </span>
          </div>
        </div>
      );
    }

    // Special Tiles - Corners with Solid Pastel Colors
    let icon = <Flag size={18} />;
    let label = step.taskType;
    let bg = 'bg-[#E0F2FE]';
    let text = 'text-[#55AEEF]';
    let border = 'border-gray-200';

    switch (step.type) {
      case StepType.START: 
        icon = <Anchor className="text-white drop-shadow-sm" />; 
        bg = 'bg-[#93C5FD]'; // Pastel Blue
        text = 'text-white';
        label = '每日起笔';
        break;
      case StepType.JAIL: 
        icon = <Coffee className="text-white drop-shadow-sm" />; 
        bg = 'bg-[#6EE7B7]'; // Pastel Green
        text = 'text-white'; 
        break;
      case StepType.REST: 
        icon = <Sparkles className="text-white drop-shadow-sm" />; 
        bg = 'bg-[#FCD34D]'; // Pastel Yellow
        text = 'text-white'; 
        label = '闲云野鹤'; 
        break;
      case StepType.GO_TO_JAIL: 
        icon = <MapPin className="text-white drop-shadow-sm" />; 
        bg = 'bg-[#F9A8D4]'; // Pastel Pink
        text = 'text-white'; 
        break;
      case StepType.CHANCE: 
        icon = <Lightbulb className="text-yellow-400" />; 
        bg = 'bg-white'; 
        text = 'text-yellow-500'; 
        break;
      case StepType.CHEST: 
        icon = <AlertOctagon className="text-blue-400" />; 
        bg = 'bg-white'; 
        text = 'text-blue-500'; 
        break;
      case StepType.TAX: 
        icon = <Coins className="text-gray-400" />; 
        bg = 'bg-white'; 
        text = 'text-gray-500'; 
        break;
    }

    return (
      <div className={`w-full h-full flex flex-col items-center justify-center p-1 text-center border-[0.5px] ${border} ${bg} ${text} relative overflow-hidden`}>
         <div className="mb-1 relative z-10">{icon}</div>
         <span className="text-[9px] font-bold leading-none relative z-10 drop-shadow-sm">{label}</span>
         {step.price > 0 && <span className="text-[8px] mt-1 opacity-70 relative z-10">-₵{step.price}</span>}
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:4px_4px]"></div>
      </div>
    );
  };

  // Cute Cloud SVG for center background
  const CuteCloud = ({ size, opacity, className }: { size: number, opacity: number, className?: string }) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 220 160" className={`text-white fill-current ${className}`} style={{ opacity }}>
      <path d="M 50 115 C 20 115 10 70 45 55 C 50 20 100 15 120 45 C 150 15 190 35 190 80 C 195 110 170 130 145 125 Q 125 120 140 105 L 140 105 Q 125 120 145 125 L 135 123 Q 90 120 50 115 Z"/>
    </svg>
  );

  // Helper to calculate progress for a module
  const getModuleProgress = (module: ModuleType) => {
    const moduleSteps = GAME_STEPS.filter(s => s?.module === module);
    if (moduleSteps.length === 0) return 0;
    const completed = moduleSteps.filter(s => playerState.completedSteps.includes(s.id));
    return completed.length / moduleSteps.length;
  };

  return (
    <div className="w-full max-w-4xl aspect-square bg-[#A7DBF8] p-2 md:p-4 rounded-xl shadow-2xl relative select-none">
      <style>{`
        @keyframes balloon-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes cloud-drift-1 {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes cloud-drift-2 {
          0% { transform: translateX(400%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* --- GRID CONTAINER --- */}
      <div 
        className="w-full h-full grid gap-0.5 bg-[#55AEEF] border-4 border-white shadow-lg rounded-lg overflow-hidden"
        style={{
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows: 'repeat(10, 1fr)'
        }}
      >
         
         {/* --- CENTER AREA --- */}
         <div 
            className="relative flex flex-col items-center justify-between p-0 overflow-hidden bg-[#A7DBF8]"
            style={{ gridColumn: '2 / 10', gridRow: '2 / 10' }}
         >
             {/* --- BACKGROUND SCENE --- */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden">
                 
                 {/* 1. Sky Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-b from-[#A7DBF8] via-[#CDE8FE] to-[#E6F4FF] h-[75%]"></div>
                 
                 {/* 2. Floating Clouds (Whiter, Higher Opacity) */}
                 <div className="absolute top-[10%] left-0 w-full h-[50%] overflow-hidden">
                    <CuteCloud size={100} opacity={0.95} className="absolute top-[20%] left-0 animate-[cloud-drift-1_60s_linear_infinite]" />
                    <CuteCloud size={80} opacity={0.85} className="absolute top-[40%] left-1/2 animate-[cloud-drift-1_45s_linear_infinite_reverse]" />
                    <CuteCloud size={120} opacity={0.9} className="absolute top-[10%] left-[80%] animate-[cloud-drift-2_50s_linear_infinite]" />
                 </div>

                 {/* 3. Grass with RICH FLOWERS */}
                 <div className="absolute bottom-0 w-full h-[35%] bg-[#A3E635] rounded-t-[15%] scale-x-125 origin-bottom overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#65a30d 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                    
                    {/* Scattered Flowers - Varied, High Brightness, Saturated */}
                    <div className="absolute bottom-6 right-10 text-[#FDE047] opacity-100 drop-shadow-md"><Flower2 size={32} fill="currentColor" /></div>
                    <div className="absolute bottom-16 right-20 text-[#F472B6] opacity-100 drop-shadow-md"><Flower2 size={24} fill="currentColor" /></div>
                    <div className="absolute bottom-4 right-32 text-white opacity-100 drop-shadow-md"><Flower2 size={20} fill="currentColor" /></div>
                    <div className="absolute bottom-24 right-5 text-[#34D399] opacity-100 drop-shadow-md"><Flower2 size={28} fill="currentColor" /></div>
                    
                    <div className="absolute bottom-8 left-16 text-[#93C5FD] opacity-100 drop-shadow-md"><Flower2 size={26} fill="currentColor" /></div>
                    <div className="absolute bottom-20 left-28 text-[#FDA4AF] opacity-100 drop-shadow-md"><Flower2 size={20} fill="currentColor" /></div>
                    <div className="absolute bottom-4 left-44 text-[#FEF9C3] opacity-100 drop-shadow-md"><Flower2 size={18} fill="currentColor" /></div>
                    <div className="absolute bottom-28 right-[40%] text-white opacity-90 drop-shadow-md"><Flower2 size={16} fill="currentColor" /></div>
                    
                    <div className="absolute bottom-2 right-[20%] text-[#FBCFE8] opacity-100 drop-shadow-md"><Flower2 size={30} fill="currentColor" /></div>
                 </div>

                 {/* 4. Picnic Mat (Perspective) */}
                 <div className="absolute bottom-[-5%] left-1/2 w-[75%] h-[55%] origin-bottom transform -translate-x-1/2 perspective-[600px] z-10">
                    <div className="w-full h-full bg-[#FFF1F2] shadow-2xl rounded-xl transform rotate-x-[35deg] scale-95 border-4 border-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-40" style={{
                            backgroundImage: `
                                linear-gradient(45deg, #FDA4AF 25%, transparent 25%, transparent 75%, #FDA4AF 75%, #FDA4AF), 
                                linear-gradient(45deg, #FDA4AF 25%, transparent 25%, transparent 75%, #FDA4AF 75%, #FDA4AF)
                            `,
                            backgroundPosition: '0 0, 20px 20px',
                            backgroundSize: '40px 40px',
                        }}></div>
                    </div>
                 </div>
                
                 {/* 5. Balloons (Animated) */}
                 <div className="absolute top-[10%] right-[10%] opacity-90" style={{ animation: 'balloon-float 4s ease-in-out infinite' }}>
                     <div className="w-12 h-14 bg-[#FCA5A5] rounded-full shadow-lg relative z-10 border border-white/20">
                         <div className="absolute top-3 left-3 w-2 h-4 bg-white/40 rounded-full rotate-[-45deg]"></div>
                     </div>
                     <div className="absolute bottom-[-30px] left-1/2 w-[1.5px] h-20 bg-white/60 origin-top rotate-6"></div>
                 </div>
                 <div className="absolute top-[20%] right-[5%] opacity-90" style={{ animation: 'balloon-float 5s ease-in-out infinite 1s' }}>
                     <div className="w-12 h-14 bg-[#6EE7B7] rounded-full shadow-lg relative z-10 border border-white/20">
                        <div className="absolute top-3 left-3 w-2 h-4 bg-white/40 rounded-full rotate-[-45deg]"></div>
                     </div>
                     <div className="absolute bottom-[-30px] left-1/2 w-[1.5px] h-20 bg-white/60 origin-top -rotate-6"></div>
                 </div>

             </div>

             {/* --- FOREGROUND INTERACTIVE ELEMENTS --- */}
             <div className="relative z-40 w-full h-full p-4 pointer-events-none">
                
                {/* CARDS (Centered, Colored to Match Grid) */}
                <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 w-[80%] flex justify-center gap-12 pointer-events-auto z-50">
                    {/* Chance (Inspiration) - Orange (#FDBA74) */}
                    <div className="relative w-24 h-36 cursor-pointer group hover:-translate-y-2 transition-transform duration-300">
                        <div className="absolute inset-0 bg-[#FDBA74] rounded-lg transform rotate-3 translate-x-1 translate-y-1 border border-white/50"></div>
                        <div className="absolute inset-0 bg-[#FDBA74] rounded-lg transform -rotate-2 translate-x-2 translate-y-2 border border-white/50"></div>
                        <div className="absolute inset-0 bg-[#FDBA74] rounded-lg shadow-xl border-4 border-white flex flex-col items-center justify-center transform group-hover:rotate-1 transition-transform">
                           <Lightbulb className="text-white w-10 h-10 mb-2 drop-shadow-sm" />
                           <span className="text-white font-bold text-sm tracking-widest text-center leading-tight drop-shadow-sm">文思<br/>泉涌</span>
                        </div>
                    </div>

                    {/* Challenge (Insight) - Blue (#93C5FD) */}
                    <div className="relative w-24 h-36 cursor-pointer group hover:-translate-y-2 transition-transform duration-300">
                        <div className="absolute inset-0 bg-[#93C5FD] rounded-lg transform -rotate-3 translate-x-1 translate-y-1 border border-white/50"></div>
                        <div className="absolute inset-0 bg-[#93C5FD] rounded-lg transform rotate-2 translate-x-2 translate-y-2 border border-white/50"></div>
                        <div className="absolute inset-0 bg-[#93C5FD] rounded-lg shadow-xl border-4 border-white flex flex-col items-center justify-center transform group-hover:-rotate-1 transition-transform">
                           <Star className="text-white w-10 h-10 mb-2 drop-shadow-sm" />
                           <span className="text-white font-bold text-sm tracking-widest text-center leading-tight drop-shadow-sm">妙手<br/>偶得</span>
                        </div>
                    </div>
                </div>

                {/* SCATTERED SHAPED TREASURES ON MAT WITH PROGRESS (Centered 2x2 Grid) */}
                <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 w-[70%] h-[160px] pointer-events-auto z-40 grid grid-cols-2 gap-x-8 gap-y-4 items-center justify-items-center">
                    
                    {/* Brush - Top Left (Traditional Calligraphy Brush Shape) */}
                    <div className="flex flex-col items-center justify-center group cursor-help hover:scale-105 transition-transform">
                         <svg width="60" height="80" viewBox="0 0 60 100" className="drop-shadow-lg">
                            {/* Handle */}
                            <path d="M 28 0 L 32 0 L 35 65 L 25 65 Z" fill="#D4A373" stroke="white" strokeWidth="2" />
                            {/* Decor */}
                            <rect x="25" y="60" width="10" height="5" fill="#333" />
                            {/* Tip - Soft & Round */}
                            <path d="M 25 65 Q 15 80 30 98 Q 45 80 35 65 Z" fill="#333" stroke="none" />
                         </svg>
                         <div className="w-16 h-2 bg-white/50 rounded-full mt-1 overflow-hidden border border-white">
                            <div className="h-full bg-[#6EE7B7]" style={{ width: `${getModuleProgress(ModuleType.BRUSH) * 100}%` }}></div>
                         </div>
                         <span className="text-[9px] font-bold text-[#6EE7B7] bg-white/90 px-1.5 rounded-sm mt-0.5">笔法精进</span>
                    </div>

                    {/* Ink - Top Right */}
                    <div className="flex flex-col items-center justify-center group cursor-help hover:scale-105 transition-transform">
                         <svg width="60" height="60" viewBox="0 0 60 60" className="drop-shadow-lg">
                            <rect x="5" y="15" width="50" height="40" rx="5" fill="#93C5FD" stroke="white" strokeWidth="2" />
                            <rect x="15" y="0" width="30" height="15" rx="2" fill="#60A5FA" stroke="white" strokeWidth="2" />
                            <circle cx="30" cy="35" r="12" fill="#1E3A8A" opacity="0.8" />
                         </svg>
                         <div className="w-16 h-2 bg-white/50 rounded-full mt-1 overflow-hidden border border-white">
                            <div className="h-full bg-[#93C5FD]" style={{ width: `${getModuleProgress(ModuleType.INK) * 100}%` }}></div>
                         </div>
                         <span className="text-[9px] font-bold text-[#93C5FD] bg-white/90 px-1.5 rounded-sm mt-0.5">墨韵掌握</span>
                    </div>

                    {/* Paper - Bottom Left */}
                    <div className="flex flex-col items-center justify-center group cursor-help hover:scale-105 transition-transform">
                         <svg width="70" height="40" viewBox="0 0 80 40" className="drop-shadow-lg">
                            <rect x="10" y="5" width="60" height="30" fill="#FDBA74" stroke="white" strokeWidth="2" />
                            <rect x="0" y="0" width="10" height="40" rx="2" fill="#F97316" stroke="white" strokeWidth="2" />
                            <rect x="70" y="0" width="10" height="40" rx="2" fill="#F97316" stroke="white" strokeWidth="2" />
                         </svg>
                         <div className="w-16 h-2 bg-white/50 rounded-full mt-1 overflow-hidden border border-white">
                            <div className="h-full bg-[#FDBA74]" style={{ width: `${getModuleProgress(ModuleType.PAPER) * 100}%` }}></div>
                         </div>
                         <span className="text-[9px] font-bold text-[#FDBA74] bg-white/90 px-1.5 rounded-sm mt-0.5">宣纸学问</span>
                    </div>

                    {/* Palette - Bottom Right (Classic Kidney Shape) */}
                    <div className="flex flex-col items-center justify-center group cursor-help hover:scale-105 transition-transform">
                         <svg width="70" height="60" viewBox="0 0 80 60" className="drop-shadow-lg">
                            {/* Kidney Shape */}
                            <path d="M 10 30 C 10 10 30 5 40 5 C 60 5 75 15 75 30 C 75 50 60 55 50 55 C 45 55 45 45 40 45 C 35 45 35 55 30 55 C 10 55 10 40 10 30 Z" fill="#F9A8D4" stroke="white" strokeWidth="2" />
                            {/* Paint Blobs */}
                            <circle cx="20" cy="25" r="6" fill="#EF4444" />
                            <circle cx="35" cy="20" r="6" fill="#F59E0B" />
                            <circle cx="55" cy="25" r="6" fill="#3B82F6" />
                            <circle cx="65" cy="40" r="6" fill="#10B981" />
                         </svg>
                         <div className="w-16 h-2 bg-white/50 rounded-full mt-1 overflow-hidden border border-white">
                            <div className="h-full bg-[#F9A8D4]" style={{ width: `${getModuleProgress(ModuleType.COLOR) * 100}%` }}></div>
                         </div>
                         <span className="text-[9px] font-bold text-[#F9A8D4] bg-white/90 px-1.5 rounded-sm mt-0.5">色彩意境</span>
                    </div>

                </div>

             </div>
         </div>

         {/* --- BOARD TILES LOOP --- */}
         {GAME_STEPS.map((step, index) => {
             const { col, row } = getGridPosition(index);
             const isCurrent = playerState.currentPosition === index;
             
             return (
                 <div
                    key={index}
                    onClick={() => onStepClick(step)}
                    style={{ gridColumn: col, gridRow: row }}
                    className={`
                        relative cursor-pointer transition-all duration-200 bg-white
                        hover:z-50 hover:shadow-xl
                    `}
                 >
                    {renderTileContent(step)}

                    {/* Player Token */}
                    {isCurrent && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none transition-all duration-500 ease-in-out">
                             <div className="w-10 h-10 relative animate-bounce">
                                <div className="absolute bottom-0 w-8 h-8 bg-gray-800 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                   <Brush size={16} className="text-white" />
                                </div>
                             </div>
                        </div>
                    )}
                 </div>
             );
         })}

      </div>
    </div>
  );
};

export default GameBoard;
