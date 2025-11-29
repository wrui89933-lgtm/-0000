import React from 'react';
import { ModuleType, GameStep } from '../types';
import { Brush, Palette, Droplets, ScrollText } from 'lucide-react';

interface FragmentCornersProps {
  completedSteps: number[];
  allSteps: GameStep[];
}

const Corner: React.FC<{ 
  module: ModuleType, 
  icon: React.ReactNode, 
  positionClass: string,
  progress: number,
  label: string
}> = ({ module, icon, positionClass, progress, label }) => {
  const isComplete = progress === 1;

  return (
    <div className={`fixed ${positionClass} z-40 flex flex-col items-center pointer-events-none`}>
      <div 
        className={`
          relative w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 shadow-lg transition-all duration-1000 overflow-hidden bg-white
          ${isComplete ? 'border-[#55AEEF] shadow-[#55AEEF]/40' : 'border-[#A7DBF8]'}
        `}
      >
        {/* Fill Animation (Blue Liquid) */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-[#55AEEF] transition-all duration-1000 ease-in-out"
          style={{ 
            height: `${progress * 100}%`,
            opacity: 0.2
          }}
        />
        
        {/* Solid Line Progress (Like a water level) */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-[#55AEEF] transition-all duration-1000 ease-in-out"
          style={{ 
            height: `${progress * 100}%`,
            top: `${100 - (progress * 100)}%`,
            borderTop: '2px solid #55AEEF',
            display: progress > 0 ? 'block' : 'none'
          }}
        />

        {/* Icon */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 text-[#55AEEF]`} 
        >
          <div className={`${isComplete ? 'animate-pulse scale-110' : ''}`}>
            {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
          </div>
        </div>
        
        {/* Checkmark */}
        {isComplete && (
          <div className="absolute top-1 right-1">
             <div className="w-2 h-2 bg-[#55AEEF] rounded-full"></div>
          </div>
        )}
      </div>
      
      {/* Label Badge */}
      <div className="mt-2 bg-white px-2 py-0.5 rounded-full shadow-sm text-[10px] md:text-xs font-bold text-[#55AEEF] border border-[#A7DBF8]">
        {label} {Math.round(progress * 100)}%
      </div>
    </div>
  );
};

const FragmentCorners: React.FC<FragmentCornersProps> = ({ completedSteps, allSteps }) => {
  const getProgress = (module: ModuleType) => {
    const moduleSteps = allSteps.filter(s => s.module === module);
    if (moduleSteps.length === 0) return 0;
    const completed = moduleSteps.filter(s => completedSteps.includes(s.id));
    return completed.length / moduleSteps.length;
  };

  return (
    <>
      {/* Top Left - Brush */}
      <Corner 
        module={ModuleType.BRUSH}
        icon={<Brush />}
        positionClass="top-20 left-4 md:top-24 md:left-10"
        progress={getProgress(ModuleType.BRUSH)}
        label="笔法"
      />

      {/* Top Right - Ink */}
      <Corner 
        module={ModuleType.INK}
        icon={<Droplets />}
        positionClass="top-20 right-4 md:top-24 md:right-10"
        progress={getProgress(ModuleType.INK)}
        label="墨韵"
      />

      {/* Bottom Left - Paper */}
      <Corner 
        module={ModuleType.PAPER}
        icon={<ScrollText />}
        positionClass="bottom-28 left-4 md:bottom-10 md:left-10"
        progress={getProgress(ModuleType.PAPER)}
        label="宣纸"
      />

      {/* Bottom Right - Color */}
      <Corner 
        module={ModuleType.COLOR}
        icon={<Palette />}
        positionClass="bottom-28 right-4 md:bottom-10 md:right-10"
        progress={getProgress(ModuleType.COLOR)}
        label="色彩"
      />
    </>
  );
};

export default FragmentCorners;