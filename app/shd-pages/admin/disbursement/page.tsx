// 'use client';

// import { useAuth } from '@/shd-contexts/AuthContext';
// import { useState, useEffect, useCallback } from 'react';

// type Wallet = {
//   balance: number;
//   availableBalance: number;
//   pendingPayouts: number;
//   totalDeposited: number;
//   totalDisbursed: number;
//   currency: string;
// };

// type Owed = { _id: string; owed: number };
// type Txn = {
//   _id: string;
//   transactionId: string;
//   type: string;
//   category: string;
//   amount: number;
//   status: string;
//   receiptNumber?: string;
//   errorMessage?: string;
//   createdAt: string;
// };

// export default function AdminWalletPage() {
//   const [wallet, setWallet] = useState<Wallet | null>(null);
//   const [owed, setOwed] = useState<Owed[]>([]);
//   const [recent, setRecent] = useState<Txn[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);


// const { user, token, organizationId, isLoading: authLoading } = useAuth();

// const adminUserId = user?.id ?? null;
// const activeOrganizationId = organizationId ?? user?.organizationId ?? null;

//   // Deposit form
//   const [depositAmount, setDepositAmount] = useState('');
//   const [depositPhone, setDepositPhone] = useState('');

//   // Payout form
//   const [payMarketerId, setPayMarketerId] = useState('');
//   const [payAmount, setPayAmount] = useState('');
//   const [payPhone, setPayPhone] = useState('');
//   const [payRemarks, setPayRemarks] = useState('');


// // const load = useCallback(async () => {
// //   if (authLoading || !token || !activeOrganizationId) return;

// //   setLoading(true);

// //   try {
// //     const res = await fetch('/api/admin/wallet/summary', {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //       cache: 'no-store',
// //     });

// //     const data = await res.json();

// //     if (!res.ok) {
// //       throw new Error(data.error || 'Failed to load wallet summary');
// //     }

// //     setWallet(data.wallet);
// //     setOwed(data.owed || []);
// //     setRecent(data.recent || []);
// //   } catch (error) {
// //     setMsg({
// //       type: 'err',
// //       text: error instanceof Error ? error.message : 'Failed to load wallet',
// //     });
// //   } finally {
// //     setLoading(false);
// //   }
// // }, [authLoading, token, activeOrganizationId]);


// const load = useCallback(async () => {
//   if (authLoading || !token || !activeOrganizationId) return;

//   setLoading(true);
//   setMsg(null);

//   try {
//     const params = new URLSearchParams({
//       organizationId: String(activeOrganizationId),
//     });

