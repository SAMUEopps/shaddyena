import { Rider } from '@/components/orders/details/types/orders';

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
}