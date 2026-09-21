import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NewOrderModal } from './NewOrderModal';
import { OrderStatus } from '../../types';
import { 
  Search, 
  ChevronRight, 
  Calendar, 
  Plus, 
  ChevronDown
} from 'lucide-react';
import { formatNaira, formatDate } from '../../utils/formatters';

const TABS: { id: string; label: string; filterStatus?: OrderStatus | 'all' }[] = [
  { id: 'all', label: 'All orders', filterStatus: 'all' },
  { id: 'placed', label: 'Placed', filterStatus: 'Placed' },
  { id: 'confirmed', label: 'Confirmed', filterStatus: 'Order Confirmed' },
  { id: 'ready', label: 'Ready', filterStatus: 'Ready' },
  { id: 'dispatched', label: 'Dispatched', filterStatus: 'Order Dispatched' },
  { id: 'delivered', label: 'Delivered', filterStatus: 'Order Delivered' },
  { id: 'completed', label: 'Completed', filterStatus: 'Completed' },
  { id: 'cancelled', label: 'Cancelled', filterStatus: 'Cancelled' },
];

export const OrderList: React.FC = () => {
  const { 
    orders, 
    setCurrentView 
  } = useApp();

  const [activeTabId, setActiveTabId] = useState('all');
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const currentTab = TABS.find(t => t.id === activeTabId);

  const filteredOrders = (orders || []).filter(order => {
    const orderNum = order.orderNumber || '';
    const custName = order.customerName || '';
    const custEmail = order.customerEmail || '';
    const recipName = order.recipientName || '';

    const matchesSearch = 
      orderNum.toLowerCase().includes(search.toLowerCase()) ||
      custName.toLowerCase().includes(search.toLowerCase()) ||
      custEmail.toLowerCase().includes(search.toLowerCase()) ||
      recipName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      !currentTab || 
      currentTab.filterStatus === 'all' || 
      order.status === currentTab.filterStatus;

    const matchesPayment = paymentFilter === 'all' || (order.paymentStatus || 'Payment Successful') === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter(item => item !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const getStatusDotColor = (status: OrderStatus) => {
    switch (status) {
      case 'Order Delivered':
      case 'Completed':
        return 'bg-emerald-500';
      case 'Order Confirmed':
      case 'Ready':
        return 'bg-blue-500';
      case 'Order Dispatched':
        return 'bg-amber-500';
      case 'Cancelled':
        return 'bg-rose-500';
      default:
        return 'bg-brand-500';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
            Order queue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            All orders · {filteredOrders.length} matching orders
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Status Tabs Navigation */}
      <div className="border-b border-slate-200 overflow-x-auto custom-scrollbar">
        <div className="flex items-center space-x-6 min-w-max">
          {TABS.map(tab => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'text-brand-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search by order number, buyer, or email */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order number, buyer, or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Payment and Dates Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              <option value="all">All payments</option>
              <option value="Payment Successful">Payment Successful</option>
              <option value="Pending">Payment Pending</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Select dates</span>
          </button>
        </div>
      </div>

      {/* ORDERS QUEUE TABLE VIEW */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <h3 className="text-sm font-bold text-slate-800">No orders in this queue</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No orders matched your active status filter or search parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded text-brand-500 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3 font-semibold">Order</th>
                  <th className="py-3.5 px-3 font-semibold">Buyer</th>
                  <th className="py-3.5 px-3 font-semibold">Recipient</th>
                  <th className="py-3.5 px-3 font-semibold">Items</th>
                  <th className="py-3.5 px-3 font-semibold">Delivery</th>
                  <th className="py-3.5 px-3 font-semibold">Amount</th>
                  <th className="py-3.5 px-3 font-semibold">Payment</th>
                  <th className="py-3.5 px-3 font-semibold">Status</th>
                  <th className="py-3.5 px-3 font-semibold">Placed</th>
                  <th className="py-3.5 pr-4 w-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const itemsCount = (order.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setCurrentView({ type: 'order-detail', id: order.id })}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 pl-4 pr-2" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleSelectOrder(order.id, e as any)}
                          className="rounded text-brand-500 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>

                      {/* Order Code */}
                      <td className="py-3.5 px-3 font-bold text-slate-900 group-hover:text-brand-600 transition-colors whitespace-nowrap">
                        {order.orderNumber || 'UBX-N/A'}
                      </td>

                      {/* Buyer */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{order.customerName || 'Customer'}</span>
                        <span className="text-[11px] text-slate-400 block">{order.customerEmail || '—'}</span>
                      </td>

                      {/* Recipient */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">{order.recipientName || order.customerName || 'Recipient'}</span>
                        <span className="text-[11px] text-slate-400 block">{order.recipientPhone || '—'}</span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                      </td>

                      {/* Delivery */}
                      <td className="py-3.5 px-3 text-slate-700 capitalize whitespace-nowrap">
                        {(order.deliveryMode || 'Delivery').toLowerCase()}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {formatNaira(order.totalAmount || 0)}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-800 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          <span>{order.paymentStatus || 'Payment Successful'}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-800 font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusDotColor(order.status)}`} />
                          <span>{order.status || 'Placed'}</span>
                        </span>
                      </td>

                      {/* Placed Date */}
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                        {formatDate(order.datePlaced)}
                      </td>

                      {/* Action Chevron */}
                      <td className="py-3.5 pr-4 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
      />

    </div>
  );
};
