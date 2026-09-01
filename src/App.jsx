import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import AdminOrders from './components/AdminOrders';
import Flow1Discounts from './components/Flow1Discounts';
import Flow2Logistics from './components/Flow2Logistics';
import Flow3Checkout from './components/Flow3Checkout';
import Flow4Feedback from './components/Flow4Feedback';
import GuidedFlowBar from './components/GuidedFlowBar';

import {
  initialProducts,
  initialDoorLocations,
  initialPickupLocations,
  initialPartners,
  initialShipments,
  initialFeedback
} from './data/initialData';

import { ShoppingBag, Eye } from 'lucide-react';

export default function App() {
  // Global Shared State
  const [products, setProducts] = useState(initialProducts);
  const [doorLocations, setDoorLocations] = useState(initialDoorLocations);
  const [pickupLocations, setPickupLocations] = useState(initialPickupLocations);
  const [partners, setPartners] = useState(initialPartners);
  const [shipments, setShipments] = useState(initialShipments);
  const [feedbackList, setFeedbackList] = useState(initialFeedback);

  // Navigation State
  const [mainMode, setMainMode] = useState('admin'); // 'admin' | 'customer'
  const [adminTab, setAdminTab] = useState('orders'); // 'orders' | 'products' | 'logistics' | 'feedback' | ...
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

  // Jump preset helper from top Guided Flow Bar
  const handleJumpToFlow = (flowKey) => {
    if (flowKey === 'flow1') {
      setMainMode('admin');
      setAdminTab('products');
    } else if (flowKey === 'flow2') {
      setMainMode('admin');
      setAdminTab('orders');
    } else if (flowKey === 'flow3') {
      setMainMode('customer');
      setCustomerSubMode('checkout');
    } else if (flowKey === 'flow4') {
      setMainMode('customer');
      setCustomerSubMode('feedback');
      setFeedbackCustomerViewMode('invitation');
    }
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Guided Flow Preset Bar */}
      <GuidedFlowBar onJumpToFlow={handleJumpToFlow} />

      {/* CUSTOMER STOREFRONT HEADER (Shown when in Customer Mode) */}
      {mainMode === 'customer' && (
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => setCustomerSubMode('customer')} 
                className="bg-orange-500 text-white font-extrabold px-3 py-1 rounded text-xl tracking-tight cursor-pointer"
              >
                Unboxie
              </div>
              <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2.5 py-0.5 rounded border border-orange-200">
                Customer Storefront
              </span>
            </div>

            {/* Customer Header Navigation */}
            <div className="flex items-center space-x-6 text-sm font-semibold text-gray-700">
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

            {/* Switch to Admin Button */}
            <button
              onClick={() => setMainMode('admin')}
              className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-md transition shadow-sm flex items-center space-x-2"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Switch to Admin Panel</span>
            </button>
          </div>
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADMIN MODE VIEW */}
      {/* ------------------------------------------------------------- */}
      {mainMode === 'admin' && (
        <AdminLayout
          currentTab={adminTab}
          setCurrentTab={setAdminTab}
          onSwitchToCustomer={() => setMainMode('customer')}
        >
          {/* ORDERS TAB WITH EMBEDDED PARTNER ASSIGNMENT & SHIPMENT TRACKING */}
          {adminTab === 'orders' && (
            <AdminOrders
              shipments={shipments}
              partners={partners}
              feedbackList={feedbackList}
              onUpdateShipmentStatus={handleUpdateShipmentStatus}
              onAssignPartner={handleAssignPartnerToOrder}
            />
          )}

          {/* FLOW 1: PRODUCTS TAB */}
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

          {/* FLOW 2: LOGISTICS TAB (LOCATIONS & PARTNERS) */}
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

          {/* FLOW 4: ADMIN FEEDBACK TAB */}
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

          {/* DASHBOARD / OTHER PLACEHOLDER TABS */}
          {['dashboard', 'categories', 'occasions'].includes(adminTab) && (
            <div className="py-12 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <h2 className="text-lg font-bold text-gray-800 capitalize">{adminTab} Module</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                This module is active. For key engineering features, please select 
                <button onClick={() => setAdminTab('orders')} className="text-orange-600 font-bold ml-1 hover:underline">Orders</button>, 
                <button onClick={() => setAdminTab('products')} className="text-orange-600 font-bold ml-1 hover:underline">Products</button>, 
                <button onClick={() => setAdminTab('logistics')} className="text-orange-600 font-bold ml-1 hover:underline">Logistics</button>, or 
                <button onClick={() => setAdminTab('feedback')} className="text-orange-600 font-bold ml-1 hover:underline">Feedback</button>.
              </p>
            </div>
          )}
        </AdminLayout>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CUSTOMER MODE VIEW */}
      {/* ------------------------------------------------------------- */}
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
