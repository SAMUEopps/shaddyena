'use client';

import { useState } from 'react';

/*interface AvailableFund {
  _id: string;
  orderId: string;
  amount: number;
  netAmount: number;
  type: string;
  metadata?: {
    isImmediateRelease: boolean;
    percentage: number;
    holdUntil?: string;
  };
  scheduledAt: string;
}*/

interface AvailableFund {
  _id: string;
  orderId: string;
  amount: number;
  netAmount: number;
  type: string;
  metadata: {
    isImmediateRelease?: boolean;
    percentage?: number;
    holdUntil?: string;
    breakdown?: {
      totalAmount: number;
      commission: number;
      vendorEarnings: number;
      immediateRelease: number;
      remaining20Percent: number;
    };
  };
  scheduledAt: string;
  withdrawalStatus: string;
}

interface AvailableFundsProps {
  funds: AvailableFund[];
  selectedFunds: string[];
  onSelectFund: (fundId: string) => void;
  onSelectAll: () => void;
  onRequestWithdrawal: () => void;
  totalSelected: number;
}

export default function AvailableFunds({
  funds,
  selectedFunds,
  onSelectFund,
  onSelectAll,
  onRequestWithdrawal,
  totalSelected
}: AvailableFundsProps) {
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const sortedFunds = [...funds].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime();
    }
    return b.netAmount - a.netAmount;
  });

  if (funds.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No available funds</h3>
        <p className="mt-1 text-gray-500">All your earnings have been processed or are locked.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with actions */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">
              {selectedFunds.length} of {funds.length} funds selected
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Total Selected: KSh {totalSelected.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                className="text-sm border-gray-300 rounded"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
            </div>
            <button
              onClick={onSelectAll}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {selectedFunds.length === funds.length ? 'Deselect All' : 'Select All'}
            </button>
            <button
              onClick={onRequestWithdrawal}
              disabled={selectedFunds.length === 0}
              className={`px-4 py-2 text-sm rounded-lg font-medium ${
                selectedFunds.length > 0
                  ? 'bg-[#bf2c7e] text-white hover:bg-[#a8246e]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Request Withdrawal
            </button>
          </div>
        </div>
      </div>

      {/* Funds Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input
                  type="checkbox"
                  checked={selectedFunds.length === funds.length && funds.length > 0}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-[#bf2c7e] rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available From</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/*{sortedFunds.map((fund) => {
              const isSelected = selectedFunds.includes(fund._id);
              const isImmediate = fund.metadata?.isImmediateRelease;
              const isAvailable = new Date(fund.scheduledAt) <= new Date();

              return (
                <tr key={fund._id} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectFund(fund._id)}
                      disabled={!isAvailable}
                      className="h-4 w-4 text-[#bf2c7e] rounded disabled:opacity-50"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {fund.orderId}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isImmediate
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isImmediate ? 'Immediate (80%)' : 'Regular (20%)'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    KSh {fund.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    KSh {fund.netAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {isAvailable ? 'Available' : 'Locked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(fund.scheduledAt).toLocaleDateString()}
                    {!isAvailable && fund.metadata?.holdUntil && (
                      <p className="text-xs text-gray-400">
                        Hold until: {new Date(fund.metadata.holdUntil).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}*/}
            {sortedFunds.map((fund) => {
            const isSelected = selectedFunds.includes(fund._id);
            const isImmediate = fund.metadata?.isImmediateRelease;
            const isAvailable = fund.withdrawalStatus === 'AVAILABLE';
            const breakdown = fund.metadata?.breakdown;

            return (
                <tr key={fund._id} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                <td className="px-6 py-4">
                    <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectFund(fund._id)}
                    disabled={!isAvailable}
                    className="h-4 w-4 text-[#bf2c7e] rounded disabled:opacity-50"
                    />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {fund.orderId}
                </td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                    isImmediate
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                    {isImmediate ? 'Immediate (80%)' : 'Regular (20%)'}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                    {breakdown ? (
                    <div className="space-y-1">
                        <div>Total: KSh {breakdown.totalAmount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                        After {breakdown.commission.toLocaleString()} commission
                        </div>
                    </div>
                    ) : (
                    `KSh ${fund.amount.toLocaleString()}`
                    )}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    KSh {fund.netAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {isAvailable ? 'Available' : 'Locked'}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(fund.scheduledAt).toLocaleDateString()}
                    {!isAvailable && fund.metadata?.holdUntil && (
                    <p className="text-xs text-gray-400">
                        Hold until: {new Date(fund.metadata.holdUntil).toLocaleDateString()}
                    </p>
                    )}
                </td>
                </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Immediate Funds (80%)</p>
            <p className="text-lg font-semibold text-green-600">
              KSh {funds
                .filter(f => f.metadata?.isImmediateRelease)
                .reduce((sum, f) => sum + f.netAmount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Regular Funds (20%)</p>
            <p className="text-lg font-semibold text-blue-600">
              KSh {funds
                .filter(f => !f.metadata?.isImmediateRelease)
                .reduce((sum, f) => sum + f.netAmount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Available</p>
            <p className="text-lg font-semibold text-gray-900">
              KSh {funds
                .filter(f => new Date(f.scheduledAt) <= new Date())
                .reduce((sum, f) => sum + f.netAmount, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}