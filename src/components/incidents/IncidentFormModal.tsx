import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";
import { CostBearer, IncidentStatus, Incident, IssueType } from "../../types";
import {
  AlertCircle,
  DollarSign,
  ShoppingBag,
  Store,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface IncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentToEdit?: Incident | null;
  prefillOrderId?: string;
  prefillVendorId?: string;
  prefillItemId?: string;
  prefillItemName?: string;
}

const ISSUE_TYPE_OPTIONS: {
  value: IssueType;
  label: string;
  description: string;
}[] = [
  {
    value: "Damaged Product",
    label: "Damaged Product",
    description: "Arrived broken, scratched, or defective.",
  },
  {
    value: "Wrong Colour",
    label: "Wrong Colour",
    description: "Delivered an incorrect color variant.",
  },
  {
    value: "Wrong Quantity",
    label: "Wrong Quantity",
    description: "Delivered fewer or more items than purchased.",
  },
  {
    value: "Incomplete Product",
    label: "Incomplete Product",
    description: "Missing components or accessories.",
  },
  {
    value: "Different Product",
    label: "Different Product",
    description: "Delivered the wrong item entirely.",
  },
  {
    value: "Vendor Delay",
    label: "Vendor Delay",
    description: "Supplier missed the agreed handoff time.",
  },
  {
    value: "Additional Cost Incurred",
    label: "Additional Cost Incurred",
    description: "Sourcing required unforeseen extra expenses.",
  },
  {
    value: "Unexpected Vendor Cancellation",
    label: "Unexpected Vendor Cancellation",
    description: "Supplier backed out after accepting the order.",
  },
  {
    value: "Other",
    label: "Other",
    description: "Custom or miscellaneous fulfillment issue.",
  },
];

