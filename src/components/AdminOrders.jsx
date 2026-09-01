import React, { useState } from 'react';
import { 
  Truck, 
  User, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Building2, 
  X, 
  ArrowLeft, 
  Gift, 
  MessageSquare, 
  AlertCircle,
  ShieldAlert,
  Eye,
  ChevronRight
} from 'lucide-react';

export default function AdminOrders({ 
  shipments, 
  partners, 
  feedbackList, 
  onUpdateShipmentStatus, 
  onAssignPartner 
}) {
  // Selected Order for detail page view (null = show table list)
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState('');
  const [assignmentSuccessMsg, setAssignmentSuccessMsg] = useState('');

  // Selected Order object
  const activeOrder = shipments.find(s => s.orderId === selectedOrderId);

  // Currency helper
  const formatNaira = (amount) => '₦' + Math.round(amount).toLocaleString();

  // Associated Customer Feedback (if any)
  const orderFeedback = feedbackList.find(f => f.orderId === activeOrder?.orderId);

  // Logistics tracking sequence
  const trackingSequence = [
    'Order Ready',
    'Assigned',
    'Picked Up from Unboxie',
    'Out for Delivery',
    'Delivered'
  ];

  const handleAssignPartner = (e) => {
    e.preventDefault();
    if (!selectedPartnerName || !activeOrder) return;
    onAssignPartner(activeOrder.orderId, selectedPartnerName);
    setAssignmentSuccessMsg(`Partner "${selectedPartnerName}" assigned successfully! Delivery tracking is now active.`);
    setTimeout(() => setAssignmentSuccessMsg(''), 3000);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Order Ready': 'bg-slate-100 text-slate-700 border-slate-200',
      'Assigned': 'bg-blue-50 text-blue-700 border-blue-200/80',
      'Picked Up from Unboxie': 'bg-purple-50 text-purple-700 border-purple-200/80',
      'Out for Delivery': 'bg-orange-50 text-orange-700 border-orange-200/80',
      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      'Failed': 'bg-rose-50 text-rose-700 border-rose-200/80',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
        {status}
      </span>
    );
  };

  // Helper check if order is assigned
  const isAssigned = activeOrder && activeOrder.partner && activeOrder.partner !== 'Pending Assignment';

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: ORDERS TABLE LIST (Main Page) */}
      {/* ------------------------------------------------------------- */}
      {!selectedOrderId ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Orders</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage incoming customer gift orders, assign delivery partners, and track shipments.
              </p>
            </div>
          </div>

          {/* Clean SaaS Orders Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex justify-between items-center text-xs font-semibold text-slate-500">
              <span className="uppercase tracking-wider text-[11px]">All Orders ({shipments.length})</span>
              <span className="text-slate-400 font-normal">
                Click "View Order" to assign a partner & unlock live tracking
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/50 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-5">Order ID</th>
                    <th className="py-3.5 px-5">Customer</th>
                    <th className="py-3.5 px-5">Delivery Location</th>
                    <th className="py-3.5 px-5">Logistics Partner</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((ord) => {
                    const hasPartner = ord.partner && ord.partner !== 'Pending Assignment';
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                        {/* Order ID */}
                        <td className="py-4 px-5 font-mono font-bold text-orange-600">
                          {ord.orderId}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-5 font-semibold text-slate-900">
                          {ord.customer}
                        </td>

                        {/* Delivery Location */}
                        <td className="py-4 px-5">
                          <div className="text-slate-900 font-medium">{ord.deliveryType}</div>
                          <div className="text-slate-500 text-[11px]">{ord.location}</div>
                        </td>

                        {/* Logistics Partner */}
                        <td className="py-4 px-5">
                          {hasPartner ? (
                            <span className="inline-flex items-center space-x-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md text-xs border border-emerald-200/60">
                              <Truck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{ord.partner}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md text-xs border border-amber-200/60">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Unassigned</span>
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">{getStatusBadge(ord.status)}</td>

                        {/* Date */}
                        <td className="py-4 px-5 text-slate-500">{ord.date}</td>

                        {/* Action */}
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrderId(ord.orderId);
                              setSelectedPartnerName('');
                            }}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/80 px-3 py-1.5 rounded-lg border border-orange-200/70 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Order</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* VIEW 2: INDIVIDUAL ORDER PAGE DETAIL */
        /* ------------------------------------------------------------- */
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedOrderId(null)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Back to Orders</span>
          </button>

          {activeOrder && (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              {/* Order Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-slate-900 font-mono tracking-tight">{activeOrder.orderId}</h2>
                    {getStatusBadge(activeOrder.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Placed on {activeOrder.date} • Standard Checkout</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Delivery Fee</span>
                  <span className="text-base font-mono font-bold text-orange-600">{formatNaira(activeOrder.fee)}</span>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Customer Information</span>
                  <div className="font-bold text-slate-900 text-sm">{activeOrder.customer}</div>
                  <div className="text-slate-600 font-mono">Phone: {activeOrder.customerPhone || '08123456789'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Delivery Destination</span>
                  <div className="font-bold text-slate-900 text-sm">{activeOrder.deliveryType}</div>
                  <div className="text-slate-700">{activeOrder.location}</div>
                  <div className="text-slate-500 italic">{activeOrder.address}</div>
                </div>
              </div>

              {/* Attached Personal Gift Letter */}
              <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 space-y-1 text-xs">
                <div className="font-semibold text-amber-900 flex items-center space-x-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  <span>Personal Gift Message</span>
                </div>
                <p className="text-amber-950 italic text-xs font-serif leading-relaxed">
                  "Happy Birthday Mum! Thank you for always being there for me. Love you so much!"
                </p>
              </div>

              {/* ASSIGNMENT CARD */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-orange-500" />
                      <span>Assign Delivery Partner</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assign a logistics partner to unlock live delivery tracking on this order page.
                    </p>
                  </div>
                  {isAssigned && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-200/60">
                      Partner: {activeOrder.partner}
                    </span>
                  )}
                </div>

                {assignmentSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200/70 text-emerald-700 rounded-lg text-xs font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{assignmentSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAssignPartner} className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 flex flex-wrap items-end gap-4 text-xs">
                  <div className="flex-1 min-w-[220px]">
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isAssigned ? 'Reassign Partner' : 'Select Delivery Partner *'}
                    </label>
                    <select
                      value={selectedPartnerName || (isAssigned ? activeOrder.partner : '')}
                      onChange={(e) => setSelectedPartnerName(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none bg-white"
                    >
                      <option value="">-- Select Logistics Partner --</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.type} • {p.coverageType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedPartnerName}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-4 py-2 rounded-lg shadow-xs transition text-xs"
                  >
                    {isAssigned ? 'Update Partner' : 'Assign Partner'}
                  </button>
                </form>
              </div>

              {/* DELIVERY & SHIPMENT TRACKING SECTION */}
              {!isAssigned ? (
                /* UNASSIGNED PLACEHOLDER CALLOUT */
                <div className="border border-dashed border-slate-200/80 rounded-xl p-6 text-center space-y-2 bg-slate-50/50">
                  <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-800">
                    No Delivery Partner Assigned Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Assign a logistics partner above to activate delivery tracking on this order.
                  </p>
                </div>
              ) : (
                /* ASSIGNED DELIVERY INFORMATION & SHIPMENT TRACKING */
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>Delivery Information & Shipment Tracking</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Logistics tracking timeline managed directly on this order page.
                      </p>
                    </div>
                  </div>

                  {/* Sleek Progress Stepper */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
                    <div className="grid grid-cols-5 gap-2 text-center relative">
                      {trackingSequence.map((st, idx) => {
                        const currentIdx = trackingSequence.indexOf(
                          activeOrder.status === 'Assigned to GIG Logistics' || activeOrder.status === 'Assigned to Tunde Delivery' || activeOrder.status === 'Assigned to ABC Logistics'
                            ? 'Assigned'
                            : activeOrder.status
                        );
                        const isDone = currentIdx >= idx;
                        const isCurrent = currentIdx === idx;

                        return (
                          <div key={st} className="flex flex-col items-center space-y-1.5 relative z-10">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border transition ${
                              isCurrent
                                ? 'bg-orange-500 text-white border-orange-500 ring-2 ring-orange-200'
                                : isDone
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white text-slate-400 border-slate-300'
                            }`}>
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[11px] font-medium leading-tight ${isCurrent ? 'text-orange-600 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Status Controls */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/70 space-y-2">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Update Logistics Status:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {trackingSequence.map((st) => (
                        <button
                          key={st}
                          onClick={() => onUpdateShipmentStatus(activeOrder.orderId, st)}
                          className={`py-1.5 px-3 rounded-lg font-medium text-center border transition ${
                            activeOrder.status === st
                              ? 'bg-orange-500 text-white border-orange-500 font-bold shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/70'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LINKED CUSTOMER REVIEW */}
              {orderFeedback && (
                <div className="border-t border-slate-100 pt-5 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <MessageSquare className="w-4 h-4 text-orange-500" />
                    <span>Customer Review</span>
                  </div>
                  <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-200/70 text-xs space-y-1">
                    <div className="font-bold text-slate-900">
                      Rating: {"★".repeat(orderFeedback.rating)}
                    </div>
                    <p className="italic text-slate-800">“{orderFeedback.review}”</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
