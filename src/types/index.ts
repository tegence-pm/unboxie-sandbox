export type VendorType = 'Souvenir Vendor' | 'Customization Vendor';
export type VendorSource = 'Online' | 'Offline';
export type VendorStatus = 'Active' | 'Inactive';

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  source: VendorSource;
  phone: string;
  state: string;
  cityLga: string;
  address: string;
  categories: string[];
  notes?: string;
  status: VendorStatus;
  createdAt: string;
  lastUsedDate?: string;
  timesUsed: number;
}

export interface Product {
  id: string;
  name: string;
  sampleImage?: string;
  description: string;
  categories: string[];
  basePrice?: number;
  linkedVendorIds: string[];
  createdAt: string;
}

export interface PackagingOption {
  id: string;
  name: string;
  description: string;
  sampleImage?: string;
  dimensions?: string;
  linkedVendorIds: string[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId?: string;
  packagingId?: string;
  itemType: 'product' | 'packaging';
  name: string;
  image?: string;
  customisation?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  sourcedVendorId?: string;
  sourcingStatus: 'pending' | 'sourced' | 'unavailable';
  sourcingNotes?: string;
  sourcedAt?: string;
}

export type OrderStatus = 
  | 'Placed' 
  | 'Order Confirmed' 
  | 'Ready' 
  | 'Order Dispatched' 
  | 'Order Delivered' 
  | 'Completed' 
  | 'Cancelled'
  | 'Pending Sourcing'
  | 'Sourced'
  | 'In Assembly'
  | 'Fulfilled';

export interface DeliveryPartner {
  name: string;
  role: string;
  phone: string;
  email?: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. UBX-37FYGP4X
  customerName: string;
  customerPhone?: string;
  customerEmail: string;
  deliveryMode: string; // e.g. DELIVERY / PICKUP
  senderIdentity: string; // e.g. Visible to recipient / Anonymous
  packagingName?: string;
  packagingVendorId?: string;
  
  recipientName: string;
  recipientEmail?: string;
  recipientPhone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  postcode?: string;
  country: string;

  deliveryPartner?: DeliveryPartner;
  giftMessage?: string;

  datePlaced: string;
  status: OrderStatus;
  paymentStatus: 'Payment Successful' | 'Pending' | 'Failed';
  deliveryFee: number;
  totalAmount: number;
  
  items: OrderItem[];
  notes?: string;
}

export type CostBearer = 'Unboxie' | 'Vendor';
export type IncidentStatus = 'Open' | 'Resolved';

export type IssueType =
  | 'Damaged Product'
  | 'Wrong Colour'
  | 'Wrong Quantity'
  | 'Incomplete Product'
  | 'Different Product'
  | 'Vendor Delay'
  | 'Additional Cost Incurred'
  | 'Unexpected Vendor Cancellation'
  | 'Other';

export interface Incident {
  id: string;
  orderId: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  itemId?: string;
  itemName: string;
  issueType?: IssueType | string;
  description: string;
  cost: number; // in Naira (₦)
  costCoveredBy: CostBearer;
  status: IncidentStatus;
  createdAt: string;
}
