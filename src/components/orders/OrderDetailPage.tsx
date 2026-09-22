import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, OrderItem, Incident } from '../../types';
import { IncidentFormModal } from '../incidents/IncidentFormModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Truck, 
  Gift, 
  Package, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  ChevronDown,
  Building2,
  ExternalLink,
  Layers,
  Sparkles,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { formatNaira, formatDate, formatRelativeTime } from '../../utils/formatters';

interface OrderDetailPageProps {
  orderId: string;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId }) => {
  const { 
    getOrderById, 
    updateOrder, 
    sourceOrderItem, 
    deleteIncident,
    vendors, 
    products, 
    packagingOptions,
    incidents, 
    setCurrentView,
    setActiveTab,
    setOrderSubTab 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [activeTabLocal, setActiveTabLocal] = useState<'products' | 'packaging' | 'incidents'>('products');
  const [itemSearch, setItemSearch] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Line-item sourcing state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Incident reporting modal
  const [incidentPrefill, setIncidentPrefill] = useState<{
    vendorId?: string;
    itemId?: string;
    itemName?: string;
  } | null>(null);
  const [incidentToEdit, setIncidentToEdit] = useState<Incident | null>(null);
  const [incidentToDelete, setIncidentToDelete] = useState<Incident | null>(null);

  const order = getOrderById(orderId);
  if (!order) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-sm">Order not found.</p>
        <button
          onClick={() => {
            setActiveTab('orders-incidents');
            setOrderSubTab('orders');
            setCurrentView({ type: 'order-list' });
          }}
          className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Back to Order Queue
        </button>
      </div>
    );
  }

  const orderIncidents = incidents.filter(i => i.orderId === order.id);
  const totalOrderIncidentCost = orderIncidents.reduce((sum, i) => sum + (i.cost || 0), 0);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => setActiveToast(null), 4000);
  };

  const handleSelectVendor = (item: OrderItem, vendorId: string, vendorName: string) => {
    sourceOrderItem(order.id, item.id, vendorId);
    showToast(`✓ Sourced "${item.name}" from ${vendorName}. Vendor sourcing history updated!`);
    setEditingItemId(null);
  };

  // Find linked available alternative suppliers for a product
  const getAvailableVendorsForItem = (item: OrderItem) => {
    if (item.productId) {
      const prod = products.find(p => p.id === item.productId);
      if (prod && prod.linkedVendorIds.length > 0) {
        return vendors.filter(v => prod.linkedVendorIds.includes(v.id));
      }
    }
    return vendors;
  };

  // Get matching packaging option details and available suppliers
  const matchedPackaging = packagingOptions.find(p => p.name === order.packagingName || p.id === 'pkg_1');
  const getAvailablePackagingVendors = () => {
    if (matchedPackaging && matchedPackaging.linkedVendorIds.length > 0) {
      const linked = vendors.filter(v => matchedPackaging.linkedVendorIds.includes(v.id));
      if (linked.length > 0) return linked;
    }
    return vendors.filter(v => v.type === 'Customization Vendor' || v.categories.includes('Boxes'));
  };

  const filteredItems = (order.items || []).filter(it => 
    (it.name || '').toLowerCase().includes(itemSearch.toLowerCase())
  );

  const totalProductLines = (order.items || []).filter(it => it.itemType === 'product').length || (order.items || []).length;
  const sourcedItemsCount = (order.items || []).filter(it => it.sourcingStatus === 'sourced').length;
  const isFullySourced = (order.items || []).length > 0 && sourcedItemsCount === (order.items || []).length;

  const packagingVendor = order.packagingVendorId ? vendors.find(v => v.id === order.packagingVendorId) : null;
  const availablePackagingVendors = getAvailablePackagingVendors();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Dynamic Toast Feedback */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-modal flex items-center gap-3 text-xs font-semibold animate-fade-in border border-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center flex-shrink-0 font-bold">
            ✓
          </div>
          <span>{activeToast}</span>
        </div>
      )}

      {/* Top Header Row with Status button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('orders-incidents');
              setOrderSubTab('orders');
              setCurrentView({ type: 'order-list' });
            }}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Back to Order queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
                Order {order.orderNumber}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isFullySourced 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isFullySourced ? '✓ All Items Sourced' : `${sourcedItemsCount}/${order.items.length} Sourced`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed {formatDate(order.datePlaced)} · {(order.deliveryMode || 'Delivery').toLowerCase()} fulfillment
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto relative">
          <button
            onClick={() => {
              setIncidentToEdit(null);
              setIncidentPrefill({});
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report Incident</span>
          </button>

          {/* Update Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Status: {order.status}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-1.5 shadow-modal border border-slate-200 z-50 animate-fade-in text-xs">
                {(['Placed', 'Order Confirmed', 'Ready', 'Order Dispatched', 'Order Delivered', 'Completed', 'Cancelled'] as OrderStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrder(order.id, { status: st });
                      setIsStatusDropdownOpen(false);
                      showToast(`Order status updated to "${st}"`);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                      order.status === st ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sourcing Workflow Ops Guidance Callout */}
      {!isFullySourced && (
        <div className="p-4 rounded-2xl bg-orange-50/80 border border-brand-200 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-brand-500 text-white flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-slate-900">Ops Sourcing Action Required</h4>
            <p className="text-slate-600 mt-0.5">
              Check the pre-linked alternative vendors for each line item below. Once you confirm availability offline, 
              select the vendor used. The system will automatically update the vendor's sourcing volume and last sourced timestamp.
            </p>
          </div>
        </div>
      )}

      {/* 4 Top KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 block">Order total</span>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">
            {formatNaira(order.totalAmount || 0)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Customer charge</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 block">Items</span>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">
            {totalProductLines}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {totalProductLines === 1 ? '1 product line' : `${totalProductLines} product lines`}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 block">Delivery fee</span>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">
            {formatNaira(order.deliveryFee || 500)}
          </div>
          <span className="text-[11px] font-bold text-slate-600 mt-0.5 block uppercase tracking-wider">
            {order.deliveryMode || 'DELIVERY'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 block">Ordered</span>
          <div className="text-xl font-bold font-heading text-slate-900 mt-1 truncate">
            {formatDate(order.datePlaced)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Order creation date</span>
        </div>
      </div>

      {/* 2-Column Info Grid: Customer, Recipient, Delivery Partner & Gift Message */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Customer & Order + Recipient */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Customer & order card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold font-heading text-slate-900">
              Customer & order
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs divide-y sm:divide-y-0 divide-slate-100">
              <div className="flex justify-between sm:block">
                <span className="text-slate-400 block mb-0.5">Customer</span>
                <span className="font-semibold text-slate-900">{order.customerName}</span>
              </div>

              <div className="flex justify-between sm:block pt-2 sm:pt-0">
                <span className="text-slate-400 block mb-0.5">Email</span>
                <span className="font-semibold text-slate-900">{order.customerEmail}</span>
              </div>

              <div className="flex justify-between sm:block pt-2 sm:pt-0">
                <span className="text-slate-400 block mb-0.5">Order number</span>
                <span className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  {order.orderNumber}
                  <button onClick={handleCopyOrderNumber} className="text-slate-400 hover:text-slate-700 cursor-pointer" title="Copy">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </span>
              </div>

              <div className="flex justify-between sm:block pt-2 sm:pt-0">
                <span className="text-slate-400 block mb-0.5">Ordered</span>
                <span className="font-semibold text-slate-900">{formatDate(order.datePlaced)}</span>
              </div>

              <div className="flex justify-between sm:block pt-2 sm:pt-0">
                <span className="text-slate-400 block mb-0.5">Delivery mode</span>
                <span className="font-bold text-slate-900 uppercase">{order.deliveryMode}</span>
              </div>

              <div className="flex justify-between sm:block pt-2 sm:pt-0">
                <span className="text-slate-400 block mb-0.5">Sender identity</span>
                <span className="font-semibold text-slate-900">{order.senderIdentity}</span>
              </div>
            </div>
          </div>

          {/* Recipient card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold font-heading text-slate-900">
              Recipient
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Name</span>
                <span className="font-semibold text-slate-900">{order.recipientName}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Email</span>
                <span className="font-semibold text-slate-500">{order.recipientEmail || 'Not provided'}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Phone</span>
                <span className="font-semibold text-slate-900">{order.recipientPhone}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Address</span>
                <span className="font-semibold text-slate-900">{order.deliveryAddress}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">City</span>
                <span className="font-semibold text-slate-900">{order.city || 'Lagos'}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">State</span>
                <span className="font-semibold text-slate-900">{order.state || 'Lagos'}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Postcode</span>
                <span className="font-semibold text-slate-500">{order.postcode || 'Not provided'}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Country</span>
                <span className="font-semibold text-slate-900">{order.country || 'Nigeria'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Delivery Partner & Gift Message */}
        <div className="space-y-5">
          
          {/* Delivery Partner */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-slate-900">
                  Delivery partner
                </h3>
                <span className="text-[11px] text-slate-400">Assigned fulfillment driver</span>
              </div>
            </div>

            {order.deliveryPartner ? (
              <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                <p className="font-bold text-slate-900">{order.deliveryPartner.name}</p>
                <p className="text-slate-500">{order.deliveryPartner.role}</p>
                <p className="font-semibold text-slate-800">{order.deliveryPartner.phone}</p>
                {order.deliveryPartner.email && (
                  <p className="text-slate-500">{order.deliveryPartner.email}</p>
                )}
                {order.deliveryPartner.location && (
                  <p className="text-slate-400 text-[11px] pt-1">{order.deliveryPartner.location}</p>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 pt-1">
                Dispatch driver not yet assigned.
              </div>
            )}
          </div>

          {/* Gift Message */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-slate-900">
                  Gift message
                </h3>
                <span className="text-[11px] text-slate-400">Included on custom greeting card</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <blockquote className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{order.giftMessage || 'No personalized gift card message requested.'}"
              </blockquote>
            </div>
          </div>

        </div>

      </div>

      {/* Main Tabbed Fulfillment Section: Products, Packaging, Incidents */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        
        {/* Tab Headers Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 pt-4 bg-slate-50/50 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTabLocal('products')}
              className={`flex items-center gap-2 pb-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTabLocal === 'products'
                  ? 'border-brand-500 text-brand-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({order.items.length})</span>
            </button>

            <button
              onClick={() => setActiveTabLocal('packaging')}
              className={`flex items-center gap-2 pb-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTabLocal === 'packaging'
                  ? 'border-brand-500 text-brand-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Packaging Option</span>
              {order.packagingVendorId ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Packaging Sourced" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-500" title="Box Supplier Pending" />
              )}
            </button>

            <button
              onClick={() => setActiveTabLocal('incidents')}
              className={`flex items-center gap-2 pb-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTabLocal === 'incidents'
                  ? 'border-brand-500 text-brand-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Incidents ({orderIncidents.length})</span>
            </button>
          </div>

          {activeTabLocal === 'incidents' && (
            <button
              onClick={() => {
                setIncidentToEdit(null);
                setIncidentPrefill({});
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Incident</span>
            </button>
          )}
        </div>

        {/* Tab 1: Products */}
        {activeTabLocal === 'products' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-brand-500" />
                  Order Products & Sourcing Allocation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select the vendor you sourced each product from after confirming availability.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search order products..."
                  value={itemSearch}
                  onChange={e => setItemSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs"
                />
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">PRODUCT</th>
                    <th className="py-3 px-4">CUSTOMISATION</th>
                    <th className="py-3 px-4">QTY</th>
                    <th className="py-3 px-4">UNIT PRICE</th>
                    <th className="py-3 px-4">LINE TOTAL</th>
                    <th className="py-3 px-4">SOURCING VENDOR</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map(item => {
                    const availableVendors = getAvailableVendorsForItem(item);
                    const sourcedVendor = item.sourcedVendorId 
                      ? vendors.find(v => v.id === item.sourcedVendorId) 
                      : null;
                    const isEditing = editingItemId === item.id;

                    return (
                      <React.Fragment key={item.id}>
                        <tr className={`transition-colors ${
                          item.sourcingStatus === 'sourced' ? 'hover:bg-slate-50/60' : 'bg-amber-50/20 hover:bg-amber-50/40'
                        }`}>
                          {/* Product Thumbnail & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0 shadow-2xs"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-orange-50 text-brand-600 flex items-center justify-center flex-shrink-0 border border-orange-100">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-slate-900 text-xs block">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {availableVendors.length === 1 
                                    ? '1 supplier linked' 
                                    : `${availableVendors.length} alternative suppliers linked`}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Customisation */}
                          <td className="py-3.5 px-4 text-slate-500">
                            {item.customisation || 'None'}
                          </td>

                          {/* Quantity */}
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {item.quantity}
                          </td>

                          {/* Unit Price */}
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {formatNaira(item.unitPrice)}
                          </td>

                          {/* Line Total */}
                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {formatNaira(item.lineTotal || (item.unitPrice * item.quantity))}
                          </td>

                          {/* Sourcing Vendor Column */}
                          <td className="py-3.5 px-4">
                            {sourcedVendor ? (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                  <span>{sourcedVendor.name}</span>
                                </span>
                                <button
                                  onClick={() => {
                                    setActiveTab('vendors');
                                    setCurrentView({ type: 'vendor-detail', id: sourcedVendor.id });
                                  }}
                                  className="text-[11px] text-slate-400 hover:text-brand-600 cursor-pointer"
                                  title="View vendor profile"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Pending Sourcing</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingItemId(isEditing ? null : item.id)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                  item.sourcingStatus === 'sourced'
                                    ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                                    : 'text-white bg-brand-500 hover:bg-brand-600 shadow-xs'
                                }`}
                              >
                                {isEditing ? 'Close Selector' : (item.sourcedVendorId ? 'Change Vendor' : 'Select Vendor')}
                              </button>
                              
                              {item.sourcedVendorId && (
                                <button
                                  onClick={() => {
                                    setIncidentToEdit(null);
                                    setIncidentPrefill({
                                      vendorId: item.sourcedVendorId,
                                      itemId: item.id,
                                      itemName: item.name,
                                    });
                                  }}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  title="Report product defect to vendor"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Sourcing Vendor Selector Drawer */}
                        {isEditing && (
                          <tr className="bg-brand-50/40">
                            <td colSpan={7} className="p-4 border-y border-brand-200">
                              <div className="space-y-3 bg-white p-4 rounded-xl border border-brand-200 shadow-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Building2 className="w-4 h-4 text-brand-500" />
                                    <span>Select Vendor Used for "{item.name}":</span>
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    Click a vendor to record sourcing immediately
                                  </span>
                                </div>

                                {/* Linked Vendors List */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                  {availableVendors.map(v => {
                                    const isCurrentlySourced = item.sourcedVendorId === v.id;
                                    return (
                                      <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => handleSelectVendor(item, v.id, v.name)}
                                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                                          isCurrentlySourced
                                            ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                                            : 'bg-white border-slate-200 hover:border-brand-400 hover:bg-brand-50/30'
                                        }`}
                                      >
                                        <div className="min-w-0 pr-2">
                                          <span className="text-xs font-bold text-slate-900 group-hover:text-brand-600 block truncate">
                                            {v.name}
                                          </span>
                                          <span className="text-[10px] text-slate-500 block">
                                            {v.type} • {v.cityLga || v.state}
                                          </span>
                                          <span className="text-[10px] text-brand-600 font-semibold mt-0.5 block">
                                            Used {v.timesUsed || 0} times
                                          </span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                          isCurrentlySourced 
                                            ? 'border-emerald-500 bg-emerald-500 text-white' 
                                            : 'border-slate-300 group-hover:border-brand-500'
                                        }`}>
                                          {isCurrentlySourced ? <Check className="w-3 h-3" /> : <span className="text-[10px] font-bold text-brand-600 opacity-0 group-hover:opacity-100">+</span>}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                  <span className="text-[11px] text-slate-400">
                                    Sourcing updates the vendor's fulfillment volume and last active date automatically.
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setEditingItemId(null)}
                                    className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Packaging Option */}
        {activeTabLocal === 'packaging' && (
          <div className="p-6 space-y-6">
            
            {/* Packaging Box Summary Card */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 border border-purple-200">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold font-heading text-slate-900">
                      {order.packagingName || '10 inch Box (New Xmas Hamper)'}
                    </h3>
                    {packagingVendor ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Sourced: {packagingVendor.name}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Supplier Unassigned</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {matchedPackaging?.description || 'Custom rigid packaging box for curated hamper assembly.'}
                  </p>
                  {matchedPackaging?.dimensions && (
                    <span className="text-[11px] text-purple-700 font-semibold mt-1 inline-block bg-white px-2 py-0.5 rounded-md border border-purple-200">
                      Dimensions: {matchedPackaging.dimensions}
                    </span>
                  )}
                </div>
              </div>

              {/* Action: Report issue on packaging */}
              {packagingVendor && (
                <button
                  type="button"
                  onClick={() => {
                    setIncidentToEdit(null);
                    setIncidentPrefill({
                      vendorId: packagingVendor.id,
                      itemName: order.packagingName || 'Packaging Box Option',
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors self-start md:self-auto cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Report Packaging Defect</span>
                </button>
              )}
            </div>

            {/* Packaging Vendor Selection Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-500" />
                  <span>Select / Change Box Supplier</span>
                </h4>
                <span className="text-xs text-slate-400">
                  {availablePackagingVendors.length} Supplier option(s) available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availablePackagingVendors.map(v => {
                  const isCurrentlySelected = order.packagingVendorId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        updateOrder(order.id, { packagingVendorId: v.id });
                        showToast(`✓ Packaging box sourced from ${v.name}`);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                        isCurrentlySelected
                          ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 shadow-2xs'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 block truncate">
                            {v.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {v.type} • {v.cityLga || v.state}
                        </span>
                        <span className="text-[10px] text-purple-700 font-semibold mt-1 block">
                          Used {v.timesUsed || 0} times
                        </span>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isCurrentlySelected
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-slate-300 group-hover:border-purple-500'
                      }`}>
                        {isCurrentlySelected ? <Check className="w-3 h-3" /> : <span className="text-[10px] font-bold text-purple-600 opacity-0 group-hover:opacity-100">+</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Incidents */}
        {activeTabLocal === 'incidents' && (
          <div className="p-6 space-y-4">
            
            {/* Header & Quality Loss Sum */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Order Incidents & Defect Log ({orderIncidents.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quality defects and supplier handoff issues recorded for this order.
                </p>
              </div>

              {orderIncidents.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl">
                    Total Quality Loss: {formatNaira(totalOrderIncidentCost)}
                  </span>
                </div>
              )}
            </div>

            {orderIncidents.length === 0 ? (
              <div className="p-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-bold text-slate-800">No Incidents Recorded</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  All products and packaging for this order were sourced without reported defects or fulfillment delays.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIncidentToEdit(null);
                    setIncidentPrefill({});
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Log New Incident</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">AFFECTED PRODUCT</th>
                      <th className="py-3 px-4">RESPONSIBLE VENDOR</th>
                      <th className="py-3 px-4">DESCRIPTION</th>
                      <th className="py-3 px-4">COST (₦)</th>
                      <th className="py-3 px-4">COVERED BY</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderIncidents.map(inc => (
                      <tr key={inc.id} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* Affected Product */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block">
                            {inc.itemName}
                          </span>
                          {inc.issueType && (
                            <span className="inline-block text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md mt-0.5">
                              {inc.issueType}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {formatRelativeTime(inc.createdAt)}
                          </span>
                        </td>

                        {/* Responsible Vendor */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setActiveTab('vendors');
                              setCurrentView({ type: 'vendor-detail', id: inc.vendorId });
                            }}
                            className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-brand-600 cursor-pointer"
                          >
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{inc.vendorName}</span>
                          </button>
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-slate-600 line-clamp-2" title={inc.description}>
                            {inc.description}
                          </p>
                        </td>

                        {/* Cost */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-bold font-heading text-rose-600">
                          {formatNaira(inc.cost)}
                        </td>

                        {/* Cost Covered By */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                            inc.costCoveredBy === 'Vendor' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {inc.costCoveredBy}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            inc.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              inc.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`} />
                            <span>{inc.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setIncidentToEdit(inc);
                                setIncidentPrefill({});
                              }}
                              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Incident"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setIncidentToDelete(inc)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Incident"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Incident Form Modal */}
      <IncidentFormModal
        isOpen={!!incidentPrefill || !!incidentToEdit}
        onClose={() => {
          setIncidentPrefill(null);
          setIncidentToEdit(null);
        }}
        incidentToEdit={incidentToEdit}
        prefillOrderId={order.id}
        prefillVendorId={incidentPrefill?.vendorId}
        prefillItemId={incidentPrefill?.itemId}
        prefillItemName={incidentPrefill?.itemName}
      />

      {/* Delete Incident Confirmation Modal */}
      <ConfirmModal
        isOpen={!!incidentToDelete}
        onClose={() => setIncidentToDelete(null)}
        onConfirm={() => {
          if (incidentToDelete) {
            deleteIncident(incidentToDelete.id);
            setIncidentToDelete(null);
            showToast('✓ Incident record deleted successfully');
          }
        }}
        title="Delete Incident Record"
        message={`Are you sure you want to delete the incident record for "${incidentToDelete?.itemName}"? This will update vendor reliability stats accordingly.`}
        confirmText="Delete Incident"
        variant="danger"
      />

    </div>
  );
};
