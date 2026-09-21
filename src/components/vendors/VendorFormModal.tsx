import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Vendor, VendorType, VendorSource, VendorStatus } from '../../types';
import { X } from 'lucide-react';

interface VendorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorToEdit?: Vendor | null;
}

const COMMON_CATEGORIES = [
  'Diffusers',
  'Candles',
  'Fragrances',
  'Keychains',
  'Mugs & Drinkware',
  'Stationery',
  'Jewelry',
  'Skincare & Wellness',
  'Boxes & Packaging',
  'Ribbons & Sleeves',
  'Printing & Engraving',
  'Silk & Pouches',
];

const NIGERIAN_STATES = [
  'Lagos',
  'FCT - Abuja',
  'Ogun',
  'Oyo',
  'Rivers',
  'Enugu',
  'Kano',
  'Delta',
  'Edo',
  'Anambra',
];

export const VendorFormModal: React.FC<VendorFormModalProps> = ({
  isOpen,
  onClose,
  vendorToEdit,
}) => {
  const { addVendor, updateVendor } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<VendorType>('Souvenir Vendor');
  const [source, setSource] = useState<VendorSource>('Online');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Lagos');
  const [cityLga, setCityLga] = useState('');
  const [address, setAddress] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<VendorStatus>('Active');

  useEffect(() => {
    if (vendorToEdit) {
      setName(vendorToEdit.name);
      setType(vendorToEdit.type);
      setSource(vendorToEdit.source);
      setPhone(vendorToEdit.phone);
      setState(vendorToEdit.state);
      setCityLga(vendorToEdit.cityLga);
      setAddress(vendorToEdit.address);
      setCategories(vendorToEdit.categories || []);
      setNotes(vendorToEdit.notes || '');
      setStatus(vendorToEdit.status);
    } else {
      setName('');
      setType('Souvenir Vendor');
      setSource('Online');
      setPhone('');
      setState('Lagos');
      setCityLga('');
      setAddress('');
      setCategories([]);
      setCustomCategory('');
      setNotes('');
      setStatus('Active');
    }
  }, [vendorToEdit, isOpen]);

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      setCategories([...categories, customCategory.trim()]);
      setCustomCategory('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (vendorToEdit) {
      updateVendor(vendorToEdit.id, {
        name: name.trim(),
        type,
        source,
        phone: phone.trim(),
        state,
        cityLga: cityLga.trim(),
        address: address.trim(),
        categories,
        notes: notes.trim(),
        status,
      });
    } else {
      addVendor({
        name: name.trim(),
        type,
        source,
        phone: phone.trim(),
        state,
        cityLga: cityLga.trim(),
        address: address.trim(),
        categories,
        notes: notes.trim(),
        status,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vendorToEdit ? 'Edit Vendor Details' : 'Add New Sourcing Vendor'}
      subtitle="Fill in vendor details, category specialties, and location information."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Name & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Vendor / Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lagos Scent Co."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Vendor Type *
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as VendorType)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            >
              <option value="Souvenir Vendor">Souvenir Vendor (Gift items & products)</option>
              <option value="Customization Vendor">Customization Vendor (Printing, boxes, ribbons)</option>
            </select>
          </div>
        </div>

        {/* Source & Status & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Sourcing Channel (Source) *
            </label>
            <select
              value={source}
              onChange={e => setSource(e.target.value as VendorSource)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            >
              <option value="Online">Online (Instagram, TikTok, Web)</option>
              <option value="Offline">Offline (Shops, Markets, Referral)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Status *
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as VendorStatus)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            >
              <option value="Active">Active (In active sourcing network)</option>
              <option value="Inactive">Inactive (Not sourced recently)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone / WhatsApp Number
            </label>
            <input
              type="text"
              placeholder="+234 800 000 0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Location: State & City/LGA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              State
            </label>
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            >
              {NIGERIAN_STATES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              City / LGA / Area
            </label>
            <input
              type="text"
              placeholder="e.g. Lekki Phase 1, Yaba, Wuse II"
              value={cityLga}
              onChange={e => setCityLga(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Physical Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Physical / Market Address
          </label>
          <input
            type="text"
            placeholder="e.g. Shop 42 Tejuosho Ultra Modern Market, Yaba"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Product Categories */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Categories Supplied
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {COMMON_CATEGORIES.map(cat => {
              const selected = categories.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    selected
                      ? 'bg-brand-500 text-white border-brand-600 shadow-xs font-medium'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {selected ? '✓ ' : '+ '}{cat}
                </button>
              );
            })}
          </div>

          {/* Custom tag adder */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom category tag..."
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomCategory(e);
                }
              }}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddCustomCategory}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Add Tag
            </button>
          </div>

          {/* Selected non-common tags */}
          {categories.filter(c => !COMMON_CATEGORIES.includes(c)).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {categories
                .filter(c => !COMMON_CATEGORIES.includes(c))
                .map(cat => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className="hover:text-brand-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Operational Notes & Sourcing Handles
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Found via IG @handle. Reaches out quickly on WhatsApp. Requires 24-hour lead time for bulk orders."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
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
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            {vendorToEdit ? 'Save Changes' : 'Create Vendor'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
