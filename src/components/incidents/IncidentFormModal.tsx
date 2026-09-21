import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { CostBearer, IncidentStatus, Incident } from '../../types';

interface IncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentToEdit?: Incident | null;
  prefillOrderId?: string;
  prefillVendorId?: string;
  prefillItemId?: string;
  prefillItemName?: string;
}

export const IncidentFormModal: React.FC<IncidentFormModalProps> = ({
  isOpen,
  onClose,
  incidentToEdit,
  prefillOrderId,
  prefillVendorId,
  prefillItemId,
  prefillItemName,
}) => {
  const { 
    addIncident, 
    updateIncident, 
    orders, 
    vendors 
  } = useApp();

  const [orderId, setOrderId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState<number | ''>('');
  const [costCoveredBy, setCostCoveredBy] = useState<CostBearer>('Vendor');
  const [vendorSplit, setVendorSplit] = useState<number | ''>('');
  const [unboxieSplit, setUnboxieSplit] = useState<number | ''>('');
  const [status, setStatus] = useState<IncidentStatus>('Resolved');

  // Selected Order object to populate items
  const selectedOrder = orders.find(o => o.id === orderId);

  useEffect(() => {
    if (incidentToEdit) {
      setOrderId(incidentToEdit.orderId);
      setVendorId(incidentToEdit.vendorId);
      setItemId(incidentToEdit.itemId || '');
      setItemName(incidentToEdit.itemName);
      setDescription(incidentToEdit.description);
      setCost(incidentToEdit.cost);
      setCostCoveredBy(incidentToEdit.costCoveredBy);
      setVendorSplit(incidentToEdit.costSplitDetails?.vendorAmount || '');
      setUnboxieSplit(incidentToEdit.costSplitDetails?.unboxieAmount || '');
      setStatus(incidentToEdit.status);
    } else {
      const initialOrderId = prefillOrderId || (orders[0]?.id || '');
      setOrderId(initialOrderId);
      
      const order = orders.find(o => o.id === initialOrderId);
      const firstItem = order?.items.find(i => (prefillItemId ? i.id === prefillItemId : true)) || order?.items[0];
      
      setItemId(prefillItemId || (firstItem?.id || ''));
      setItemName(prefillItemName || (firstItem?.name || 'General Order Issue'));
      
      const autoVendorId = prefillVendorId || firstItem?.sourcedVendorId || (vendors[0]?.id || '');
      setVendorId(autoVendorId);

      setDescription('');
      setCost('');
      setCostCoveredBy('Vendor');
      setVendorSplit('');
      setUnboxieSplit('');
      setStatus('Resolved');
    }
  }, [incidentToEdit, prefillOrderId, prefillVendorId, prefillItemId, prefillItemName, isOpen, orders, vendors]);

  // When order changes in dropdown, auto update available items
  const handleOrderChange = (newOrderId: string) => {
    setOrderId(newOrderId);
    const ord = orders.find(o => o.id === newOrderId);
    if (ord && ord.items.length > 0) {
      const first = ord.items[0];
      setItemId(first.id);
      setItemName(first.name);
      if (first.sourcedVendorId) {
        setVendorId(first.sourcedVendorId);
      }
    }
  };

  // When line item changes in dropdown, auto pick the responsible vendor if assigned!
  const handleItemChange = (newItemId: string) => {
    setItemId(newItemId);
    if (newItemId === 'general') {
      setItemName('General Order Fulfillment Issue');
    } else if (selectedOrder) {
      const it = selectedOrder.items.find(i => i.id === newItemId);
      if (it) {
        setItemName(it.name);
        if (it.sourcedVendorId) {
          setVendorId(it.sourcedVendorId);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !vendorId || !description.trim()) return;

    const ord = orders.find(o => o.id === orderId);
    const ven = vendors.find(v => v.id === vendorId);

    const costNum = Number(cost) || 0;

    let costSplitDetails = undefined;
    if (costCoveredBy === 'Split') {
      costSplitDetails = {
        vendorAmount: Number(vendorSplit) || 0,
        unboxieAmount: Number(unboxieSplit) || 0,
      };
    }

    if (incidentToEdit) {
      updateIncident(incidentToEdit.id, {
        orderId,
        orderNumber: ord?.orderNumber || 'ORD-N/A',
        vendorId,
        vendorName: ven?.name || 'Unknown Vendor',
        itemId: itemId || undefined,
        itemName: itemName || 'Order Item',
        description: description.trim(),
        cost: costNum,
        costCoveredBy,
        costSplitDetails,
        status,
      });
    } else {
      addIncident({
        orderId,
        orderNumber: ord?.orderNumber || 'ORD-N/A',
        vendorId,
        vendorName: ven?.name || 'Unknown Vendor',
        itemId: itemId || undefined,
        itemName: itemName || 'Order Item',
        description: description.trim(),
        cost: costNum,
        costCoveredBy,
        costSplitDetails,
        status,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={incidentToEdit ? 'Edit Fulfillment Incident' : 'Record Order Incident'}
      subtitle="Track fulfillment issue, responsible vendor, and cost liability."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Order & Affected Item Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Associated Order *
            </label>
            <select
              value={orderId}
              onChange={e => handleOrderChange(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} — {o.customerName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Affected Line Item
            </label>
            <select
              value={itemId}
              onChange={e => handleItemChange(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {selectedOrder?.items.map(it => (
                <option key={it.id} value={it.id}>
                  {it.name} (x{it.quantity})
                </option>
              ))}
              <option value="general">Entire Order / Packaging Issue</option>
            </select>
          </div>
        </div>

        {/* Responsible Vendor & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Responsible Vendor *
            </label>
            <select
              value={vendorId}
              onChange={e => setVendorId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium text-slate-800"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Incident Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as IncidentStatus)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Issue Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            What Happened? (Description) *
          </label>
          <textarea
            required
            rows={3}
            placeholder="e.g. Product arrived with broken seal / Wrong colour supplied / Vendor delayed dispatch by 2 days..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
          />
        </div>

        {/* Cost & Who Covered Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Cost Incurred (₦)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 3500"
              value={cost}
              onChange={e => setCost(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Who Covered the Cost? *
            </label>
            <select
              value={costCoveredBy}
              onChange={e => setCostCoveredBy(e.target.value as CostBearer)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold text-slate-800"
            >
              <option value="Vendor">Vendor (Vendor absorbed / replaced)</option>
              <option value="Unboxie">Unboxie (Unboxie absorbed cost to protect customer)</option>
              <option value="Split">Split between Vendor & Unboxie</option>
            </select>
          </div>
        </div>

        {/* Split inputs if Split is chosen */}
        {costCoveredBy === 'Split' && (
          <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vendor Portion (₦)</label>
              <input
                type="number"
                min="0"
                value={vendorSplit}
                onChange={e => setVendorSplit(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unboxie Portion (₦)</label>
              <input
                type="number"
                min="0"
                value={unboxieSplit}
                onChange={e => setUnboxieSplit(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs transition-all"
          >
            {incidentToEdit ? 'Save Changes' : 'Record Incident'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
