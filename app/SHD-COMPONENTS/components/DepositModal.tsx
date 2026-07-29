// // app/SHD-COMPONENTS/components/DepositModal.tsx
// 'use client';

// import { useState } from 'react';
// import { X } from 'lucide-react';

// interface DepositModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onDeposit: (amount: number, password: string) => Promise<void>;
//   isLoading: boolean;
// }

// export default function DepositModal({ 
//   isOpen, 
//   onClose, 
//   onDeposit, 
//   isLoading 
// }: DepositModalProps) {
//   const [amount, setAmount] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   if (!isOpen) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     const depositAmount = parseFloat(amount);
//     if (isNaN(depositAmount) || depositAmount < 1) {
//       setError('Please enter a valid amount (minimum KSh 1)');
//       return;
//     }

//     if (!password) {
//       setError('Please enter your password');
//       return;
//     }

//     try {
//       await onDeposit(depositAmount, password);
//       setAmount('');
//       setPassword('');
//       onClose();
//     } catch (err: any) {
//       setError(err.message || 'Failed to process deposit');
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-slideUp">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <span className="text-3xl">💰</span>
//             <h2 className="text-2xl font-bold text-gray-900">Deposit Money</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
//             disabled={isLoading}
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Info Banner */}
//         <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
//           <p className="text-sm text-blue-700 flex items-start gap-2">
//             <span className="text-lg">💡</span>
//             <span>
//               You will receive an M-Pesa STK Push on your phone to complete the deposit.
//               Please ensure your phone is ready.
//             </span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Amount Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Amount <span className="text-gray-400">(KSh)</span>
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
//                 KSh
//               </span>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 min="1"
//                 step="1"
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter amount"
//                 className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pl-16 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
//               />
//             </div>
//             <p className="text-xs text-gray-500 mt-1.5">
//               Minimum deposit: KSh 1
//             </p>
//           </div>

//           {/* Password Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
//                 🔒
//               </span>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter your password to confirm"
//                 className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
//               <span>❌</span>
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isLoading}
//               className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <span>💳</span>
//                   Deposit
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// app/SHD-COMPONENTS/components/DepositModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, password: string, phoneNumber: string) => Promise<void>;
  isLoading: boolean;
}

export default function DepositModal({ 
  isOpen, 
  onClose, 
  onDeposit, 
  isLoading 
}: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[+\s]/g, '');
    return /^254[0-9]{9}$/.test(cleanPhone);
  };

  const formatPhoneNumber = (value: string): string => {
    let cleaned = value.replace(/[^0-9+]/g, '');
    
    if (cleaned.startsWith('0') && cleaned.length > 1) {
      cleaned = '254' + cleaned.substring(1);
    }
    
    if (!cleaned.startsWith('+') && !cleaned.startsWith('254') && cleaned.length > 0) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < 1) {
      setError('Please enter a valid amount (minimum KSh 1)');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (e.g., 254712345678 or +254712345678)');
      return;
    }

    try {
      await onDeposit(depositAmount, password, phoneNumber);
      setAmount('');
      setPassword('');
      setPhoneNumber('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to process deposit');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <h2 className="text-2xl font-bold text-gray-900">Deposit Money</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <p className="text-sm text-blue-700 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span>
              You will receive an M-Pesa STK Push on your phone to complete the deposit.
              Please ensure your phone is ready.
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                📱
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                required
                disabled={isLoading}
                placeholder="254712345678 or +254712345678"
                className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-gray-500">
                Enter the phone number to receive M-Pesa prompt
              </p>
              {phoneNumber && validatePhoneNumber(phoneNumber) && (
                <span className="text-xs text-green-600">✓ Valid number</span>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Examples: 254712345678, +254712345678, 0712345678
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount <span className="text-gray-400">(KSh)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                KSh
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
                required
                disabled={isLoading}
                placeholder="Enter amount"
                className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pl-16 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Minimum deposit: KSh 1
            </p>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your password to confirm"
                className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>💳</span>
                  Deposit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}