// // // // C:\Users\USER\Desktop\Projects\my-app\app\membership\activate\page.tsx
// // // /*'use client';

// // // import { useState } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';

// // // export default function ActivateMembership() {
// // //   const router = useRouter();
// // //   const [formData, setFormData] = useState({
// // //     password: '',
// // //     initialDeposit: '100'
// // //   });
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     setFormData({
// // //       ...formData,
// // //       [e.target.name]: e.target.value
// // //     });
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError('');

// // //     const depositAmount = parseFloat(formData.initialDeposit);
// // //     if (depositAmount < 100) {
// // //       setError('Minimum initial deposit is KSh 100');
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       const token = localStorage.getItem('token');
// // //       if (!token) {
// // //         router.push('/login');
// // //         return;
// // //       }

// // //       const response = await fetch('/api/membership/activate', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         },
// // //         body: JSON.stringify({
// // //           password: formData.password,
// // //           initialDeposit: depositAmount
// // //         })
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok) {
// // //         alert('🎉 Membership activated successfully!');
// // //         router.push('/membership/dashboard');
// // //       } else {
// // //         setError(data.error || 'Failed to activate membership');
// // //       }
// // //     } catch (error) {
// // //       setError('An error occurred. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-10">
// // //       <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
// // //         <div className="text-center mb-8">
// // //           <div className="text-6xl mb-4">🌟</div>
// // //           <h1 className="text-3xl font-bold text-gray-900">Become a Member</h1>
// // //           <p className="text-gray-600 mt-2">
// // //             Unlock exclusive benefits and investment opportunities
// // //           </p>
// // //         </div>

// // //         {error && (
// // //           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
// // //             {error}
// // //           </div>
// // //         )}

// // //         <div className="bg-purple-50 rounded-lg p-4 mb-6">
// // //           <h3 className="font-semibold text-purple-800 mb-2">✨ Membership Benefits:</h3>
// // //           <ul className="text-sm text-purple-700 space-y-1">
// // //             <li>✅ Access to investment opportunities</li>
// // //             <li>✅ Earn up to 25% returns on investments</li>
// // //             <li>✅ Save and grow your money</li>
// // //             <li>✅ Exclusive member perks</li>
// // //             <li>✅ Referral bonuses</li>
// // //           </ul>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="space-y-4">
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">
// // //               Confirm Password
// // //             </label>
// // //             <input
// // //               type="password"
// // //               name="password"
// // //               value={formData.password}
// // //               onChange={handleChange}
// // //               required
// // //               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
// // //               placeholder="Enter your current password"
// // //             />
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">
// // //               Initial Deposit (Minimum KSh 100)
// // //             </label>
// // //             <div className="relative">
// // //               <span className="absolute left-3 top-3 text-gray-500">KSh</span>
// // //               <input
// // //                 type="number"
// // //                 name="initialDeposit"
// // //                 value={formData.initialDeposit}
// // //                 onChange={handleChange}
// // //                 required
// // //                 min="100"
// // //                 className="w-full border border-gray-300 rounded-lg p-3 pl-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
// // //                 placeholder="Enter amount"
// // //               />
// // //             </div>
// // //             <p className="text-xs text-gray-500 mt-1">Minimum deposit of KSh 100 required</p>
// // //           </div>

// // //           <button
// // //             type="submit"
// // //             disabled={loading}
// // //             className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 transition"
// // //           >
// // //             {loading ? 'Processing...' : '💰 Activate Membership'}
// // //           </button>
// // //         </form>

// // //         <div className="mt-6 text-center">
// // //           <Link href="/" className="text-blue-600 hover:underline">
// // //             ← Back to Home
// // //           </Link>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }*/

// // // 'use client';

// // // import { useState } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';

// // // export default function ActivateMembership() {
// // //   const router = useRouter();
// // //   const [formData, setFormData] = useState({
// // //     password: '',
// // //     initialDeposit: '100'
// // //   });
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     setFormData({
// // //       ...formData,
// // //       [e.target.name]: e.target.value
// // //     });
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError('');

// // //     const depositAmount = parseFloat(formData.initialDeposit);
// // //     if (depositAmount < 100) {
// // //       setError('Minimum initial deposit is KSh 100');
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       const token = localStorage.getItem('token');
// // //       if (!token) {
// // //         router.push('/shd-pages/login');
// // //         return;
// // //       }

// // //       const response = await fetch('/api/shd-api/api/membership/activate', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         },
// // //         body: JSON.stringify({
// // //           password: formData.password,
// // //           initialDeposit: depositAmount
// // //         })
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok) {
// // //         alert('🎉 Membership activated successfully!');
// // //         router.push('/shd-pages/membership/dashboard');
// // //       } else {
// // //         setError(data.error || 'Failed to activate membership');
// // //       }
// // //     } catch (error) {
// // //       setError('An error occurred. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-background py-8 sm:py-12 px-4 flex items-center justify-center">
// // //       <div className="w-full max-w-md">
// // //         <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-surface">
// // //           {/* Header */}
// // //           <div className="text-center mb-8">
// // //             <div className="text-6xl mb-4">🌟</div>
// // //             <h1 className="text-2xl sm:text-3xl font-black text-secondary">Become a Member</h1>
// // //             <p className="text-muted mt-2">
// // //               Unlock exclusive benefits and investment opportunities
// // //             </p>
// // //           </div>

// // //           {/* Error Message */}
// // //           {error && (
// // //             <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
// // //               <div className="flex items-center gap-2">
// // //                 <span>❌</span>
// // //                 <span>{error}</span>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Benefits Card */}
// // //           <div className="bg-surface/50 rounded-xl p-5 mb-6 border border-surface">
// // //             <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
// // //               <span className="text-primary">✨</span>
// // //               Membership Benefits:
// // //             </h3>
// // //             <ul className="space-y-2 text-sm text-muted">
// // //               <li className="flex items-start gap-3">
// // //                 <span className="text-primary font-bold">✓</span>
// // //                 Access to investment opportunities
// // //               </li>
// // //               <li className="flex items-start gap-3">
// // //                 <span className="text-primary font-bold">✓</span>
// // //                 Earn up to 25% returns on investments
// // //               </li>
// // //               <li className="flex items-start gap-3">
// // //                 <span className="text-primary font-bold">✓</span>
// // //                 Save and grow your money
// // //               </li>
// // //               <li className="flex items-start gap-3">
// // //                 <span className="text-primary font-bold">✓</span>
// // //                 Exclusive member perks
// // //               </li>
// // //               <li className="flex items-start gap-3">
// // //                 <span className="text-primary font-bold">✓</span>
// // //                 Referral bonuses
// // //               </li>
// // //             </ul>
// // //           </div>

// // //           {/* Form */}
// // //           <form onSubmit={handleSubmit} className="space-y-5">
// // //             <div>
// // //               <label className="block text-sm font-medium text-secondary mb-1.5">
// // //                 Confirm Password
// // //               </label>
// // //               <input
// // //                 type="password"
// // //                 name="password"
// // //                 value={formData.password}
// // //                 onChange={handleChange}
// // //                 required
// // //                 className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
// // //                 placeholder="Enter your current password"
// // //               />
// // //             </div>

// // //             <div>
// // //               <label className="block text-sm font-medium text-secondary mb-1.5">
// // //                 Initial Deposit <span className="text-muted font-normal">(Minimum KSh 100)</span>
// // //               </label>
// // //               <div className="relative">
// // //                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">KSh</span>
// // //                 <input
// // //                   type="number"
// // //                   name="initialDeposit"
// // //                   value={formData.initialDeposit}
// // //                   onChange={handleChange}
// // //                   required
// // //                   min="100"
// // //                   className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 pl-16 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
// // //                   placeholder="Enter amount"
// // //                 />
// // //               </div>
// // //               <p className="text-xs text-muted mt-1.5">
// // //                 💰 Minimum deposit of KSh 100 required
// // //               </p>
// // //             </div>

// // //             <button
// // //               type="submit"
// // //               disabled={loading}
// // //               className="w-full bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
// // //             >
// // //               {loading ? (
// // //                 <span className="flex items-center justify-center gap-2">
// // //                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// // //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// // //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// // //                   </svg>
// // //                   Processing...
// // //                 </span>
// // //               ) : (
// // //                 '💰 Activate Membership'
// // //               )}
// // //             </button>
// // //           </form>

// // //           {/* Footer */}
// // //           <div className="mt-6 text-center">
// // //             <Link 
// // //               href="/" 
// // //               className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2"
// // //             >
// // //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
// // //               </svg>
// // //               Back to Home
// // //             </Link>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // // app/shd-pages/membership/activate/page.tsx
// // 'use client';

// // import { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';

// // export default function ActivateMembership() {
// //   const router = useRouter();
// //   const [formData, setFormData] = useState({
// //     password: '',
// //     initialDeposit: '100'
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [paymentInitiated, setPaymentInitiated] = useState(false);
// //   const [checkoutId, setCheckoutId] = useState('');
// //   const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value
// //     });
// //   };

// //   const checkPaymentStatus = async (checkoutId: string) => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await fetch(`/api/shd-api/api/payment/status/${checkoutId}`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       const data = await response.json();
      
// //       if (data.status === 'success') {
// //         // Payment successful
// //         if (pollingInterval) {
// //           clearInterval(pollingInterval);
// //           setPollingInterval(null);
// //         }
// //         alert('🎉 Membership activated successfully!');
// //         router.push('/shd-pages/membership/dashboard');
// //       } else if (data.status === 'failed') {
// //         if (pollingInterval) {
// //           clearInterval(pollingInterval);
// //           setPollingInterval(null);
// //         }
// //         setError('Payment failed. Please try again.');
// //         setPaymentInitiated(false);
// //       }
// //       // If status is 'pending', continue polling
// //     } catch (error) {
// //       console.error('Error checking payment status:', error);
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     const depositAmount = parseFloat(formData.initialDeposit);
// //     if (depositAmount < 100) {
// //       setError('Minimum initial deposit is KSh 100');
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         router.push('/shd-pages/login');
// //         return;
// //       }

// //       const response = await fetch('/api/shd-api/api/membership/activate', {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //           password: formData.password,
// //           initialDeposit: depositAmount
// //         })
// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         // Payment initiated
// //         setPaymentInitiated(true);
// //         setCheckoutId(data.payment.checkoutRequestId);
        
// //         // Start polling for payment status
// //         const interval = setInterval(() => {
// //           checkPaymentStatus(data.payment.checkoutRequestId);
// //         }, 3000);
// //         setPollingInterval(interval);

// //         // Show M-Pesa prompt
// //         alert(`💳 M-Pesa STK Push sent to ${data.payment.phoneNumber}. Please enter your PIN to complete payment.`);
// //       } else {
// //         setError(data.error || 'Failed to activate membership');
// //       }
// //     } catch (error) {
// //       setError('An error occurred. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Cleanup polling on unmount
// //   // useEffect(() => {
// //   //   return () => {
// //   //     if (pollingInterval) {
// //   //       clearInterval(pollingInterval);
// //   //     }
// //   //   };
// //   // }, []);

// //   return (
// //     <div className="min-h-screen bg-background py-8 sm:py-12 px-4 flex items-center justify-center">
// //       <div className="w-full max-w-md">
// //         <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-surface">
// //           {/* Header */}
// //           <div className="text-center mb-8">
// //             <div className="text-6xl mb-4">🌟</div>
// //             <h1 className="text-2xl sm:text-3xl font-black text-secondary">Become a Member</h1>
// //             <p className="text-muted mt-2">
// //               Unlock exclusive benefits and investment opportunities
// //             </p>
// //           </div>

// //           {/* Error Message */}
// //           {error && (
// //             <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
// //               <div className="flex items-center gap-2">
// //                 <span>❌</span>
// //                 <span>{error}</span>
// //               </div>
// //             </div>
// //           )}

// //           {/* Payment Status */}
// //           {paymentInitiated && (
// //             <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
// //               <div className="flex items-center gap-2">
// //                 <span>⏳</span>
// //                 <span>Payment initiated. Please check your phone for M-Pesa prompt.</span>
// //               </div>
// //             </div>
// //           )}

// //           {/* Form */}
// //           {!paymentInitiated ? (
// //             <form onSubmit={handleSubmit} className="space-y-5">
// //               {/* ... rest of your form fields ... */}
// //               <div>
// //                 <label className="block text-sm font-medium text-secondary mb-1.5">
// //                   Confirm Password
// //                 </label>
// //                 <input
// //                   type="password"
// //                   name="password"
// //                   value={formData.password}
// //                   onChange={handleChange}
// //                   required
// //                   className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
// //                   placeholder="Enter your current password"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-secondary mb-1.5">
// //                   Initial Deposit <span className="text-muted font-normal">(Minimum KSh 100)</span>
// //                 </label>
// //                 <div className="relative">
// //                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">KSh</span>
// //                   <input
// //                     type="number"
// //                     name="initialDeposit"
// //                     value={formData.initialDeposit}
// //                     onChange={handleChange}
// //                     required
// //                     min="100"
// //                     className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 pl-16 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
// //                     placeholder="Enter amount"
// //                   />
// //                 </div>
// //                 <p className="text-xs text-muted mt-1.5">
// //                   💰 Minimum deposit of KSh 100 required
// //                 </p>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="w-full bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
// //               >
// //                 {loading ? (
// //                   <span className="flex items-center justify-center gap-2">
// //                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                     </svg>
// //                     Processing...
// //                   </span>
// //                 ) : (
// //                   '💰 Activate Membership'
// //                 )}
// //               </button>
// //             </form>
// //           ) : (
// //             <div className="text-center py-8">
// //               <div className="text-4xl mb-4">💳</div>
// //               <p className="text-secondary font-medium">Waiting for M-Pesa payment...</p>
// //               <p className="text-sm text-muted mt-2">
// //                 Please check your phone and enter your M-Pesa PIN.
// //               </p>
// //               <button
// //                 onClick={() => {
// //                   if (pollingInterval) {
// //                     clearInterval(pollingInterval);
// //                     setPollingInterval(null);
// //                   }
// //                   setPaymentInitiated(false);
// //                 }}
// //                 className="mt-4 text-primary hover:text-accent-dark transition-colors duration-200"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           )}

// //           {/* Footer */}
// //           <div className="mt-6 text-center">
// //             <Link 
// //               href="/" 
// //               className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2"
// //             >
// //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
// //               </svg>
// //               Back to Home
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // app/shd-pages/membership/activate/page.tsx (Updated)
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import PaymentProcessor from '@/app/SHD-COMPONENTS/components/PaymentProcessor';


// export default function ActivateMembership() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     password: '',
//     initialDeposit: '100'
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [paymentData, setPaymentData] = useState<{
//     checkoutId: string;
//     transactionId: string;
//     phoneNumber: string;
//   } | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const depositAmount = parseFloat(formData.initialDeposit);
//     if (depositAmount < 100) {
//       setError('Minimum initial deposit is KSh 100');
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/shd-pages/login');
//         return;
//       }

//       const response = await fetch('/api/shd-api/api/membership/activate', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           password: formData.password,
//           initialDeposit: depositAmount
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Payment initiated
//         setPaymentData({
//           checkoutId: data.payment.checkoutRequestId,
//           transactionId: data.payment.transactionId,
//           phoneNumber: data.payment.phoneNumber
//         });
        
//         // Show M-Pesa prompt
//         alert(`💳 M-Pesa STK Push sent to ${data.payment.phoneNumber}. Please enter your PIN to complete payment.`);
//       } else {
//         setError(data.error || 'Failed to activate membership');
//       }
//     } catch (error: any) {
//       setError(error.message || 'An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentSuccess = () => {
//     setTimeout(() => {
//       router.push('/shd-pages/membership/dashboard');
//     }, 1500);
//   };

//   const handlePaymentFailure = (error: string) => {
//     setError(error);
//     setPaymentData(null);
//   };

//   const handlePaymentCancel = () => {
//     setPaymentData(null);
//   };

//   return (
//     <div className="min-h-screen bg-background py-8 sm:py-12 px-4 flex items-center justify-center">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-surface">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="text-6xl mb-4">🌟</div>
//             <h1 className="text-2xl sm:text-3xl font-black text-secondary">Become a Member</h1>
//             <p className="text-muted mt-2">
//               Unlock exclusive benefits and investment opportunities
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
//               <div className="flex items-center gap-2">
//                 <span>❌</span>
//                 <span>{error}</span>
//               </div>
//             </div>
//           )}

//           {/* Payment Processor */}
//           {paymentData ? (
//             <PaymentProcessor
//               checkoutId={paymentData.checkoutId}
//               transactionId={paymentData.transactionId}
//               onSuccess={handlePaymentSuccess}
//               onFailure={handlePaymentFailure}
//               onCancel={handlePaymentCancel}
//             />
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-secondary mb-1.5">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
//                   placeholder="Enter your current password"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary mb-1.5">
//                   Initial Deposit <span className="text-muted font-normal">(Minimum KSh 100)</span>
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">KSh</span>
//                   <input                    type="number"
//                     name="initialDeposit"
//                     value={formData.initialDeposit}
//                     onChange={handleChange}
//                     required
//                     min="100"
//                     className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 pl-16 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
//                     placeholder="Enter amount"
//                   />
//                 </div>
//                 <p className="text-xs text-muted mt-1.5">
//                   💰 Minimum deposit of KSh 100 required
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </span>
//                 ) : (
//                   '💰 Activate Membership'
//                 )}
//               </button>
//             </form>
//           )}

//           {/* Footer */}
//           <div className="mt-6 text-center">
//             <Link 
//               href="/" 
//               className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back to Home
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/shd-pages/membership/activate/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PaymentProcessor from '@/app/SHD-COMPONENTS/components/PaymentProcessor';

export default function ActivateMembership() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    initialDeposit: '1',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState<{
    checkoutId: string;
    transactionId: string;
    phoneNumber: string;
  } | null>(null);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Format phone number if it's the phone field
    if (e.target.name === 'phoneNumber') {
      // Remove all non-numeric characters except '+'
      value = value.replace(/[^0-9+]/g, '');
      
      // If it starts with 0, replace with 254
      if (value.startsWith('0') && value.length > 1) {
        value = '254' + value.substring(1);
      }
      
      // If it doesn't start with + or 254, add 254
      if (!value.startsWith('+') && !value.startsWith('254') && value.length > 0) {
        value = '254' + value;
      }
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any spaces and plus sign for validation
    const cleanPhone = phone.replace(/[+\s]/g, '');
    // Check if it's a valid Kenyan phone number (254 followed by 9 digits)
    return /^254[0-9]{9}$/.test(cleanPhone);
  };

  const formatPhoneDisplay = (phone: string): string => {
    if (!phone) return '';
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length === 12 && clean.startsWith('254')) {
      return `+${clean}`;
    }
    return phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const depositAmount = parseFloat(formData.initialDeposit);
    if (depositAmount < 1) {
      setError('Minimum initial deposit is KSh 100');
      setLoading(false);
      return;
    }

    // Check if phone number is provided
    if (!formData.phoneNumber) {
      setError('Please enter your phone number');
      setLoading(false);
      return;
    }

    // Validate phone number
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (e.g., 254712345678 or +254712345678)');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/shd-pages/login');
        return;
      }

      const response = await fetch('/api/shd-api/api/membership/activate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: formData.password,
          initialDeposit: depositAmount,
          phoneNumber: formData.phoneNumber // Send the phone number to the API
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Payment initiated
        setPaymentData({
          checkoutId: data.payment.checkoutRequestId,
          transactionId: data.payment.transactionId,
          phoneNumber: data.payment.phoneNumber
        });
        
        // Show M-Pesa prompt
        alert(`💳 M-Pesa STK Push sent to ${data.payment.phoneNumber}. Please enter your PIN to complete payment.`);
      } else {
        setError(data.error || 'Failed to activate membership');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setTimeout(() => {
      router.push('/shd-pages/membership/dashboard');
    }, 1500);
  };

  const handlePaymentFailure = (error: string) => {
    setError(error);
    setPaymentData(null);
  };

  const handlePaymentCancel = () => {
    setPaymentData(null);
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-surface">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="text-2xl sm:text-3xl font-black text-secondary">Become a Member</h1>
            <p className="text-muted mt-2">
              Unlock exclusive benefits and investment opportunities
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Payment Processor */}
          {paymentData ? (
            <PaymentProcessor
              checkoutId={paymentData.checkoutId}
              transactionId={paymentData.transactionId}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              onCancel={handlePaymentCancel}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone Number Input */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">
                    📱
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="254712345678 or +254712345678"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 pl-12 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-muted">
                    📱 Enter the phone number to receive M-Pesa prompt
                  </p>
                  {formData.phoneNumber && validatePhoneNumber(formData.phoneNumber) && (
                    <span className="text-xs text-green-600">✓ Valid number</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Examples: 254712345678, +254712345678, 0712345678
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter your current password"
                />
              </div>

              {/* Initial Deposit Input */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Initial Deposit <span className="text-muted font-normal">(Minimum KSh 100)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">KSh</span>
                  <input
                    type="number"
                    name="initialDeposit"
                    value={formData.initialDeposit}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 pl-16 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="Enter amount"
                  />
                </div>
                <p className="text-xs text-muted mt-1.5">
                  💰 Minimum deposit of KSh 100 required
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  '💰 Activate Membership'
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}