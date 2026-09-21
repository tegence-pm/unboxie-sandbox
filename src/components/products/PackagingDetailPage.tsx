import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PackagingFormModal } from './PackagingFormModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  ArrowLeft, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Users
} from 'lucide-react';

interface PackagingDetailPageProps {
  packagingId: string;
}

export const PackagingDetailPage: React.FC<PackagingDetailPageProps> = ({ packagingId }) => {
  const { 
    getPackagingById, 
    updatePackaging, 
    deletePackaging, 
    vendors, 
    setCurrentView,
    setActiveTab,
    setProductSubTab 
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVendorPickerOpen, setIsVendorPickerOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'vendors'>('vendors');
  const [isDeletePackagingModalOpen, setIsDeletePackagingModalOpen] = useState(false);
  const [vendorToUnlink, setVendorToUnlink] = useState<{ id: string; name: string } | null>(null);

  const packaging = getPackagingById(packagingId);
  if (!packaging) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-sm">Packaging Option not found.</p>
        <button
          onClick={() => {
            setActiveTab('products-packaging');
            setProductSubTab('packaging');
            setCurrentView({ type: 'packaging-list' });
          }}
          className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Back to Packaging Options
        </button>
      </div>
    );
  }

  const linkedVendors = vendors.filter(v => packaging.linkedVendorIds.includes(v.id));
  const unlinkedVendors = vendors.filter(v => !packaging.linkedVendorIds.includes(v.id));

  const handleRemoveVendor = (vendorId: string) => {
    updatePackaging(packaging.id, {
      linkedVendorIds: packaging.linkedVendorIds.filter(id => id !== vendorId),
    });
  };

  const handleAddVendor = (vendorId: string) => {
    updatePackaging(packaging.id, {
      linkedVendorIds: [...packaging.linkedVendorIds, vendorId],
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Top Back & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('products-packaging');
              setProductSubTab('packaging');
              setCurrentView({ type: 'packaging-list' });
            }}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Back to Packaging"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              {packaging.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Packaging specifications and linked manufacturing/customization suppliers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Option</span>
          </button>

          <button
            onClick={() => setIsDeletePackagingModalOpen(true)}
            className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200/60 rounded-xl transition-colors shadow-2xs"
            title="Delete Option"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs: Details vs Linked Vendors */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveDetailTab('details')}
              className={`pb-3.5 text-xs font-bold border-b-2 transition-all ${
                activeDetailTab === 'details'
                  ? 'border-purple-600 text-purple-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Packaging Details
            </button>
            <button
              onClick={() => setActiveDetailTab('vendors')}
              className={`pb-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeDetailTab === 'vendors'
                  ? 'border-purple-600 text-purple-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Linked Vendors</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeDetailTab === 'vendors' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {linkedVendors.length}
              </span>
            </button>
          </div>

          {activeDetailTab === 'vendors' && (
            <button
              onClick={() => setIsVendorPickerOpen(!isVendorPickerOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isVendorPickerOpen ? 'Done Linking' : 'Link Vendor'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Details */}
        {activeDetailTab === 'details' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {packaging.sampleImage ? (
                <img
                  src={packaging.sampleImage}
                  alt={packaging.name}
                  className="w-40 h-40 rounded-2xl object-cover border border-slate-100 flex-shrink-0 shadow-2xs"
                />
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Layers className="w-16 h-16" />
                </div>
              )}

              <div className="flex-1 space-y-4">
                {packaging.dimensions && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      Dimensions / Specs
                    </span>
                    <span className="text-xl font-bold font-heading text-purple-700">
                      {packaging.dimensions}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Material Details & Description
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {packaging.description || 'No detailed specifications provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vendors Table */}
        {activeDetailTab === 'vendors' && (
          <div className="p-6 space-y-4">
            {/* Picker Dropdown to Link New Suppliers */}
            {isVendorPickerOpen && (
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3 animate-fade-in mb-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Add Supplier to this Packaging Option:
                </span>

                {unlinkedVendors.length === 0 ? (
                  <p className="text-xs text-slate-500">All registered vendors are already linked.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {unlinkedVendors.map(v => (
                      <div
                        key={v.id}
                        onClick={() => handleAddVendor(v.id)}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-500 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-purple-600">
                            {v.name}
                          </span>
                          <span className="text-[10px] text-slate-500">{v.type} • {v.cityLga || v.state}</span>
                        </div>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                          + Link
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Linked Vendors Table */}
            {linkedVendors.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-300">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800">No Suppliers Linked</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Click "Link Another Supplier" above to attach packaging suppliers.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">VENDOR</th>
                      <th className="py-3 px-4">TYPE</th>
                      <th className="py-3 px-4">LOCATION</th>
                      <th className="py-3 px-4">SOURCING STATS</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {linkedVendors.map(vendor => (
                      <tr key={vendor.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {vendor.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate">
                                {vendor.name}
                              </span>
                              {vendor.notes && (
                                <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                                  {vendor.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800">{vendor.type}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 block">{vendor.cityLga}</span>
                          <span className="text-[11px] text-slate-400 block">{vendor.state}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block">
                            {vendor.timesUsed || 0} times used
                          </span>
                          {vendor.lastUsedDate ? (
                            <span className="text-[10px] text-slate-400 block">
                              Last: {new Date(vendor.lastUsedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 block">Not used yet</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            vendor.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              vendor.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`} />
                            <span>{vendor.status}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setActiveTab('vendors');
                                setCurrentView({ type: 'vendor-detail', id: vendor.id });
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <span>Profile</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </button>
                            <button
                              onClick={() => setVendorToUnlink({ id: vendor.id, name: vendor.name })}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Unlink supplier"
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

      {/* Edit Modal */}
      <PackagingFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        packagingToEdit={packaging}
      />

      {/* Delete Packaging Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeletePackagingModalOpen}
        onClose={() => setIsDeletePackagingModalOpen(false)}
        onConfirm={() => {
          deletePackaging(packaging.id);
          setCurrentView({ type: 'packaging-list' });
        }}
        title="Delete Packaging Option"
        message={`Are you sure you want to delete "${packaging.name}"? This item will be permanently removed from your catalog.`}
        confirmText="Delete Option"
      />

      {/* Unlink Vendor Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(vendorToUnlink)}
        onClose={() => setVendorToUnlink(null)}
        onConfirm={() => {
          if (vendorToUnlink) {
            handleRemoveVendor(vendorToUnlink.id);
            setVendorToUnlink(null);
          }
        }}
        title="Unlink Supplier"
        message={`Are you sure you want to unlink "${vendorToUnlink?.name}" from this packaging option? Ops will no longer see them listed as a default supplier for this item.`}
        confirmText="Unlink Supplier"
        variant="warning"
      />

    </div>
  );
};
