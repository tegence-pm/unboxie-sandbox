import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductFormModal } from './ProductFormModal';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';
import { ConfirmModal } from '../common/ConfirmModal';
import { Product } from '../../types';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users
} from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

export const ProductList: React.FC = () => {
  const { 
    products, 
    deleteProduct, 
    setCurrentView 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Extract all unique categories
  const allCategories = Array.from(
    new Set(products.flatMap(p => p.categories || []))
  ).sort();

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.categories.some(c => c.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = 
      selectedCategories.length === 0 ||
      selectedCategories.some(cat => p.categories.includes(cat));

    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(product);
  };

  return (
    <div className="space-y-5">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products or descriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          <MultiSelectDropdown
            options={allCategories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Filter Categories"
          />

          <button
            onClick={() => {
              setProductToEdit(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* PRODUCTS TABLE VIEW */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or add new items to the catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Product</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Description</th>
                  <th className="py-3.5 px-4">Est. Price</th>
                  <th className="py-3.5 px-4">Sourcing Network</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(product => {
                  const linkedCount = product.linkedVendorIds.length;

                  return (
                    <tr
                      key={product.id}
                      onClick={() => setCurrentView({ type: 'product-detail', id: product.id })}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {product.sampleImage ? (
                            <img
                              src={product.sampleImage}
                              alt={product.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-100 flex-shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center flex-shrink-0 border border-orange-100">
                              <Package className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <span className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors block truncate text-sm">
                              {product.name}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.categories.slice(0, 2).map(cat => (
                                <span key={cat} className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                                  {cat}
                                </span>
                              ))}
                              {product.categories.length > 2 && (
                                <span className="text-[10px] text-slate-400">+{product.categories.length - 2}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 text-slate-600 hidden md:table-cell max-w-xs truncate">
                        {product.description || '—'}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {product.basePrice ? formatNaira(product.basePrice) : '—'}
                      </td>

                      {/* Sourcing Vendors Count Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          linkedCount > 0 
                            ? 'bg-brand-50 text-brand-700 border border-brand-200/60' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          <Users className="w-3.5 h-3.5" />
                          <span>{linkedCount} Vendor{linkedCount === 1 ? '' : 's'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentView({ type: 'product-detail', id: product.id });
                            }}
                            className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            Details & Vendors
                          </button>
                          <button
                            onClick={(e) => handleEdit(product, e)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(product, e)}
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

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
          }
        }}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This item will be removed from your catalog and unlinked from any associated vendors.`}
        confirmText="Delete Product"
      />

    </div>
  );
};
