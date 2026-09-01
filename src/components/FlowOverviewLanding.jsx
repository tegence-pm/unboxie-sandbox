import React from 'react';
import { 
  Tag, 
  MapPin, 
  Truck, 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag, 
  Eye, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function FlowOverviewLanding({ onSelectFlow }) {
  const flows = [
    {
      id: 'flow1',
      title: '1. Product Discounts Flow',
      subtitle: 'Admin Product Discounts ➔ Customer Storefront & Product Details',
      badge: 'Admin ➔ Customer',
      color: 'border-orange-200 bg-orange-50/40 text-orange-600',
      icon: Tag,
      description: 'Admin applies percentage or fixed discounts with frontend validation (>100% or >price). The customer storefront immediately reflects the discount badge (e.g. 20% OFF), strikethrough original price, and bold discounted selling price.',
      actionText: 'Launch Flow 1 (Edit Discount & See Customer Impact)',
      target: 'admin-products'
    },
    {
      id: 'flow2',
      title: '2. Delivery Locations & Fees Flow',
      subtitle: 'Admin Delivery Locations ➔ Dynamic Customer Checkout Fees',
      badge: 'Admin ➔ Checkout',
      color: 'border-blue-200 bg-blue-50/40 text-blue-600',
      icon: MapPin,
      description: 'Admin configures state-specific delivery locations and fees (e.g. Lagos -> Gbagada ₦2k, VI ₦3k). At checkout, selecting a state and area dynamically updates delivery options and recalculates the total order price.',
      actionText: 'Launch Flow 2 (Add Location & Test Dynamic Checkout)',
      target: 'admin-locations'
    },
    {
      id: 'flow3',
      title: '3. Logistics Partners & Sequential Tracking',
      subtitle: 'Admin Logistics Partners ➔ Order Assignment & Step-by-Step Status',
      badge: 'Admin ➔ Orders',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-600',
      icon: Truck,
      description: 'Admin manages delivery partners (Single State vs Interstate rules). On the Order page, assigning a partner unlocks shipment tracking, allowing step-by-step sequential status advancement without skipping steps.',
      actionText: 'Launch Flow 3 (Assign Partner & Track Order Status)',
      target: 'admin-orders'
    },
    {
      id: 'flow4',
      title: '4. Customer Feedback & Admin Linking',
      subtitle: 'Customer Review Submission ➔ Linked Admin Feedback Dashboard',
      badge: 'Customer ➔ Admin',
      color: 'border-purple-200 bg-purple-50/40 text-purple-600',
      icon: MessageSquare,
      description: 'Delivered order triggers customer review invitation. Customer rates 1-5 stars, writes text review, and uploads photos. Submitted review links directly back to the order details on the Admin Feedback dashboard.',
      actionText: 'Launch Flow 4 (Submit Review & View Admin Feedback)',
      target: 'customer-feedback'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 font-sans text-slate-900 space-y-10">
      {/* Hero Welcome Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-orange-100/80 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Unboxie Rebuild — Interactive Feature Screens & Flows</span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Complete Product & Logistics Flow Prototype
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          Welcome! This prototype demonstrates how Unboxie’s admin back office and customer storefront connect end-to-end. Explore all 4 core product flows below.
        </p>
      </div>

      {/* Grid of 4 Interactive Flows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flows.map((flow) => {
          const Icon = flow.icon;
          return (
            <div
              key={flow.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${flow.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {flow.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition">
                    {flow.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {flow.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {flow.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onSelectFlow(flow.id)}
                  className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-xs"
                >
                  <span>{flow.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Quick Jump Actions Footer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Ready to explore full Admin or Storefront views?</h3>
          <p className="text-xs text-slate-400 mt-0.5">Switch directly between Admin Back Office and Customer Experience.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onSelectFlow('admin')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enter Admin Back Office</span>
          </button>
          <button
            onClick={() => onSelectFlow('customer')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Enter Customer Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
}
