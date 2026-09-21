import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Product } from '../../types';
import { Check } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const COMMON_PRODUCT_CATEGORIES = [
  'Keychains',
  'Diffusers',
  'Fragrances',
  'Candles',
  'Drinkware',
  'Stationery',
  'Skincare',
  'Jewelry',
  'Personalized',
  'Corporate',
  'Wellness',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, vendors } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sampleImage, setSampleImage] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [customCat, setCustomCat] = useState('');
  const [linkedVendorIds, setLinkedVendorIds] = useState<string[]>([]);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setSampleImage(productToEdit.sampleImage || '');
      setBasePrice(productToEdit.basePrice || '');
      setCategories(productToEdit.categories || []);
      setLinkedVendorIds(productToEdit.linkedVendorIds || []);
    } else {
      setName('');
      setDescription('');
      setSampleImage('');
      setBasePrice('');
      setCategories([]);
      setCustomCat('');
      setLinkedVendorIds([]);
    }
  }, [productToEdit, isOpen]);

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleAddCustomCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCat.trim() && !categories.includes(customCat.trim())) {
      setCategories([...categories, customCat.trim()]);
      setCustomCat('');
    }
  };

  const toggleVendor = (vendorId: string) => {
    if (linkedVendorIds.includes(vendorId)) {
      setLinkedVendorIds(linkedVendorIds.filter(id => id !== vendorId));
    } else {
      setLinkedVendorIds([...linkedVendorIds, vendorId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        sampleImage: sampleImage.trim() || undefined,
        basePrice: basePrice ? Number(basePrice) : undefined,
        categories,
      });
    } else {
      addProduct({
        name: name.trim(),
        description: description.trim(),
        sampleImage: sampleImage.trim() || undefined,
        basePrice: basePrice ? Number(basePrice) : undefined,
        categories,
        linkedVendorIds,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Edit Product' : 'Add New Product'}
      subtitle="Catalog item and pre-linked sourcing vendors."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Name & Base Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Heart Keychain (Rose Gold)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Est. Price (₦)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 4500"
              value={basePrice}
              onChange={e => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Sample Image URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Sample Image URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={sampleImage}
            onChange={e => setSampleImage(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Description
          </label>
          <textarea
            rows={2}
            placeholder="Describe product specs, material, variants..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Categories
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {COMMON_PRODUCT_CATEGORIES.map(cat => {
              const selected = categories.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    selected
                      ? 'bg-brand-500 text-white border-brand-600 font-medium'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {selected ? '✓ ' : '+ '}{cat}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom category tag..."
              value={customCat}
              onChange={e => setCustomCat(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomCat(e);
                }
              }}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={handleAddCustomCat}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Add
            </button>
          </div>
        </div>

        {/* Step 2: Link Vendors Who Can Supply this Product (Only shown on create) */}
        {!productToEdit && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Link Initial Vendors
                </label>
                <p className="text-[11px] text-slate-500">
                  Select vendors Ops can reach out to when an order requires this item.
                </p>
              </div>
              <span className="text-xs font-semibold text-brand-600">
                {linkedVendorIds.length} Linked
              </span>
            </div>

            <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1.5 custom-scrollbar bg-slate-50/50">
              {vendors.length === 0 ? (
                <p className="text-xs text-slate-400 p-2 text-center">No vendors available. Please add vendors first.</p>
              ) : (
                vendors.map(v => {
                  const isSelected = linkedVendorIds.includes(v.id);
                  return (
                    <div
                      key={v.id}
                      onClick={() => toggleVendor(v.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-50 border border-brand-200'
                          : 'bg-white border border-slate-200/70 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border text-white transition-colors ${
                          isSelected ? 'bg-brand-500 border-brand-500' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-800 block truncate">{v.name}</span>
                          <span className="text-[10px] text-slate-500">{v.type} • {v.cityLga || v.state} • Used {v.timesUsed || 0}x</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        v.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                  );
                })
              )}
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
            {productToEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