//     const res = await fetch(
//       `/api/admin/wallet/summary?${params.toString()}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         cache: 'no-store',
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(
//         data.error || `Failed to load wallet (${res.status})`
//       );
//     }

//     setWallet(data.wallet);
//     setOwed(data.owed ?? []);
//     setRecent(data.recent ?? []);
//   } catch (error) {
//     setMsg({
//       type: 'err',
//       text:
//         error instanceof Error
//           ? error.message
//           : 'Failed to load wallet',
//     });
//   } finally {
//     setLoading(false);
//   }
// }, [authLoading, token, activeOrganizationId]);


// useEffect(() => {
//   if (!authLoading && token && activeOrganizationId) {
//     void load();
//   }
// }, [authLoading, token, activeOrganizationId, load]);

//   useEffect(() => { load(); }, [load]);

//   async function handleDeposit(e: React.FormEvent) {
//     e.preventDefault();
//     setMsg(null);
//     if (!depositAmount || Number(depositAmount) <= 0) {
//       return setMsg({ type: 'err', text: 'Enter a valid amount' });
//     }
//     try {
//       const res = await fetch('/api/admin/wallet/deposit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           adminUserId, organizationId,
//           amount: Number(depositAmount),
//           phoneNumber: depositPhone || undefined,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);
//       setMsg({ type: 'ok', text: 'STK sent. Approve on your phone.' });
//       setDepositAmount('');
//       setTimeout(load, 4000);
//     } catch (err: any) {
//       setMsg({ type: 'err', text: err.message });
//     }
//   }

//   async function handlePayout(e: React.FormEvent) {
//     e.preventDefault();
//     setMsg(null);
//     if (!payMarketerId || !payAmount) {
//       return setMsg({ type: 'err', text: 'Select marketer and amount' });
//     }
//     if (wallet && Number(payAmount) > wallet.availableBalance) {
//       return setMsg({ type: 'err', text: 'Amount exceeds available balance' });
//     }
//     try {
//       const res = await fetch('/api/admin/wallet/payout', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           adminUserId, organizationId,
//           marketerId: payMarketerId,
//           amount: Number(payAmount),
//           phoneNumber: payPhone || undefined,
//           remarks: payRemarks || undefined,
//           idempotencyKey: `payout-${Date.now()}`,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);
//       setMsg({ type: 'ok', text: 'Payout submitted to M-Pesa B2C.' });
//       setPayAmount(''); setPayPhone(''); setPayRemarks('');
//       load();
//     } catch (err: any) {
//       setMsg({ type: 'err', text: err.message });
//     }
//   }

//   return (
//     <main className="container p-6 space-y-6">
//       <header className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-secondary">Admin Wallet</h1>
//         <button
//           onClick={load}
//           className="px-4 py-2 rounded-xl bg-primary text-white hover:opacity-90"
//         >
//           {loading ? 'Refreshing…' : 'Refresh'}
//         </button>
//       </header>

//       {msg && (
//         <div
//           className={`rounded-xl p-3 text-sm ${
//             msg.type === 'ok'
//               ? 'bg-green-50 text-green-700 border border-green-200'
//               : 'bg-red-50 text-red-700 border border-red-200'
//           }`}
//         >
//           {msg.text}
//         </div>
//       )}

//       {/* Balance cards */}
//       <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard label="Total balance" value={wallet?.balance ?? 0} accent />
//         <StatCard label="Available" value={wallet?.availableBalance ?? 0} />
//         <StatCard label="Pending payouts" value={wallet?.pendingPayouts ?? 0} />
//         <StatCard label="Total disbursed" value={wallet?.totalDisbursed ?? 0} />
//       </section>

//       {/* Deposit + payout forms */}
//       <section className="grid md:grid-cols-2 gap-6">
//         {/* Deposit */}
//         <form onSubmit={handleDeposit} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
//           <h2 className="font-semibold text-secondary">Deposit funds (M-Pesa STK)</h2>
//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             type="number"
//             placeholder="Amount (KES)"
//             value={depositAmount}
//             onChange={(e) => setDepositAmount(e.target.value)}
//           />
//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             placeholder="Phone (optional, defaults to your account)"
//             value={depositPhone}
//             onChange={(e) => setDepositPhone(e.target.value)}
//           />
//           <button className="w-full rounded-xl bg-primary text-white py-2 hover:opacity-90">
//             Send STK push
//           </button>
//         </form>

//         {/* Payout */}
//         <form onSubmit={handlePayout} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
//           <h2 className="font-semibold text-secondary">Disburse to marketer (B2C)</h2>
//           <select
//             className="w-full rounded-xl border px-3 py-2"
//             value={payMarketerId}
//             onChange={(e) => setPayMarketerId(e.target.value)}
//           >
//             <option value="">Select marketer with earnings owed…</option>
//             {owed.map((o) => (
//               <option key={o._id} value={o._id}>
//                 {o._id} — owed {o.owed}
//               </option>
//             ))}
//           </select>
//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             type="number"
//             placeholder="Amount (KES)"
//             value={payAmount}
//             onChange={(e) => setPayAmount(e.target.value)}
//           />
//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             placeholder="Override phone (optional)"
//             value={payPhone}
//             onChange={(e) => setPayPhone(e.target.value)}
//           />
//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             placeholder="Remarks (optional)"
//             value={payRemarks}
//             onChange={(e) => setPayRemarks(e.target.value)}
//           />
//           <button className="w-full rounded-xl bg-secondary text-white py-2 hover:opacity-90">
//             Send B2C payout
//           </button>
//         </form>
//       </section>

//       {/* Recent activity */}
//       <section className="bg-white rounded-2xl p-5 shadow-sm">
//         <h2 className="font-semibold text-secondary mb-3">Recent wallet activity</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="text-left text-muted">
//               <tr>
//                 <th className="py-2">Time</th>
//                 <th>Ref</th>
//                 <th>Category</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Receipt</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recent.map((t) => (
//                 <tr key={t._id} className="border-t">
//                   <td className="py-2">{new Date(t.createdAt).toLocaleString()}</td>
//                   <td className="font-mono text-xs">{t.transactionId}</td>
//                   <td>{t.category}</td>
//                   <td>{t.amount}</td>
//                   <td>
//                     <StatusPill status={t.status} />
//                   </td>
//                   <td className="text-xs">{t.receiptNumber || t.errorMessage || '—'}</td>
//                 </tr>
//               ))}
//               {recent.length === 0 && (
//                 <tr><td colSpan={6} className="text-center text-muted py-4">No activity yet</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </main>
//   );
// }

// function StatCard({
//   label, value, accent,
// }: { label: string; value: number; accent?: boolean }) {
//   return (
//     <div
//       className={`rounded-2xl p-4 shadow-sm ${
//         accent ? 'bg-primary text-white' : 'bg-white'
//       }`}
//     >
//       <p className={`text-xs ${accent ? 'text-white/80' : 'text-muted'}`}>{label}</p>
//       <p className="text-xl font-bold mt-1">{value.toLocaleString()} KES</p>
//     </div>
//   );
// }

// function StatusPill({ status }: { status: string }) {
//   const color =
//     status === 'success'
//       ? 'bg-green-100 text-green-700'
//       : status === 'failed' || status === 'cancelled'
//       ? 'bg-red-100 text-red-700'
//       : 'bg-yellow-100 text-yellow-700';
//   return (
//     <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>{status}</span>
//   );
// }


// // app/shd-pages/admin/wallet/page.tsx
// 'use client';

// import { useAuth } from '@/shd-contexts/AuthContext';
// import { useState, useEffect, useCallback, useMemo } from 'react';

// type Wallet = {
//   balance: number;
//   availableBalance: number;
//   pendingPayouts: number;
//   totalDisbursed: number;
//   currency: string;
// };

// type Marketer = {
//   _id: string;
//   name: string;
//   email: string;
//   phoneNumber: string;
//   marketerStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
//   marketerTier: string;
//   totalCommissions: number;
//   totalReferralsMade: number;
//   disbursed: number;
//   owed: number;
//   payoutMethod?: 'mpesa' | 'bank';
//   payoutDetails?: {
//     phoneNumber?: string;
//     bankName?: string;
//     accountNumber?: string;
//     accountName?: string;
//   };
// };

// type Payout = {
//   _id: string;
//   amount: number;
//   status: 'pending' | 'processing' | 'completed' | 'failed';
//   method: 'MPESA' | 'BANK';
//   reference: string;
//   transactionId?: string;
//   errorMessage?: string;
//   createdAt: string;
//   marketerId?: { _id: string; name: string; email: string; phoneNumber: string };
// };

// type Txn = {
//   _id: string;
//   transactionId: string;
//   type: string;
//   category: string;
//   amount: number;
//   status: string;
//   receiptNumber?: string;
//   errorMessage?: string;
//   createdAt: string;
// };

// export default function AdminWalletPage() {
//   const { user, token, organizationId, isLoading: authLoading } = useAuth();
//   const adminUserId = user?.id ?? null;
//   const activeOrganizationId = organizationId ?? user?.organizationId ?? null;

//   // Wallet
//   const [wallet, setWallet] = useState<Wallet | null>(null);
//   const [recent, setRecent] = useState<Txn[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(
//     null
//   );

//   // Marketers
//   const [marketers, setMarketers] = useState<Marketer[]>([]);
//   const [marketersLoading, setMarketersLoading] = useState(false);

//   // Deposit form
//   const [depositAmount, setDepositAmount] = useState('');
//   const [depositPhone, setDepositPhone] = useState('');

//   // Payout form
//   const [payMarketerId, setPayMarketerId] = useState('');
//   const [payAmount, setPayAmount] = useState('');
//   const [payPhone, setPayPhone] = useState('');
//   const [payRemarks, setPayRemarks] = useState('');
//   const [paying, setPaying] = useState(false);

//   // Payout history for selected marketer
//   const [payouts, setPayouts] = useState<Payout[]>([]);

//   const selectedMarketer = useMemo(
//     () => marketers.find((m) => m._id === payMarketerId) || null,
//     [marketers, payMarketerId]
//   );

//   const hasPendingPayouts = payouts.some(
//     (p) => p.status === 'pending' || p.status === 'processing'
//   );

//   /* ---------------- Load wallet summary ---------------- */
//   const load = useCallback(async () => {
//     if (authLoading || !token || !activeOrganizationId) return;
//     setLoading(true);
//     setMsg(null);
//     try {
//       const params = new URLSearchParams({
//         organizationId: String(activeOrganizationId),
//       });
//       const res = await fetch(
//         `/api/admin/wallet/summary?${params.toString()}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           cache: 'no-store',
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Failed to load wallet');
//       setWallet(data.wallet);
//       setRecent(data.recent ?? []);
//     } catch (error) {
//       setMsg({
//         type: 'err',
//         text: error instanceof Error ? error.message : 'Failed to load wallet',
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [authLoading, token, activeOrganizationId]);

