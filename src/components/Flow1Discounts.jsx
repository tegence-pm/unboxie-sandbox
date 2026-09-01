import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Tag, 
  Check, 
  AlertCircle, 
  X, 
  ShoppingBag, 
  ArrowLeft,
  DollarSign,
  Percent,
  Eye
} from 'lucide-react';

export default function Flow1Discounts({ 
  products, 
  onUpdateProduct, 
  onSwitchToCustomer,
  viewMode = 'admin', // 'admin' | 'customer' | 'customer-detail'
  selectedProductId = 'prod-1',
  setSelectedProductId
}) {
  // Drawer / Modal state for Admin Edit
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' | 'fixed'
  const [discountValue, setDiscountValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Helper calculation for prices
  const calculatePrice = (price, isDisc, type, valStr) => {
    if (!isDisc) return { originalPrice: price, discountAmount: 0, newPrice: price, percentVal: 0 };
    const numVal = parseFloat(valStr) || 0;
    if (type === 'percentage') {
      const discAmt = (price * numVal) / 100;
      return {
        originalPrice: price,
        discountAmount: discAmt,
        newPrice: price - discAmt,
        percentVal: numVal
      };
    } else {
      const discAmt = numVal;
      const pct = price > 0 ? (discAmt / price) * 100 : 0;
      return {
        originalPrice: price,
        discountAmount: discAmt,
        newPrice: price - discAmt,
        percentVal: pct
      };
    }
  };

  // Open edit modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsDiscounted(product.is_discounted || false);
    setDiscountType(product.discount_type || 'percentage');
    setDiscountValue(product.discount_value !== undefined ? String(product.discount_value) : '');
    setValidationError('');
    setSaveSuccessMsg('');
  };

  // Live validation check
  const handleDiscountChange = (valStr, type, discEnabled) => {
    setDiscountValue(valStr);
    if (!discEnabled) {
      setValidationError('');
      return;
    }
    const val = parseFloat(valStr);
    if (isNaN(val) || val < 0) {
      setValidationError('Please enter a valid positive discount number.');
      return;
    }
    if (type === 'percentage' && val > 100) {
      setValidationError('Discount cannot be greater than 100%.');
      return;
    }
    if (type === 'fixed' && editingProduct && val > editingProduct.price) {
      setValidationError('Discount amount cannot be greater than the product price.');
      return;
    }
    setValidationError('');
  };

  const handleToggleDiscount = (enabled) => {
    setIsDiscounted(enabled);
    handleDiscountChange(discountValue, discountType, enabled);
  };

  const handleTypeChange = (newType) => {
    setDiscountType(newType);
    setDiscountValue('');
    setValidationError('');
  };

  // Save edits
  const handleSave = (e) => {
    e.preventDefault();
    if (isDiscounted) {
      const val = parseFloat(discountValue);
      if (isNaN(val) || val <= 0) {
        setValidationError('Please specify a discount value greater than 0.');
        return;
      }
      if (discountType === 'percentage' && val > 100) {
        setValidationError('Discount cannot be greater than 100%.');
        return;
      }
      if (discountType === 'fixed' && editingProduct && val > editingProduct.price) {
        setValidationError('Discount amount cannot be greater than the product price.');
        return;
      }
    }

    const updated = {
      ...editingProduct,
      is_discounted: isDiscounted,
      discount_type: discountType,
      discount_value: isDiscounted ? parseFloat(discountValue) : 0,
    };

    onUpdateProduct(updated);
    setSaveSuccessMsg('Product discount updated successfully!');
    setTimeout(() => {
      setEditingProduct(null);
      setSaveSuccessMsg('');
    }, 900);
  };

  // Quick preset test triggers for validation demo
  const triggerValidationDemo = (type) => {
    if (type === 'over100') {
      setIsDiscounted(true);
      setDiscountType('percentage');
      setDiscountValue('120');
      setValidationError('Discount cannot be greater than 100%.');
    } else if (type === 'overPrice') {
      setIsDiscounted(true);
      setDiscountType('fixed');
      setDiscountValue('200000');
      setValidationError('Discount amount cannot be greater than the product price.');
    }
  };

  // Format currency
  const formatNaira = (amount) => {
    return '₦' + Math.round(amount).toLocaleString();
  };

  // Calculate product display prices
  const getProductPrices = (product) => {
    const calc = calculatePrice(product.price, product.is_discounted, product.discount_type, product.discount_value);
    return {
      originalPrice: formatNaira(calc.originalPrice),
      newPrice: formatNaira(calc.newPrice),
      badgeText: product.discount_type === 'percentage' 
        ? `${product.discount_value}% OFF` 
        : `${formatNaira(product.discount_value)} OFF`,
      isDiscounted: product.is_discounted && calc.newPrice < calc.originalPrice
    };
  };

  // Selected product for customer detail view
  const currentDetailProduct = products.find(p => p.id === selectedProductId) || products[0];

  // -------------------------------------------------------------
  // ADMIN VIEW
  // -------------------------------------------------------------
  if (viewMode === 'admin') {
    return (
      <div className="space-y-6 font-sans text-slate-900">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage the products and pricing rules available on Unboxie.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSwitchToCustomer('customer')}
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200/70 transition"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Preview Customer View</span>
            </button>
            <button
              onClick={() => handleOpenEdit(products[0])}
              className="inline-flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/50 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-5">Product</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Price</th>
                  <th className="py-3.5 px-5">Discount Status</th>
                  <th className="py-3.5 px-5">Stock</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const priceInfo = getProductPrices(product);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition">
                      {/* Product Name & Image */}
                      <td className="py-4 px-5 font-medium text-slate-900">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200/70"
                          />
                          <div>
                            <div className="font-semibold text-slate-900 text-xs">{product.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{product.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-5 text-slate-600">{product.category}</td>

                      {/* Price */}
                      <td className="py-4 px-5 font-medium">
                        {priceInfo.isDiscounted ? (
                          <div>
                            <span className="text-slate-400 line-through text-[11px] mr-1.5">
                              {priceInfo.originalPrice}
                            </span>
                            <span className="text-slate-900 font-bold">
                              {priceInfo.newPrice}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-900 font-bold">{priceInfo.originalPrice}</span>
                        )}
                      </td>

                      {/* Discount Badge */}
                      <td className="py-4 px-5">
                        {priceInfo.isDiscounted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200/70">
                            <Tag className="w-3 h-3 mr-1 text-orange-500" />
                            {priceInfo.badgeText}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">—</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-5 text-slate-700 font-mono">{product.stock}</td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/80 px-2.5 py-1.5 rounded-lg border border-orange-200/70 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit / Discount</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDIT / DISCOUNT DRAWER MODAL */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Drawer Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Edit Product Discount</h2>
                  <p className="text-xs text-slate-500">{editingProduct.name}</p>
                </div>
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200/70 text-emerald-700 rounded-lg text-xs flex items-center space-x-2 font-medium">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {/* Readonly product details */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Product Name</span>
                    <span className="font-semibold text-slate-800">{editingProduct.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Category</span>
                    <span className="font-semibold text-slate-800">{editingProduct.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Original Price</span>
                    <span className="font-semibold text-slate-900 font-mono text-sm">{formatNaira(editingProduct.price)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Stock / Status</span>
                    <span className="font-semibold text-slate-800">{editingProduct.stock} units ({editingProduct.status})</span>
                  </div>
                </div>

                {/* Discount Section */}
                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <Tag className="w-3.5 h-3.5 text-orange-500" />
                        <span>Discount Settings</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">Apply promotional pricing to this product.</p>
                    </div>

                    {/* Discounted Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isDiscounted} 
                        onChange={(e) => handleToggleDiscount(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      <span className="ml-2 text-xs font-semibold text-slate-700">
                        {isDiscounted ? 'ON' : 'OFF'}
                      </span>
                    </label>
                  </div>

                  {!isDiscounted ? (
                    <div className="bg-slate-50 rounded-xl p-3.5 text-center text-xs text-slate-500 border border-dashed border-slate-200/80">
                      No discount applied. Standard selling price ({formatNaira(editingProduct.price)}) applies.
                    </div>
                  ) : (
                    <div className="space-y-4 bg-orange-50/40 p-4 rounded-xl border border-orange-200/70">
                      {/* Discount Type Selector */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Discount Type
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleTypeChange('percentage')}
                            className={`flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                              discountType === 'percentage'
                                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <Percent className="w-3.5 h-3.5" />
                            <span>Percentage (%)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTypeChange('fixed')}
                            className={`flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                              discountType === 'fixed'
                                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Fixed Amount (₦)</span>
                          </button>
                        </div>
                      </div>

                      {/* Discount Value Input */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₦)'}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={discountValue}
                            onChange={(e) => handleDiscountChange(e.target.value, discountType, isDiscounted)}
                            placeholder={discountType === 'percentage' ? 'e.g. 20' : 'e.g. 20000'}
                            className={`w-full text-xs font-semibold rounded-lg border px-3 py-2 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none ${
                              validationError ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'
                            }`}
                          />
                        </div>

                        {/* Validation Error Message */}
                        {validationError && (
                          <div className="mt-2 text-xs text-rose-700 font-medium flex items-center space-x-1.5 bg-rose-50 p-2 rounded-lg border border-rose-200/70">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                            <span>{validationError}</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Test Validation Buttons */}
                      <div className="pt-2 border-t border-orange-200/60">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Test Frontend Validation Rules:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => triggerValidationDemo('over100')}
                            className="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-md border border-rose-200/60 transition"
                          >
                            Simulate &gt;100% Discount (e.g. 120%)
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerValidationDemo('overPrice')}
                            className="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-md border border-rose-200/60 transition"
                          >
                            Simulate &gt;Product Price (e.g. ₦200k)
                          </button>
                        </div>
                      </div>

                      {/* Live Calculation Preview */}
                      {!validationError && (
                        <div className="bg-white p-3 rounded-lg border border-orange-200/70 space-y-1 text-xs">
                          <div className="font-semibold text-slate-700 border-b border-slate-100 pb-1 flex justify-between">
                            <span>Calculation Preview</span>
                            <span className="text-orange-600 font-bold text-[10px]">LIVE UPDATING</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Original Price:</span>
                            <span className="font-mono">{formatNaira(editingProduct.price)}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Discount:</span>
                            <span className="text-rose-600 font-mono">
                              - {formatNaira(calculatePrice(editingProduct.price, isDiscounted, discountType, discountValue).discountAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100 text-xs">
                            <span>New Price:</span>
                            <span className="text-orange-600 font-mono">
                              {formatNaira(calculatePrice(editingProduct.price, isDiscounted, discountType, discountValue).newPrice)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!!validationError}
                    className={`px-4 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs transition ${
                      validationError
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // CUSTOMER VIEW — Product Catalog Listing & Product Details
  // -------------------------------------------------------------
  if (viewMode === 'customer-detail') {
    const priceInfo = getProductPrices(currentDetailProduct);
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 font-sans text-slate-900">
        <button
          onClick={() => onSwitchToCustomer('customer')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600 mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gift Catalog</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="relative">
            <img 
              src={currentDetailProduct.image} 
              alt={currentDetailProduct.name} 
              className="w-full h-80 object-cover rounded-xl border border-slate-100"
            />
            {priceInfo.isDiscounted && (
              <span className="absolute top-3 left-3 bg-orange-500 text-white font-bold text-xs px-3 py-1 rounded shadow-xs">
                {priceInfo.badgeText}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider">
                  {currentDetailProduct.category}
                </span>
                <h1 className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentDetailProduct.name}
                </h1>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                {priceInfo.isDiscounted ? (
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-extrabold text-orange-600">
                        {priceInfo.newPrice}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        {priceInfo.originalPrice}
                      </span>
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded border border-orange-200">
                        {priceInfo.badgeText}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-2xl font-extrabold text-slate-900">
                    {priceInfo.originalPrice}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>In Stock ({currentDetailProduct.stock} available)</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {currentDetailProduct.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={() => onSwitchToCustomer('checkout')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-xs transition flex items-center justify-center space-x-2 text-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Box & Proceed to Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CUSTOMER CATALOG LISTING
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Discover Gifts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Browse curated gift options for your loved ones.</p>
        </div>
        <button
          onClick={() => onSwitchToCustomer('admin')}
          className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition"
        >
          Return to Admin Panel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const priceInfo = getProductPrices(product);
          return (
            <div
              key={product.id}
              onClick={() => {
                setSelectedProductId(product.id);
                onSwitchToCustomer('customer-detail');
              }}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                />
                {priceInfo.isDiscounted && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
                    {priceInfo.badgeText}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-slate-900 text-xs mt-0.5 line-clamp-1 group-hover:text-orange-600 transition">
                    {product.name}
                  </h3>
                </div>

                <div>
                  {priceInfo.isDiscounted ? (
                    <div className="flex items-baseline space-x-2">
                      <span className="text-sm font-extrabold text-orange-600">
                        {priceInfo.newPrice}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {priceInfo.originalPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-slate-900">
                      {priceInfo.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
