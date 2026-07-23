// C:\Users\USER\Desktop\Projects\my-app\app\admin\members\page.tsx
/*'use client';

import { useState, useEffect } from 'react';

interface Member {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  memberSince: string;
  totalSavings: number;
  totalInvestments: number;
  availableBalance: number;
  referralEarnings: number;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/members', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMembers(data.members);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase()) ||
    member.phoneNumber.includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🌟 Members</h1>
        <div className="flex gap-3">
          <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-semibold">
            Total: {members.length}
          </span>
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Since</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                    <div className="text-sm text-gray-500">{member.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(member.memberSince).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-blue-600">
                    KSh {member.totalSavings?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 font-semibold text-purple-600">
                    KSh {member.totalInvestments?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    KSh {member.availableBalance?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 font-semibold text-amber-600">
                    KSh {member.referralEarnings?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMembers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No members found</div>
        )}
      </div>
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Member {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  memberSince: string;
  totalSavings: number;
  totalInvestments: number;
  availableBalance: number;
  referralEarnings: number;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/members', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setMessage({ type: 'error', text: 'Failed to load members' });
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase()) ||
    member.phoneNumber.includes(search)
  );

  const getTotalStats = () => {
    return {
      totalSavings: members.reduce((sum, m) => sum + (m.totalSavings || 0), 0),
      totalInvestments: members.reduce((sum, m) => sum + (m.totalInvestments || 0), 0),
      totalBalance: members.reduce((sum, m) => sum + (m.availableBalance || 0), 0),
      totalReferrals: members.reduce((sum, m) => sum + (m.referralEarnings || 0), 0)
    };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary">
            🌟 Members
          </h1>
          <p className="text-muted mt-1">
            Manage all members on the platform
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="bg-amber-100 text-amber-700 px-4 py-2.5 rounded-xl font-bold border border-amber-200">
            Total: {members.length}
          </span>
          <button
            onClick={fetchMembers}
            className="bg-surface hover:bg-surface/70 text-secondary px-5 py-2.5 rounded-xl transition-all duration-200 font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-surface">
          <p className="text-xs text-muted font-medium">Total Savings</p>
          <p className="text-lg sm:text-xl font-bold text-primary">
            KSh {stats.totalSavings.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-surface">
          <p className="text-xs text-muted font-medium">Total Investments</p>
          <p className="text-lg sm:text-xl font-bold text-accent-dark">
            KSh {stats.totalInvestments.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-surface">
          <p className="text-xs text-muted font-medium">Total Balance</p>
          <p className="text-lg sm:text-xl font-bold text-secondary">
            KSh {stats.totalBalance.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-surface">
          <p className="text-xs text-muted font-medium">Referral Earnings</p>
          <p className="text-lg sm:text-xl font-bold text-amber-600">
            KSh {stats.totalReferrals.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search members by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
        />
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-surface">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-lg font-bold text-secondary mb-2">No members found</h3>
            <p className="text-muted">
              {search ? 'Try adjusting your search' : 'No members have joined yet'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-4 text-primary hover:text-accent-dark font-medium transition-colors duration-200"
              >
                Clear search →
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface/30">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Member</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Since</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Savings</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">Investments</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Balance</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden xl:table-cell">Referrals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-surface/30 transition-colors duration-200">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-secondary">{member.name}</div>
                      <div className="text-xs text-muted truncate max-w-[150px]">{member.email}</div>
                      <div className="text-xs text-muted sm:hidden">{member.phoneNumber}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-muted hidden sm:table-cell">
                      {new Date(member.memberSince).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-primary hidden md:table-cell">
                      KSh {member.totalSavings?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-accent-dark hidden lg:table-cell">
                      KSh {member.totalInvestments?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-secondary">
                      KSh {member.availableBalance?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-amber-600 hidden xl:table-cell">
                      KSh {member.referralEarnings?.toLocaleString() || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {filteredMembers.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-surface">
          <div className="text-sm text-muted">
            Showing {filteredMembers.length} of {members.length} members
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-muted">
              Total Savings: <span className="font-bold text-primary">
                KSh {filteredMembers.reduce((sum, m) => sum + (m.totalSavings || 0), 0).toLocaleString()}
              </span>
            </span>
            <span className="text-muted">
              Total Balance: <span className="font-bold text-secondary">
                KSh {filteredMembers.reduce((sum, m) => sum + (m.availableBalance || 0), 0).toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}