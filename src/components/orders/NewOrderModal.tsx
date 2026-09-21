import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { generateOrderNumber, generateId, formatNaira } from '../../utils/formatters';
import { Plus, Trash2, Package, Layers } from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose }) => {
  const { addOrder, orders, products, packagingOptions } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryState, setDeliveryState] = useState('Lagos');
  const [selectedPackagingId, setSelectedPackagingId] = useState(packagingOptions[0]?.id || '');
  const [selectedProductItems, setSelectedProductItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 1 }
  ]);
  const [notes, setNotes] = useState('');

  const handleAddProductRow = () => {
    if (products.length > 0) {
      setSelectedProductItems(prev => [...prev, { productId: products[0].id, quantity: 1 }]);
    }
  };

  const handleRemoveProductRow = (index: number) => {
    setSelectedProductItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateProductRow = (index: number, field: 'productId' | 'quantity', value: any) => {
    setSelectedProductItems(prev => prev.map((item, i) => {
      if (i !== index) return item;
      return { ...item, [field]: value };
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    selectedProductItems.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod && prod.basePrice) {
        total += prod.basePrice * (item.quantity || 1);
      }
    });
    // Add default packaging base fee
    total += 5000;
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const orderNumber = generateOrderNumber(orders.length);
    const selectedPkg = packagingOptions.find(p => p.id === selectedPackagingId);

    const items: any[] = [];

    // Add selected products
    selectedProductItems.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        items.push({
          id: generateId('oi'),
          productId: prod.id,
          itemType: 'product' as const,
          name: prod.name,
          quantity: Number(item.quantity) || 1,
          unitPrice: prod.basePrice || 3500,
          sourcingStatus: 'pending' as const,
        });
      }
    });

    // Add selected packaging
    if (selectedPkg) {
      items.push({
        id: generateId('oi_pkg'),
        packagingId: selectedPkg.id,
        itemType: 'packaging' as const,
        name: selectedPkg.name,
        quantity: 1,
        unitPrice: 5000,
        sourcingStatus: 'pending' as const,
      });
    }

    addOrder({
      orderNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      customerEmail: 'customer@example.com',
      deliveryMode: 'DELIVERY',
      senderIdentity: 'Visible to recipient',
      recipientName: customerName.trim(),
      recipientPhone: customerPhone.trim() || '+234 800 000 0000',
      deliveryAddress: deliveryAddress.trim() || 'Lagos, Nigeria',
      city: 'Lagos',
      state: deliveryState,
      country: 'Nigeria',
      datePlaced: new Date().toISOString(),
      status: 'Placed',
      paymentStatus: 'Payment Successful',
      deliveryFee: 500,
      items,
      totalAmount: calculateTotal(),
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Order (Ops Test Simulator)"
      subtitle="Place a mock customer order to simulate the vendor sourcing workflow."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Customer Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Femi Balogun"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+234 800 000 0000"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Delivery Address
            </label>
            <input
              type="text"
              placeholder="e.g. 15 Adeola Odeku, VI"
              value={deliveryAddress}
              onChange={e => setDeliveryAddress(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Delivery State
            </label>
            <select
              value={deliveryState}
              onChange={e => setDeliveryState(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="Lagos">Lagos</option>
              <option value="FCT - Abuja">FCT - Abuja</option>
              <option value="Ogun">Ogun</option>
              <option value="Rivers">Rivers</option>
              <option value="Oyo">Oyo</option>
            </select>
          </div>
        </div>

        {/* Select Packaging Option */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            Select Box / Packaging Option
          </label>
          <select
            value={selectedPackagingId}
            onChange={e => setSelectedPackagingId(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {packagingOptions.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} {pkg.dimensions ? `(${pkg.dimensions})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Select Products */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-brand-500" />
              Gift Products to Include
            </label>
            <button
              type="button"
              onClick={handleAddProductRow}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {selectedProductItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={item.productId}
                  onChange={e => handleUpdateProductRow(idx, 'productId', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {products.map(prod => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} {prod.basePrice ? `(${formatNaira(prod.basePrice)})` : ''}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => handleUpdateProductRow(idx, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1.5 text-xs rounded-xl border border-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />

                {selectedProductItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProductRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total Price Estimate */}
        <div className="p-3 bg-brand-50/70 border border-brand-200 rounded-xl flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Estimated Total Order Amount:</span>
          <span className="font-bold text-base text-brand-600">{formatNaira(calculateTotal())}</span>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Customer Gifting Notes
          </label>
          <textarea
            rows={2}
            placeholder="Special instructions, gift card message..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
          />
        </div>

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
            Create Order
          </button>
        </div>
      </form>
    </Modal>
  );
};
