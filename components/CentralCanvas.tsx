import React from 'react';
import { PaintingState } from '../types';

interface CentralCanvasProps {
  paintingState: PaintingState;
  showRewardEffect: boolean;
}

const CentralCanvas: React.FC<CentralCanvasProps> = ({ paintingState, showRewardEffect }) => {
  // Using a landscape that fits the blue/white aesthetic (snowy mountain or misty river)
  // Converting to a blue-tone monotone image via CSS filters
  const imageUrl = "https://images.unsplash.com/photo-1516579899388-349f50689cb0?q=80&w=1000&auto=format&fit=crop"; 
  // Good candidates: Snowy mountains, misty lakes.

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 pointer-events-none">
      {/* Scroll Container */}
      <div className="relative w-full h-full bg-[#f8fbff] shadow-[0_0_15px_rgba(85,174,239,0.2)] border-y-8 border-[#55AEEF] flex flex-col overflow-hidden rounded-sm">
        
        {/* Scroll Paper Texture */}
        <div className="absolute inset-0 bg-white opacity-80" style={{ backgroundImage: 'radial-gradient(#A7DBF8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Content Container */}
        <div className="relative flex-1 w-full h-full overflow-hidden p-4 flex items-center justify-center">
            
            {/* Base Outline (Brush Module) */}
            <div 
                className="absolute inset-4 transition-opacity duration-1000 ease-in-out z-10"
                style={{ 
                opacity: 0.2 + (paintingState.brushProgress * 0.8),
                filter: 'grayscale(100%) contrast(150%) brightness(1.1) drop-shadow(0 0 1px #55AEEF)',
                mixBlendMode: 'multiply'
                }}
            >
                <img src={imageUrl} alt="Sketch" className="w-full h-full object-contain" />
            </div>

            {/* Ink Wash (Ink Module) */}
            <div 
                className="absolute inset-4 transition-opacity duration-1000 ease-in-out z-20"
                style={{ 
                opacity: paintingState.inkProgress,
                filter: 'grayscale(100%) sepia(100%) hue-rotate(180deg) saturate(200%) brightness(0.9)', // Blue Ink Effect
                mixBlendMode: 'multiply'
                }}
            >
                <img src={imageUrl} alt="Ink" className="w-full h-full object-contain" />
            </div>

            {/* Final Color (Color Module) */}
            <div 
                className="absolute inset-4 transition-opacity duration-1000 ease-in-out z-30"
                style={{ 
                opacity: paintingState.colorProgress,
                filter: 'contrast(110%) saturate(120%)',
                mixBlendMode: 'normal'
                }}
            >
                <img src={imageUrl} alt="Color" className="w-full h-full object-contain" />
            </div>

             {/* Progress Text overlay */}
             <div className="absolute bottom-2 right-4 z-40 bg-white/80 px-2 py-1 rounded text-[#55AEEF] text-xs font-bold border border-[#A7DBF8]">
                画卷完成度: {Math.round(paintingState.totalProgress * 100)}%
             </div>
        </div>

        {/* Reward Effect */}
        {showRewardEffect && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#55AEEF]/10">
                <div className="text-4xl font-bold text-[#55AEEF] drop-shadow-md animate-bounce">
                    笔下生花
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CentralCanvas;