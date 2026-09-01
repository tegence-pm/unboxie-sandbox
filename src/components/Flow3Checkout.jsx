import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Building2, 
  Check, 
  ChevronRight, 
  ArrowRight, 
  Edit3, 
  Info,
  ShieldCheck,
  Gift
} from 'lucide-react';

export default function Flow3Checkout({ 
  doorLocations, 
  pickupLocations, 
  onCompleteCheckout,
  onSwitchToAdmin 
}) {
  // 5A. Delivery Method Selection ('door' | 'pickup')
  const [deliveryMethod, setDeliveryMethod] = useState('door');

  // Doorstep Surprise State & Location
  const [doorState, setDoorState] = useState('Lagos');
  const [selectedDoorAreaId, setSelectedDoorAreaId] = useState('loc-2'); // Gbagada
  const [streetAddress, setStreetAddress] = useState('15 Example Street, Gbagada');

  // Unboxie Hub State & Location
  const [pickupState, setPickupState] = useState('Lagos');
  const [selectedPickupId, setSelectedPickupId] = useState('pk-1'); // GIG Gbagada

  // Summary State toggle (editing vs confirmed summary view)
  const [isSummaryConfirmed, setIsSummaryConfirmed] = useState(false);

  // Helper formatting
  const formatNaira = (amount) => '₦' + Math.round(amount).toLocaleString();

  // Selected Door Area object
  const currentDoorAreas = doorLocations[doorState] || [];
  const selectedDoorArea = currentDoorAreas.find(a => a.id === selectedDoorAreaId) || currentDoorAreas[0];

  // Selected Pickup Area object
  const currentPickupHubs = pickupLocations[pickupState] || [];
  const selectedPickupHub = currentPickupHubs.find(h => h.id === selectedPickupId) || currentPickupHubs[0];

  // Base pricing
  const baseGiftPrice = 45000;
  const basePackagingPrice = 10000;

  // Active delivery fee calculation
  const activeDeliveryFee = deliveryMethod === 'door' 
    ? (selectedDoorArea ? selectedDoorArea.fee : 0)
    : (selectedPickupHub ? selectedPickupHub.fee : 0);

  const grandTotal = baseGiftPrice + basePackagingPrice + activeDeliveryFee;

  // State change handler for Door Delivery
  const handleDoorStateChange = (e) => {
    const newState = e.target.value;
    setDoorState(newState);
    const newAreas = doorLocations[newState] || [];
    if (newAreas.length > 0) {
      setSelectedDoorAreaId(newAreas[0].id);
    }
  };

  // State change handler for Pickup
  const handlePickupStateChange = (e) => {
    const newState = e.target.value;
    setPickupState(newState);
    const newHubs = pickupLocations[newState] || [];
    if (newHubs.length > 0) {
      setSelectedPickupId(newHubs[0].id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans text-slate-900">
      {/* Checkout Title & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider">Checkout — Step 2</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Delivery & Pickup Options</h1>
        </div>
        <button
          onClick={onSwitchToAdmin}
          className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg transition"
        >
          View Admin Controls
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Delivery Forms */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-slate-700">
            <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block mb-0.5">Dynamic Fee Calculation</span>
              <span>
                <b>State → Location → Delivery Fee → Customer Address</b>.
                Notice how selecting a different State or Location updates the checkout summary in real time.
              </span>
            </div>
          </div>

          {!isSummaryConfirmed ? (
            <div className="space-y-6">
              {/* 5A. Delivery Method Cards */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  1. Select Delivery Method
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Doorstep Surprise Radio Card */}
                  <div
                    onClick={() => setDeliveryMethod('door')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                      deliveryMethod === 'door'
                        ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      deliveryMethod === 'door' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                    }`}>
                      {deliveryMethod === 'door' && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Truck className={`w-4 h-4 ${deliveryMethod === 'door' ? 'text-orange-500' : 'text-slate-400'}`} />
                        <span className="font-bold text-slate-900 text-xs">Doorstep Surprise</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        We'll deliver the gift directly to their doorstep.
                      </p>
                    </div>
                  </div>

                  {/* Unboxie Hub Radio Card */}
                  <div
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                      deliveryMethod === 'pickup'
                        ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      deliveryMethod === 'pickup' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                    }`}>
                      {deliveryMethod === 'pickup' && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Building2 className={`w-4 h-4 ${deliveryMethod === 'pickup' ? 'text-orange-500' : 'text-slate-400'}`} />
                        <span className="font-bold text-slate-900 text-xs">Unboxie Hub</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Pick it up from a nearby Unboxie Hub location.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5B & 5C. DOORSTEP SURPRISE FORM */}
              {deliveryMethod === 'door' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>2. Doorstep Delivery Details</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* State Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                      <select
                        value={doorState}
                        onChange={handleDoorStateChange}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none bg-white"
                      >
                        {Object.keys(doorLocations).map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    {/* Delivery Area Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Area</label>
                      <select
                        value={selectedDoorAreaId}
                        onChange={(e) => setSelectedDoorAreaId(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none bg-white"
                      >
                        {currentDoorAreas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name} — {formatNaira(area.fee)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Address input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Street Address</label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. 15 Example Street, Gbagada"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {selectedDoorArea && (
                    <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-200/70 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{selectedDoorArea.name}, {doorState}</span>
                        <span className="text-slate-500 text-[11px]">Doorstep delivery fee applied</span>
                      </div>
                      <span className="font-bold text-orange-600 text-sm font-mono">
                        {formatNaira(selectedDoorArea.fee)}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => setIsSummaryConfirmed(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-xs transition flex items-center justify-center space-x-2 text-xs"
                  >
                    <span>Confirm Delivery Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 5D. UNBOXIE HUB PICKUP FORM */}
              {deliveryMethod === 'pickup' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-orange-500" />
                    <span>2. Select Unboxie Pickup Hub</span>
                  </h2>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                    <select
                      value={pickupState}
                      onChange={handlePickupStateChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none bg-white"
                    >
                      {Object.keys(pickupLocations).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700">Choose Pickup Location</label>
                    {currentPickupHubs.length === 0 ? (
                      <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        No pickup locations available in {pickupState} yet. Please choose Doorstep Surprise.
                      </div>
                    ) : (
                      currentPickupHubs.map((hub) => (
                        <div
                          key={hub.id}
                          onClick={() => setSelectedPickupId(hub.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                            selectedPickupId === hub.id
                              ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                              selectedPickupId === hub.id ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                            }`}>
                              {selectedPickupId === hub.id && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{hub.name}</div>
                              <div className="text-[11px] text-slate-500">{hub.address}</div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-orange-600 text-xs">
                            {formatNaira(hub.fee)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => setIsSummaryConfirmed(true)}
                    disabled={currentPickupHubs.length === 0}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-xs transition flex items-center justify-center space-x-2 text-xs disabled:bg-slate-200"
                  >
                    <span>Confirm Pickup Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 5E. CHECKOUT DELIVERY SUMMARY CONFIRMED VIEW */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs">
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>Delivery Summary Confirmed</span>
                </div>
                <button
                  onClick={() => setIsSummaryConfirmed(false)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200/70 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Option</span>
                </button>
              </div>

              {deliveryMethod === 'door' ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span>Doorstep Surprise</span>
                  </div>
                  <div className="text-slate-700 font-semibold">{selectedDoorArea?.name}, {doorState}</div>
                  <div className="text-slate-500">{streetAddress}</div>
                  <div className="pt-2 border-t border-slate-200/60 text-orange-600 font-bold font-mono">
                    Delivery Fee: {formatNaira(selectedDoorArea?.fee || 0)}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-orange-500" />
                    <span>Unboxie Hub Pickup</span>
                  </div>
                  <div className="text-slate-700 font-semibold">{selectedPickupHub?.name}</div>
                  <div className="text-slate-500">{selectedPickupHub?.address}</div>
                  <div className="pt-2 border-t border-slate-200/60 text-orange-600 font-bold font-mono">
                    Pickup Fee: {formatNaira(selectedPickupHub?.fee || 0)}
                  </div>
                </div>
              )}

              <button
                onClick={() => onCompleteCheckout({
                  deliveryMethod,
                  doorState,
                  area: selectedDoorArea?.name,
                  hub: selectedPickupHub?.name,
                  fee: activeDeliveryFee,
                  total: grandTotal
                })}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-xs transition flex items-center justify-center space-x-2 text-xs"
              >
                <Gift className="w-4 h-4" />
                <span>Place Order & Pay {formatNaira(grandTotal)}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Column: Live Checkout Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 sticky top-20">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Gift Items:</span>
                <span className="font-mono font-medium text-slate-900">{formatNaira(baseGiftPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Packaging & Box:</span>
                <span className="font-mono font-medium text-slate-900">{formatNaira(basePackagingPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
                <span>{deliveryMethod === 'door' ? 'Delivery Fee:' : 'Pickup Fee:'}</span>
                <span className="font-mono font-bold text-orange-600">
                  {formatNaira(activeDeliveryFee)}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-slate-900 text-sm pt-3 border-t border-slate-200/70">
                <span>Total:</span>
                <span className="font-mono text-orange-600">{formatNaira(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