//   /* ---------------- Load marketers ---------------- */
//   const loadMarketers = useCallback(async () => {
//     if (authLoading || !token) return;
//     setMarketersLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (activeOrganizationId)
//         params.set('organizationId', String(activeOrganizationId));

//       const res = await fetch(
//         `/api/admin/wallet/marketers?${params.toString()}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           cache: 'no-store',
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Failed to load marketers');
//       setMarketers(data.marketers || []);
//     } catch (error: any) {
//       setMsg({ type: 'err', text: error.message });
//     } finally {
//       setMarketersLoading(false);
//     }
//   }, [authLoading, token, activeOrganizationId]);

//   /* ---------------- Load payout history ---------------- */
//   const loadPayouts = useCallback(
//     async (marketerId?: string) => {
//       if (!token) return;
//       try {
//         const params = new URLSearchParams({ limit: '25' });
//         if (marketerId) params.set('marketerId', marketerId);
//         const res = await fetch(
//           `/api/admin/wallet/payouts?${params.toString()}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             cache: 'no-store',
//           }
//         );
//         const data = await res.json();
//         if (res.ok) setPayouts(data.payouts || []);
//       } catch {
//         /* non-fatal */
//       }
//     },
//     [token]
//   );

//   /* ---------------- Initial loads ---------------- */
//   useEffect(() => {
//     if (!authLoading && token && activeOrganizationId) {
//       void load();
//       void loadMarketers();
//       void loadPayouts(payMarketerId || undefined);
//     }
//   }, [
//     authLoading,
//     token,
//     activeOrganizationId,
//     load,
//     loadMarketers,
//     loadPayouts,
//     payMarketerId,
//   ]);

//   /* ---------------- Poll payout status ---------------- */
//   useEffect(() => {
//     if (!hasPendingPayouts) return;
//     const t = setInterval(
//       () => void loadPayouts(payMarketerId || undefined),
//       30000
//     );
//     return () => clearInterval(t);
//   }, [hasPendingPayouts, payMarketerId, loadPayouts]);

//   /* ---------------- When marketer changes, prefill ---------------- */
//   useEffect(() => {
//     if (!selectedMarketer) {
//       setPayAmount('');
//       setPayPhone('');
//       return;
//     }
//     setPayAmount(selectedMarketer.owed > 0 ? String(selectedMarketer.owed) : '');
//     setPayPhone(
//       selectedMarketer.payoutDetails?.phoneNumber ||
//         selectedMarketer.phoneNumber ||
//         ''
//     );
//     void loadPayouts(selectedMarketer._id);
//   }, [selectedMarketer, loadPayouts]);

