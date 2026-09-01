import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import AdminOrders from './components/AdminOrders';
import Flow1Discounts from './components/Flow1Discounts';
import Flow2Logistics from './components/Flow2Logistics';
import Flow3Checkout from './components/Flow3Checkout';
import Flow4Feedback from './components/Flow4Feedback';
import FlowOverviewLanding from './components/FlowOverviewLanding';
import InteractiveTourModal, { TOUR_STEPS } from './components/InteractiveTourModal';

import {
  initialProducts,
  initialDoorLocations,
  initialPickupLocations,
  initialPartners,
  initialShipments,
  initialFeedback
} from './data/initialData';

import { Eye, Home, Play, Sparkles } from 'lucide-react';

export default function App() {
  // Global Shared State
  const [products, setProducts] = useState(initialProducts);
  const [doorLocations, setDoorLocations] = useState(initialDoorLocations);
  const [pickupLocations, setPickupLocations] = useState(initialPickupLocations);
  const [partners, setPartners] = useState(initialPartners);
  const [shipments, setShipments] = useState(initialShipments);
  const [feedbackList, setFeedbackList] = useState(initialFeedback);

  // Guided Tour Modal State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Navigation Modes: 'overview' | 'admin' | 'customer'
  const [mainMode, setMainMode] = useState('overview'); 
  const [adminTab, setAdminTab] = useState('products'); // 'orders' | 'products' | 'logistics' | 'feedback'
  const [logisticsSubTab, setLogisticsSubTab] = useState('locations'); // 'locations' | 'partners'
  const [customerSubMode, setCustomerSubMode] = useState('customer'); // 'customer' | 'customer-detail' | 'checkout' | 'feedback'
  const [feedbackCustomerViewMode, setFeedbackCustomerViewMode] = useState('invitation'); // 'invitation' | 'form' | 'submitted'
  const [selectedProductId, setSelectedProductId] = useState('prod-1');

  // State handlers for state updates
  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAddDoorLocation = (stateName, newLoc) => {
    const current = doorLocations[stateName] || [];
    setDoorLocations({
      ...doorLocations,
      [stateName]: [...current, newLoc]
    });
  };

  const handleAddPickupLocation = (stateName, newHub) => {
    const current = pickupLocations[stateName] || [];
    setPickupLocations({
      ...pickupLocations,
      [stateName]: [...current, newHub]
    });
  };

  const handleAddPartner = (newPartner) => {
    setPartners([...partners, newPartner]);
  };

  const handleAssignPartnerToOrder = (orderId, partnerName) => {
    setShipments(shipments.map(s => {
      if (s.orderId === orderId) {
        return {
          ...s,
          partner: partnerName,
          status: 'Assigned',
          history: [...s.history, { status: `Assigned to ${partnerName}`, time: 'Just now' }]
        };
      }
      return s;
    }));
  };

  const handleUpdateShipmentStatus = (shipmentId, newStatus) => {
    setShipments(shipments.map(s => {
      if (s.id === shipmentId || s.orderId === shipmentId) {
        return {
          ...s,
          status: newStatus,
          history: [...s.history, { status: newStatus, time: 'Just now' }]
        };
      }
      return s;
    }));
  };

  const handleAddFeedback = (newFb) => {
    setFeedbackList([newFb, ...feedbackList]);
  };

  // Tour Step Navigation
  const navigateToTourStep = (stepIdx) => {
    setIsTourActive(true);
    setTourStepIndex(stepIdx);
    const stepConfig = TOUR_STEPS[stepIdx] || TOUR_STEPS[0];

    setMainMode(stepConfig.mode);
    if (stepConfig.mode === 'admin') {
      setAdminTab(stepConfig.tab);
      if (stepConfig.tab === 'logistics') {
        setLogisticsSubTab('locations');
      }
    } else if (stepConfig.mode === 'customer') {
      setCustomerSubMode(stepConfig.subMode || 'customer');
      if (stepConfig.feedbackSubMode) {
        setFeedbackCustomerViewMode(stepConfig.feedbackSubMode);
      }
    }
  };

  const startGuidedTour = () => {
    navigateToTourStep(0);
  };

  const restartGuidedTour = () => {
    navigateToTourStep(0);
  };

  const closeGuidedTour = () => {
    setIsTourActive(false);
  };

  // Handle completing checkout flow
  const handleCompleteCheckout = (orderData) => {
    const newOrderId = `#${Math.floor(100000 + Math.random() * 900000)}`;
    const newShipment = {
      id: `SH-${Date.now().toString().slice(-5)}`,
      orderId: newOrderId,
      customer: 'Eyimofe (New Checkout)',
      customerPhone: '08123456789',
      deliveryType: orderData.deliveryMethod === 'door' ? 'Door Delivery' : 'Pickup',
      location: orderData.deliveryMethod === 'door' ? `${orderData.area}, ${orderData.doorState}` : orderData.hub,
      address: orderData.deliveryMethod === 'door' ? '15 Example Street' : 'Hub Address',
      fee: orderData.fee,
      partner: 'Pending Assignment',
      status: 'Order Ready',
      date: 'Just now',
      history: [{ status: 'Order Ready', time: 'Just now' }]
    };
    setShipments([newShipment, ...shipments]);

    // Jump to Admin Orders page to view and assign partner!
    setMainMode('admin');
    setAdminTab('orders');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Prominent Floating Tour Modal when active */}
      {isTourActive && (
        <InteractiveTourModal
          currentStepIndex={tourStepIndex}
          onNavigateStep={navigateToTourStep}
          onRestartTour={restartGuidedTour}
          onCloseTour={closeGuidedTour}
        />
      )}

      {/* OVERVIEW LANDING HEADER */}
      {mainMode === 'overview' && (
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => setMainMode('overview')}
                className="bg-orange-500 text-white font-extrabold px-3 py-1 rounded-md text-lg tracking-tight cursor-pointer"
              >
                Unboxie
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded border border-slate-200">
                Interactive Prototype Overview
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs font-semibold">
              <button
                onClick={startGuidedTour}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition font-bold flex items-center space-x-1.5 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Guided Tour Modal</span>
              </button>
              <button
                onClick={() => setMainMode('admin')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg transition"
              >
                Admin Platform
              </button>
              <button
                onClick={() => setMainMode('customer')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg transition border border-slate-200"
              >
                Customer Storefront
              </button>
            </div>
          </div>
        </header>
      )}

      {/* CUSTOMER STOREFRONT HEADER */}
      {mainMode === 'customer' && (
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => setCustomerSubMode('customer')} 
                className="bg-orange-500 text-white font-extrabold px-3 py-1 rounded-md text-lg tracking-tight cursor-pointer"
              >
                Unboxie
              </div>
              <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2.5 py-0.5 rounded border border-orange-200">
                Customer Storefront
              </span>
            </div>

            <div className="flex items-center space-x-6 text-xs font-semibold text-slate-700">
              <button 
                onClick={() => setCustomerSubMode('customer')} 
                className={`hover:text-orange-600 ${customerSubMode === 'customer' || customerSubMode === 'customer-detail' ? 'text-orange-600 border-b-2 border-orange-500 pb-0.5' : ''}`}
              >
                Discover Gifts
              </button>
              <button 
                onClick={() => setCustomerSubMode('checkout')} 
                className={`hover:text-orange-600 ${customerSubMode === 'checkout' ? 'text-orange-600 border-b-2 border-orange-500 pb-0.5' : ''}`}
              >
                Checkout & Delivery
              </button>
              <button 
                onClick={() => { setCustomerSubMode('feedback'); setFeedbackCustomerViewMode('invitation'); }} 
                className={`hover:text-orange-600 ${customerSubMode === 'feedback' ? 'text-orange-600 border-b-2 border-orange-500 pb-0.5' : ''}`}
              >
                Leave Gift Review
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {!isTourActive && (
                <button
                  onClick={startGuidedTour}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Guided Tour</span>
                </button>
              )}
              <button
                onClick={() => setMainMode('overview')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition border border-slate-200 flex items-center space-x-1.5"
              >
                <Home className="w-3.5 h-3.5 text-slate-500" />
                <span>Landing</span>
              </button>
              <button
                onClick={() => setMainMode('admin')}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow-xs flex items-center space-x-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* MODE 1: OVERVIEW LANDING PAGE */}
      {mainMode === 'overview' && (
        <main className="flex-1">
          <FlowOverviewLanding
            onStartTour={startGuidedTour}
            onJumpToStep={navigateToTourStep}
          />
        </main>
      )}

      {/* MODE 2: ADMIN BACK OFFICE */}
      {mainMode === 'admin' && (
        <AdminLayout
          currentTab={adminTab}
          setCurrentTab={setAdminTab}
          onSwitchToCustomer={() => setMainMode('customer')}
        >
          <div className="mb-4 flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMainMode('overview')}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg transition border border-slate-200/60"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>← Landing Overview</span>
              </button>
              {!isTourActive && (
                <button
                  onClick={startGuidedTour}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-lg transition flex items-center space-x-1 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Guided Tour</span>
                </button>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Admin View Mode: <strong className="text-slate-700 capitalize">{adminTab}</strong>
            </span>
          </div>

          {/* ORDERS TAB */}
          {adminTab === 'orders' && (
            <AdminOrders
              shipments={shipments}
              partners={partners}
              feedbackList={feedbackList}
              onUpdateShipmentStatus={handleUpdateShipmentStatus}
              onAssignPartner={handleAssignPartnerToOrder}
            />
          )}

          {/* PRODUCTS TAB */}
          {adminTab === 'products' && (
            <Flow1Discounts
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onSwitchToCustomer={(subMode) => {
                setMainMode('customer');
                setCustomerSubMode(subMode || 'customer');
              }}
              viewMode="admin"
              selectedProductId={selectedProductId}
              setSelectedProductId={setSelectedProductId}
            />
          )}

          {/* LOGISTICS TAB */}
          {adminTab === 'logistics' && (
            <Flow2Logistics
              doorLocations={doorLocations}
              pickupLocations={pickupLocations}
              partners={partners}
              onAddDoorLocation={handleAddDoorLocation}
              onAddPickupLocation={handleAddPickupLocation}
              onAddPartner={handleAddPartner}
              activeSubTab={logisticsSubTab}
              setActiveSubTab={setLogisticsSubTab}
            />
          )}

          {/* ADMIN FEEDBACK TAB */}
          {adminTab === 'feedback' && (
            <Flow4Feedback
              feedbackList={feedbackList}
              onAddFeedback={handleAddFeedback}
              onSwitchToAdmin={() => setMainMode('admin')}
              onSwitchToCustomer={(subMode) => {
                setMainMode('customer');
                setCustomerSubMode(subMode || 'customer');
              }}
              viewMode="admin-list"
              setViewMode={() => {}}
              onViewOrderDetails={() => {
                setAdminTab('orders');
              }}
            />
          )}
        </AdminLayout>
      )}

      {/* MODE 3: CUSTOMER STOREFRONT */}
      {mainMode === 'customer' && (
        <main className="flex-1">
          {customerSubMode === 'customer' && (
            <Flow1Discounts
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onSwitchToCustomer={(subMode) => setCustomerSubMode(subMode)}
              viewMode="customer"
              selectedProductId={selectedProductId}
              setSelectedProductId={setSelectedProductId}
            />
          )}

          {customerSubMode === 'customer-detail' && (
            <Flow1Discounts
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onSwitchToCustomer={(subMode) => setCustomerSubMode(subMode)}
              viewMode="customer-detail"
              selectedProductId={selectedProductId}
              setSelectedProductId={setSelectedProductId}
            />
          )}

          {customerSubMode === 'checkout' && (
            <Flow3Checkout
              doorLocations={doorLocations}
              pickupLocations={pickupLocations}
              onCompleteCheckout={handleCompleteCheckout}
              onSwitchToAdmin={() => {
                setMainMode('admin');
                setAdminTab('orders');
              }}
            />
          )}

          {customerSubMode === 'feedback' && (
            <Flow4Feedback
              feedbackList={feedbackList}
              onAddFeedback={handleAddFeedback}
              onSwitchToAdmin={() => setMainMode('admin')}
              onSwitchToCustomer={(subMode) => setCustomerSubMode(subMode)}
              viewMode={feedbackCustomerViewMode}
              setViewMode={setFeedbackCustomerViewMode}
              onViewOrderDetails={() => {
                setMainMode('admin');
                setAdminTab('orders');
              }}
            />
          )}
        </main>
      )}
    </div>
  );
}
