import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import { ConfirmModal } from "../common/ConfirmModal";
import {
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Package,
  Layers,
  Edit3,
  Trash2,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Percent,
} from "lucide-react";
import {
  formatNaira,
  formatRelativeTime,
  formatDate,
} from "../../utils/formatters";

interface VendorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string | null;
  onEdit: () => void;
  onLogIncident: (vendorId: string) => void;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({
  isOpen,
  onClose,
  vendorId,
  onEdit,
  onLogIncident,
}) => {
  const {
    getVendorById,
    getVendorProducts,
    getVendorPackaging,
    getVendorOrders,
    getVendorIncidents,
    getVendorPerformance,
    toggleVendorStatus,
    deleteVendor,
    setSelectedOrderId,
    setActiveTab,
    setOrderSubTab,
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<
    "products" | "orders" | "incidents"
  >("products");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = useState(false);

  if (!vendorId) return null;
  const vendor = getVendorById(vendorId);
  if (!vendor) return null;

  const products = getVendorProducts(vendor.id);
  const packaging = getVendorPackaging(vendor.id);
  const orders = getVendorOrders(vendor.id);
  const incidents = getVendorIncidents(vendor.id);
  const performance = getVendorPerformance(vendor.id);

  const cleanPhone = vendor.phone?.replace(/[^0-9+]/g, "");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vendor.name}
      subtitle={`${vendor.type} • ${vendor.source} Channel`}
      maxWidth="3xl"
    >
      <div className="space-y-6 pt-1">
        {/* Top Header Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <Badge
                  variant={vendor.status === "Active" ? "success" : "neutral"}
                  dot
                  size="md"
                >
                  {vendor.status}
                </Badge>

                <Badge
                  variant={
                    vendor.type === "Souvenir Vendor" ? "brand" : "purple"
                  }
                  size="md"
                >
                  {vendor.type}
                </Badge>

                <Badge
                  variant={vendor.source === "Online" ? "blue" : "neutral"}
                  size="md"
                >
                  {vendor.source}
                </Badge>
              </div>

              {/* Contact info row */}
              <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600">
                {vendor.phone && (
                  <a
                    href={`https://wa.me/${cleanPhone.replace("+", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{vendor.phone}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}

                <span className="inline-flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {[vendor.cityLga, vendor.state]
                      .filter(Boolean)
                      .join(", ") || "Nigeria"}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Last Sourced:{" "}
                    <strong className="text-slate-700 font-semibold">
                      {formatRelativeTime(vendor.lastUsedDate)}
                    </strong>
                  </span>
                </span>
              </div>

              {vendor.address && (
                <p className="mt-2 text-xs text-slate-500 italic">
                  Address: {vendor.address}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
              {/* Status Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={vendor.status === "Active"}
                onClick={() => setIsToggleStatusModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs group cursor-pointer"
                title={
                  vendor.status === "Active"
                    ? "Click to mark as Inactive"
                    : "Click to mark as Active"
                }
              >
                <span
                  className={`text-xs font-semibold ${vendor.status === "Active" ? "text-slate-800" : "text-slate-500"}`}
                >
                  {vendor.status === "Active" ? "Active" : "Inactive"}
                </span>
                <div
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                    vendor.status === "Active"
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                      vendor.status === "Active"
                        ? "translate-x-3.5"
                        : "translate-x-0"
                    }`}
                  />
                </div>
              </button>

              <button
                onClick={onEdit}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                title="Edit Vendor"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                title="Delete Vendor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes callout */}
          {vendor.notes && (
            <div className="mt-3.5 pt-3 border-t border-slate-200 text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl">
              <span className="font-semibold text-slate-700">
                Notes & Sourcing Insights:{" "}
              </span>
              {vendor.notes}
            </div>
          )}
        </div>

        {/* 5-Column Key Sourcing Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Sourced
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-brand-500" />
            </div>
            <div>
              <div className="text-lg font-bold font-heading text-slate-900">
                {performance.totalSourcedItems}
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Total items
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Issue Rate
              </span>
              <Percent
                className={`w-3.5 h-3.5 ${performance.issueRate === 0 ? "text-emerald-500" : "text-amber-500"}`}
              />
            </div>
            <div>
              <div
                className={`text-lg font-bold font-heading ${
                  performance.issueRate === 0
                    ? "text-emerald-700"
                    : "text-amber-700"
                }`}
              >
                {performance.issueRate}%
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                {performance.issueCount} incident
                {performance.issueCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Trust Score
              </span>
              <ShieldCheck
                className={`w-3.5 h-3.5 ${performance.reliabilityScore >= 90 ? "text-emerald-500" : "text-amber-500"}`}
              />
            </div>
            <div>
              <div
                className={`text-lg font-bold font-heading ${
                  performance.reliabilityScore >= 90
                    ? "text-emerald-700"
                    : "text-amber-700"
                }`}
              >
                {performance.reliabilityScore}%
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                {performance.issueCount === 0
                  ? "Flawless track record"
                  : `${performance.issueRate}% defect rate`}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Issue Loss
              </span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div>
              <div className="text-lg font-bold font-heading text-rose-600">
                {formatNaira(performance.totalIssueCost)}
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Total value
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Liability
              </span>
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-[11px] font-semibold text-slate-800 space-y-0.5">
              <div className="text-emerald-700 flex justify-between gap-1">
                <span>Vendor:</span>
                <span className="font-bold">
                  {formatNaira(performance.costCoveredByVendor)}
                </span>
              </div>
              <div className="text-rose-600 flex justify-between gap-1">
                <span>Unboxie:</span>
                <span className="font-bold">
                  {formatNaira(performance.costCoveredByUnboxie)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTabLocal("products")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "products"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Products & Packaging ({products.length + packaging.length})
              </button>

              <button
                onClick={() => setActiveTabLocal("orders")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "orders"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Order Sourcing History ({orders.length})
              </button>

              <button
                onClick={() => setActiveTabLocal("incidents")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "incidents"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Incidents & Quality Log ({incidents.length})
              </button>
            </div>

            {activeTab === "incidents" && (
              <button
                onClick={() => onLogIncident(vendor.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Log Incident</span>
              </button>
            )}
          </div>

          {/* TAB 1: PRODUCTS & PACKAGING */}
          {activeTab === "products" && (
            <div className="mt-4 space-y-4">
              {/* Products Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-brand-500" />
                  Products Supplied ({products.length})
                </h4>

                {products.length === 0 ? (
                  <div className="p-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                    No catalog products currently linked to this vendor. Link
                    products in the Products module.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-brand-300 transition-colors"
                      >
                        {prod.sampleImage ? (
                          <img
                            src={prod.sampleImage}
                            alt={prod.name}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {prod.basePrice && (
                              <span className="text-[11px] font-medium text-brand-600">
                                {formatNaira(prod.basePrice)}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              {prod.categories.slice(0, 2).join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Packaging Section */}
              {packaging.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                    Packaging Options Supplied ({packaging.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {packaging.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-colors"
                      >
                        {pkg.sampleImage ? (
                          <img
                            src={pkg.sampleImage}
                            alt={pkg.name}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-400 flex-shrink-0">
                            <Layers className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {pkg.name}
                          </p>
                          {pkg.dimensions && (
                            <p className="text-[11px] text-slate-500">
                              {pkg.dimensions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === "orders" && (
            <div className="mt-4">
              {orders.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                  This vendor has not yet been selected for any customer orders.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {orders.map(({ order, items }) => (
                    <div
                      key={order.id}
                      onClick={() => {
                        onClose();
                        setSelectedOrderId(order.id);
                        setActiveTab("orders-incidents");
                        setOrderSubTab("orders");
                      }}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-brand-600">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs font-medium text-slate-800">
                            • {order.customerName}
                          </span>
                          <Badge
                            size="sm"
                            variant={
                              order.status === "Fulfilled" ? "success" : "brand"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Sourced items:{" "}
                          <span className="text-slate-700 font-medium">
                            {items.join(", ")}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">
                          {formatDate(order.datePlaced)}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {formatNaira(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INCIDENTS & QUALITY */}
          {activeTab === "incidents" && (
            <div className="mt-4">
              {incidents.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-emerald-50/50 border border-dashed border-emerald-200 text-xs text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                  <p className="font-semibold">Zero incidents recorded</p>
                  <p className="text-emerald-600/80 mt-0.5">
                    This vendor has maintained a reliable track record with no
                    recorded defects or delays.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={
                              inc.status === "Resolved" ? "success" : "danger"
                            }
                            size="sm"
                          >
                            {inc.status}
                          </Badge>
                          <span className="text-xs font-bold text-slate-800">
                            Order {inc.orderNumber}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({inc.itemName})
                          </span>
                        </div>
                        <span className="text-xs font-bold text-rose-600">
                          {formatNaira(inc.cost)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg">
                        {inc.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>
                          Cost Covered By:{" "}
                          <strong
                            className={
                              inc.costCoveredBy === "Vendor"
                                ? "text-emerald-700"
                                : "text-rose-700"
                            }
                          >
                            {inc.costCoveredBy}
                          </strong>
                        </span>
                        <span>Logged {formatRelativeTime(inc.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteVendor(vendor.id);
          onClose();
        }}
        title="Delete Vendor"
        message={`Are you sure you want to delete vendor "${vendor.name}"? This action cannot be undone.`}
        confirmText="Delete Vendor"
      />

      {/* Status Toggle Confirmation Modal */}
      <ConfirmModal
        isOpen={isToggleStatusModalOpen}
        onClose={() => setIsToggleStatusModalOpen(false)}
        onConfirm={() => toggleVendorStatus(vendor.id)}
        title={
          vendor.status === "Active"
            ? "Mark Vendor as Inactive"
            : "Activate Vendor"
        }
        message={
          vendor.status === "Active"
            ? `Are you sure you want to mark "${vendor.name}" as Inactive?.`
            : `Are you sure you want to mark "${vendor.name}" as Active?`
        }
        confirmText={
          vendor.status === "Active" ? "Set as Inactive" : "Activate"
        }
        variant={vendor.status === "Active" ? "warning" : "success"}
      />
    </Modal>
  );
};
