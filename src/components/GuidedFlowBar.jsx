import React from 'react';
import { Play, Sparkles } from 'lucide-react';

export default function GuidedFlowBar({ onJumpToFlow }) {
  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 font-medium text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span className="font-semibold text-white">Interactive Flow Demo:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onJumpToFlow('flow1')}
            className="bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 font-medium px-2.5 py-1 rounded transition flex items-center space-x-1.5 border border-slate-700/60"
          >
            <Play className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
            <span>1. Product Discounts</span>
          </button>

          <button
            onClick={() => onJumpToFlow('flow2')}
            className="bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 font-medium px-2.5 py-1 rounded transition flex items-center space-x-1.5 border border-slate-700/60"
          >
            <Play className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
            <span>2. Admin Orders & Logistics</span>
          </button>

          <button
            onClick={() => onJumpToFlow('flow3')}
            className="bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 font-medium px-2.5 py-1 rounded transition flex items-center space-x-1.5 border border-slate-700/60"
          >
            <Play className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
            <span>3. Customer Checkout</span>
          </button>

          <button
            onClick={() => onJumpToFlow('flow4')}
            className="bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 font-medium px-2.5 py-1 rounded transition flex items-center space-x-1.5 border border-slate-700/60"
          >
            <Play className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
            <span>4. Customer Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
}