//   /* ---------------- Deposit ---------------- */
//   async function handleDeposit(e: React.FormEvent) {
//     e.preventDefault();
//     setMsg(null);
//     if (!depositAmount || Number(depositAmount) <= 0) {
//       return setMsg({ type: 'err', text: 'Enter a valid amount' });
//     }
//     try {
//       const res = await fetch('/api/admin/wallet/deposit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           adminUserId,
//           organizationId,
//           amount: Number(depositAmount),
//           phoneNumber: depositPhone || undefined,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);
//       setMsg({ type: 'ok', text: 'STK sent. Approve on your phone.' });
//       setDepositAmount('');
//       setTimeout(load, 4000);
//     } catch (err: any) {
//       setMsg({ type: 'err', text: err.message });
//     }
//   }

//   /* ---------------- Payout ---------------- */
//   async function handlePayout(e: React.FormEvent) {
//     e.preventDefault();
//     setMsg(null);
//     if (!payMarketerId || !payAmount) {
//       return setMsg({ type: 'err', text: 'Select marketer and amount' });
//     }
//     const amt = Number(payAmount);
//     if (amt <= 0) {
//       return setMsg({ type: 'err', text: 'Amount must be greater than 0' });
//     }
//     if (selectedMarketer && amt > selectedMarketer.owed) {
//       return setMsg({
//         type: 'err',
//         text: `Amount exceeds owed (KES ${selectedMarketer.owed.toLocaleString()})`,
//       });
//     }

//     setPaying(true);
//     try {
//       const res = await fetch('/api/admin/wallet/payout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           adminUserId,
//           organizationId,
//           marketerId: payMarketerId,
//           amount: amt,
//           phoneNumber: payPhone || undefined,
//           remarks: payRemarks || undefined,
//           idempotencyKey: `payout-${Date.now()}`,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       setMsg({ type: 'ok', text: 'Payout sent to M-Pesa B2C.' });
//       setPayAmount('');
//       setPayPhone('');
//       setPayRemarks('');

//       // Refresh everything
//       await Promise.all([
//         loadMarketers(),
//         loadPayouts(payMarketerId),
//         load(),
//       ]);
//     } catch (err: any) {
//       setMsg({ type: 'err', text: err.message });
//     } finally {
//       setPaying(false);
//     }
//   }

//   return (
//     <main className="container p-6 space-y-6">
//       <header className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-secondary">Admin Wallet</h1>
//         <button
//           onClick={() => {
//             load();
//             loadMarketers();
//             loadPayouts(payMarketerId || undefined);
//           }}
//           className="px-4 py-2 rounded-xl bg-primary text-white hover:opacity-90"
//         >
//           {loading || marketersLoading ? 'Refreshing…' : 'Refresh'}
//         </button>
//       </header>

//       {msg && (
//         <div
//           className={`rounded-xl p-3 text-sm ${
//             msg.type === 'ok'
//               ? 'bg-green-50 text-green-700 border border-green-200'
//               : 'bg-red-50 text-red-700 border border-red-200'
//           }`}
//         >
//           {msg.text}
//         </div>
//       )}

//       {/* Balance cards */}
//       <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard label="Total balance" value={wallet?.balance ?? 0} accent />
//         <StatCard label="Available" value={wallet?.availableBalance ?? 0} />
//         <StatCard label="Pending payouts" value={wallet?.pendingPayouts ?? 0} />
//         <StatCard label="Total disbursed" value={wallet?.totalDisbursed ?? 0} />
//       </section>

//       {/* Deposit + payout forms */}
//       <section className="grid md:grid-cols-2 gap-6">
//         {/* Deposit */}
//         <form
//           onSubmit={handleDeposit}
//           className="bg-white rounded-2xl p-5 shadow-sm space-y-3"
//         >
//           <h2 className="font-semibold text-secondary">
//             Deposit funds (M-Pesa STK)
//           </h2>
//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             type="number"
//             placeholder="Amount (KES)"
//             value={depositAmount}
//             onChange={(e) => setDepositAmount(e.target.value)}
//           />
//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             placeholder="Phone (optional, defaults to your account)"
//             value={depositPhone}
//             onChange={(e) => setDepositPhone(e.target.value)}
//           />
//           <button className="w-full rounded-xl bg-primary text-white py-2 hover:opacity-90">
//             Send STK push
//           </button>
//         </form>

//         {/* Payout */}
//         <form
//           onSubmit={handlePayout}
//           className="bg-white rounded-2xl p-5 shadow-sm space-y-3"
//         >
//           <h2 className="font-semibold text-secondary">
//             Disburse to marketer (B2C)
//           </h2>

//           <select
//             className="w-full rounded-xl border px-3 py-2"
//             value={payMarketerId}
//             onChange={(e) => setPayMarketerId(e.target.value)}
//           >
//             <option value="">
//               {marketersLoading
//                 ? 'Loading marketers…'
//                 : 'Select a marketer…'}
//             </option>
//             {marketers.map((m) => (
//               <option key={m._id} value={m._id}>
//                 {m.name} — owed KES {m.owed.toLocaleString()} (
//                 {m.marketerStatus})
//               </option>
//             ))}
//           </select>

//           {selectedMarketer && (
//             <div className="rounded-xl bg-gray-50 p-3 text-xs text-muted space-y-1">
//               <div className="flex justify-between">
//                 <span>Total earned</span>
//                 <span className="font-semibold text-secondary">
//                   KES {selectedMarketer.totalCommissions.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Already disbursed</span>
//                 <span className="font-semibold">
//                   KES {selectedMarketer.disbursed.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Owed</span>
//                 <span className="font-semibold text-green-700">
//                   KES {selectedMarketer.owed.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Referrals</span>
//                 <span>{selectedMarketer.totalReferralsMade}</span>
//               </div>
//             </div>
//           )}

