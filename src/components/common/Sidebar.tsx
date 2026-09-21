import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Package, 
  Layers, 
  ShoppingCart, 
  ShieldAlert, 
  RotateCcw,
  Search,
  LayoutDashboard,
  Users,
  ChevronDown,
  LogOut,
  Gift
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    productSubTab, 
    setProductSubTab, 
    orderSubTab, 
    setOrderSubTab,
    vendors, 
    incidents,
    resetToDefaultData,
    setCurrentView
  } = useApp();

  const [menuSearch, setMenuSearch] = useState('');
  const [isOrdersOpen, setIsOrdersOpen] = useState(true);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(true);

  const activeVendorsCount = vendors.filter(v => v.status === 'Active').length;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 flex-shrink-0 select-none overflow-y-auto custom-scrollbar">
      <div>
        {/* Logo Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-7 w-auto" viewBox="0 0 220 54" fill="none">
              <path d="M107 14 C104 9, 99 7, 96 11 C93 15, 98 19, 105 17 Z" fill="#7B61FF"/>
              <path d="M113 14 C116 9, 121 7, 124 11 C127 15, 122 19, 115 17 Z" fill="#7B61FF"/>
              <text x="0" y="44" fontFamily="'Instrument Sans', sans-serif" fontSize="44" fontWeight="900" letterSpacing="-0.04em" fill="#FF4D24">
                Unb<tspan fill="#FF4D24">o</tspan>xie
              </text>
            </svg>
            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-orange-100 text-brand-700 rounded-md border border-brand-200">
              OP
            </span>
          </div>
          <span className="text-xs text-slate-300 font-mono">«</span>
        </div>

        {/* Filter menu search */}
        <div className="px-4 pt-3 pb-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter menu..."
              value={menuSearch}
              onChange={e => setMenuSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-3 space-y-4 text-xs">
          
          {/* GROUP 1: OPERATE */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5 block">
              OPERATE
            </span>

            <div className="space-y-0.5">
              {/* Overview (quick stats) */}
              <button
                onClick={() => {
                  setActiveTab('orders-incidents');
                  setOrderSubTab('orders');
                  setCurrentView({ type: 'order-list' });
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>Overview</span>
              </button>

              {/* Orders Group with Submenu (Orders, Incident, Pending carts) */}
              <div>
                <button
                  onClick={() => {
                    setIsOrdersOpen(!isOrdersOpen);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === 'orders-incidents'
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className={`w-4 h-4 ${activeTab === 'orders-incidents' ? 'text-brand-500' : 'text-slate-400'}`} />
                    <span>Orders</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOrdersOpen ? '' : '-rotate-90'}`} />
                </button>

                {isOrdersOpen && (
                  <div className="pl-9 pr-2 py-0.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveTab('orders-incidents');
                        setOrderSubTab('orders');
                        setCurrentView({ type: 'order-list' });
                      }}
                      className={`w-full text-left py-1.5 px-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'orders-incidents' && orderSubTab === 'orders'
                          ? 'text-brand-600 font-bold bg-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Orders
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('orders-incidents');
                        setOrderSubTab('incidents');
                        setCurrentView({ type: 'incident-list' });
                      }}
                      className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'orders-incidents' && orderSubTab === 'incidents'
                          ? 'text-rose-600 font-bold bg-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                        <span>Incident</span>
                      </div>
                      {incidents.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold">
                          {incidents.length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('orders-incidents');
                        setOrderSubTab('orders');
                        setCurrentView({ type: 'order-list' });
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-lg text-slate-500 hover:text-slate-900 font-medium"
                    >
                      Pending carts
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GROUP 2: CATALOGUE */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5 block">
              CATALOGUE
            </span>

            <div className="space-y-0.5">
              {/* Products Item */}
              <div>
                <button
                  onClick={() => {
                    setActiveTab('products-packaging');
                    setProductSubTab('products');
                    setCurrentView({ type: 'product-list' });
                    setIsCatalogueOpen(!isCatalogueOpen);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === 'products-packaging' && productSubTab === 'products'
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Products</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCatalogueOpen ? '' : '-rotate-90'}`} />
                </button>

                {isCatalogueOpen && (
                  <div className="pl-9 pr-2 py-0.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveTab('products-packaging');
                        setProductSubTab('products');
                        setCurrentView({ type: 'product-list' });
                      }}
                      className={`w-full text-left py-1 px-2 rounded-md font-medium transition-colors ${
                        activeTab === 'products-packaging' && productSubTab === 'products'
                          ? 'text-brand-600 font-bold bg-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Product catalogue
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('products-packaging');
                        setProductSubTab('products');
                        setCurrentView({ type: 'product-list' });
                      }}
                      className="w-full text-left py-1 px-2 rounded-md text-slate-500 hover:text-slate-900 font-medium"
                    >
                      Categories
                    </button>
                  </div>
                )}
              </div>

              {/* Packaging Options */}
              <button
                onClick={() => {
                  setActiveTab('products-packaging');
                  setProductSubTab('packaging');
                  setCurrentView({ type: 'packaging-list' });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors ${
                  activeTab === 'products-packaging' && productSubTab === 'packaging'
                    ? 'bg-purple-50 text-purple-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4 text-purple-500" />
                <span>Packaging Options</span>
              </button>

              {/* Giftboxes */}
              <button
                onClick={() => {
                  setActiveTab('products-packaging');
                  setProductSubTab('packaging');
                  setCurrentView({ type: 'packaging-list' });
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
              >
                <Gift className="w-4 h-4 text-slate-400" />
                <span>Giftboxes</span>
              </button>
            </div>
          </div>

          {/* GROUP 3: PEOPLE */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5 block">
              PEOPLE
            </span>

            <div className="space-y-0.5">
              {/* Vendors */}
              <button
                onClick={() => {
                  setActiveTab('vendors');
                  setCurrentView({ type: 'vendor-list' });
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'vendors'
                    ? 'bg-brand-50 text-brand-600 shadow-xs border border-brand-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className={`w-4 h-4 ${activeTab === 'vendors' ? 'text-brand-500' : 'text-slate-400'}`} />
                  <span>Vendors</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'vendors' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {activeVendorsCount}
                </span>
              </button>

              {/* Customers */}
              <button
                onClick={() => {
                  setActiveTab('orders-incidents');
                  setOrderSubTab('orders');
                  setCurrentView({ type: 'order-list' });
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>Customers</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <button
          onClick={() => {
            if (confirm('Reset all vendors, products, packaging, and orders to initial demo seed data?')) {
              resetToDefaultData();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Demo Seed</span>
        </button>

        {/* User Card matching screenshot (admin tech+admin@tege...) */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-orange-100 text-brand-700 font-black flex items-center justify-center text-xs flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">admin</p>
              <p className="text-[10px] text-slate-400 truncate">tech+admin@tege...</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1" title="Logout">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
