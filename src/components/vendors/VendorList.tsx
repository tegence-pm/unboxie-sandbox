import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';
import { 
  Building2, 
  Plus, 
  Search, 
  AlertCircle
} from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

export const VendorList: React.FC = () => {
  const { 
    vendors, 
    incidents,
    setCurrentView,
  } = useApp();

  // Filters state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Extract all unique categories
  const allCategories = Array.from(
    new Set(vendors.flatMap(v => v.categories || []))
  ).sort();

  // Filtered vendors
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.cityLga.toLowerCase().includes(search.toLowerCase()) ||
      v.state.toLowerCase().includes(search.toLowerCase()) ||
      v.categories.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
      v.notes?.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'all' || v.type === typeFilter;
    const matchesSource = sourceFilter === 'all' || v.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    
    // Multi-select category match: if any selected category matches
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.some(cat => v.categories.includes(cat));

    return matchesSearch && matchesType && matchesSource && matchesStatus && matchesCategory;
  });

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'Active').length;
  const totalIncidentCost = incidents.reduce((acc, i) => acc + (i.cost || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
            Vendor Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage Unboxie's supplier network, track sourcing activity, and review quality records.
          </p>
        </div>

        <button
          onClick={() => setCurrentView({ type: 'vendor-form' })}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* KPI Stat Cards (active source rating and total sourced items removed as requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Vendors"
          value={totalVendors}
          subtitle={`${activeVendors} currently in Active Sourcing Network`}
          icon={Building2}
          variant="default"
        />
        <StatCard
          title="Total Quality Loss (Incidents)"
          value={formatNaira(totalIncidentCost)}
          subtitle={`${incidents.length} order quality issue(s) recorded`}
          icon={AlertCircle}
          variant={totalIncidentCost > 0 ? "warning" : "default"}
        />
      </div>

      {/* Search & Filter Bar with Multi-select Dropdown */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendors by name, city, specialty, notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filter Selects */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Types</option>
              <option value="Souvenir Vendor">Souvenir Vendors</option>
              <option value="Customization Vendor">Customization Vendors</option>
            </select>

            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Channels</option>
              <option value="Online">Online (IG / TikTok)</option>
              <option value="Offline">Offline (Market / Shops)</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            {/* Multi-Select Category Dropdown */}
            <MultiSelectDropdown
              options={allCategories}
              selected={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="Filter Categories"
            />
          </div>
        </div>

        {/* Selected Category Tags Indicator */}
        {selectedCategories.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Filtered by:</span>
            {selectedCategories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200 font-medium"
              >
                {cat}
                <button
                  onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}
                  className="hover:text-brand-900"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={() => setSelectedCategories([])}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Vendor Table View */}
      {filteredVendors.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-300">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No vendors found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new vendor to the network.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setTypeFilter('all');
              setSourceFilter('all');
              setStatusFilter('all');
              setSelectedCategories([]);
            }}
            className="mt-4 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
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
                {filteredVendors.map(vendor => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                    onClick={() => setCurrentView({ type: 'vendor-detail', id: vendor.id })}
                  >
                    {/* Vendor Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 border border-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {vendor.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors block truncate">
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

                    {/* Type (Channel removed) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800">{vendor.type}</span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 block">{vendor.cityLga}</span>
                      <span className="text-[11px] text-slate-400 block">{vendor.state}</span>
                    </td>

                    {/* Sourcing Stats */}
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

                    {/* Status */}
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

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setCurrentView({ type: 'vendor-detail', id: vendor.id })}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => setCurrentView({ type: 'vendor-form', id: vendor.id })}
                          className="px-2.5 py-1 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                        >
                          Edit
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

    </div>
  );
};
