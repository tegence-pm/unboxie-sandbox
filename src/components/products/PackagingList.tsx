import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PackagingFormModal } from './PackagingFormModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { PackagingOption } from '../../types';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users
} from 'lucide-react';

export const PackagingList: React.FC = () => {
  const { 
    packagingOptions, 
    deletePackaging, 
    setCurrentView 
  } = useApp();

  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [packagingToEdit, setPackagingToEdit] = useState<PackagingOption | null>(null);
  const [packagingToDelete, setPackagingToDelete] = useState<PackagingOption | null>(null);

  const filteredPackaging = packagingOptions.filter(pkg => {
    return (
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(search.toLowerCase()) ||
      pkg.dimensions?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleEdit = (pkg: PackagingOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setPackagingToEdit(pkg);
    setIsFormOpen(true);
  };

  const handleDelete = (pkg: PackagingOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setPackagingToDelete(pkg);
  };

  return (
    <div className="space-y-5">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search packaging or dimensions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400 bg-white"
          />
        </div>

        <button
          onClick={() => {
            setPackagingToEdit(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Packaging Option</span>
        </button>
      </div>

      {/* PACKAGING TABLE VIEW */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {filteredPackaging.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No packaging options found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add box sizes, ribbons, sleeves, or custom wrapping materials.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Packaging Option</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Specifications</th>
                  <th className="py-3.5 px-4">Supplying Vendors</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPackaging.map(pkg => {
                  const linkedCount = pkg.linkedVendorIds.length;

                  return (
                    <tr
                      key={pkg.id}
                      onClick={() => setCurrentView({ type: 'packaging-detail', id: pkg.id })}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Option Name & Thumbnail */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {pkg.sampleImage ? (
                            <img
                              src={pkg.sampleImage}
                              alt={pkg.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-100 flex-shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 border border-purple-100">
                              <Layers className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <span className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors block truncate text-sm">
                              {pkg.name}
                            </span>
                            {pkg.dimensions && (
                              <span className="text-[11px] text-purple-700 font-medium block mt-0.5">
                                {pkg.dimensions}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 text-slate-600 hidden md:table-cell max-w-xs truncate">
                        {pkg.description || '—'}
                      </td>

                      {/* Supplying Vendors Count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          linkedCount > 0 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200/60' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          <Users className="w-3.5 h-3.5" />
                          <span>{linkedCount} Supplier{linkedCount === 1 ? '' : 's'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentView({ type: 'packaging-detail', id: pkg.id });
                            }}
                            className="text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            Details & Suppliers
                          </button>
                          <button
                            onClick={(e) => handleEdit(pkg, e)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(pkg, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <PackagingFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setPackagingToEdit(null);
        }}
        packagingToEdit={packagingToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(packagingToDelete)}
        onClose={() => setPackagingToDelete(null)}
        onConfirm={() => {
          if (packagingToDelete) {
            deletePackaging(packagingToDelete.id);
            setPackagingToDelete(null);
          }
        }}
        title="Delete Packaging Option"
        message={`Are you sure you want to delete "${packagingToDelete?.name}"? This item will be removed from your packaging catalog and unlinked from any associated suppliers.`}
        confirmText="Delete Option"
      />
    </div>
  );
};
