import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { 
  OrderStatus, 
  OrderItem 
} from '../../types';
import { 
  Phone, 
  MapPin, 
  Package, 
  Layers, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { formatNaira, formatDate, formatRelativeTime } from '../../utils/formatters';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  onLogIncident: (orderId: string, vendorId?: string, itemId?: string, itemName?: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  orderId,
  onLogIncident,
}) => {
  const { 
    getOrderById, 
    products, 
    packagingOptions, 
    vendors, 
    sourceOrderItem, 
    updateOrder,
    incidents,
    setSelectedVendorId,
    setActiveTab
  } = useApp();

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedVendorForEdit, setSelectedVendorForEdit] = useState<string>('');
  const [sourcingNotesForEdit, setSourcingNotesForEdit] = useState<string>('');

  if (!orderId) return null;
  const order = getOrderById(orderId);
  if (!order) return null;

  const orderIncidents = incidents.filter(i => i.orderId === order.id);

  const handleStartSourcing = (item: OrderItem) => {
    setEditingItemId(item.id);
    setSelectedVendorForEdit(item.sourcedVendorId || '');
    setSourcingNotesForEdit(item.sourcingNotes || '');
  };

  const handleSaveSourcing = (itemId: string) => {
    sourceOrderItem(order.id, itemId, selectedVendorForEdit, sourcingNotesForEdit);
    setEditingItemId(null);
  };

  // Find linked available vendors for an order item
  const getAvailableVendorsForItem = (item: OrderItem) => {
    if (item.itemType === 'product' && item.productId) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        return vendors.filter(v => prod.linkedVendorIds.includes(v.id));
      }
    } else if (item.itemType === 'packaging' && item.packagingId) {
      const pkg = packagingOptions.find(p => p.id === item.packagingId);
      if (pkg) {
        return vendors.filter(v => pkg.linkedVendorIds.includes(v.id));
      }
    }
    return vendors; // fallback to all vendors
  };

  const allItemsSourced = order.items.every(it => it.sourcingStatus === 'sourced');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${order.orderNumber} • ${order.customerName}`}
      subtitle={`Placed on ${formatDate(order.datePlaced)} • Total Value: ${formatNaira(order.totalAmount)}`}
      maxWidth="3xl"
    >
      <div className="space-y-6 pt-1">
        
        {/* Order Meta Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={
                  order.status === 'Fulfilled' ? 'success' :
                  order.status === 'Sourced' ? 'blue' :
                  order.status === 'In Assembly' ? 'purple' : 'warning'
                }
                dot
                size="md"
              >
                {order.status}
              </Badge>
              
              {allItemsSourced ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  All Line Items Sourced
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Sourcing Incomplete
                </span>
              )}
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              {order.customerPhone && (
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {order.customerPhone}
                </span>
              )}
              {order.deliveryAddress && (
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {order.deliveryAddress}
                </span>
              )}
            </div>
          </div>

          {/* Status Quick Changer */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status:
            </label>
            <select
              value={order.status}
              onChange={e => updateOrder(order.id, { status: e.target.value as OrderStatus })}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="Pending Sourcing">Pending Sourcing</option>
              <option value="Sourced">Sourced</option>
              <option value="In Assembly">In Assembly</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Line Items & Sourcing Workflow */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-900 uppercase tracking-wider">
                Line Items & Vendor Assignment ({order.items.length})
              </h3>
              <p className="text-xs text-slate-500">
                Assign the specific vendor sourced for each item. This automatically increments vendor metrics.
              </p>
            </div>

            <button
              onClick={() => onLogIncident(order.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Report Incident</span>
            </button>
          </div>

          <div className="space-y-3">
            {order.items.map((item, index) => {
              const availableVendors = getAvailableVendorsForItem(item);
              const sourcedVendor = item.sourcedVendorId 
                ? vendors.find(v => v.id === item.sourcedVendorId) 
                : null;
              const isEditing = editingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.sourcingStatus === 'sourced'
                      ? 'bg-white border-slate-200/90 shadow-2xs'
                      : 'bg-amber-50/40 border-amber-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    
                    {/* Item Details */}
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl flex-shrink-0 ${
                        item.itemType === 'packaging' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-brand-600'
                      }`}>
                        {item.itemType === 'packaging' ? <Layers className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">#{index + 1}</span>
                          <h4 className="text-sm font-bold text-slate-900 font-heading">
                            {item.name}
                          </h4>
                          <span className="text-xs font-semibold text-slate-500">
                            x{item.quantity}
                          </span>
                        </div>

                        {item.unitPrice && (
                          <span className="text-xs font-medium text-slate-600 block mt-0.5">
                            {formatNaira(item.unitPrice * item.quantity)} ({formatNaira(item.unitPrice)} each)
                          </span>
                        )}

                        {/* Sourcing State Callout */}
                        {item.sourcingStatus === 'sourced' && sourcedVendor ? (
                          <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
                            <span className="text-slate-500 font-medium">Sourced from:</span>
                            <button
                              onClick={() => {
                                onClose();
                                setSelectedVendorId(sourcedVendor.id);
                                setActiveTab('vendors');
                              }}
                              className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60"
                            >
                              <Building2 className="w-3 h-3" />
                              {sourcedVendor.name}
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </button>

                            <Badge variant="success" size="sm" dot>
                              Confirmed
                            </Badge>

                            {item.sourcedAt && (
                              <span className="text-[11px] text-slate-400">
                                ({formatRelativeTime(item.sourcedAt)})
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-2 text-xs text-amber-700 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Needs vendor confirmation</span>
                          </div>
                        )}

                        {item.sourcingNotes && !isEditing && (
                          <p className="mt-1.5 text-xs text-slate-500 bg-slate-50 p-1.5 rounded-lg">
                            <span className="font-semibold text-slate-600">Ops Log: </span>
                            {item.sourcingNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Sourcing Button */}
                    {!isEditing && (
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          onClick={() => handleStartSourcing(item)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                            item.sourcingStatus === 'sourced'
                              ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                              : 'bg-brand-500 text-white border-brand-600 hover:bg-brand-600 shadow-xs'
                          }`}
                        >
                          {item.sourcingStatus === 'sourced' ? 'Change Vendor' : 'Assign Vendor'}
                        </button>

                        {item.sourcedVendorId && (
                          <button
                            onClick={() => onLogIncident(order.id, item.sourcedVendorId, item.id, item.name)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Log issue for this specific item"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sourcing Editor Drawer / Form inline */}
                  {isEditing && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-3 bg-white p-3.5 rounded-xl border border-brand-200 shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Select Vendor Used for "{item.name}"
                        </label>
                        <span className="text-[11px] text-slate-500">
                          {availableVendors.length} Pre-linked supplier option(s)
                        </span>
                      </div>

                      {/* Radio / selection cards for available vendors */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availableVendors.map(v => (
                          <div
                            key={v.id}
                            onClick={() => setSelectedVendorForEdit(v.id)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                              selectedVendorForEdit === v.id
                                ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">{v.name}</span>
                              <span className="text-[10px] text-slate-500">{v.type} • {v.cityLga || v.state}</span>
                              <span className="text-[10px] text-slate-400 block">Previously used: {v.timesUsed || 0}x</span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedVendorForEdit === v.id ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                            }`}>
                              {selectedVendorForEdit === v.id && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Ops Sourcing Note (e.g. Vendor A was out of stock, called Vendor B) */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Sourcing Notes / Vendor Check Log
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Reached out to Vendor A (out of stock), Vendor B confirmed ready for dispatch."
                          value={sourcingNotesForEdit}
                          onChange={e => setSourcingNotesForEdit(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingItemId(null)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveSourcing(item.id)}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-xs transition-all"
                        >
                          Save Sourcing Selection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Existing Incidents Logged Against This Order */}
        {orderIncidents.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Incidents Logged on this Order ({orderIncidents.length})
            </h4>

            <div className="space-y-2">
              {orderIncidents.map(inc => (
                <div key={inc.id} className="p-3 rounded-xl bg-white border border-rose-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{inc.vendorName} ({inc.itemName})</span>
                    <span className="font-bold text-rose-600">{formatNaira(inc.cost)}</span>
                  </div>
                  <p className="text-slate-600">{inc.description}</p>
                  <span className="text-[10px] text-slate-400 block">Cost covered by: {inc.costCoveredBy}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
