'use client';

import { useState, useEffect } from 'react';

interface BalanceData {
  balance: {
    accountName: string;
    amount: number;
    currency: string;
    fullBalance: string;
  } | null;
  timestamp: string;
  resultCode: string;
  resultDesc: string;
  success: boolean;
}

interface BalanceHistory {
  _id: string;
  balance: number;
  accountName: string;
  currency: string;
  timestamp: string;
  resultCode: string;
}

export default function BalancePage() {
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shad-api/api/mpesa/balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance');
      }

      console.log('Balance Response:', data);

      // Show waiting message
      setBalanceData({
        success: true,
        balance: null,
        timestamp: new Date().toISOString(),
        resultCode: 'pending',
        resultDesc: 'Balance query initiated. Waiting for response...',
      });
      
      setLastChecked(new Date().toLocaleString());

      // Start polling for the balance result
      pollBalanceResult();

    } catch (err: any) {
      console.error('Error fetching balance:', err);
      setError(err.message || 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const pollBalanceResult = () => {
    let attempts = 0;
    const maxAttempts = 15;
    
    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch('/api/shd-api/api/mpesa/balance-result/get');
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.balance) {
            setBalanceData(data);
            setLastChecked(new Date().toLocaleString());
            clearInterval(interval);
            // Fetch history after getting new balance
            fetchBalanceHistory();
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setError('Balance query timed out. Please try again.');
        setLoading(false);
      }
    }, 3000);
  };

  const fetchBalanceHistory = async () => {
    try {
      const response = await fetch('/api/shd-api/api/mpesa/balance/history');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBalanceHistory(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  // Load initial balance data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Get latest balance
        const response = await fetch('/api/shd-api/api/mpesa/balance-result/get');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.balance) {
            setBalanceData(data);
            setLastChecked(new Date(data.timestamp).toLocaleString());
          }
        }
        
        // Get history
        await fetchBalanceHistory();
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                M-PESA Paybill Balance
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {showHistory ? 'Hide History' : 'Show History'}
                </button>
                <button
                  onClick={fetchBalance}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking...
                    </>
                  ) : (
                    'Check Balance'
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {balanceData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <div className="text-sm text-gray-600 mb-2">Current Balance</div>
                    {balanceData.balance ? (
                      <>
                        <div className="text-4xl font-bold text-green-700">
                          {balanceData.balance.currency} {balanceData.balance.amount.toLocaleString()}
                        </div>
                        <div className="mt-2 text-sm text-gray-700 font-medium">
                          {balanceData.balance.accountName}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {balanceData.balance.fullBalance}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-600">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          <span>Waiting for response...</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          The balance query is asynchronous. Please wait a moment.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Status</div>
                    <div className="space-y-2">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          balanceData.resultCode === '0' ? 'bg-green-100 text-green-800' : 
                          balanceData.resultCode === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {balanceData.resultCode === '0' ? 'Success' : 
                           balanceData.resultCode === 'pending' ? 'Pending' : 'Failed'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        {balanceData.resultDesc}
                      </div>
                      <div className="text-xs text-gray-500">
                        Result Code: {balanceData.resultCode}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Last Updated</div>
                    {lastChecked ? (
                      <div className="text-sm text-gray-700">
                        {lastChecked}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Not checked yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!balanceData && !error && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0-1v-1m0 1V6m0 1V5m0 1V4m0 1V3m-2 14h4M6 7a6 6 0 0112 0v10a6 6 0 01-12 0V7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No balance data</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Click the "Check Balance" button to fetch the current paybill balance.
                </p>
              </div>
            )}

            {/* Balance History */}
            {showHistory && balanceHistory.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Balance History
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date/Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {balanceHistory.map((record) => (
                        <tr key={record._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(record.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.accountName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            {record.currency} {record.balance.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.resultCode === '0' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {record.resultCode === '0' ? 'Success' : 'Failed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}