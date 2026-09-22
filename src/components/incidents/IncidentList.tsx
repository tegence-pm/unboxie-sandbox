import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { IncidentFormModal } from "./IncidentFormModal";
import { ConfirmModal } from "../common/ConfirmModal";
import { Incident } from "../../types";
import { StatCard } from "../common/StatCard";
import {
  AlertTriangle,
  Plus,
  Search,
  Building2,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { formatNaira, formatRelativeTime } from "../../utils/formatters";

export const IncidentList: React.FC = () => {
  const { incidents, vendors, deleteIncident, setCurrentView } = useApp();

  const [search, setSearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [bearerFilter, setBearerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState<Incident | null>(null);
  const [incidentToDelete, setIncidentToDelete] = useState<Incident | null>(
    null,
  );

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      inc.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      inc.itemName.toLowerCase().includes(search.toLowerCase()) ||
      inc.description.toLowerCase().includes(search.toLowerCase());

    const matchesVendor =
      vendorFilter === "all" || inc.vendorId === vendorFilter;
    const matchesBearer =
      bearerFilter === "all" || inc.costCoveredBy === bearerFilter;
    const matchesStatus = statusFilter === "all" || inc.status === statusFilter;

    return matchesSearch && matchesVendor && matchesBearer && matchesStatus;
  });

  // Incident statistics
  let totalCost = 0;
  let vendorCoveredTotal = 0;
  let unboxieCoveredTotal = 0;

  incidents.forEach((inc) => {
    totalCost += inc.cost || 0;
    if (inc.costCoveredBy === "Vendor") {
      vendorCoveredTotal += inc.cost || 0;
    } else if (inc.costCoveredBy === "Unboxie") {
      unboxieCoveredTotal += inc.cost || 0;
    }
  });

  const handleEdit = (inc: Incident) => {
    setIncidentToEdit(inc);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
            Order Incidents
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track order fulfillment defects, supplier liabilities, and loss
            recoveries.
          </p>
        </div>

        <button
          onClick={() => {
            setIncidentToEdit(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Incident</span>
        </button>
      </div>

      {/* Incident Metric KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Incidents"
          value={incidents.length}
          subtitle={`${incidents.filter((i) => i.status === "Open").length} currently open`}
          icon={AlertTriangle}
          variant="default"
        />
        <StatCard
          title="Total Quality Loss"
          value={formatNaira(totalCost)}
          icon={DollarSign}
          variant="danger"
        />
        <StatCard
          title="Recovered by Vendors"
          value={formatNaira(vendorCoveredTotal)}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Absorbed by Unboxie"
          value={formatNaira(unboxieCoveredTotal)}
          icon={HelpCircle}
          variant="warning"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search incidents by order #"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto justify-between md:justify-end">
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Vendors</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            <select
              value={bearerFilter}
              onChange={(e) => setBearerFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Cost Bearers</option>
              <option value="Vendor">Covered by Vendor</option>
              <option value="Unboxie">Covered by Unboxie</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table View */}
      {filteredIncidents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-300">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            No incidents found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All orders are fulfilled cleanly without recorded quality
            disruptions.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ORDER #</th>
                  <th className="py-3 px-4">AFFECTED PRODUCT</th>
                  <th className="py-3 px-4">RESPONSIBLE VENDOR</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4">COST (₦)</th>
                  <th className="py-3 px-4">COST COVERED BY</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Order Number */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setCurrentView({
                            type: "order-detail",
                            id: inc.orderId,
                          });
                        }}
                        className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
                      >
                        <span>{inc.orderNumber}</span>
                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      </button>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {formatRelativeTime(inc.createdAt)}
                      </span>
                    </td>

                    {/* Affected Product */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {inc.itemName}
                      </span>
                      {inc.issueType && (
                        <span className="inline-block text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md mt-0.5">
                          {inc.issueType}
                        </span>
                      )}
                    </td>

                    {/* Responsible Vendor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setCurrentView({
                            type: "vendor-detail",
                            id: inc.vendorId,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-brand-600"
                      >
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inc.vendorName}</span>
                      </button>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p
                        className="text-slate-600 truncate"
                        title={inc.description}
                      >
                        {inc.description}
                      </p>
                    </td>

                    {/* Cost */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold font-heading text-rose-600">
                      {formatNaira(inc.cost)}
                    </td>

                    {/* Cost Covered By */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          inc.costCoveredBy === "Vendor"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {inc.costCoveredBy}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inc.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inc.status === "Resolved"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <span>{inc.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(inc)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Incident"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setIncidentToDelete(inc)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Incident"
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
        </div>
      )}

      {/* Incident Form Modal */}
      <IncidentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setIncidentToEdit(null);
        }}
        incidentToEdit={incidentToEdit}
      />

      {/* Delete Incident Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(incidentToDelete)}
        onClose={() => setIncidentToDelete(null)}
        onConfirm={() => {
          if (incidentToDelete) {
            deleteIncident(incidentToDelete.id);
            setIncidentToDelete(null);
          }
        }}
        title="Delete Incident Record"
        message={`Are you sure you want to delete the incident record for Order ${incidentToDelete?.orderNumber} (${incidentToDelete?.itemName})? This will update vendor stats accordingly.`}
        confirmText="Delete Record"
      />
    </div>
  );
};
