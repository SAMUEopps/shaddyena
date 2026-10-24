'use client';

import { useState, useEffect, useCallback } from 'react';

type Wallet = {
  balance: number;
  availableBalance: number;
  pendingPayouts: number;
  totalDeposited: number;
  totalDisbursed: number;
  currency: string;
};

type Owed = { _id: string; owed: number };
type Txn = {
  _id: string;
  transactionId: string;
  type: string;
  category: string;
  amount: number;
  status: string;
  receiptNumber?: string;
  errorMessage?: string;
  createdAt: string;
};

export default function AdminWalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [owed, setOwed] = useState<Owed[]>([]);
  const [recent, setRecent] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Admin/org from your auth session — stub here
  const adminUserId = 'REPLACE_FROM_SESSION';
  const organizationId = 'REPLACE_FROM_SESSION';

  // Deposit form
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPhone, setDepositPhone] = useState('');

  // Payout form
  const [payMarketerId, setPayMarketerId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payPhone, setPayPhone] = useState('');
  const [payRemarks, setPayRemarks] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/wallet/summary?organizationId=${organizationId}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      setWallet(data.wallet);
      setOwed(data.owed || []);
      setRecent(data.recent || []);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => { load(); }, [load]);

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!depositAmount || Number(depositAmount) <= 0) {
      return setMsg({ type: 'err', text: 'Enter a valid amount' });
    }
    try {
      const res = await fetch('/api/admin/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUserId, organizationId,
          amount: Number(depositAmount),
          phoneNumber: depositPhone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'ok', text: 'STK sent. Approve on your phone.' });
      setDepositAmount('');
      setTimeout(load, 4000);
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    }
  }

  async function handlePayout(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!payMarketerId || !payAmount) {
      return setMsg({ type: 'err', text: 'Select marketer and amount' });
    }
    if (wallet && Number(payAmount) > wallet.availableBalance) {
      return setMsg({ type: 'err', text: 'Amount exceeds available balance' });
    }
    try {
      const res = await fetch('/api/admin/wallet/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUserId, organizationId,
          marketerId: payMarketerId,
          amount: Number(payAmount),
          phoneNumber: payPhone || undefined,
          remarks: payRemarks || undefined,
          idempotencyKey: `payout-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'ok', text: 'Payout submitted to M-Pesa B2C.' });
      setPayAmount(''); setPayPhone(''); setPayRemarks('');
      load();
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    }
  }

  return (
    <main className="container p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">Admin Wallet</h1>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl bg-primary text-white hover:opacity-90"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {msg && (
        <div
          className={`rounded-xl p-3 text-sm ${
            msg.type === 'ok'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Balance cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total balance" value={wallet?.balance ?? 0} accent />
        <StatCard label="Available" value={wallet?.availableBalance ?? 0} />
        <StatCard label="Pending payouts" value={wallet?.pendingPayouts ?? 0} />
        <StatCard label="Total disbursed" value={wallet?.totalDisbursed ?? 0} />
      </section>

      {/* Deposit + payout forms */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Deposit */}
        <form onSubmit={handleDeposit} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-secondary">Deposit funds (M-Pesa STK)</h2>
          <input
            className="w-full rounded-xl border px-3 py-2"
            type="number"
            placeholder="Amount (KES)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Phone (optional, defaults to your account)"
            value={depositPhone}
            onChange={(e) => setDepositPhone(e.target.value)}
          />
          <button className="w-full rounded-xl bg-primary text-white py-2 hover:opacity-90">
            Send STK push
          </button>
        </form>

        {/* Payout */}
        <form onSubmit={handlePayout} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-secondary">Disburse to marketer (B2C)</h2>
          <select
            className="w-full rounded-xl border px-3 py-2"
            value={payMarketerId}
            onChange={(e) => setPayMarketerId(e.target.value)}
          >
            <option value="">Select marketer with earnings owed…</option>
            {owed.map((o) => (
              <option key={o._id} value={o._id}>
                {o._id} — owed {o.owed}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded-xl border px-3 py-2"
            type="number"
            placeholder="Amount (KES)"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
          />
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Override phone (optional)"
            value={payPhone}
            onChange={(e) => setPayPhone(e.target.value)}
          />
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Remarks (optional)"
            value={payRemarks}
            onChange={(e) => setPayRemarks(e.target.value)}
          />
          <button className="w-full rounded-xl bg-secondary text-white py-2 hover:opacity-90">
            Send B2C payout
          </button>
        </form>
      </section>

      {/* Recent activity */}
      <section className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold text-secondary mb-3">Recent wallet activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="py-2">Time</th>
                <th>Ref</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="py-2">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="font-mono text-xs">{t.transactionId}</td>
                  <td>{t.category}</td>
                  <td>{t.amount}</td>
                  <td>
                    <StatusPill status={t.status} />
                  </td>
                  <td className="text-xs">{t.receiptNumber || t.errorMessage || '—'}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">No activity yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label, value, accent,
}: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ${
        accent ? 'bg-primary text-white' : 'bg-white'
      }`}
    >
      <p className={`text-xs ${accent ? 'text-white/80' : 'text-muted'}`}>{label}</p>
      <p className="text-xl font-bold mt-1">{value.toLocaleString()} KES</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === 'success'
      ? 'bg-green-100 text-green-700'
      : status === 'failed' || status === 'cancelled'
      ? 'bg-red-100 text-red-700'
      : 'bg-yellow-100 text-yellow-700';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>{status}</span>
  );
}