import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  ArrowLeft, 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Users
} from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    vendors, 
    setCurrentView,
    setActiveTab,
    setProductSubTab 
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVendorPickerOpen, setIsVendorPickerOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'vendors'>('vendors');
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [vendorToUnlink, setVendorToUnlink] = useState<{ id: string; name: string } | null>(null);

  const product = getProductById(productId);
  if (!product) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-sm">Product not found.</p>
        <button
          onClick={() => {
            setActiveTab('products-packaging');
            setProductSubTab('products');
            setCurrentView({ type: 'product-list' });
          }}
          className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Back to Product Catalog
        </button>
      </div>
    );
  }

  const linkedVendors = vendors.filter(v => product.linkedVendorIds.includes(v.id));
  const unlinkedVendors = vendors.filter(v => !product.linkedVendorIds.includes(v.id));

  const handleRemoveVendor = (vendorId: string) => {
    updateProduct(product.id, {
      linkedVendorIds: product.linkedVendorIds.filter(id => id !== vendorId),
    });
  };

  const handleAddVendor = (vendorId: string) => {
    updateProduct(product.id, {
      linkedVendorIds: [...product.linkedVendorIds, vendorId],
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
              setProductSubTab('products');
              setCurrentView({ type: 'product-list' });
            }}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Product details and managing available sourcing vendors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Product</span>
          </button>

          <button
            onClick={() => setIsDeleteProductModalOpen(true)}
            className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200/60 rounded-xl transition-colors shadow-2xs"
            title="Delete Product"
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
                  ? 'border-brand-500 text-brand-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveDetailTab('vendors')}
              className={`pb-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeDetailTab === 'vendors'
                  ? 'border-brand-500 text-brand-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Linked Vendors</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeDetailTab === 'vendors' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {linkedVendors.length}
              </span>
            </button>
          </div>

          {activeDetailTab === 'vendors' && (
            <button
              onClick={() => setIsVendorPickerOpen(!isVendorPickerOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs transition-all"
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
              {product.sampleImage ? (
                <img
                  src={product.sampleImage}
                  alt={product.name}
                  className="w-40 h-40 rounded-2xl object-cover border border-slate-100 flex-shrink-0 shadow-2xs"
                />
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-500 flex-shrink-0">
                  <Package className="w-16 h-16" />
                </div>
              )}

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      Estimated Price
                    </span>
                    <span className="text-2xl font-bold font-heading text-brand-600">
                      {product.basePrice ? formatNaira(product.basePrice) : 'Not specified'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {product.categories.map(cat => (
                      <span key={cat} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Description & Specifications
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {product.description || 'No detailed description specified.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vendors Table */}
        {activeDetailTab === 'vendors' && (
          <div className="p-6 space-y-4">
            {/* Picker Dropdown to Link New Vendors */}
            {isVendorPickerOpen && (
              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200 space-y-3 animate-fade-in mb-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Add Available Supplier to this Product:
                </span>

                {unlinkedVendors.length === 0 ? (
                  <p className="text-xs text-slate-500">All registered vendors are already linked to this product.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {unlinkedVendors.map(v => (
                      <div
                        key={v.id}
                        onClick={() => handleAddVendor(v.id)}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-500 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-brand-600">
                            {v.name}
                          </span>
                          <span className="text-[10px] text-slate-500">{v.type} • {v.cityLga || v.state}</span>
                        </div>
                        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">
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
                <h3 className="text-base font-semibold text-slate-800">No Sourcing Vendors Linked</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Ops has no suppliers registered for this product. Click "Link Another Vendor" above to attach suppliers.
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
                            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
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
                              title="Unlink vendor"
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
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productToEdit={product}
      />

      {/* Delete Product Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteProductModalOpen}
        onClose={() => setIsDeleteProductModalOpen(false)}
        onConfirm={() => {
          deleteProduct(product.id);
          setCurrentView({ type: 'product-list' });
        }}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This product will be permanently removed from your catalog.`}
        confirmText="Delete Product"
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
        title="Unlink Vendor"
        message={`Are you sure you want to unlink "${vendorToUnlink?.name}" from this product? Ops will no longer see them listed as a default supplier for this item.`}
        confirmText="Unlink Vendor"
        variant="warning"
      />

    </div>
  );
};
