/*import { Rider } from '@/components/orders/details/types/orders';

interface RiderAssignmentProps {
  availableRiders: Rider[];
  selectedRiderId: string;
  onSelectRider: (id: string) => void;
  deliveryFee: number;
  onDeliveryFeeChange: (fee: number) => void;
  onAssignRider: () => Promise<void>;
  isAssigningRider: boolean;
}

export default function RiderAssignment({
  availableRiders,
  selectedRiderId,
  onSelectRider,
  deliveryFee,
  onDeliveryFeeChange,
  onAssignRider,
  isAssigningRider
}: RiderAssignmentProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Assign Delivery Rider</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Rider
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={selectedRiderId}
              onChange={(e) => onSelectRider(e.target.value)}
            >
              <option value="">Select a rider</option>
              {availableRiders.map(rider => (
                <option key={rider._id} value={rider._id}>
                  {rider.firstName} {rider.lastName} ({rider.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Fee (KES)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter delivery fee"
              value={deliveryFee}
              onChange={(e) => onDeliveryFeeChange(parseFloat(e.target.value) || 0)}
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={onAssignRider}
              disabled={isAssigningRider || !selectedRiderId || deliveryFee <= 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigningRider ? 'Assigning...' : 'Assign Rider'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Assigning a rider will change the status to "ASSIGNED" and notify the rider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { Rider } from '@/components/orders/details/types/orders';
import { UserPlus, DollarSign, Truck, AlertCircle, CheckCircle } from 'lucide-react';

interface RiderAssignmentProps {
  availableRiders: Rider[];
  selectedRiderId: string;
  onSelectRider: (id: string) => void;
  deliveryFee: number;
  onDeliveryFeeChange: (fee: number) => void;
  onAssignRider: () => Promise<void>;
  isAssigningRider: boolean;
}

export default function RiderAssignment({
  availableRiders,
  selectedRiderId,
  onSelectRider,
  deliveryFee,
  onDeliveryFeeChange,
  onAssignRider,
  isAssigningRider
}: RiderAssignmentProps) {
  const selectedRider = availableRiders.find(r => r._id === selectedRiderId);
  
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
            <Truck className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Assign Delivery Rider
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Select a rider and set delivery fee
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {/* Rider Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Select Rider
            </label>
            <div className="relative">
              <select 
                className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all appearance-none cursor-pointer"
                value={selectedRiderId}
                onChange={(e) => onSelectRider(e.target.value)}
              >
                <option value="">Choose a rider...</option>
                {availableRiders.map(rider => (
                  <option key={rider._id} value={rider._id}>
                    {rider.firstName} {rider.lastName} • {rider.email}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Selected Rider Preview */}
            {selectedRider && (
              <div className="mt-3 p-3 bg-[var(--color-primary)]/5 rounded-xl border border-[var(--color-primary)]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center text-white font-bold">
                    {selectedRider.firstName.charAt(0)}{selectedRider.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text)]">
                      {selectedRider.firstName} {selectedRider.lastName}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {selectedRider.email} • {selectedRider.phone || 'No phone'}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                </div>
              </div>
            )}
          </div>
          
          {/* Delivery Fee Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Delivery Fee (KES)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <DollarSign className="w-5 h-5 text-[var(--color-text-muted)]" />
              </div>
              <input
                type="number"
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                placeholder="Enter delivery fee amount"
                value={deliveryFee}
                onChange={(e) => onDeliveryFeeChange(parseFloat(e.target.value) || 0)}
                min="0"
                step="50"
              />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              This fee will be paid by the customer to the rider
            </p>
          </div>
          
          {/* Assign Button */}
          <button
            onClick={onAssignRider}
            disabled={isAssigningRider || !selectedRiderId || deliveryFee <= 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isAssigningRider ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Assigning Rider...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Assign Rider</span>
              </>
            )}
          </button>
          
          {/* Info Alert */}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-700">What happens next?</p>
                <p className="text-xs text-blue-600 mt-1">
                  Assigning a rider will change the status to "ASSIGNED" and notify the rider immediately.
                  The rider will see delivery details in their dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}