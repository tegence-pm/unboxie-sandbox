import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Vendor, 
  Product, 
  PackagingOption, 
  Order, 
  Incident, 
  VendorStatus 
} from '../types';
import { 
  INITIAL_VENDORS, 
  INITIAL_PRODUCTS, 
  INITIAL_PACKAGING, 
  INITIAL_ORDERS, 
  INITIAL_INCIDENTS 
} from '../data/initialData';
import { generateId } from '../utils/formatters';

export type ViewState = 
  | { type: 'vendor-list' }
  | { type: 'vendor-detail'; id: string }
  | { type: 'vendor-form'; id?: string }
  | { type: 'product-list' }
  | { type: 'product-detail'; id: string }
  | { type: 'product-form'; id?: string }
  | { type: 'packaging-list' }
  | { type: 'packaging-detail'; id: string }
  | { type: 'packaging-form'; id?: string }
  | { type: 'order-list' }
  | { type: 'order-detail'; id: string }
  | { type: 'order-form' }
  | { type: 'incident-list' }
  | { type: 'incident-form'; id?: string; prefill?: { orderId?: string; vendorId?: string; itemId?: string; itemName?: string } };

interface AppContextType {
  // State
  vendors: Vendor[];
  products: Product[];
  packagingOptions: PackagingOption[];
  orders: Order[];
  incidents: Incident[];
  
  // Navigation
  activeTab: 'vendors' | 'products-packaging' | 'orders-incidents';
  setActiveTab: (tab: 'vendors' | 'products-packaging' | 'orders-incidents') => void;
  
  productSubTab: 'products' | 'packaging';
  setProductSubTab: (tab: 'products' | 'packaging') => void;
  orderSubTab: 'orders' | 'incidents';
  setOrderSubTab: (tab: 'orders' | 'incidents') => void;

  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;

