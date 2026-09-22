import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { VendorType, VendorSource, VendorStatus } from "../../types";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Tag,
  FileText,
  X,
  Save,
} from "lucide-react";

interface VendorFormPageProps {
  vendorId?: string;
}

const COMMON_CATEGORIES = [
  "Diffusers",
  "Candles",
  "Fragrances",
  "Keychains",
  "Mugs & Drinkware",
  "Stationery",
  "Jewelry",
  "Skincare & Wellness",
  "Boxes & Packaging",
  "Ribbons & Sleeves",
  "Printing & Engraving",
  "Silk & Pouches",
];

const NIGERIAN_STATES = [
  "Lagos",
  "FCT - Abuja",
  "Ogun",
  "Oyo",
  "Rivers",
  "Enugu",
  "Kano",
  "Delta",
  "Edo",
  "Anambra",
];

export const VendorFormPage: React.FC<VendorFormPageProps> = ({ vendorId }) => {
  const { addVendor, updateVendor, getVendorById, setCurrentView } = useApp();

  const existingVendor = vendorId ? getVendorById(vendorId) : null;

  const [name, setName] = useState("");
  const [type, setType] = useState<VendorType>("Souvenir Vendor");
  const [source, setSource] = useState<VendorSource>("Online");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("Lagos");
  const [cityLga, setCityLga] = useState("");
  const [address, setAddress] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<VendorStatus>("Active");

  useEffect(() => {
    if (existingVendor) {
      setName(existingVendor.name);
      setType(existingVendor.type);
      setSource(existingVendor.source);
      setPhone(existingVendor.phone);
      setState(existingVendor.state);
      setCityLga(existingVendor.cityLga);
      setAddress(existingVendor.address);
      setCategories(existingVendor.categories || []);
      setNotes(existingVendor.notes || "");
      setStatus(existingVendor.status);
    }
  }, [existingVendor]);

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      setCategories([...categories, customCategory.trim()]);
      setCustomCategory("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (existingVendor) {
      updateVendor(existingVendor.id, {
        name: name.trim(),
        type,
        source,
        phone: phone.trim(),
        state,
        cityLga: cityLga.trim(),
        address: address.trim(),
        categories,
        notes: notes.trim(),
        status,
      });
      setCurrentView({ type: "vendor-detail", id: existingVendor.id });
    } else {
      const created = addVendor({
        name: name.trim(),
        type,
        source,
        phone: phone.trim(),
        state,
        cityLga: cityLga.trim(),
        address: address.trim(),
        categories,
        notes: notes.trim(),
        status,
      });
      setCurrentView({ type: "vendor-detail", id: created.id });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back button & Title */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (existingVendor) {
                setCurrentView({
                  type: "vendor-detail",
                  id: existingVendor.id,
                });
              } else {
                setCurrentView({ type: "vendor-list" });
              }
            }}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">
              {existingVendor
                ? `Edit Vendor: ${existingVendor.name}`
                : "Add New Vendor"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure supplier profile, product categories, and contact
              details.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Profile */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold font-heading uppercase tracking-wider text-slate-900">
              Business Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Vendor / Business Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lagos Scent Co."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Vendor Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VendorType)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
              >
                <option value="Souvenir Vendor">
                  Souvenir Vendor (Gift items & products)
                </option>
                <option value="Customization Vendor">
                  Customization Vendor (Printing, box sleeves, engraving)
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Sourcing Channel (Source) *
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as VendorSource)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              >
                <option value="Online">
                  Online (Instagram, TikTok, Website)
                </option>
                <option value="Offline">
                  Offline (Shops, Markets, Referrals)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Availability Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VendorStatus)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
              >
                <option value="Active">
                  Active (Currently used in active network)
                </option>
                <option value="Inactive">
                  Inactive (Not sourced recently)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold font-heading uppercase tracking-wider text-slate-900">
              Contact & Location Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                placeholder="+234 800 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                {NIGERIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                City
              </label>
              <input
                type="text"
                placeholder="e.g. Lekki Phase 1, Yaba, Wuse II"
                value={cityLga}
                onChange={(e) => setCityLga(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Physical Shop / Market Address
            </label>
            <input
              type="text"
              placeholder="e.g. Shop 42, Tejuosho Ultra Modern Market, Yaba, Lagos"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Section 3: Categories */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Tag className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold font-heading uppercase tracking-wider text-slate-900">
              Product Categories Supplied
            </h2>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Select category specialties or add custom tags to link products to
              this vendor.
            </p>

            <div className="flex flex-wrap gap-2">
              {COMMON_CATEGORIES.map((cat) => {
                const isSelected = categories.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-brand-500 text-white border-brand-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2 max-w-md pt-2">
              <input
                type="text"
                placeholder="Add custom category tag..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomCategory(e);
                  }
                }}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="button"
                onClick={handleAddCustomCategory}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Add Tag
              </button>
            </div>

            {/* Custom tags list */}
            {categories.filter((c) => !COMMON_CATEGORIES.includes(c)).length >
              0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {categories
                  .filter((c) => !COMMON_CATEGORIES.includes(c))
                  .map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className="hover:text-brand-900"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Operational Notes */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold font-heading uppercase tracking-wider text-slate-900">
              Notes
            </h2>
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="e.g. Found via Instagram @handle. Very prompt with dispatch. Best price on 100ml reed diffusers. Closed on Sundays."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (existingVendor) {
                setCurrentView({
                  type: "vendor-detail",
                  id: existingVendor.id,
                });
              } else {
                setCurrentView({ type: "vendor-list" });
              }
            }}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{existingVendor ? "Save Changes" : "Create Vendor"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
