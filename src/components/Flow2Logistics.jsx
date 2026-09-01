import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  Plus, 
  ChevronRight, 
  ArrowLeft, 
  X, 
  AlertCircle, 
  Building2, 
  User, 
  Info
} from 'lucide-react';

export default function Flow2Logistics({
  doorLocations,
  pickupLocations,
  partners,
  onAddDoorLocation,
  onAddPickupLocation,
  onAddPartner,
  activeSubTab = 'locations', // 'locations' | 'partners'
  setActiveSubTab
}) {
  // Location view tab state
  const [locationTypeTab, setLocationTypeTab] = useState('door'); // 'door' | 'pickup'
  const [selectedState, setSelectedState] = useState(null); // e.g. 'Lagos'

  // Modals state
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);

  // Add Location Form state
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationFee, setNewLocationFee] = useState('');
  const [newPickupAddress, setNewPickupAddress] = useState('');

  // Add Partner Form state
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    type: 'Company',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Lagos',
    coverageType: 'Single State', // 'Single State' | 'Interstate'
    coverageStates: ['Lagos'],
  });
  const [partnerFormError, setPartnerFormError] = useState('');

  // Currency helper
  const formatNaira = (amount) => '₦' + Math.round(amount).toLocaleString();

  // Nigerian States list
  const nigerianStates = ['Lagos', 'Abuja', 'Rivers', 'Delta', 'Ogun', 'Kano', 'Enugu'];

  // Handle submit new location
  const handleSaveLocation = (e) => {
    e.preventDefault();
    if (!newLocationName || !newLocationFee) return;

    if (locationTypeTab === 'door') {
      onAddDoorLocation(selectedState || 'Lagos', {
        id: `loc-${Date.now()}`,
        name: newLocationName,
        fee: parseFloat(newLocationFee),
        status: 'Active'
      });
    } else {
      onAddPickupLocation(selectedState || 'Lagos', {
        id: `pk-${Date.now()}`,
        name: newLocationName,
        address: newPickupAddress || 'Hub Address',
        fee: parseFloat(newLocationFee),
        status: 'Active'
      });
    }

    setNewLocationName('');
    setNewLocationFee('');
    setNewPickupAddress('');
    setIsAddLocationModalOpen(false);
  };

  // Handle partner form state changes
  const handlePartnerStateToggle = (stateName) => {
    let current = [...partnerForm.coverageStates];
    if (partnerForm.coverageType === 'Single State') {
      current = [stateName];
    } else {
      if (current.includes(stateName)) {
        current = current.filter(s => s !== stateName);
      } else {
        current.push(stateName);
      }
    }
    setPartnerForm({ ...partnerForm, coverageStates: current });
    validatePartnerForm({ ...partnerForm, coverageStates: current });
  };

  const handleCoverageTypeChange = (type) => {
    let initialStates = partnerForm.coverageStates;
    if (type === 'Single State' && initialStates.length > 1) {
      initialStates = [initialStates[0]];
    } else if (type === 'Interstate' && initialStates.length < 2) {
      initialStates = ['Lagos', 'Abuja'];
    }
    const updated = { ...partnerForm, coverageType: type, coverageStates: initialStates };
    setPartnerForm(updated);
    validatePartnerForm(updated);
  };

  const validatePartnerForm = (data) => {
    if (!data.name || !data.phone) {
      setPartnerFormError('Partner Name and Phone Number are required.');
      return false;
    }
    if (data.coverageType === 'Single State' && data.coverageStates.length !== 1) {
      setPartnerFormError('Single State coverage allows exactly 1 state selection.');
      return false;
    }
    if (data.coverageType === 'Interstate' && data.coverageStates.length < 2) {
      setPartnerFormError('Interstate coverage requires selecting at least 2 states.');
      return false;
    }
    setPartnerFormError('');
    return true;
  };

  const handleSavePartner = (e) => {
    e.preventDefault();
    if (!validatePartnerForm(partnerForm)) return;

    onAddPartner({
      id: `part-${Date.now()}`,
      ...partnerForm,
      status: 'Active'
    });

    setIsAddPartnerModalOpen(false);
    setPartnerForm({
      name: '',
      type: 'Company',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: 'Lagos',
      coverageType: 'Single State',
      coverageStates: ['Lagos'],
    });
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header Tabs */}
      <div className="border-b border-slate-200/80">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveSubTab('locations')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition ${
              activeSubTab === 'locations'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivery Locations</span>
          </button>

          <button
            onClick={() => setActiveSubTab('partners')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition ${
              activeSubTab === 'partners'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Delivery Partners</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: DELIVERY LOCATIONS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'locations' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Delivery Locations</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage delivery areas and prices available to customers at checkout.
              </p>
            </div>

            <div className="bg-slate-100/80 p-1 rounded-lg flex space-x-1 border border-slate-200/60">
              <button
                onClick={() => { setLocationTypeTab('door'); setSelectedState(null); }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  locationTypeTab === 'door'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Door Delivery
              </button>
              <button
                onClick={() => { setLocationTypeTab('pickup'); setSelectedState(null); }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  locationTypeTab === 'pickup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pickup Hubs
              </button>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-700">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block mb-0.5">Manual Location Entry Note</span>
              <span className="text-slate-600">
                Delivery area names are entered manually rather than selected from a rigid LGA dropdown. 
                This allows precise operational control over pricing for distinct areas (e.g. Victoria Island vs Ajah).
              </span>
            </div>
          </div>

          {!selectedState ? (
            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Nigerian States ({locationTypeTab === 'door' ? 'Door Delivery' : 'Pickup Hubs'})
              </div>
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/50 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-5">State</th>
                    <th className="py-3.5 px-5">Locations</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.keys(locationTypeTab === 'door' ? doorLocations : pickupLocations).map((state) => {
                    const locs = (locationTypeTab === 'door' ? doorLocations[state] : pickupLocations[state]) || [];
                    return (
                      <tr key={state} className="hover:bg-slate-50/60 transition">
                        <td className="py-4 px-5 font-bold text-slate-900">{state}</td>
                        <td className="py-4 px-5 font-mono text-slate-700">
                          {locs.length} Active {locationTypeTab === 'door' ? 'Areas' : 'Hubs'}
                        </td>
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setSelectedState(state)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/80 px-2.5 py-1.5 rounded-lg border border-orange-200/70 transition"
                          >
                            <span>View State</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedState(null)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 bg-white rounded-lg border border-slate-200 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedState} {locationTypeTab === 'door' ? 'Door Delivery Locations' : 'Pickup Locations'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage delivery areas and fees within {selectedState}.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddLocationModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {locationTypeTab === 'door' ? '+ Add Delivery Location' : '+ Add Pickup Location'}
                  </span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/50 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-200/80">
                    <tr>
                      <th className="py-3.5 px-5">Location Name</th>
                      {locationTypeTab === 'pickup' && <th className="py-3.5 px-5">Address</th>}
                      <th className="py-3.5 px-5">Fee</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {((locationTypeTab === 'door' ? doorLocations[selectedState] : pickupLocations[selectedState]) || []).map((loc) => (
                      <tr key={loc.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-5 font-bold text-slate-900">{loc.name}</td>
                        {locationTypeTab === 'pickup' && (
                          <td className="py-3.5 px-5 text-slate-600">{loc.address}</td>
                        )}
                        <td className="py-3.5 px-5 font-mono font-bold text-orange-600">
                          {formatNaira(loc.fee)}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg border border-slate-200 transition">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADD LOCATION MODAL */}
          {isAddLocationModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200/80 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    {locationTypeTab === 'door' ? 'Add Delivery Location' : 'Add Pickup Location'}
                  </h3>
                  <button onClick={() => setIsAddLocationModalOpen(false)}>
                    <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>

                <form onSubmit={handleSaveLocation} className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      disabled
                      value={selectedState || 'Lagos'}
                      className="w-full bg-slate-100 text-slate-600 font-semibold px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {locationTypeTab === 'door' ? 'Location Name' : 'Pickup Location Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      placeholder={locationTypeTab === 'door' ? 'e.g. Gbagada' : 'e.g. GIG Gbagada'}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {locationTypeTab === 'pickup' && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hub Address</label>
                      <input
                        type="text"
                        required
                        value={newPickupAddress}
                        onChange={(e) => setNewPickupAddress(e.target.value)}
                        placeholder="e.g. Gbagada Express Way"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {locationTypeTab === 'door' ? 'Delivery Fee (₦)' : 'Pickup Fee (₦)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={newLocationFee}
                      onChange={(e) => setNewLocationFee(e.target.value)}
                      placeholder="e.g. 2000"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddLocationModalOpen(false)}
                      className="px-3.5 py-1.5 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-xs transition"
                    >
                      {locationTypeTab === 'door' ? 'Add Location' : 'Add Hub'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: DELIVERY PARTNERS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'partners' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Delivery Partners</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the companies and drivers responsible for delivering Unboxie orders.
              </p>
            </div>

            <button
              onClick={() => setIsAddPartnerModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Partner</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/50 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-5">Partner</th>
                  <th className="py-3.5 px-5">Type</th>
                  <th className="py-3.5 px-5">Coverage</th>
                  <th className="py-3.5 px-5">Phone</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-5 font-bold text-slate-900">
                      <div className="flex items-center space-x-2.5">
                        {partner.type === 'Company' ? (
                          <Building2 className="w-4 h-4 text-orange-500" />
                        ) : (
                          <User className="w-4 h-4 text-blue-500" />
                        )}
                        <span>{partner.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-xs font-medium text-slate-700">
                      {partner.type}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] font-bold text-slate-400 mr-1">
                          [{partner.coverageType}]
                        </span>
                        {partner.coverageStates.map((st) => (
                          <span key={st} className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded border border-slate-200">
                            {st}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-700">{partner.phone}</td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        {partner.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg border border-slate-200 transition">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADD PARTNER MODAL */}
          {isAddPartnerModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200/80 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Add Delivery Partner</h3>
                  <button onClick={() => setIsAddPartnerModalOpen(false)}>
                    <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>

                <form onSubmit={handleSavePartner} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
                  {partnerFormError && (
                    <div className="p-3 bg-rose-50 border border-rose-200/70 text-rose-700 rounded-lg font-medium flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{partnerFormError}</span>
                    </div>
                  )}

                  <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b pb-1">
                    Basic Information
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Partner Name *</label>
                      <input
                        type="text"
                        required
                        value={partnerForm.name}
                        onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                        placeholder="e.g. GIG Logistics"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Partner Type *</label>
                      <select
                        value={partnerForm.type}
                        onChange={(e) => setPartnerForm({ ...partnerForm, type: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none bg-white font-semibold"
                      >
                        <option value="Company">Company</option>
                        <option value="Independent Driver">Independent Driver</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={partnerForm.phone}
                        onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                        placeholder="080..."
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={partnerForm.email}
                        onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                        placeholder="partner@example.com"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b pb-1 pt-2">
                    Coverage Rules
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Coverage Type *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleCoverageTypeChange('Single State')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                          partnerForm.coverageType === 'Single State'
                            ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        Single State
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCoverageTypeChange('Interstate')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                          partnerForm.coverageType === 'Interstate'
                            ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        Interstate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {partnerForm.coverageType === 'Single State'
                        ? 'Select State (Only 1 allowed)'
                        : 'Select States (At least 2 required)'}
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {nigerianStates.map((st) => {
                        const isSelected = partnerForm.coverageStates.includes(st);
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handlePartnerStateToggle(st)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                              isSelected
                                ? 'bg-orange-100 text-orange-800 border-orange-300 font-bold'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {st} {isSelected && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddPartnerModalOpen(false)}
                      className="px-3.5 py-1.5 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-xs transition"
                    >
                      Create Partner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
