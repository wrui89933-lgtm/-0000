
import React, { useState, useRef } from 'react';
import { GameStep } from '../types';
import { getArtTutorFeedback } from '../services/geminiService';
import { Loader2, Bot, CheckCircle, X, Camera, Coins, Stamp } from 'lucide-react';

interface TaskModalProps {
  step: GameStep | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (imageBase64: string) => void;
  isCompleted: boolean;
  existingImage?: string;
  canAfford: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ step, isOpen, onClose, onComplete, isCompleted, existingImage, canAfford }) => {
  const [tutorFeedback, setTutorFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(existingImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !step) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetFeedback = async () => {
    if (!selectedImage) return;
    setLoadingFeedback(true);
    const feedback = await getArtTutorFeedback(step.taskType, step.action, selectedImage);
    setTutorFeedback(feedback);
    setLoadingFeedback(false);
  };

  const handlePurchase = () => {
    if (selectedImage && canAfford) {
      onComplete(selectedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border-4 border-[#55AEEF] relative">
        
        {/* Header - Property Deed Style */}
        <div className="relative text-white p-4 text-center" style={{ backgroundColor: '#55AEEF' }}>
           <button onClick={onClose} className="absolute top-2 right-2 text-white/80 hover:text-white">
            <X size={24} />
           </button>
           <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{step.module} 之道</p>
           <h2 className="text-2xl font-black">{step.taskType}</h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-[#f8fbff]">
          
          {/* Price & Rent Table */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
             <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2 mb-2">
                <span className="text-gray-500 text-sm">请教费 (Rent)</span>
                <span className="font-bold text-[#55AEEF]">₵{step.rent}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">习得费用 (Price)</span>
                <span className="font-bold text-orange-500">₵{step.price}</span>
             </div>
          </div>

          {/* Task Description */}
          <div className="space-y-2 text-center">
             <p className="text-gray-800 font-medium text-lg">{step.taskContent}</p>
             <p className="text-gray-500 text-sm italic">"{step.description}"</p>
          </div>

          {/* Verification */}
          <div className="border-2 border-dashed border-[#A7DBF8] rounded-xl p-4 flex flex-col items-center justify-center bg-white min-h-[160px] relative cursor-pointer hover:bg-blue-50 transition"
               onClick={() => !isCompleted && fileInputRef.current?.click()}>
             {selectedImage ? (
                <img src={selectedImage} alt="Work" className="max-h-40 rounded shadow-sm object-contain" />
             ) : (
                <div className="text-center text-gray-400">
                   <Camera size={32} className="mx-auto mb-2 text-[#A7DBF8]" />
                   <p className="text-xs">点击上传练习照片以验证</p>
                </div>
             )}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          {/* AI Feedback */}
          {selectedImage && (
             <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-gray-700">
                {tutorFeedback ? (
                   <p>{tutorFeedback}</p>
                ) : (
                   <button onClick={handleGetFeedback} disabled={loadingFeedback} className="w-full text-[#55AEEF] font-bold flex items-center justify-center gap-2">
                      {loadingFeedback ? <Loader2 className="animate-spin" size={16} /> : <Bot size={16} />}
                      请求大师点评
                   </button>
                )}
             </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-gray-100">
          {isCompleted ? (
             <button disabled className="w-full py-3 bg-green-100 text-green-700 rounded-lg font-bold flex items-center justify-center gap-2">
                <Stamp size={20} /> 已习得 (Owned)
             </button>
          ) : (
             <button 
               onClick={handlePurchase}
               disabled={!selectedImage || !canAfford}
               className={`w-full py-3 rounded-lg font-bold shadow-md flex items-center justify-center gap-2 text-white transition-all
                  ${(selectedImage && canAfford) ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}
               `}
             >
                <Coins size={20} />
                {canAfford ? `支付 ₵${step.price} 习得` : '启蒙币不足'}
             </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default TaskModal;
