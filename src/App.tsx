import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { VendorList } from './components/vendors/VendorList';
import { VendorDetailPage } from './components/vendors/VendorDetailPage';
import { VendorFormPage } from './components/vendors/VendorFormPage';
import { ProductPackagingModule } from './components/products/ProductPackagingModule';
import { OrderIncidentModule } from './components/orders/OrderIncidentModule';

const MainContent: React.FC = () => {
  const { currentView, activeTab } = useApp();

  // Route based on activeTab and currentView
  if (activeTab === 'vendors') {
    if (currentView.type === 'vendor-detail') {
      return <VendorDetailPage vendorId={currentView.id} />;
    }
    if (currentView.type === 'vendor-form') {
      return <VendorFormPage vendorId={currentView.id} />;
    }
    return <VendorList />;
  }

  if (activeTab === 'products-packaging') {
    return <ProductPackagingModule />;
  }

  if (activeTab === 'orders-incidents') {
    return <OrderIncidentModule />;
  }

  return <VendorList />;
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-row font-sans antialiased selection:bg-brand-100 selection:text-brand-900">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen custom-scrollbar">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MainContent />
        </main>
      </div>
    </div>
  );
};

export default App;
