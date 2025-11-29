
import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import TaskModal from './components/TaskModal';
import { GAME_STEPS, TOTAL_STEPS } from './constants';
import { GameStep, PlayerState, StepType } from './types';
import { Dice5, RefreshCw, Coins } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [player, setPlayer] = useState<PlayerState>({
    currentPosition: 0,
    completedSteps: [], // Owned Properties
    completedImages: {},
    isMoving: false,
    diceValue: null,
    coins: 1500, // Starting Money
    inJail: false
  });

  const [modalStep, setModalStep] = useState<GameStep | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // --- Actions ---

  const handleRollDice = () => {
    if (player.isMoving || isModalOpen) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setPlayer(prev => ({ ...prev, isMoving: true, diceValue: roll }));

    setTimeout(() => {
      setPlayer(prev => {
        const nextPos = (prev.currentPosition + roll) % TOTAL_STEPS;
        
        // Pass Go Logic
        let newCoins = prev.coins;
        if (nextPos < prev.currentPosition) {
           newCoins += 200; // Salary
           setPopupMessage("经过起点：领取启蒙币 ₵200");
           setShowReward(true);
           setTimeout(() => setShowReward(false), 2000);
        }

        return {
          ...prev,
          currentPosition: nextPos,
          isMoving: false,
          coins: newCoins
        };
      });
    }, 1000);
  };

  // Trigger interaction when landing
  useEffect(() => {
    if (!player.isMoving && player.diceValue !== null) {
      const step = GAME_STEPS[player.currentPosition];
      handleLanding(step);
    }
  }, [player.currentPosition, player.isMoving]);

  const handleLanding = (step: GameStep) => {
      setTimeout(() => {
        if (step.type === StepType.PROPERTY) {
            setModalStep(step);
            setIsModalOpen(true);
        } else if (step.type === StepType.TAX) {
            const tax = step.price || 100;
            setPlayer(p => ({ ...p, coins: Math.max(0, p.coins - tax) }));
            setPopupMessage(`缴纳税务：-${tax} 启蒙币`);
            setShowReward(true);
            setTimeout(() => setShowReward(false), 2000);
        } else if (step.type === StepType.CHANCE || step.type === StepType.CHEST) {
            const amount = Math.random() > 0.5 ? 50 : -50;
            const msg = amount > 0 ? "获得意外之财" : "不慎打翻墨汁";
            setPlayer(p => ({ ...p, coins: p.coins + amount }));
            setPopupMessage(`${step.taskType}：${msg} ${amount > 0 ? '+' : ''}${amount}`);
            setShowReward(true);
            setTimeout(() => setShowReward(false), 2000);
        } else if (step.type === StepType.GO_TO_JAIL) {
            setPlayer(p => ({ ...p, currentPosition: 9, inJail: true })); // Move to Jail (Index 9)
            setPopupMessage("面壁思过！");
            setShowReward(true);
            setTimeout(() => setShowReward(false), 2000);
        }
      }, 500);
  };

  const handleStepClick = (step: GameStep) => {
    // Allow viewing properties anywhere
    if (step.type === StepType.PROPERTY) {
        setModalStep(step);
        setIsModalOpen(true);
    }
  };

  const handlePurchaseProperty = (imageBase64: string) => {
    if (!modalStep) return;

    if (player.completedSteps.includes(modalStep.id)) {
        // Already owned, maybe upgrade logic later
        setIsModalOpen(false);
        return;
    }

    if (player.coins < modalStep.price) {
        alert("启蒙币不足，无法习得此技能！");
        return;
    }

    setPlayer(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, modalStep.id],
      completedImages: { ...prev.completedImages, [modalStep.id]: imageBase64 },
      coins: prev.coins - modalStep.price
    }));

    setPopupMessage("习得技能！");
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
    setIsModalOpen(false);
  };

  const handleReset = () => {
    if (confirm("确定要重置所有进度吗？")) {
      setPlayer({
        currentPosition: 0,
        completedSteps: [],
        completedImages: {},
        isMoving: false,
        diceValue: null,
        coins: 1500,
        inJail: false
      });
    }
  };

  // Cute Cloud SVG for background
  const CuteCloud = ({ size, opacity }: { size: number, opacity: number }) => (
    <svg 
      width={size} 
      height={size * 0.7} 
      viewBox="0 0 220 160" 
      className="text-white fill-current" 
      style={{ opacity }}
    >
      <path 
        d="M 50 115 
            C 20 115 10 70 45 55 
            C 50 20 100 15 120 45 
            C 150 15 190 35 190 80 
            C 195 110 170 130 145 125 
            Q 125 120 140 105
            L 140 105
            Q 125 120 145 125
            L 135 123
            Q 90 120 50 115 Z"
      />
    </svg>
  );

  return (
    <div className="h-screen w-screen bg-[#A7DBF8] text-[#1e3a8a] font-serif overflow-hidden relative flex flex-col">
      
      {/* Background Clouds (Custom Cute Shape) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] animate-[float_30s_linear_infinite]">
             <CuteCloud size={300} opacity={0.4} />
        </div>
        <div className="absolute bottom-[20%] -right-[10%] animate-[float_40s_linear_infinite_reverse]">
             <CuteCloud size={250} opacity={0.3} />
        </div>
        <div className="absolute top-[50%] left-[20%] animate-[float_60s_linear_infinite] delay-1000">
             <CuteCloud size={150} opacity={0.2} />
        </div>
        <style>{`@keyframes float { 0% { transform: translateX(0px); } 50% { transform: translateX(50px); } 100% { transform: translateX(0px); } }`}</style>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-6 h-16 flex items-center justify-end pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
            <div className="bg-yellow-400 px-4 py-2 rounded-xl text-yellow-900 font-bold text-sm shadow-md flex items-center gap-2 border-2 border-white">
                <Coins size={18} />
                <span>{player.coins}</span>
            </div>
             <button onClick={handleReset} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors">
               <RefreshCw size={20} />
             </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="w-full flex-1 flex items-center justify-center relative p-2 md:p-6 overflow-hidden z-10">
         <GameBoard 
            playerState={player} 
            onStepClick={handleStepClick}
            showRewardEffect={showReward}
        />
      </main>

      {/* Dice Control */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
           {player.diceValue !== null && !player.isMoving && (
             <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#55AEEF] text-white font-bold px-5 py-2 rounded-xl shadow-lg whitespace-nowrap animate-bounce border-2 border-white">
               前进 {player.diceValue} 步
             </div>
           )}

           <button
             onClick={handleRollDice}
             disabled={player.isMoving || isModalOpen}
             className={`
               group relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-200
               ${player.isMoving 
                 ? 'bg-gray-300 cursor-not-allowed scale-95' 
                 : 'bg-white hover:bg-[#f0f9ff] active:scale-95 shadow-[0_0_20px_rgba(85,174,239,0.5)] border-4 border-[#55AEEF]'
               }
             `}
           >
             <Dice5 size={48} className={`text-[#55AEEF] z-10 ${player.isMoving ? 'animate-spin' : ''}`} />
           </button>
        </div>

      {/* Reward Popup */}
      {showReward && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none">
           <div className="bg-[#55AEEF] text-white px-6 py-3 rounded-full shadow-xl animate-bounce flex items-center gap-2 border-2 border-white font-bold">
              {popupMessage}
           </div>
        </div>
      )}

      {/* Modal */}
      <TaskModal 
        step={modalStep}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handlePurchaseProperty}
        isCompleted={modalStep ? player.completedSteps.includes(modalStep.id) : false}
        existingImage={modalStep ? player.completedImages[modalStep.id] : undefined}
        canAfford={modalStep ? player.coins >= modalStep.price : false}
      />
    </div>
  );
};

export default App;
    