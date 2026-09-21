import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Package, 
  ShoppingCart, 
  RotateCcw, 
  AlertCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    vendors, 
    orders, 
    incidents,
    resetToDefaultData 
  } = useApp();

  const activeVendorsCount = vendors.filter(v => v.status === 'Active').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending Sourcing').length;
  const openIncidentsCount = incidents.filter(i => i.status === 'Open').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <svg className="h-8 w-auto" viewBox="0 0 220 54" fill="none">
                  {/* Ribbon Accent */}
                  <path d="M107 14 C104 9, 99 7, 96 11 C93 15, 98 19, 105 17 Z" fill="#7B61FF"/>
                  <path d="M113 14 C116 9, 121 7, 124 11 C127 15, 122 19, 115 17 Z" fill="#7B61FF"/>
                  {/* Wordmark */}
                  <text x="0" y="44" fontFamily="'Instrument Sans', sans-serif" fontSize="44" fontWeight="900" letterSpacing="-0.04em" fill="#FF4D24">
                    Unb<tspan fill="#FF4D24">o</tspan>xie
                  </text>
                </svg>
                <span className="ml-2.5 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-orange-100 text-brand-700 rounded-md border border-brand-200">
                  Ops Admin
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setActiveTab('vendors')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'vendors'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Building2 className={`w-4 h-4 ${activeTab === 'vendors' ? 'text-brand-500' : 'text-slate-500'}`} />
                <span>Vendors</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'vendors' ? 'bg-brand-50 text-brand-600 font-bold' : 'bg-slate-200 text-slate-600'
                }`}>
                  {activeVendorsCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('products-packaging')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'products-packaging'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Package className={`w-4 h-4 ${activeTab === 'products-packaging' ? 'text-brand-500' : 'text-slate-500'}`} />
                <span>Products & Packaging</span>
              </button>

              <button
                onClick={() => setActiveTab('orders-incidents')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'orders-incidents'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <ShoppingCart className={`w-4 h-4 ${activeTab === 'orders-incidents' ? 'text-brand-500' : 'text-slate-500'}`} />
                <span>Orders & Incidents</span>
                {(pendingOrdersCount > 0 || openIncidentsCount > 0) && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    {pendingOrdersCount + openIncidentsCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset all vendors, products, orders, and incidents back to standard demo data?')) {
                  resetToDefaultData();
                }
              }}
              title="Reset to original demo seed data"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg ${
              activeTab === 'vendors' ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-600'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Vendors ({activeVendorsCount})
          </button>
          <button
            onClick={() => setActiveTab('products-packaging')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg ${
              activeTab === 'products-packaging' ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-600'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Catalog
          </button>
          <button
            onClick={() => setActiveTab('orders-incidents')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg ${
              activeTab === 'orders-incidents' ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-600'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Orders & Issues
          </button>
        </div>

      </div>
    </header>
  );
};
