import React from 'react';
import { Play, ArrowRight, ArrowLeft, RotateCcw, Sparkles, X, CheckCircle2 } from 'lucide-react';

export const TOUR_STEPS = [
  {
    step: 1,
    flow: 'Flow 1: Product Discounts',
    mode: 'admin',
    tab: 'products',
    subMode: '',
    title: 'Step 1: Admin Product Discount',
    instruction: 'In Admin Products, click "Edit / Discount" on Jo Malone, toggle Discount ON (20%), and click "Save Changes".',
    nextLabel: 'Continue to Customer Storefront ➔',
  },
  {
    step: 2,
    flow: 'Flow 1: Product Discounts',
    mode: 'customer',
    tab: '',
    subMode: 'customer',
    title: 'Step 2: Customer Discount Impact',
    instruction: 'On the Customer Storefront, see how the "20% OFF" badge, ₦185,000 strikethrough, and ₦148,000 selling price appear.',
    nextLabel: 'Go to Admin Delivery Settings ➔',
  },
  {
    step: 3,
    flow: 'Flow 2: Delivery Locations',
    mode: 'admin',
    tab: 'logistics',
    subMode: '',
    title: 'Step 3: Admin Delivery Areas & Fees',
    instruction: 'In Admin Delivery Locations, view Lagos delivery areas (Gbagada ₦2,000, VI ₦3,000) or add a new delivery location.',
    nextLabel: 'Test Customer Checkout ➔',
  },
  {
    step: 4,
    flow: 'Flow 2: Delivery Locations',
    mode: 'customer',
    tab: '',
    subMode: 'checkout',
    title: 'Step 4: Dynamic Customer Checkout',
    instruction: 'In Customer Checkout, select Lagos ➔ Gbagada (₦2,000). Watch the Order Summary dynamically recalculate the total to ₦57,000.',
    nextLabel: 'Go to Admin Orders ➔',
  },
  {
    step: 5,
    flow: 'Flow 3: Partner Assignment',
    mode: 'admin',
    tab: 'orders',
    subMode: '',
    title: 'Step 5: Admin Orders (Unassigned)',
    instruction: 'In Admin Orders, click "View Order" on unassigned Order #483925 and assign GIG Logistics as the delivery partner.',
    nextLabel: 'Advance Order Status ➔',
  },
  {
    step: 6,
    flow: 'Flow 3: Status Progression',
    mode: 'admin',
    tab: 'orders',
    subMode: '',
    title: 'Step 6: Sequential Status Progression',
    instruction: 'Once assigned, click "Advance to Next Step" to move order status step-by-step (Assigned ➔ Picked Up ➔ Out for Delivery ➔ Delivered).',
    nextLabel: 'Leave Customer Review ➔',
  },
  {
    step: 7,
    flow: 'Flow 4: Customer Feedback',
    mode: 'customer',
    tab: '',
    subMode: 'feedback',
    feedbackSubMode: 'invitation',
    title: 'Step 7: Customer Review Invitation',
    instruction: 'On the Customer Review page for Order #483925, click "Leave a Review", select 5 stars, write feedback, and click Submit.',
    nextLabel: 'See Admin Feedback ➔',
  },
  {
    step: 8,
    flow: 'Flow 4: Admin Feedback Loop',
    mode: 'admin',
    tab: 'feedback',
    subMode: '',
    title: 'Step 8: Admin Feedback Dashboard',
    instruction: 'In Admin Feedback, view the customer review list. Click "View Details" on Eyimofe\'s review to see full review details linked directly to Order #483925.',
    nextLabel: 'Tour Complete! Restart 🔄',
  },
];

export default function InteractiveTourModal({
  currentStepIndex,
  onNavigateStep,
  onRestartTour,
  onCloseTour
}) {
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

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-xl w-[92%] z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-orange-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentStep.flow}
            </span>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              Step {currentStep.step} of {TOUR_STEPS.length}
            </span>
          </div>

          <button 
            onClick={onCloseTour}
            className="text-slate-400 hover:text-white p-1 rounded-md transition"
            title="Close Tour Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Prompt */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>{currentStep.title}</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed pl-6">
            {currentStep.instruction}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-lg text-xs border border-slate-700 transition flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}
            <button
              onClick={onRestartTour}
              title="Restart Tour"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center space-x-2 text-xs"
          >
            <span>{currentStep.nextLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
