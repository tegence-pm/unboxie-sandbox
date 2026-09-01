import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  X, 
  Maximize2, 
  Minimize2, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const TOUR_STEPS = [
  {
    step: 1,
    flow: 'Flow 1: Product Discounts',
    mode: 'admin',
    tab: 'products',
    subMode: '',
    title: '1. Admin Product Discount',
    instruction: 'Click "Edit / Discount" on Jo Malone, toggle Discount ON (20%), and click "Save Changes".',
    nextLabel: 'See Customer Storefront ➔',
  },
  {
    step: 2,
    flow: 'Flow 1: Product Discounts',
    mode: 'customer',
    tab: '',
    subMode: 'customer',
    title: '2. Customer Discount Impact',
    instruction: 'Notice the "20% OFF" badge, ₦185,000 strikethrough, and ₦148,000 selling price on the storefront.',
    nextLabel: 'Go to Admin Delivery Settings ➔',
  },
  {
    step: 3,
    flow: 'Flow 2: Delivery Locations',
    mode: 'admin',
    tab: 'logistics',
    subMode: '',
    title: '3. Admin Delivery Areas & Fees',
    instruction: 'View Lagos delivery areas (Gbagada ₦2,000, VI ₦3,000) or add a custom delivery location.',
    nextLabel: 'Test Customer Checkout ➔',
  },
  {
    step: 4,
    flow: 'Flow 2: Delivery Locations',
    mode: 'customer',
    tab: '',
    subMode: 'checkout',
    title: '4. Dynamic Customer Checkout',
    instruction: 'Select Lagos ➔ Gbagada (₦2,000). The Order Summary dynamically updates total to ₦57,000.',
    nextLabel: 'Go to Admin Orders ➔',
  },
  {
    step: 5,
    flow: 'Flow 3: Partner Assignment',
    mode: 'admin',
    tab: 'orders',
    subMode: '',
    title: '5. Admin Orders (Unassigned)',
    instruction: 'Click "View Order" on unassigned Order #483925 and assign GIG Logistics as the partner.',
    nextLabel: 'Advance Order Status ➔',
  },
  {
    step: 6,
    flow: 'Flow 3: Status Progression',
    mode: 'admin',
    tab: 'orders',
    subMode: '',
    title: '6. Sequential Status Progression',
    instruction: 'Once assigned, click "Advance to Next Step" (Assigned ➔ Picked Up ➔ Out for Delivery ➔ Delivered).',
    nextLabel: 'Leave Customer Review ➔',
  },
  {
    step: 7,
    flow: 'Flow 4: Customer Feedback',
    mode: 'customer',
    tab: '',
    subMode: 'feedback',
    feedbackSubMode: 'invitation',
    title: '7. Customer Review Invitation',
    instruction: 'Click "Leave a Review", select 5 stars, write feedback, and click Submit.',
    nextLabel: 'See Admin Feedback ➔',
  },
  {
    step: 8,
    flow: 'Flow 4: Admin Feedback Loop',
    mode: 'admin',
    tab: 'feedback',
    subMode: '',
    title: '8. Admin Feedback Dashboard',
    instruction: 'Click "View Details" on Eyimofe\'s review to see full review details linked directly to Order #483925.',
    nextLabel: 'Tour Complete! Restart 🔄',
  },
];

export default function InteractiveTourModal({
  currentStepIndex,
  onNavigateStep,
  onRestartTour,
  onCloseTour
}) {
  // Placement position toggle ('top-right' | 'center')
  const [position, setPosition] = useState('top-right');

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onRestartTour();
    } else {
      onNavigateStep(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onNavigateStep(currentStepIndex - 1);
    }
  };

  // Class names based on position preference
  const containerClasses = position === 'top-right'
    ? 'fixed top-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-top-4 duration-300'
    : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200';

  const cardClasses = position === 'top-right'
    ? 'bg-white rounded-2xl shadow-xl border border-slate-200/90 p-5 space-y-4 font-sans text-slate-900 ring-1 ring-slate-950/5'
    : 'bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-md w-full p-6 space-y-4 font-sans text-slate-900 ring-1 ring-slate-950/5';

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        {/* Sleek Onboarding Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-orange-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Step {currentStep.step} of {TOUR_STEPS.length}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[150px]">
              {currentStep.flow}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setPosition(position === 'top-right' ? 'center' : 'top-right')}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition"
              title={position === 'top-right' ? 'Center on screen' : 'Dock to top-right'}
            >
              {position === 'top-right' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onCloseTour}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition"
              title="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Body Instruction */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{currentStep.title}</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed pl-5 font-medium">
            {currentStep.instruction}
          </p>
        </div>

        {/* Progress bar indicator */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-orange-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep.step) / TOUR_STEPS.length) * 100}%` }}
          ></div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition flex items-center space-x-1 border border-slate-200/70"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}
            <button
              onClick={onRestartTour}
              title="Restart Tour"
              className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-xs transition border border-slate-200/70"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center space-x-1.5 text-xs"
          >
            <span>{currentStep.nextLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
