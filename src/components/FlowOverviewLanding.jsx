import React from 'react';
import { Play, Sparkles, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { TOUR_STEPS } from './InteractiveTourBanner';

export default function FlowOverviewLanding({ onStartTour, onJumpToStep }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-sans text-slate-900 space-y-8">
      {/* Minimal Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Unboxie Prototype</span>
        </div>
        
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
          Interactive Flow Walkthrough
        </h1>

        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Follow the step-by-step guided tour to see how Admin changes dynamically affect the Customer Storefront and Checkout.
        </p>

        <div className="pt-2">
          <button
            onClick={onStartTour}
            className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-xs transition flex items-center justify-center space-x-2 mx-auto"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Guided Flow Tour (Step 1 of 8)</span>
          </button>
        </div>
      </div>

      {/* Clean 4 Flow Quick Launcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => onJumpToStep(0)}
          className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:border-orange-300 transition cursor-pointer flex justify-between items-center group"
        >
          <div>
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Flow 1</span>
            <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600">Product Discounts</span>
            <span className="text-[11px] text-slate-500 block">Admin Edit ➔ Customer 20% OFF</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition" />
        </div>

        <div 
          onClick={() => onJumpToStep(2)}
          className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:border-orange-300 transition cursor-pointer flex justify-between items-center group"
        >
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Flow 2</span>
            <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600">Delivery Locations</span>
            <span className="text-[11px] text-slate-500 block">Admin Locations ➔ Dynamic Checkout</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition" />
        </div>

        <div 
          onClick={() => onJumpToStep(4)}
          className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:border-orange-300 transition cursor-pointer flex justify-between items-center group"
        >
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Flow 3</span>
            <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600">Logistics & Tracking</span>
            <span className="text-[11px] text-slate-500 block">Assign Partner ➔ Advance Status</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition" />
        </div>

        <div 
          onClick={() => onJumpToStep(6)}
          className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:border-orange-300 transition cursor-pointer flex justify-between items-center group"
        >
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Flow 4</span>
            <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600">Customer Feedback</span>
            <span className="text-[11px] text-slate-500 block">Submit Review ➔ Admin Feedback</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition" />
        </div>
      </div>
    </div>
  );
}