//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             type="number"
//             placeholder="Amount (KES)"
//             value={payAmount}
//             onChange={(e) => setPayAmount(e.target.value)}
//             max={selectedMarketer?.owed ?? undefined}
//             min={1}
//           />
//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             placeholder="Override phone (optional)"
//             value={payPhone}
//             onChange={(e) => setPayPhone(e.target.value)}
//           />
//           <input
//             className="w-full rounded-xl border px-3 py-2"
//             placeholder="Remarks (optional)"
//             value={payRemarks}
//             onChange={(e) => setPayRemarks(e.target.value)}
//           />
//           <button
//             disabled={paying || !payMarketerId || (selectedMarketer?.owed ?? 0) <= 0}
//             className="w-full rounded-xl bg-secondary text-white py-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {paying ? 'Sending…' : 'Send B2C payout'}
//           </button>
//         </form>
//       </section>

//       {/* Payout history for selected marketer */}
//       <section className="bg-white rounded-2xl p-5 shadow-sm">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="font-semibold text-secondary">
//             Payouts{selectedMarketer ? ` — ${selectedMarketer.name}` : ''}
//           </h2>
//           {hasPendingPayouts && (
//             <span className="text-xs text-muted flex items-center gap-1">
//               <span className="inline-block animate-pulse">⏳</span>
//               Auto-refreshing…
//             </span>
//           )}
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="text-left text-muted">
//               <tr>
//                 <th className="py-2">Time</th>
//                 <th>Marketer</th>
//                 <th>Ref</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Receipt / Error</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payouts.map((p) => (
//                 <tr key={p._id} className="border-t">
//                   <td className="py-2">
//                     {new Date(p.createdAt).toLocaleString()}
//                   </td>
//                   <td>{p.marketerId?.name ?? '—'}</td>
//                   <td className="font-mono text-xs">{p.reference}</td>
//                   <td>KES {p.amount.toLocaleString()}</td>
//                   <td>
//                     <StatusPill status={p.status} />
//                   </td>
//                   <td className="text-xs">
//                     {p.transactionId || p.errorMessage || '—'}
//                   </td>
//                 </tr>
//               ))}
//               {payouts.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="text-center text-muted py-4">
//                     No payouts yet
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Recent wallet activity */}
//       <section className="bg-white rounded-2xl p-5 shadow-sm">
//         <h2 className="font-semibold text-secondary mb-3">
//           Recent wallet activity
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="text-left text-muted">
//               <tr>
//                 <th className="py-2">Time</th>
//                 <th>Ref</th>
//                 <th>Category</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Receipt</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recent.map((t) => (
//                 <tr key={t._id} className="border-t">
//                   <td className="py-2">
//                     {new Date(t.createdAt).toLocaleString()}
//                   </td>
//                   <td className="font-mono text-xs">{t.transactionId}</td>
//                   <td>{t.category}</td>
//                   <td>{t.amount}</td>
//                   <td>
//                     <StatusPill status={t.status} />
//                   </td>
//                   <td className="text-xs">
//                     {t.receiptNumber || t.errorMessage || '—'}
//                   </td>
//                 </tr>
//               ))}
//               {recent.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="text-center text-muted py-4">
//                     No activity yet
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </main>
//   );
// }

// function StatCard({
//   label,
//   value,
//   accent,
// }: {
//   label: string;
//   value: number;
//   accent?: boolean;
// }) {
//   return (
//     <div
//       className={`rounded-2xl p-4 shadow-sm ${
//         accent ? 'bg-primary text-white' : 'bg-white'
//       }`}
//     >
//       <p className={`text-xs ${accent ? 'text-white/80' : 'text-muted'}`}>
//         {label}
//       </p>
//       <p className="text-xl font-bold mt-1">{value.toLocaleString()} KES</p>
//     </div>
//   );
// }

// function StatusPill({ status }: { status: string }) {
//   const color =
//     status === 'completed' || status === 'success'
//       ? 'bg-green-100 text-green-700'
//       : status === 'failed' || status === 'cancelled'
//       ? 'bg-red-100 text-red-700'
//       : status === 'processing'
//       ? 'bg-blue-100 text-blue-700'
//       : 'bg-yellow-100 text-yellow-700';
//   return (
//     <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>
//       {status}
//     </span>
//   );
// }

// app/shd-pages/admin/wallet/page.tsx
'use client';

import { useAuth } from '@/shd-contexts/AuthContext';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

type Wallet = {
  balance: number;
  availableBalance: number;
  pendingPayouts: number;
  totalDeposited: number;
  totalDisbursed: number;
  currency: string;
};

type Marketer = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  marketerStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  marketerTier: string;
  totalCommissions: number;
  totalReferralsMade: number;
  disbursed: number;
  owed: number;
  payoutMethod?: 'mpesa' | 'bank';
  payoutDetails?: {
    phoneNumber?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
};

