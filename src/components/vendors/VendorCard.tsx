import React from 'react';
import { Vendor } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { 
  ChevronRight,
  Package
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

interface VendorCardProps {
  vendor: Vendor;
  onClick: () => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onClick }) => {
  const { getVendorPerformance, getVendorProducts, getVendorPackaging } = useApp();
  const performance = getVendorPerformance(vendor.id);
  const productsCount = getVendorProducts(vendor.id).length;
  const packagingCount = getVendorPackaging(vendor.id).length;

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-brand-400 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant={vendor.status === 'Active' ? 'success' : 'neutral'}
              dot
              size="sm"
            >
              {vendor.status}
            </Badge>
            <Badge variant={vendor.type === 'Souvenir Vendor' ? 'brand' : 'purple'} size="sm">
              {vendor.type}
            </Badge>
          </div>
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-brand-500 transition-colors flex items-center">
            View Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>

        {/* Vendor Name & Channel */}
        <div className="mb-2.5">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors font-heading">
            {vendor.name}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <span className="font-medium text-slate-700">{vendor.source} Source</span>
            {vendor.cityLga && <span>• {vendor.cityLga}, {vendor.state}</span>}
          </p>
        </div>

        {/* Categories Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {vendor.categories?.slice(0, 3).map(cat => (
            <span
              key={cat}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
            >
              {cat}
            </span>
          ))}
          {vendor.categories?.length > 3 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
              +{vendor.categories.length - 3}
            </span>
          )}
        </div>

        {/* Catalog items indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
          <Package className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Supplies <strong className="text-slate-800 font-semibold">{productsCount} products</strong>
            {packagingCount > 0 && <span>, {packagingCount} packaging items</span>}
          </span>
        </div>
      </div>

      {/* Sourcing Metrics Row */}
      <div className="pt-1">
        <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Used</span>
            <span className="text-xs font-bold text-slate-800">{vendor.timesUsed || 0}x</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Last Sourced</span>
            <span className="text-xs font-semibold text-slate-700">{formatRelativeTime(vendor.lastUsedDate)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Issues</span>
            <span className={`text-xs font-bold ${performance.issueCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {performance.issueCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
