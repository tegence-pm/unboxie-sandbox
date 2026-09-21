import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, OrderItem } from '../../types';
import { IncidentFormModal } from '../incidents/IncidentFormModal';
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
  Sparkles
} from 'lucide-react';
import { formatNaira, formatDate } from '../../utils/formatters';

interface OrderDetailPageProps {
  orderId: string;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId }) => {
  const { 
    getOrderById, 
    updateOrder, 
    sourceOrderItem, 
    vendors, 
    products, 
    packagingOptions,
    incidents, 
    setCurrentView,
    setActiveTab,
    setOrderSubTab 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Line-item sourcing state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Packaging sourcing state
  const [isEditingPackaging, setIsEditingPackaging] = useState(false);

  // Incident reporting modal
  const [incidentPrefill, setIncidentPrefill] = useState<{
    vendorId?: string;
    itemId?: string;
    itemName?: string;
  } | null>(null);

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

  // Get available suppliers for packaging
  const getAvailablePackagingVendors = () => {
    const pkg = packagingOptions.find(p => p.name === order.packagingName || p.id === 'pkg_1');
    if (pkg && pkg.linkedVendorIds.length > 0) {
      return vendors.filter(v => pkg.linkedVendorIds.includes(v.id));
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
            onClick={() => setIncidentPrefill({})}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report Incident</span>
          </button>

          {/* Update Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
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

      {/* 2-Column Info Grid */}
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
                  <button onClick={handleCopyOrderNumber} className="text-slate-400 hover:text-slate-700" title="Copy">
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

              {/* Packaging Sourcing with Selector */}
              <div className="sm:col-span-2 pt-2 sm:pt-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 block">Packaging Box Option</span>
                  <button
                    onClick={() => setIsEditingPackaging(!isEditingPackaging)}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700"
                  >
                    {isEditingPackaging ? 'Close' : 'Select / Change Box Supplier'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <Layers className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">
                      {order.packagingName || '10 inch Box (New Xmas Hamper)'}
                    </span>
                  </div>

                  {packagingVendor ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      Sourced: {packagingVendor.name}
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-700 font-semibold">
                      Box Supplier Unassigned
                    </span>
                  )}
                </div>

                {/* Packaging Supplier Quick Selector */}
                {isEditingPackaging && (
                  <div className="mt-2 p-3 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2 animate-fade-in">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                      Choose Supplier for Box:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getAvailablePackagingVendors().map(v => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            updateOrder(order.id, { packagingVendorId: v.id });
                            setIsEditingPackaging(false);
                            showToast(`✓ Packaging box sourced from ${v.name}`);
                          }}
                          className={`p-2 rounded-lg text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                            order.packagingVendorId === v.id
                              ? 'bg-white border-purple-600 text-purple-900 ring-1 ring-purple-600'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300'
                          }`}
                        >
                          <span className="truncate">{v.name}</span>
                          <span className="text-[10px] text-slate-400">Used {v.timesUsed || 0}x</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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

          {/* Incidents on this Order if any */}
          {orderIncidents.length > 0 && (
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Quality Incidents ({orderIncidents.length})
                </h4>
                <span className="text-xs font-bold font-heading text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md border border-rose-200">
                  Total Loss: {formatNaira(orderIncidents.reduce((sum, i) => sum + (i.cost || 0), 0))}
                </span>
              </div>

              <div className="space-y-2.5">
                {orderIncidents.map((inc, index) => (
                  <div key={inc.id} className="p-3.5 rounded-xl bg-white border border-rose-100 text-xs space-y-2 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">
                            #{index + 1} {inc.itemName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Vendor: <strong className="text-slate-800">{inc.vendorName}</strong>
                        </span>
                      </div>
                      <span className="font-bold font-heading text-rose-600 text-sm whitespace-nowrap">
                        {formatNaira(inc.cost)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {inc.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md font-semibold ${
                          inc.costCoveredBy === 'Vendor' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : inc.costCoveredBy === 'Unboxie'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          Covered by: {inc.costCoveredBy}
                        </span>

                        {inc.costCoveredBy === 'Split' && inc.costSplitDetails && (
                          <span className="text-slate-400">
                            (Vendor: {formatNaira(inc.costSplitDetails.vendorAmount)} / Unboxie: {formatNaira(inc.costSplitDetails.unboxieAmount)})
                          </span>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        inc.status === 'Resolved' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Bottom Table: Order Items & Sourcing Fulfillment */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-heading text-slate-900">
                Order Items & Sourcing Allocation
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                isFullySourced ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
              }`}>
                {sourcedItemsCount}/{order.items.length} Sourced
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Select the vendor you sourced each item from after checking availability offline.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search order items..."
              value={itemSearch}
              onChange={e => setItemSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ITEM</th>
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
                      {/* Item Thumbnail & Name */}
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
                              className="text-[11px] text-slate-400 hover:text-brand-600"
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
                            className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                              item.sourcingStatus === 'sourced'
                                ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                                : 'text-white bg-brand-500 hover:bg-brand-600 shadow-xs'
                            }`}
                          >
                            {isEditing ? 'Close Selector' : (item.sourcedVendorId ? 'Change Vendor' : 'Select Vendor')}
                          </button>
                          
                          {item.sourcedVendorId && (
                            <button
                              onClick={() => setIncidentPrefill({
                                vendorId: item.sourcedVendorId,
                                itemId: item.id,
                                itemName: item.name,
                              })}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                              title="Report item defect to vendor"
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
                                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
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
                                className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
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

      {/* Incident Form Modal */}
      <IncidentFormModal
        isOpen={!!incidentPrefill}
        onClose={() => setIncidentPrefill(null)}
        prefillOrderId={order.id}
        prefillVendorId={incidentPrefill?.vendorId}
        prefillItemId={incidentPrefill?.itemId}
        prefillItemName={incidentPrefill?.itemName}
      />

    </div>
  );
};