type Payout = {
  _id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'MPESA' | 'BANK';
  reference: string;
  transactionId?: string;
  errorMessage?: string;
  createdAt: string;
  marketerId?:
    | {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
      }
    | string;
};

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
  const { user, token, organizationId, isLoading: authLoading } = useAuth();
  const adminUserId = user?.id ?? null;
  const activeOrganizationId = organizationId ?? user?.organizationId ?? null;

  /* ---------------- Wallet ---------------- */
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [recent, setRecent] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  /* ---------------- Marketers ---------------- */
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [marketersLoading, setMarketersLoading] = useState(false);

  /* ---------------- Deposit form ---------------- */
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPhone, setDepositPhone] = useState('');

  /* ---------------- Payout form ---------------- */
  const [payMarketerId, setPayMarketerId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payPhone, setPayPhone] = useState('');
  const [payRemarks, setPayRemarks] = useState('');
  const [paying, setPaying] = useState(false);

  /* ---------------- Payout history ---------------- */
  const [payouts, setPayouts] = useState<Payout[]>([]);

  /* ---------------- Stable refs (prevent effect-dep churn) ---------------- */
  const tokenRef = useRef<string | null>(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const orgIdRef = useRef<string | null>(activeOrganizationId);
  useEffect(() => {
    orgIdRef.current = activeOrganizationId;
  }, [activeOrganizationId]);

  const selectedMarketer = useMemo(
    () => marketers.find((m) => m._id === payMarketerId) || null,
    [marketers, payMarketerId]
  );

  const hasPendingPayouts = payouts.some(
    (p) => p.status === 'pending' || p.status === 'processing'
  );

  const walletAvailable = wallet?.availableBalance ?? 0;

  /* ---------------- Load wallet summary ---------------- */
  const load = useCallback(async () => {
    const t = tokenRef.current;
    const orgId = orgIdRef.current;
    if (authLoading || !t || !orgId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        organizationId: String(orgId),
      });
      const res = await fetch(
        `/api/admin/wallet/summary?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${t}` },
          cache: 'no-store',
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load wallet');
      setWallet(data.wallet);
      setRecent(data.recent ?? []);
    } catch (error) {
      setMsg({
        type: 'err',
        text: error instanceof Error ? error.message : 'Failed to load wallet',
      });
    } finally {
      setLoading(false);
    }
  }, [authLoading]);

  /* ---------------- Load marketers ---------------- */
  // const loadMarketers = useCallback(async () => {
  //   const t = tokenRef.current;
  //   if (authLoading || !t) return;
  //   setMarketersLoading(true);
  //   try {
  //     const params = new URLSearchParams();
  //     const orgId = orgIdRef.current;
  //     if (orgId) params.set('organizationId', String(orgId));

  //     const res = await fetch(
  //       `/api/admin/wallet/marketers?${params.toString()}`,
  //       {
  //         headers: { Authorization: `Bearer ${t}` },
  //         cache: 'no-store',
  //       }
  //     );
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.error || 'Failed to load marketers');
  //     setMarketers(data.marketers || []);
  //   } catch (error: any) {
  //     setMsg({ type: 'err', text: error.message });
  //   } finally {
  //     setMarketersLoading(false);
  //   }
  // }, [authLoading]);


