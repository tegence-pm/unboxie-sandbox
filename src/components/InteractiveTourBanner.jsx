import React from 'react';
import { Play, ArrowRight, ArrowLeft, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export const TOUR_STEPS = [
  {
    step: 1,
    flow: 'Flow 1: Product Discounts',
    mode: 'admin',
    tab: 'products',
    subMode: '',
    title: '1. Admin Product Discount',
    instruction: 'Click "Edit / Discount" on Jo Malone, enable Discount (20%), and click Save.',
    nextLabel: 'See Customer Storefront ➔',
  },
  {
    step: 2,
    flow: 'Flow 1: Product Discounts',
    mode: 'customer',
    tab: '',
    subMode: 'customer',
    title: '2. Customer Discount View',
    instruction: 'Notice the "20% OFF" badge, ₦185,000 strikethrough, and ₦148,000 discounted price.',
    nextLabel: 'Go to Admin Delivery Settings ➔',
  },
  {
    step: 3,
    flow: 'Flow 2: Delivery Locations',
    mode: 'admin',
    tab: 'logistics',
    subMode: '',
    title: '3. Admin Delivery Areas & Fees',
    instruction: 'View Lagos door delivery areas (Gbagada ₦2,000, VI ₦3,000) or add a new location.',
    nextLabel: 'Test Customer Checkout ➔',
  },
  {
    step: 4,
    flow: 'Flow 2: Delivery Locations',
    mode: 'customer',
    tab: '',
    subMode: 'checkout',
    title: '4. Dynamic Customer Checkout',
    instruction: 'Select Lagos ➔ Gbagada (₦2,000). Notice how the Order Summary updates total to ₦57,000.',
    nextLabel: 'Go to Admin Orders ➔',
  },
  {
    step: 5,
    flow: 'Flow 3: Partner Assignment',
    mode: 'admin',
    tab: 'orders',
    subMode: '',
    title: '5. Admin Orders (Unassigned)',
    instruction: 'Click "View Order" on unassigned order #483925 and assign GIG Logistics.',
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
    instruction: 'Click "View Details" on Eyimofe\'s review to see full review linked directly to Order #483925.',
    nextLabel: 'Restart Tour 🔄',
  },
];

export default function InteractiveTourBanner({
  currentStepIndex,
  onNavigateStep,
  onRestartTour
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
    <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Step Indicator & Title */}
        <div className="flex items-center space-x-3">
          <span className="bg-orange-500 text-white font-bold px-2.5 py-1 rounded text-[11px] uppercase tracking-wider">
            Guided Tour • Step {currentStep.step} of {TOUR_STEPS.length}
          </span>
          <div>
            <div className="font-bold text-white text-xs">{currentStep.title}</div>
            <div className="text-[11px] text-slate-300 font-medium">{currentStep.instruction}</div>
          </div>
        </div>

        {/* Tour Navigation Controls */}
        <div className="flex items-center space-x-2">
          {currentStepIndex > 0 && (
            <button
              onClick={handlePrev}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition flex items-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Prev</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition flex items-center space-x-1.5 text-xs"
          >
            <span>{currentStep.nextLabel}</span>
          </button>

          <button
            onClick={onRestartTour}
            title="Restart Guided Tour"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
