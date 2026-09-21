import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderList } from './OrderList';
import { OrderDetailPage } from './OrderDetailPage';
import { IncidentList } from '../incidents/IncidentList';

export const OrderIncidentModule: React.FC = () => {
  const { orderSubTab, currentView } = useApp();

  // If viewing a specific order detail, render OrderDetailPage
  if (currentView.type === 'order-detail') {
    return <OrderDetailPage orderId={currentView.id} />;
  }

  return (
    <div className="space-y-6">
      {orderSubTab === 'orders' ? <OrderList /> : <IncidentList />}
    </div>
  );
};