/* ---------------- Load marketers ---------------- */
const loadMarketers = useCallback(async () => {
  const t = tokenRef.current;
  const orgId = orgIdRef.current;

  console.group('[MARKETERS] Loading diagnostic');

  console.log('Environment:', {
    url: window.location.href,
    hostname: window.location.hostname,
    isProduction: process.env.NODE_ENV === 'production',
  });

  console.log('Authentication:', {
    authLoading,
    hasToken: !!t,
    tokenLength: t?.length || 0,
    tokenPrefix: t ? t.substring(0, 10) + '...' : null,
  });

  console.log('Organization:', {
    orgId,
    orgIdType: typeof orgId,
  });

  if (authLoading || !t) {
    console.warn('[MARKETERS] Aborting request:', {
      reason: authLoading ? 'Authentication still loading' : 'Missing token',
    });
    console.groupEnd();
    return;
  }

  setMarketersLoading(true);

  try {
    const params = new URLSearchParams();

    if (orgId) {
      params.set('organizationId', String(orgId));
    }

    const endpoint = `/api/admin/wallet/marketers?${params.toString()}`;

    console.log('[MARKETERS] Request:', endpoint);

    const startTime = performance.now();

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${t}`,
      },
      cache: 'no-store',
    });

    const duration = performance.now() - startTime;

    console.log('[MARKETERS] Response metadata:', {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      durationMs: Math.round(duration),
      contentType: res.headers.get('content-type'),
    });

    const responseText = await res.text();

    console.log('[MARKETERS] Raw response:', responseText);

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Invalid JSON response. HTTP ${res.status}: ${responseText.substring(0, 300)}`
      );
    }

    console.log('[MARKETERS] Parsed response:', data);

    if (!res.ok) {
      throw new Error(
        data.error || `Request failed with HTTP ${res.status}`
      );
    }

    const loadedMarketers = data.marketers || [];

    console.log('[MARKETERS] Results:', {
      count: loadedMarketers.length,
      marketers: loadedMarketers,
    });

    setMarketers(loadedMarketers);

    console.log('[MARKETERS] Successfully loaded');

  } catch (error: any) {
    console.error('[MARKETERS] FAILED:', error);

    setMsg({
      type: 'err',
      text: error.message || 'Failed to load marketers',
    });

  } finally {
    setMarketersLoading(false);
    console.groupEnd();
  }
}, [authLoading]);


  /* ---------------- Load payout history ---------------- */
  const loadPayouts = useCallback(async (marketerId?: string) => {
    const t = tokenRef.current;
    if (!t) return;
    try {
      const params = new URLSearchParams({ limit: '25' });
      if (marketerId) params.set('marketerId', marketerId);
      const res = await fetch(
        `/api/admin/wallet/payouts?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${t}` },
          cache: 'no-store',
        }
      );
      const data = await res.json();
      if (res.ok) setPayouts(data.payouts || []);
    } catch {
      /* non-fatal */
    }
  }, []);

  /* ---------------- Initial loads ---------------- */
  // Fixed-length deps. No payMarketerId / loadPayouts here — the
  // marketer-selection effect owns payout loading.
  useEffect(() => {
    if (authLoading || !token || !activeOrganizationId) return;
    void load();
    void loadMarketers();
  }, [authLoading, token, activeOrganizationId, load, loadMarketers]);

  /* ---------------- Marketer selection → prefill + load payouts ---------------- */
  // Single owner of payout-history loading. Always runs when the
  // selected marketer changes (or when token becomes available).
  useEffect(() => {
    if (!token) return;

    if (!selectedMarketer) {
      setPayAmount('');
      setPayPhone('');
      void loadPayouts(undefined);
      return;
    }

    setPayAmount(
      selectedMarketer.owed > 0 ? String(selectedMarketer.owed) : ''
    );
    setPayPhone(
      selectedMarketer.payoutDetails?.phoneNumber ||
        selectedMarketer.phoneNumber ||
        ''
    );
    void loadPayouts(selectedMarketer._id);
  }, [selectedMarketer, token, loadPayouts]);

  /* ---------------- Poll payout status ---------------- */
  useEffect(() => {
    if (!hasPendingPayouts) return;
    const t = setInterval(() => {
      void loadPayouts(payMarketerId || undefined);
      // Also refresh wallet + marketers because reserved funds may have cleared
      void load();
      void loadMarketers();
    }, 30000);
    return () => clearInterval(t);
  }, [hasPendingPayouts, payMarketerId, loadPayouts, load, loadMarketers]);

  /* ---------------- Deposit ---------------- */
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
          adminUserId,
          organizationId: activeOrganizationId,
          amount: Number(depositAmount),
          phoneNumber: depositPhone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'ok', text: 'STK sent. Approve on your phone.' });
      setDepositAmount('');
      // STK callbacks are async — poll a few times to pick up success
      setTimeout(load, 4000);
      setTimeout(load, 10000);
      setTimeout(load, 20000);
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    }
  }

  /* ---------------- Payout ---------------- */
  async function handlePayout(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // if (!payMarketerId || !payAmount) {
    //   return setMsg({ type: 'err', text: 'Select marketer and amount' });
    // }

    // const amt = Number(payAmount);
    // if (!Number.isFinite(amt) || amt <= 0) {
    //   return setMsg({ type: 'err', text: 'Amount must be greater than 0' });
    // }
    // if (selectedMarketer && amt > selectedMarketer.owed) {
    //   return setMsg({
    //     type: 'err',
    //     text: `Amount exceeds owed (KES ${selectedMarketer.owed.toLocaleString()})`,
    //   });
    // }
    // if (amt > walletAvailable) {
    //   return setMsg({
    //     type: 'err',
    //     text: `Amount exceeds wallet balance (KES ${walletAvailable.toLocaleString()})`,
    //   });
    // }


    // Inside handlePayout
if (!payMarketerId || !payAmount || !payPhone) {
  return setMsg({ type: 'err', text: 'Select marketer, amount and phone' });
}
const amt = Number(payAmount);
if (!Number.isFinite(amt) || amt <= 0) {
  return setMsg({ type: 'err', text: 'Amount must be greater than 0' });
}
if (amt > walletAvailable) {
  return setMsg({
    type: 'err',
    text: `Amount exceeds wallet balance (KES ${walletAvailable.toLocaleString()})`,
  });
}

    setPaying(true);
    try {
      const res = await fetch('/api/admin/wallet/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminUserId,
          organizationId: activeOrganizationId,
          marketerId: payMarketerId,
          amount: amt,
          phoneNumber: payPhone || undefined,
          remarks: payRemarks || undefined,
          idempotencyKey: `payout-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg({ type: 'ok', text: 'Payout sent to M-Pesa B2C.' });
      setPayAmount('');
      setPayPhone('');
      setPayRemarks('');

      // Refresh everything
      await Promise.all([
        loadMarketers(),
        loadPayouts(payMarketerId),
        load(),
      ]);
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setPaying(false);
    }
  }

  /* ---------------- Derived payout-form guards ---------------- */
  const parsedAmount = Number(payAmount) || 0;
  const exceedsOwed =
    !!selectedMarketer && parsedAmount > selectedMarketer.owed;
  const exceedsWallet = parsedAmount > walletAvailable;
  // const payoutDisabled =
  //   paying ||
  //   !payMarketerId ||
  //   parsedAmount <= 0 ||
  //   exceedsOwed ||
  //   exceedsWallet ||
  //   (selectedMarketer?.owed ?? 0) <= 0;
  const payoutDisabled =
  paying ||
  !payMarketerId ||
  !payPhone ||
  parsedAmount <= 0 ||
  exceedsWallet;

  return (
    <main className="container p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">Admin Wallet</h1>
        <button
          onClick={() => {
            load();
            loadMarketers();
            loadPayouts(payMarketerId || undefined);
          }}
          className="px-4 py-2 rounded-xl bg-primary text-white hover:opacity-90"
        >
          {loading || marketersLoading ? 'Refreshing…' : 'Refresh'}
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
        <form
          onSubmit={handleDeposit}
          className="bg-white rounded-2xl p-5 shadow-sm space-y-3"
        >
          <h2 className="font-semibold text-secondary">
            Deposit funds (M-Pesa STK)
          </h2>
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
        <form
          onSubmit={handlePayout}
          className="bg-white rounded-2xl p-5 shadow-sm space-y-3"
        >
          <h2 className="font-semibold text-secondary">
            Disburse to marketer (B2C)
          </h2>

          <select
            className="w-full rounded-xl border px-3 py-2"
            value={payMarketerId}
            onChange={(e) => setPayMarketerId(e.target.value)}
          >
            <option value="">
              {marketersLoading ? 'Loading marketers…' : 'Select a marketer…'}
            </option>
            {/* {marketers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} — owed KES {m.owed.toLocaleString()} ({m.marketerStatus})
              </option>
            ))} */}
            {marketers.map((m) => (
  <option key={m._id} value={m._id}>
    {m.name} — {m.marketerStatus}
  </option>
))}
          </select>

          {/* {selectedMarketer && (
            <div className="rounded-xl bg-gray-50 p-3 text-xs text-muted space-y-1">
              <div className="flex justify-between">
                <span>Total earned</span>
                <span className="font-semibold text-secondary">
                  KES {selectedMarketer.totalCommissions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Already disbursed</span>
                <span className="font-semibold">
                  KES {selectedMarketer.disbursed.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Owed</span>
                <span className="font-semibold text-green-700">
                  KES {selectedMarketer.owed.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Referrals</span>
                <span>{selectedMarketer.totalReferralsMade}</span>
              </div>
              <div className="flex justify-between pt-1 border-t">
                <span>Wallet available</span>
                <span className="font-semibold text-secondary">
                  KES {walletAvailable.toLocaleString()}
                </span>
              </div>
            </div>
          )} */}

          {selectedMarketer && (
  <div className="rounded-xl bg-gray-50 p-3 text-xs text-muted space-y-1">
    <div className="flex justify-between">
      <span>Marketer</span>
      <span className="font-semibold text-secondary">{selectedMarketer.name}</span>
    </div>
    <div className="flex justify-between">
      <span>Phone</span>
      <span className="font-mono">{selectedMarketer.phoneNumber || '—'}</span>
    </div>
    <div className="flex justify-between pt-1 border-t">
      <span>Wallet available</span>
      <span className="font-semibold text-secondary">
        KES {walletAvailable.toLocaleString()}
      </span>
    </div>
  </div>
)}

          <input
            className="w-full rounded-xl border px-3 py-2"
            type="number"
            placeholder="Amount (KES)"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            // max={Math.min(
            //   selectedMarketer?.owed ?? Infinity,
            //   walletAvailable || Infinity
            // )}
            max={walletAvailable || undefined}
            min={1}
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

          {/* {(exceedsOwed || exceedsWallet) && (
            <div className="text-xs text-red-600 space-y-0.5">
              {exceedsOwed && (
                <p>
                  ⚠ Amount exceeds marketer owed (KES{' '}
                  {(selectedMarketer?.owed ?? 0).toLocaleString()})
                </p>
              )}
              {exceedsWallet && (
                <p>
                  ⚠ Amount exceeds wallet balance (KES{' '}
                  {walletAvailable.toLocaleString()})
                </p>
              )}
            </div>
          )} */}

          <button
            disabled={payoutDisabled}
            className="w-full rounded-xl bg-secondary text-white py-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paying ? 'Sending…' : 'Send B2C payout'}
          </button>
        </form>
      </section>

      {/* Payout history for selected marketer */}
      <section className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-secondary">
            Payouts{selectedMarketer ? ` — ${selectedMarketer.name}` : ''}
          </h2>
          {hasPendingPayouts && (
            <span className="text-xs text-muted flex items-center gap-1">
              <span className="inline-block animate-pulse">⏳</span>
              Auto-refreshing…
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="py-2">Time</th>
                <th>Marketer</th>
                <th>Ref</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt / Error</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="py-2">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td>{marketerLabel(p.marketerId)}</td>
                  <td className="font-mono text-xs">{p.reference}</td>
                  <td>KES {p.amount.toLocaleString()}</td>
                  <td>
                    <StatusPill status={p.status} />
                  </td>
                  <td className="text-xs">
                    {p.transactionId || p.errorMessage || '—'}
                  </td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No payouts yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent wallet activity */}
      <section className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold text-secondary mb-3">
          Recent wallet activity
        </h2>
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
                  <td className="py-2">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="font-mono text-xs">{t.transactionId}</td>
                  <td>{t.category}</td>
                  <td>{t.amount}</td>
                  <td>
                    <StatusPill status={t.status} />
                  </td>
                  <td className="text-xs">
                    {t.receiptNumber || t.errorMessage || '—'}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No activity yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

/* ---------------- Helpers ---------------- */

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ${
        accent ? 'bg-primary text-white' : 'bg-white'
      }`}
    >
      <p className={`text-xs ${accent ? 'text-white/80' : 'text-muted'}`}>
        {label}
      </p>
      <p className="text-xl font-bold mt-1">{value.toLocaleString()} KES</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === 'completed' || status === 'success'
      ? 'bg-green-100 text-green-700'
      : status === 'failed' || status === 'cancelled'
      ? 'bg-red-100 text-red-700'
      : status === 'processing'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-yellow-100 text-yellow-700';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>
      {status}
    </span>
  );
}

function marketerLabel(
  marketer: Payout['marketerId']
): string {
  if (!marketer) return '—';
  if (typeof marketer === 'string') return marketer;
  return marketer.name || marketer.email || '—';
}