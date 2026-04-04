import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PERSONALITY_TYPES } from './constants.ts';

export const PersonalityInfoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (Sticky) */}
            <div className="bg-pink-50 border-b border-pink-100 p-6 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-pink-800 flex items-center gap-2">
                  <span>🧠</span> The 16 Personality Types
                </h2>
                <p className="text-pink-600 text-sm mt-1">Find the one that best describes you.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white hover:bg-pink-100 rounded-full transition-colors shadow-sm"
              >
                <X className="w-5 h-5 text-pink-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PERSONALITY_TYPES.map((type) => (
                  <div 
                    key={type.id} 
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-pink-50/50 hover:border-pink-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        {type.emoji}
                      </span>
                      <div>
                        <h4 className="font-bold text-gray-800 leading-tight">{type.name}</h4>
                        <span className="text-xs font-bold text-pink-500 bg-pink-100 px-2 py-0.5 rounded-full">
                          {type.code}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pl-1">
                      {type.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};