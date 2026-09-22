import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { IncidentFormModal } from '../incidents/IncidentFormModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Package, 
  Layers, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  ExternalLink,
  CheckCircle2,
  Clock,
  ShoppingCart,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { formatNaira, formatRelativeTime, formatDate } from '../../utils/formatters';

interface VendorDetailPageProps {
  vendorId: string;
}

export const VendorDetailPage: React.FC<VendorDetailPageProps> = ({ vendorId }) => {
  const { 
    getVendorById, 
    getVendorProducts, 
    getVendorPackaging, 
    getVendorOrders, 
    getVendorIncidents, 
    getVendorPerformance,
    toggleVendorStatus,
    deleteVendor,
    setCurrentView,
    setActiveTab,
    setProductSubTab,
    setOrderSubTab
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'products' | 'orders' | 'incidents' | 'overview'>('products');
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = useState(false);

  const vendor = getVendorById(vendorId);
  if (!vendor) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-sm">Vendor not found.</p>
        <button
          onClick={() => setCurrentView({ type: 'vendor-list' })}
          className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Return to Vendor List
        </button>
      </div>
    );
  }

  const products = getVendorProducts(vendor.id);
  const packaging = getVendorPackaging(vendor.id);
  const orders = getVendorOrders(vendor.id);
  const incidents = getVendorIncidents(vendor.id);
  const performance = getVendorPerformance(vendor.id);

  const cleanPhone = vendor.phone?.replace(/[^0-9+]/g, '');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Top Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView({ type: 'vendor-list' })}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Back to Vendors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
                {vendor.name}
              </h1>
              <Badge
                variant={vendor.status === 'Active' ? 'success' : 'neutral'}
                dot
                size="md"
              >
                {vendor.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-700">{vendor.type}</span>
              <span>•</span>
              <span>{vendor.source} Channel</span>
              <span>•</span>
              <span>Joined {formatDate(vendor.createdAt)}</span>
            </p>
          </div>
        </div>

        {/* Action buttons with Status Toggle Switch */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Status Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={vendor.status === 'Active'}
            onClick={() => setIsToggleStatusModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs group cursor-pointer"
            title={vendor.status === 'Active' ? 'Click to mark as Inactive' : 'Click to mark as Active'}
          >
            <span className={`text-xs font-semibold ${vendor.status === 'Active' ? 'text-slate-800' : 'text-slate-500'}`}>
              {vendor.status === 'Active' ? 'Active' : 'Inactive'}
            </span>
            <div
              className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                vendor.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                  vendor.status === 'Active' ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          <button
            onClick={() => setCurrentView({ type: 'vendor-form', id: vendor.id })}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200/60 rounded-xl transition-colors shadow-2xs"
            title="Delete Vendor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Structured KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Sourced Items */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Times Sourced</span>
            <div className="p-2 rounded-xl bg-orange-50 text-brand-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading text-slate-900">
              {performance.totalSourcedItems}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
              <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">Last: <strong className="text-slate-700">{formatRelativeTime(vendor.lastUsedDate)}</strong></span>
            </p>
          </div>
        </div>

        {/* Issue Rate: (Total Incidents ÷ Total Sourced Items) × 100 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Issue Rate</span>
            <div className={`p-2 rounded-xl ${
              performance.issueRate === 0 
                ? 'bg-emerald-50 text-emerald-600' 
                : performance.issueRate <= 10 
                ? 'bg-amber-50 text-amber-600' 
                : 'bg-rose-50 text-rose-600'
            }`}>
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold font-heading ${
              performance.issueRate === 0 
                ? 'text-emerald-700' 
                : performance.issueRate <= 10 
                ? 'text-amber-700' 
                : 'text-rose-600'
            }`}>
              {performance.issueRate}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1 truncate" title={`(${performance.issueCount} incidents ÷ ${performance.totalSourcedItems} items) × 100`}>
              {performance.issueCount} incident{performance.issueCount === 1 ? '' : 's'} / {performance.totalSourcedItems} items
            </p>
          </div>
        </div>

        {/* Reliability / Trust Score: 100% - Issue Rate */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trust Score</span>
            <div className={`p-2 rounded-xl ${
              performance.reliabilityScore >= 90 
                ? 'bg-emerald-50 text-emerald-600' 
                : performance.reliabilityScore >= 75 
                ? 'bg-amber-50 text-amber-600' 
                : 'bg-rose-50 text-rose-600'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold font-heading ${
              performance.reliabilityScore >= 90 
                ? 'text-emerald-700' 
                : performance.reliabilityScore >= 75 
                ? 'text-amber-700' 
                : 'text-rose-600'
            }`}>
              {performance.reliabilityScore}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {performance.issueCount === 0 ? 'Flawless track record' : `${performance.issueRate}% defect rate`}
            </p>
          </div>
        </div>

        {/* Total Quality Loss */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quality Loss</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading text-rose-600">
              {formatNaira(performance.totalIssueCost)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              Across {incidents.length} issue{incidents.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {/* Cost Liability */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Liability Split</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1 text-xs font-bold">
            <div className="text-emerald-700 flex justify-between gap-1">
              <span className="truncate">Vendor:</span>
              <span className="whitespace-nowrap">{formatNaira(performance.costCoveredByVendor)}</span>
            </div>
            <div className="text-rose-600 flex justify-between gap-1">
              <span className="truncate">Unboxie:</span>
              <span className="whitespace-nowrap">{formatNaira(performance.costCoveredByUnboxie)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 pt-4 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTabLocal('products')}
              className={`flex items-center gap-2 pb-3.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'products'
                  ? 'border-brand-500 text-brand-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Supplied Catalog Items ({products.length + packaging.length})</span>
            </button>

            <button
              onClick={() => setActiveTabLocal('orders')}
              className={`flex items-center gap-2 pb-3.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'orders'
                  ? 'border-brand-500 text-brand-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Order Sourcing History ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTabLocal('incidents')}
              className={`flex items-center gap-2 pb-3.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'incidents'
                  ? 'border-brand-500 text-brand-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Quality Incidents ({incidents.length})</span>
            </button>

            <button
              onClick={() => setActiveTabLocal('overview')}
              className={`flex items-center gap-2 pb-3.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-brand-500 text-brand-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Contact & Overview</span>
            </button>
          </div>

          {activeTab === 'incidents' && (
            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Incident</span>
            </button>
          )}
        </div>

        {/* Tab 1: Products & Packaging (Table View) */}
        {activeTab === 'products' && (
          <div className="p-6 space-y-6">
            {/* Gift Products Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-brand-500" />
                  Gift Products Supplied ({products.length})
                </h3>
                <button
                  onClick={() => {
                    setActiveTab('products-packaging');
                    setProductSubTab('products');
                    setCurrentView({ type: 'product-list' });
                  }}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Link Products in Catalog →
                </button>
              </div>

              {products.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                  No gift products currently linked to this vendor.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">PRODUCT</th>
                        <th className="py-3 px-4">CATEGORIES</th>
                        <th className="py-3 px-4">ESTIMATED PRICE</th>
                        <th className="py-3 px-4">ADDED ON</th>
                        <th className="py-3 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map(prod => (
                        <tr 
                          key={prod.id}
                          className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                          onClick={() => {
                            setActiveTab('products-packaging');
                            setProductSubTab('products');
                            setCurrentView({ type: 'product-detail', id: prod.id });
                          }}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {prod.sampleImage ? (
                                <img
                                  src={prod.sampleImage}
                                  alt={prod.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-brand-500 flex-shrink-0">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors block truncate">
                                  {prod.name}
                                </span>
                                {prod.description && (
                                  <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                                    {prod.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {prod.categories.map(cat => (
                                <span key={cat} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-900">
                            {prod.basePrice ? formatNaira(prod.basePrice) : '—'}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                            {formatDate(prod.createdAt)}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                              <span>View Product</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Packaging Options Table */}
            {packaging.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  Packaging Options Supplied ({packaging.length})
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">PACKAGING OPTION</th>
                        <th className="py-3 px-4">DIMENSIONS / SPECS</th>
                        <th className="py-3 px-4">ADDED ON</th>
                        <th className="py-3 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {packaging.map(pkg => (
                        <tr 
                          key={pkg.id}
                          className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                          onClick={() => {
                            setActiveTab('products-packaging');
                            setProductSubTab('packaging');
                            setCurrentView({ type: 'packaging-detail', id: pkg.id });
                          }}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {pkg.sampleImage ? (
                                <img
                                  src={pkg.sampleImage}
                                  alt={pkg.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                                  <Layers className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors block">
                                  {pkg.name}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-purple-700 font-medium">
                            {pkg.dimensions || '—'}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                            {formatDate(pkg.createdAt)}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700">
                              <span>View Packaging</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Order Sourcing History */}
        {activeTab === 'orders' && (
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                No orders have sourced items from this vendor yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items Sourced</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4">Date Placed</th>
                      <th className="py-3 px-4 text-right">Order Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(({ order, items }) => (
                      <tr 
                        key={order.id}
                        onClick={() => {
                          setActiveTab('orders-incidents');
                          setOrderSubTab('orders');
                          setCurrentView({ type: 'order-detail', id: order.id });
                        }}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-brand-600">{order.orderNumber}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{order.customerName}</td>
                        <td className="py-3.5 px-4 text-slate-700">{items.join(', ')}</td>
                        <td className="py-3.5 px-4">
                          <Badge size="sm" variant={order.status === 'Fulfilled' ? 'success' : 'brand'}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{formatDate(order.datePlaced)}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatNaira(order.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Quality Incidents (Table View) */}
        {activeTab === 'incidents' && (
          <div className="p-6">
            {incidents.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-emerald-50/50 border border-dashed border-emerald-200 text-emerald-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold">Zero Incidents Recorded</h4>
                <p className="text-xs text-emerald-600/90 mt-0.5">
                  This vendor has provided quality products with zero registered complaints.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">ORDER #</th>
                      <th className="py-3 px-4">AFFECTED PRODUCT</th>
                      <th className="py-3 px-4">DESCRIPTION</th>
                      <th className="py-3 px-4">COST (₦)</th>
                      <th className="py-3 px-4">COVERED BY</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {incidents.map(inc => (
                      <tr key={inc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setCurrentView({ type: 'order-detail', id: inc.orderId });
                            }}
                            className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
                          >
                            <span>{inc.orderNumber}</span>
                            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                          </button>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {formatRelativeTime(inc.createdAt)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">
                            {inc.itemName}
                          </span>
                          {inc.issueType && (
                            <span className="inline-block text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md mt-0.5">
                              {inc.issueType}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-slate-600 truncate" title={inc.description}>
                            {inc.description}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-bold font-heading text-rose-600">
                          {formatNaira(inc.cost)}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                            inc.costCoveredBy === 'Vendor' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : inc.costCoveredBy === 'Unboxie'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {inc.costCoveredBy}
                          </span>
                        </td>

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

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setCurrentView({ type: 'order-detail', id: inc.orderId });
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <span>View Order</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Overview & Contact */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">Direct Contact</span>
                {vendor.phone ? (
                  <a
                    href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{vendor.phone} (Click to open WhatsApp)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-slate-400">No phone provided</p>
                )}
                <p className="text-slate-600 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{[vendor.cityLga, vendor.state].filter(Boolean).join(', ')}</span>
                </p>
                {vendor.address && (
                  <p className="text-slate-500 italic pl-5">{vendor.address}</p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">Specialty Categories</span>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.categories?.map(cat => (
                    <span key={cat} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {vendor.notes && (
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">Internal Ops Notes:</span>
                {vendor.notes}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Incident Modal */}
      <IncidentFormModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        prefillVendorId={vendor.id}
      />

      {/* Delete Vendor Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteVendor(vendor.id);
          setCurrentView({ type: 'vendor-list' });
        }}
        title="Delete Vendor"
        message={`Are you sure you want to delete vendor "${vendor.name}"? This action cannot be undone.`}
        confirmText="Delete Vendor"
      />

      {/* Status Toggle Confirmation Modal */}
      <ConfirmModal
        isOpen={isToggleStatusModalOpen}
        onClose={() => setIsToggleStatusModalOpen(false)}
        onConfirm={() => toggleVendorStatus(vendor.id)}
        title={vendor.status === 'Active' ? 'Mark Vendor as Inactive' : 'Activate Vendor'}
        message={
          vendor.status === 'Active'
            ? `Are you sure you want to mark "${vendor.name}" as Inactive? Inactive vendors will be flagged in your directory and Ops will be notified to avoid selecting them for new orders.`
            : `Are you sure you want to mark "${vendor.name}" as Active? This vendor will be available for catalog linking and active order sourcing.`
        }
        confirmText={vendor.status === 'Active' ? 'Deactivate' : 'Activate'}
        variant={vendor.status === 'Active' ? 'warning' : 'success'}
      />

    </div>
  );
};
