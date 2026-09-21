import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { PackagingOption } from '../../types';
import { Check } from 'lucide-react';

interface PackagingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  packagingToEdit?: PackagingOption | null;
}

export const PackagingFormModal: React.FC<PackagingFormModalProps> = ({
  isOpen,
  onClose,
  packagingToEdit,
}) => {
  const { addPackaging, updatePackaging, vendors } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [sampleImage, setSampleImage] = useState('');
  const [linkedVendorIds, setLinkedVendorIds] = useState<string[]>([]);

  useEffect(() => {
    if (packagingToEdit) {
      setName(packagingToEdit.name);
      setDescription(packagingToEdit.description);
      setDimensions(packagingToEdit.dimensions || '');
      setSampleImage(packagingToEdit.sampleImage || '');
      setLinkedVendorIds(packagingToEdit.linkedVendorIds || []);
    } else {
      setName('');
      setDescription('');
      setDimensions('');
      setSampleImage('');
      setLinkedVendorIds([]);
    }
  }, [packagingToEdit, isOpen]);

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

    if (packagingToEdit) {
      updatePackaging(packagingToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        dimensions: dimensions.trim() || undefined,
        sampleImage: sampleImage.trim() || undefined,
      });
    } else {
      addPackaging({
        name: name.trim(),
        description: description.trim(),
        dimensions: dimensions.trim() || undefined,
        sampleImage: sampleImage.trim() || undefined,
        linkedVendorIds,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={packagingToEdit ? 'Edit Packaging Option' : 'Add Packaging Option'}
      subtitle="Box sizes, custom sleeves, ribbons, and supplying vendors."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Packaging Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 12-inch Luxury Rigid Box (Matte Charcoal)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Dimensions / Size
            </label>
            <input
              type="text"
              placeholder="e.g. 30x30x12 cm"
              value={dimensions}
              onChange={e => setDimensions(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Sample Image URL
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={sampleImage}
            onChange={e => setSampleImage(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Description & Material Details
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Magnetic closure rigid cardboard box with debossed gold foil crest..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
          />
        </div>

        {/* Link Vendors (Only shown on create) */}
        {!packagingToEdit && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Link Initial Vendors
                </label>
                <p className="text-[11px] text-slate-500">
                  Which vendors supply, manufacture, or customize this box/ribbon?
                </p>
              </div>
              <span className="text-xs font-semibold text-purple-600">
                {linkedVendorIds.length} Linked
              </span>
            </div>

            <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1.5 custom-scrollbar bg-slate-50/50">
              {vendors.length === 0 ? (
                <p className="text-xs text-slate-400 p-2 text-center">No vendors available.</p>
              ) : (
                vendors.map(v => {
                  const isSelected = linkedVendorIds.includes(v.id);
                  return (
                    <div
                      key={v.id}
                      onClick={() => toggleVendor(v.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-50 border border-purple-200'
                          : 'bg-white border border-slate-200/70 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border text-white transition-colors ${
                          isSelected ? 'bg-purple-600 border-purple-600' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-800 block truncate">{v.name}</span>
                          <span className="text-[10px] text-slate-500">{v.type} • {v.cityLga || v.state}</span>
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
            {packagingToEdit ? 'Save Changes' : 'Create Packaging Option'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
