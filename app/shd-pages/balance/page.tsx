
'use client';

import { useCallback, useEffect, useState } from 'react';

/* =========================================================
   TYPES
========================================================= */

interface CurrentBalance {
  _id?: string;
  accountName: string;
  currency: string;
  availableBalance: number;
  currentBalance: number;
  unclearedBalance: number;
  reservedBalance: number;
}

interface BalanceData {
  balance: CurrentBalance | null;
  timestamp: string;
  resultCode: string;
  resultDesc: string;
  success: boolean;
}

interface FullBalanceItem {
  accountName: string;
  currency: string;
  availableBalance: number;
  currentBalance: number;
  unclearedBalance: number;
  reservedBalance: number;
}

interface BalanceHistory {
  _id: string;
  accountName: string;
  balance: number;
  currency: string;
  fullBalance: FullBalanceItem[];
  resultCode: string;
  resultDesc: string;
  timestamp: string;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function BalancePage() {
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  /* =======================================================
     FETCH HISTORY
  ======================================================= */

  const fetchBalanceHistory = useCallback(async () => {
    try {
      const response = await fetch(
        '/api/shd-api/api/mpesa/balance/history',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch balance history');
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setBalanceHistory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }, []);

  /* =======================================================
     GET LATEST BALANCE RESULT
  ======================================================= */

  const getLatestBalance = useCallback(async () => {
    try {
      const response = await fetch(
        '/api/shd-api/api/mpesa/balance-result/get',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.success && data.balance) {
        return data as BalanceData;
      }

      return null;
    } catch (error) {
      console.error('Failed to get balance result:', error);
      return null;
    }
  }, []);

  /* =======================================================
     POLL BALANCE RESULT
  ======================================================= */

  const pollBalanceResult = useCallback(async () => {
    const maxAttempts = 15;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await getLatestBalance();

        if (result?.success && result.balance) {
          setBalanceData(result);
          setLastChecked(
            new Date(result.timestamp).toLocaleString()
          );

          await fetchBalanceHistory();

          setLoading(false);

          return true;
        }
      } catch (error) {
        console.error('Polling error:', error);
      }

      /*
       * Wait 3 seconds before checking again.
       * Don't wait after the final attempt.
       */
      if (attempt < maxAttempts) {
        await new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );
      }
    }

    setLoading(false);
    setError(
      'Balance query timed out. Please try again.'
    );

    return false;
  }, [fetchBalanceHistory, getLatestBalance]);

