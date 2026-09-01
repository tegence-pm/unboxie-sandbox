import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tag, 
  Calendar, 
  Truck, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function AdminLayout({ 
  currentTab, 
  setCurrentTab, 
  children,
  onSwitchToCustomer 
}) {
  const navItems = [
    { id: 'orders', label: 'Orders & Logistics', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'logistics', label: 'Delivery Settings', icon: Truck },
    { id: 'feedback', label: 'Customer Feedback', icon: MessageSquare },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'occasions', label: 'Occasions', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header bar */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 text-white font-bold px-2.5 py-1 rounded-md text-base tracking-tight shadow-xs">
              Unboxie
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Admin Platform
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onSwitchToCustomer}
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition border border-slate-200/70"
            >
              <span>Customer Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Ops Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto my-6 px-6 gap-8">
        {/* Admin Sidebar Navigation */}
        <aside className="w-60 shrink-0 bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 h-fit sticky top-20">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
            Menu
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-orange-50/80 text-orange-600 font-bold border border-orange-200/70'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-orange-500" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-white rounded-xl border border-slate-200/80 shadow-xs p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
