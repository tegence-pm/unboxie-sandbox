import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductList } from './ProductList';
import { PackagingList } from './PackagingList';
import { ProductDetailPage } from './ProductDetailPage';
import { PackagingDetailPage } from './PackagingDetailPage';
import { Package, Layers } from 'lucide-react';

export const ProductPackagingModule: React.FC = () => {
  const { 
    productSubTab, 
    setProductSubTab, 
    products, 
    packagingOptions,
    currentView,
    setCurrentView 
  } = useApp();

  // If viewing a detail page, render it directly
  if (currentView.type === 'product-detail') {
    return <ProductDetailPage productId={currentView.id} />;
  }

  if (currentView.type === 'packaging-detail') {
    return <PackagingDetailPage packagingId={currentView.id} />;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Heading & Sub-Nav Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
            Products & Packaging Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage catalog items, packaging box options, and multi-vendor sourcing supply chains.
          </p>
        </div>

        {/* Segmented Sub-tab Switcher */}
        <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/60 self-start sm:self-auto">
          <button
            onClick={() => {
              setProductSubTab('products');
              setCurrentView({ type: 'product-list' });
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              productSubTab === 'products'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className={`w-3.5 h-3.5 ${productSubTab === 'products' ? 'text-brand-500' : 'text-slate-500'}`} />
            <span>Gift Products</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              productSubTab === 'products' ? 'bg-brand-50 text-brand-600 font-bold' : 'bg-slate-300 text-slate-700'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => {
              setProductSubTab('packaging');
              setCurrentView({ type: 'packaging-list' });
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              productSubTab === 'packaging'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${productSubTab === 'packaging' ? 'text-purple-500' : 'text-slate-500'}`} />
            <span>Packaging Options</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              productSubTab === 'packaging' ? 'bg-purple-50 text-purple-600 font-bold' : 'bg-slate-300 text-slate-700'
            }`}>
              {packagingOptions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sub Module Content */}
      {productSubTab === 'products' ? <ProductList /> : <PackagingList />}

    </div>
  );
};