  /* =======================================================
     REQUEST NEW BALANCE
  ======================================================= */

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        '/api/shd-api/api/mpesa/balance',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to initiate balance request'
        );
      }

      console.log('Balance request response:', data);

      /*
       * Show pending state immediately.
       */
      setBalanceData({
        success: true,
        balance: null,
        timestamp: new Date().toISOString(),
        resultCode: 'pending',
        resultDesc:
          'Balance query initiated. Waiting for M-PESA response...',
      });

      setLastChecked(new Date().toLocaleString());

      /*
       * Start polling.
       */
      await pollBalanceResult();
    } catch (error: any) {
      console.error('Error fetching balance:', error);

      setError(
        error?.message ||
          'Failed to fetch balance'
      );

      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const latestBalance = await getLatestBalance();

        if (latestBalance?.balance) {
          setBalanceData(latestBalance);

          setLastChecked(
            new Date(
              latestBalance.timestamp
            ).toLocaleString()
          );
        }

        await fetchBalanceHistory();
      } catch (error) {
        console.error(
          'Failed to load initial balance data:',
          error
        );
      }
    };

    loadInitialData();
  }, [fetchBalanceHistory, getLatestBalance]);

  /* =======================================================
     HELPERS
  ======================================================= */

  const formatAmount = (
    amount: number | undefined | null
  ) => {
    if (
      amount === undefined ||
      amount === null ||
      Number.isNaN(amount)
    ) {
      return '0.00';
    }

    return amount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusLabel = () => {
    if (!balanceData) {
      return 'Unknown';
    }

    if (balanceData.resultCode === '0') {
      return 'Success';
    }

    if (balanceData.resultCode === 'pending') {
      return 'Pending';
    }

    return 'Failed';
  };

  const getStatusClasses = () => {
    if (!balanceData) {
      return 'bg-gray-100 text-gray-800';
    }

    if (balanceData.resultCode === '0') {
      return 'bg-green-100 text-green-800';
    }

    if (balanceData.resultCode === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    }

    return 'bg-red-100 text-red-800';
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                M-PESA Paybill Balance
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View your current M-PESA account balance and
                balance history.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowHistory(!showHistory)
                }
                className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
              >
                {showHistory
                  ? 'Hide History'
                  : 'Show History'}
              </button>

              <button
                type="button"
                onClick={fetchBalance}
                disabled={loading}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>

                    Checking...
                  </>
                ) : (
                  'Check Balance'
                )}
              </button>

            </div>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">

              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Balance Request Error
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =================================================
            BALANCE CARDS
        ================================================= */}

        {balanceData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* =============================================
                MAIN BALANCE
            ============================================= */}

            <div className="lg:col-span-2 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-lg p-6 sm:p-8 text-white">

              {balanceData.balance ? (
                <>
                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-sm font-medium text-green-100">
                        Current Balance
                      </p>

                      <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
                        {balanceData.balance.currency}{' '}
                        {formatAmount(
                          balanceData.balance.currentBalance
                        )}
                      </h2>

                      <p className="mt-3 text-sm text-green-100">
                        {balanceData.balance.accountName}
                      </p>
                    </div>

                    <div className="hidden sm:flex h-12 w-12 rounded-full bg-white/10 items-center justify-center">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0-1v-1m0 1V6m0 1V5m0 1V4m0 1V3"
                        />
                      </svg>
                    </div>

                  </div>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-xs text-green-100">
                        Available
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {balanceData.balance.currency}{' '}
                        {formatAmount(
                          balanceData.balance.availableBalance
                        )}
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-xs text-green-100">
                        Uncleared
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {balanceData.balance.currency}{' '}
                        {formatAmount(
                          balanceData.balance.unclearedBalance
                        )}
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-xs text-green-100">
                        Reserved
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {balanceData.balance.currency}{' '}
                        {formatAmount(
                          balanceData.balance.reservedBalance
                        )}
                      </p>
                    </div>

                  </div>
                </>
              ) : (
                <div className="min-h-[240px] flex flex-col items-center justify-center text-center">

                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white mb-5" />

                  <h2 className="text-xl font-semibold">
                    Waiting for M-PESA...
                  </h2>

                  <p className="mt-2 text-sm text-green-100 max-w-md">
                    The balance request has been submitted.
                    We are waiting for the asynchronous M-PESA
                    response.
                  </p>

                </div>
              )}

            </div>

            {/* =============================================
                STATUS
            ============================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

              <p className="text-sm font-medium text-gray-500">
                Request Status
              </p>

              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses()}`}
                >
                  <span
                    className={`mr-2 h-2 w-2 rounded-full ${
                      balanceData.resultCode === '0'
                        ? 'bg-green-500'
                        : balanceData.resultCode ===
                          'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />

                  {getStatusLabel()}
                </span>
              </div>

              <div className="mt-6 space-y-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Response
                  </p>

                  <p className="mt-1 text-sm text-gray-900">
                    {balanceData.resultDesc ||
                      'No response description'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Result Code
                  </p>

                  <p className="mt-1 text-sm font-mono text-gray-900">
                    {balanceData.resultCode}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm text-gray-900">
                    {lastChecked || 'Not checked yet'}
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            NO DATA
        ================================================= */}

        {!balanceData && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 sm:p-16 text-center">

            <div className="mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">

              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0-1v-1m0 1V6m0 1V5m0 1V4m0 1V3"
                />
              </svg>

            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              No balance data
            </h3>

            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Click the "Check Balance" button to request
              the current M-PESA Paybill balance.
            </p>

            <button
              type="button"
              onClick={fetchBalance}
              disabled={loading}
              className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading
                ? 'Checking...'
                : 'Check Balance'}
            </button>

          </div>
        )}

        {/* =================================================
            HISTORY
        ================================================= */}

        {showHistory && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Balance History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Previous M-PESA balance queries.
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {balanceHistory.length}{' '}
                {balanceHistory.length === 1
                  ? 'record'
                  : 'records'}
              </span>

            </div>

            {balanceHistory.length === 0 ? (
              <div className="p-10 text-center">

                <p className="text-sm text-gray-500">
                  No balance history available.
                </p>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="min-w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date / Time
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>

                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accounts
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">

                    {balanceHistory.map((record) => (

                      <tr
                        key={record._id}
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.timestamp
                            ? new Date(
                                record.timestamp
                              ).toLocaleString()
                            : '—'}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className="text-sm font-medium text-gray-900">
                            {record.accountName || '—'}
                          </div>

                          <div className="text-xs text-gray-500">
                            {record.currency || 'KES'}
                          </div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">

                          {record.currency || 'KES'}{' '}

                          {formatAmount(
                            record.balance
                          )}

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">

                          {Array.isArray(
                            record.fullBalance
                          )
                            ? record.fullBalance.length
                            : 0}

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              record.resultCode === '0'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >

                            {record.resultCode === '0'
                              ? 'Success'
                              : 'Failed'}

                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        )}

        {/* =================================================
            DETAILED ACCOUNTS FROM LATEST RESPONSE
        ================================================= */}

        {balanceData?.balance && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <div className="mb-5">

              <h2 className="text-xl font-semibold text-gray-900">
                Account Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Detailed balances returned by M-PESA.
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">

                <p className="text-xs text-gray-500">
                  Current Balance
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {balanceData.balance.currency}{' '}
                  {formatAmount(
                    balanceData.balance.currentBalance
                  )}
                </p>

              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">

                <p className="text-xs text-gray-500">
                  Available Balance
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {balanceData.balance.currency}{' '}
                  {formatAmount(
                    balanceData.balance.availableBalance
                  )}
                </p>

              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">

                <p className="text-xs text-gray-500">
                  Uncleared Balance
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {balanceData.balance.currency}{' '}
                  {formatAmount(
                    balanceData.balance.unclearedBalance
                  )}
                </p>

              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">

                <p className="text-xs text-gray-500">
                  Reserved Balance
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {balanceData.balance.currency}{' '}
                  {formatAmount(
                    balanceData.balance.reservedBalance
                  )}
                </p>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