export const IncidentFormModal: React.FC<IncidentFormModalProps> = ({
  isOpen,
  onClose,
  incidentToEdit,
  prefillOrderId,
  prefillVendorId,
  prefillItemId,
  prefillItemName,
}) => {
  const { addIncident, updateIncident, orders, vendors } = useApp();

  const [orderId, setOrderId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [issueType, setIssueType] = useState<IssueType>("Damaged Product");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState<number | "">("");
  const [costCoveredBy, setCostCoveredBy] = useState<CostBearer>("Vendor");
  const [status, setStatus] = useState<IncidentStatus>("Resolved");

  // Selected Order object to populate items
  const selectedOrder = orders.find((o) => o.id === orderId);

  useEffect(() => {
    if (incidentToEdit) {
      setOrderId(incidentToEdit.orderId);
      setVendorId(incidentToEdit.vendorId);
      setItemId(incidentToEdit.itemId || "");
      setItemName(incidentToEdit.itemName);
      setIssueType(
        (incidentToEdit.issueType as IssueType) || "Damaged Product",
      );
      setDescription(incidentToEdit.description);
      setCost(incidentToEdit.cost);
      setCostCoveredBy(incidentToEdit.costCoveredBy);
      setStatus(incidentToEdit.status);
    } else {
      const initialOrderId = prefillOrderId || orders[0]?.id || "";
      setOrderId(initialOrderId);

      const order = orders.find((o) => o.id === initialOrderId);
      const firstItem =
        order?.items.find((i) =>
          prefillItemId ? i.id === prefillItemId : true,
        ) || order?.items[0];

      setItemId(prefillItemId || firstItem?.id || "");
      setItemName(
        prefillItemName || firstItem?.name || "General Order Fulfillment Issue",
      );

      const autoVendorId =
        prefillVendorId || firstItem?.sourcedVendorId || vendors[0]?.id || "";
      setVendorId(autoVendorId);

      setIssueType("Damaged Product");
      setDescription("");
      setCost("");
      setCostCoveredBy("Vendor");
      setStatus("Resolved");
    }
  }, [
    incidentToEdit,
    prefillOrderId,
    prefillVendorId,
    prefillItemId,
    prefillItemName,
    isOpen,
    orders,
    vendors,
  ]);

  // When order changes in dropdown, auto update available items
  const handleOrderChange = (newOrderId: string) => {
    setOrderId(newOrderId);
    const ord = orders.find((o) => o.id === newOrderId);
    if (ord && ord.items.length > 0) {
      const first = ord.items[0];
      setItemId(first.id);
      setItemName(first.name);
      if (first.sourcedVendorId) {
        setVendorId(first.sourcedVendorId);
      }
    }
  };

  // When product/item changes in dropdown, auto pick the responsible vendor if assigned
  const handleItemChange = (newItemId: string) => {
    setItemId(newItemId);
    if (newItemId === "general") {
      setItemName("General Order Fulfillment Issue");
    } else if (selectedOrder) {
      const it = selectedOrder.items.find((i) => i.id === newItemId);
      if (it) {
        setItemName(it.name);
        if (it.sourcedVendorId) {
          setVendorId(it.sourcedVendorId);
        }
      }
    }
  };

  const selectedIssueTypeMeta = ISSUE_TYPE_OPTIONS.find(
    (opt) => opt.value === issueType,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !vendorId || !description.trim()) return;

    const ord = orders.find((o) => o.id === orderId);
    const ven = vendors.find((v) => v.id === vendorId);
    const costNum = Number(cost) || 0;

    if (incidentToEdit) {
      updateIncident(incidentToEdit.id, {
        orderId,
        orderNumber: ord?.orderNumber || "ORD-N/A",
        vendorId,
        vendorName: ven?.name || "Unknown Vendor",
        itemId: itemId || undefined,
        itemName: itemName || "Order Item",
        issueType,
        description: description.trim(),
        cost: costNum,
        costCoveredBy,
        status,
      });
    } else {
      addIncident({
        orderId,
        orderNumber: ord?.orderNumber || "ORD-N/A",
        vendorId,
        vendorName: ven?.name || "Unknown Vendor",
        itemId: itemId || undefined,
        itemName: itemName || "Order Item",
        issueType,
        description: description.trim(),
        cost: costNum,
        costCoveredBy,
        status,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={incidentToEdit ? "Edit Order Incident" : "Record Order Incident"}
      subtitle="Log fulfillment defects, responsible vendor, and cost liability."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-1">
        {/* Section 1: Order & Sourcing Details */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-xs font-bold uppercase tracking-wider text-slate-600">
            <ShoppingBag className="w-3.5 h-3.5 text-brand-600" />
            <span>Order & Sourcing Context</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Associated Order <span className="text-rose-500">*</span>
              </label>
              <select
                value={orderId}
                onChange={(e) => handleOrderChange(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs font-medium text-slate-800"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} — {o.customerName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Affected Product
              </label>
              <select
                value={itemId}
                onChange={(e) => handleItemChange(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs text-slate-800"
              >
                {selectedOrder?.items.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name} (x{it.quantity})
                  </option>
                ))}
                <option value="general">Entire Order / Packaging Issue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Responsible Vendor <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs font-semibold text-slate-900"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.type})
                  </option>
                ))}
              </select>
              <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Section 2: Issue Classification & Description */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-4 shadow-subtle">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Issue Details</span>
            </div>

            {/* Status toggle pill */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setStatus("Open")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  status === "Open"
                    ? "bg-amber-500 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Open</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus("Resolved")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  status === "Resolved"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Resolved</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Issue Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as IssueType)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs font-semibold text-slate-900"
            >
              {ISSUE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {selectedIssueTypeMeta && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <Info className="w-3 h-3 text-brand-500 shrink-0" />
                <span>{selectedIssueTypeMeta.description}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detail specifically what went wrong, condition on arrival, or timeline issues..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs resize-none"
            />
          </div>
        </div>

        {/* Section 3: Cost & Liability */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-xs font-bold uppercase tracking-wider text-slate-600">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Financial Liability</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cost Incurred (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                  ₦
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={cost}
                  onChange={(e) =>
                    setCost(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Who Covered the Cost? <span className="text-rose-500">*</span>
              </label>
              <select
                value={costCoveredBy}
                onChange={(e) => setCostCoveredBy(e.target.value as CostBearer)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs font-semibold text-slate-800"
              >
                <option value="Vendor">Vendor (Vendor absorbed)</option>
                <option value="Unboxie">Unboxie (Unboxie absorbed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {incidentToEdit ? "Save Changes" : "Record Incident"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