  // Selected details (for modals if needed)
  selectedVendorId: string | null;
  setSelectedVendorId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Vendor actions
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'timesUsed'>) => Vendor;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  toggleVendorStatus: (id: string) => void;

  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Packaging actions
  addPackaging: (packaging: Omit<PackagingOption, 'id' | 'createdAt'>) => PackagingOption;
  updatePackaging: (id: string, updates: Partial<PackagingOption>) => void;
  deletePackaging: (id: string) => void;

  // Order actions
  addOrder: (order: Omit<Order, 'id'>) => Order;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  sourceOrderItem: (orderId: string, itemId: string, vendorId: string, sourcingNotes?: string) => void;

  // Incident actions
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt'>) => Incident;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;

  // Helper getters
  getVendorById: (id: string) => Vendor | undefined;
  getProductById: (id: string) => Product | undefined;
  getPackagingById: (id: string) => PackagingOption | undefined;
  getOrderById: (id: string) => Order | undefined;
  getVendorIncidents: (vendorId: string) => Incident[];
  getVendorProducts: (vendorId: string) => Product[];
  getVendorPackaging: (vendorId: string) => PackagingOption[];
  getVendorOrders: (vendorId: string) => { order: Order; items: string[] }[];
  getVendorPerformance: (vendorId: string) => {
    timesUsed: number;
    totalSourcedItems: number;
    issueCount: number;
    issueRate: number;
    reliabilityScore: number;
    totalIssueCost: number;
    costCoveredByVendor: number;
    costCoveredByUnboxie: number;
    lastUsedDate?: string;
  };

  // Reset
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VENDORS: 'unboxie_admin_vendors_v4',
  PRODUCTS: 'unboxie_admin_products_v4',
  PACKAGING: 'unboxie_admin_packaging_v4',
  ORDERS: 'unboxie_admin_orders_v4',
  INCIDENTS: 'unboxie_admin_incidents_v4',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VENDORS);
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [packagingOptions, setPackagingOptions] = useState<PackagingOption[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PACKAGING);
    return saved ? JSON.parse(saved) : INITIAL_PACKAGING;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'vendors' | 'products-packaging' | 'orders-incidents'>('vendors');
  const [productSubTab, setProductSubTab] = useState<'products' | 'packaging'>('products');
  const [orderSubTab, setOrderSubTab] = useState<'orders' | 'incidents'>('orders');
  
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'vendor-list' });

  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PACKAGING, JSON.stringify(packagingOptions));
  }, [packagingOptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  // VENDOR ACTIONS
  const addVendor = (vendorData: Omit<Vendor, 'id' | 'createdAt' | 'timesUsed'>): Vendor => {
    const newVendor: Vendor = {
      ...vendorData,
      id: generateId('v'),
      createdAt: new Date().toISOString(),
      timesUsed: 0,
    };
    setVendors(prev => [newVendor, ...prev]);
    return newVendor;
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
    setProducts(prev => prev.map(p => ({
      ...p,
      linkedVendorIds: p.linkedVendorIds.filter(vid => vid !== id),
    })));
    setPackagingOptions(prev => prev.map(pkg => ({
      ...pkg,
      linkedVendorIds: pkg.linkedVendorIds.filter(vid => vid !== id),
    })));
    if (selectedVendorId === id) setSelectedVendorId(null);
  };

  const toggleVendorStatus = (id: string) => {
    setVendors(prev => prev.map(v => {
      if (v.id !== id) return v;
      const nextStatus: VendorStatus = v.status === 'Active' ? 'Inactive' : 'Active';
      return { ...v, status: nextStatus };
    }));
  };

  // PRODUCT ACTIONS
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: generateId('p'),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // PACKAGING ACTIONS
  const addPackaging = (packagingData: Omit<PackagingOption, 'id' | 'createdAt'>): PackagingOption => {
    const newPackaging: PackagingOption = {
      ...packagingData,
      id: generateId('pkg'),
      createdAt: new Date().toISOString(),
    };
    setPackagingOptions(prev => [newPackaging, ...prev]);
    return newPackaging;
  };

  const updatePackaging = (id: string, updates: Partial<PackagingOption>) => {
    setPackagingOptions(prev => prev.map(pkg => (pkg.id === id ? { ...pkg, ...updates } : pkg)));
  };

  const deletePackaging = (id: string) => {
    setPackagingOptions(prev => prev.filter(pkg => pkg.id !== id));
  };

  // ORDER ACTIONS
  const addOrder = (orderData: Omit<Order, 'id'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: generateId('ord'),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    if (selectedOrderId === id) setSelectedOrderId(null);
  };

  const sourceOrderItem = (orderId: string, itemId: string, vendorId: string, sourcingNotes?: string) => {
    const now = new Date().toISOString();
    
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      
      const updatedItems = order.items.map(item => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          sourcedVendorId: vendorId || undefined,
          sourcingStatus: vendorId ? ('sourced' as const) : ('pending' as const),
          sourcingNotes: sourcingNotes !== undefined ? sourcingNotes : item.sourcingNotes,
          sourcedAt: vendorId ? now : undefined,
        };
      });

      const allSourced = updatedItems.every(it => it.sourcingStatus === 'sourced');
      let newStatus = order.status;
      if (allSourced && order.status === 'Pending Sourcing') {
        newStatus = 'Sourced';
      }

      return {
        ...order,
        items: updatedItems,
        status: newStatus,
      };
    }));

    if (vendorId) {
      setVendors(prev => prev.map(v => {
        if (v.id !== vendorId) return v;
        return {
          ...v,
          timesUsed: (v.timesUsed || 0) + 1,
          lastUsedDate: now,
          status: 'Active',
        };
      }));
    }
  };

  // INCIDENT ACTIONS
  const addIncident = (incidentData: Omit<Incident, 'id' | 'createdAt'>): Incident => {
    const newIncident: Incident = {
      ...incidentData,
      id: generateId('inc'),
      createdAt: new Date().toISOString(),
    };
    setIncidents(prev => [newIncident, ...prev]);
    return newIncident;
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents(prev => prev.map(inc => (inc.id === id ? { ...inc, ...updates } : inc)));
  };

  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
  };

  // GETTERS
  const getVendorById = (id: string) => vendors.find(v => v.id === id);
  const getProductById = (id: string) => products.find(p => p.id === id);
  const getPackagingById = (id: string) => packagingOptions.find(pkg => pkg.id === id);
  const getOrderById = (id: string) => orders.find(o => o.id === id);

  const getVendorIncidents = (vendorId: string) => {
    return incidents.filter(inc => inc.vendorId === vendorId);
  };

  const getVendorProducts = (vendorId: string) => {
    return products.filter(p => p.linkedVendorIds.includes(vendorId));
  };

  const getVendorPackaging = (vendorId: string) => {
    return packagingOptions.filter(pkg => pkg.linkedVendorIds.includes(vendorId));
  };

  const getVendorOrders = (vendorId: string) => {
    const result: { order: Order; items: string[] }[] = [];
    orders.forEach(order => {
      const matchedItems = order.items
        .filter(it => it.sourcedVendorId === vendorId)
        .map(it => it.name);
      if (matchedItems.length > 0) {
        result.push({ order, items: matchedItems });
      }
    });
    return result;
  };

  const getVendorPerformance = (vendorId: string) => {
    const vendor = getVendorById(vendorId);
    const vendorIncidents = getVendorIncidents(vendorId);
    
    const timesUsed = vendor?.timesUsed || 0;
    const issueCount = vendorIncidents.length;

    // Count total items sourced from this vendor across all orders
    let totalSourcedItems = 0;
    orders.forEach(order => {
      order.items.forEach(it => {
        if (it.sourcedVendorId === vendorId) {
          totalSourcedItems += it.quantity || 1;
        }
      });
      if (order.packagingVendorId === vendorId) {
        totalSourcedItems += 1;
      }
    });

    const effectiveSourcedCount = Math.max(timesUsed, totalSourcedItems);
    
    let totalIssueCost = 0;
    let costCoveredByVendor = 0;
    let costCoveredByUnboxie = 0;

    vendorIncidents.forEach(inc => {
      totalIssueCost += inc.cost || 0;
      if (inc.costCoveredBy === 'Vendor') {
        costCoveredByVendor += inc.cost || 0;
      } else if (inc.costCoveredBy === 'Unboxie') {
        costCoveredByUnboxie += inc.cost || 0;
      } else if (inc.costCoveredBy === 'Split' && inc.costSplitDetails) {
        costCoveredByVendor += inc.costSplitDetails.vendorAmount || 0;
        costCoveredByUnboxie += inc.costSplitDetails.unboxieAmount || 0;
      }
    });

    // Issue Rate = (Total Incidents ÷ Total Sourced Items) × 100
    const rawIssueRate = effectiveSourcedCount > 0 
      ? (issueCount / effectiveSourcedCount) * 100 
      : 0;
    const issueRate = Number(rawIssueRate.toFixed(1));

    // Reliability/Trust Score = 100% - Issue Rate
    const reliabilityScore = effectiveSourcedCount > 0 
      ? Math.max(0, Math.min(100, Number((100 - rawIssueRate).toFixed(1)))) 
      : 100;

    return {
      timesUsed,
      totalSourcedItems: effectiveSourcedCount,
      issueCount,
      issueRate,
      reliabilityScore,
      totalIssueCost,
      costCoveredByVendor,
      costCoveredByUnboxie,
      lastUsedDate: vendor?.lastUsedDate,
    };
  };

  const resetToDefaultData = () => {
    setVendors(INITIAL_VENDORS);
    setProducts(INITIAL_PRODUCTS);
    setPackagingOptions(INITIAL_PACKAGING);
    setOrders(INITIAL_ORDERS);
    setIncidents(INITIAL_INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.VENDORS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.PACKAGING);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
  };

  const value = useMemo(() => ({
    vendors,
    products,
    packagingOptions,
    orders,
    incidents,
    activeTab,
    setActiveTab,
    productSubTab,
    setProductSubTab,
    orderSubTab,
    setOrderSubTab,
    currentView,
    setCurrentView,
    selectedVendorId,
    setSelectedVendorId,
    selectedOrderId,
    setSelectedOrderId,
    searchQuery,
    setSearchQuery,
    addVendor,
    updateVendor,
    deleteVendor,
    toggleVendorStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    addPackaging,
    updatePackaging,
    deletePackaging,
    addOrder,
    updateOrder,
    deleteOrder,
    sourceOrderItem,
    addIncident,
    updateIncident,
    deleteIncident,
    getVendorById,
    getProductById,
    getPackagingById,
    getOrderById,
    getVendorIncidents,
    getVendorProducts,
    getVendorPackaging,
    getVendorOrders,
    getVendorPerformance,
    resetToDefaultData,
  }), [
    vendors,
    products,
    packagingOptions,
    orders,
    incidents,
    activeTab,
    productSubTab,
    orderSubTab,
    currentView,
    selectedVendorId,
    selectedOrderId,
    searchQuery,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
