// // components/PaymentProcessor.tsx
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// interface PaymentProcessorProps {
//   checkoutId: string;
//   transactionId: string;
//   onSuccess: () => void;
//   onFailure: (error: string) => void;
//   onCancel: () => void;
// }

// export default function PaymentProcessor({
//   checkoutId,
//   transactionId,
//   onSuccess,
//   onFailure,
//   onCancel
// }: PaymentProcessorProps) {
//   const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
//   const [message, setMessage] = useState('Waiting for payment confirmation...');
//   const [timeElapsed, setTimeElapsed] = useState(0);

//   useEffect(() => {
//     let pollingInterval: NodeJS.Timeout;
//     let timerInterval: NodeJS.Timeout;

//     const checkStatus = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch(`/api/shd-api/api/payment/status/${checkoutId}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         const data = await response.json();
        
//         if (data.status === 'success') {
//           setStatus('success');
//           setMessage('✅ Payment completed successfully!');
//           clearInterval(pollingInterval);
//           clearInterval(timerInterval);
//           onSuccess();
//         } else if (data.status === 'failed') {
//           setStatus('failed');
//           setMessage(`❌ Payment failed: ${data.message || 'Please try again'}`);
//           clearInterval(pollingInterval);
//           clearInterval(timerInterval);
//           onFailure(data.message || 'Payment failed');
//         }
//         // If 'pending', continue polling
//       } catch (error) {
//         console.error('Error checking payment status:', error);
//       }
//     };

//     // Start polling every 3 seconds
//     pollingInterval = setInterval(checkStatus, 3000);

//     // Track time elapsed
//     timerInterval = setInterval(() => {
//       setTimeElapsed(prev => prev + 1);
//     }, 1000);

//     // Initial check
//     checkStatus();

//     // Cleanup
//     return () => {
//       clearInterval(pollingInterval);
//       clearInterval(timerInterval);
//     };
//   }, [checkoutId]);

//   return (
//     <div className="text-center py-8">
//       <div className="text-6xl mb-4">
//         {status === 'pending' && '⏳'}
//         {status === 'success' && '✅'}
//         {status === 'failed' && '❌'}
//       </div>
      
//       <h3 className="text-xl font-bold text-secondary mb-2">
//         {status === 'pending' && 'Processing Payment...'}
//         {status === 'success' && 'Payment Successful!'}
//         {status === 'failed' && 'Payment Failed'}
//       </h3>
      
//       <p className="text-muted mb-2">{message}</p>
      
//       {status === 'pending' && (
//         <>
//           <p className="text-sm text-muted">
//             Time elapsed: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
//           </p>
//           <div className="mt-4 flex flex-col items-center gap-2">
//             <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
//             <p className="text-xs text-muted">
//               Please check your phone and enter M-Pesa PIN
//             </p>
//           </div>
//         </>
//       )}
      
//       {status === 'pending' && (
//         <button
//           onClick={onCancel}
//           className="mt-4 text-muted hover:text-secondary transition-colors duration-200 text-sm"
//         >
//           Cancel Payment
//         </button>
//       )}
      
//       {status === 'failed' && (
//         <button
//           onClick={onCancel}
//           className="mt-4 bg-primary hover:bg-accent-dark text-white px-6 py-2 rounded-xl font-medium transition-all duration-200"
//         >
//           Try Again
//         </button>
//       )}
//     </div>
//   );
// }

// app/SHD-COMPONENTS/components/PaymentProcessor.tsx
'use client';

import { useState, useEffect } from 'react';

interface PaymentProcessorProps {
  checkoutId: string;
  transactionId: string;
  onSuccess: () => void;
  onFailure: (error: string) => void;
  onCancel: () => void;
}

export default function PaymentProcessor({
  checkoutId,
  transactionId,
  onSuccess,
  onFailure,
  onCancel
}: PaymentProcessorProps) {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Waiting for payment confirmation...');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    let pollingInterval: NodeJS.Timeout;
    let timerInterval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        console.log(`🔄 Checking payment status for checkout: ${checkoutId} (Attempt ${retryCount + 1})`);
        
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch(`/api/shd-api/api/payment/status/${checkoutId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('📊 Payment status response:', data);

        if (data.status === 'success') {
          console.log('✅ Payment successful!');
          setStatus('success');
          setMessage('✅ Payment completed successfully!');
          setIsPolling(false);
          clearInterval(pollingInterval);
          clearInterval(timerInterval);
          
          // Wait a moment before redirecting
          setTimeout(() => {
            onSuccess();
          }, 1500);
          
        } else if (data.status === 'failed') {
          console.log('❌ Payment failed:', data.message);
          setStatus('failed');
          setMessage(`❌ Payment failed: ${data.message || 'Please try again'}`);
          setIsPolling(false);
          clearInterval(pollingInterval);
          clearInterval(timerInterval);
          onFailure(data.message || 'Payment failed');
          
        } else if (data.status === 'pending') {
          console.log('⏳ Payment still pending...');
          // Still pending, continue polling
          
        } else {
          console.log('Unknown status:', data.status);
          setRetryCount(prev => prev + 1);
          
          // If retry count exceeds 20 (1 minute), show a message
          if (retryCount >= 20) {
            setMessage('⏳ Payment is taking longer than expected. Please check your phone for the M-Pesa prompt.');
          }
          
          if (retryCount >= 40) { // 2 minutes
            setStatus('failed');
            setMessage('⏰ Payment timeout. Please try again.');
            setIsPolling(false);
            clearInterval(pollingInterval);
            clearInterval(timerInterval);
            onFailure('Payment timeout');
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setRetryCount(prev => prev + 1);
        
        if (retryCount >= 10) {
          setMessage('⚠️ Having trouble connecting. Please check your internet connection.');
        }
      }
    };

    // Start polling every 3 seconds
    if (isPolling) {
      pollingInterval = setInterval(checkStatus, 3000);
    }

    // Track time elapsed
    timerInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Initial check
    checkStatus();

    // Cleanup
    return () => {
      clearInterval(pollingInterval);
      clearInterval(timerInterval);
    };
  }, [checkoutId, retryCount, isPolling]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">
        {status === 'pending' && '⏳'}
        {status === 'success' && '✅'}
        {status === 'failed' && '❌'}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {status === 'pending' && 'Processing Payment...'}
        {status === 'success' && 'Payment Successful!'}
        {status === 'failed' && 'Payment Failed'}
      </h3>
      
      <p className="text-gray-600 mb-2">{message}</p>
      
      {status === 'pending' && (
        <>
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            <p className="text-sm text-gray-500">
              Time elapsed: {formatTime(timeElapsed)}
            </p>
            <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto mt-2">
              <p className="text-sm text-blue-700">
                📱 Please check your phone and enter your M-Pesa PIN to complete the transaction.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Waiting for M-Pesa confirmation...
            </div>
            <button
              onClick={() => {
                // Manual refresh check
                setRetryCount(0);
                // Force re-check
                const checkAgain = async () => {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`/api/shd-api/api/payment/status/${checkoutId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  const data = await response.json();
                  console.log('Manual check:', data);
                  
                  if (data.status === 'success') {
                    setStatus('success');
                    setMessage('✅ Payment completed successfully!');
                    setIsPolling(false);
                    setTimeout(() => onSuccess(), 1500);
                  }
                };
                checkAgain();
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Check payment status now
            </button>
          </div>
          <button
            onClick={onCancel}
            className="mt-6 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm underline"
          >
            Cancel Payment
          </button>
        </>
      )}
      
      {status === 'failed' && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-4">
            Your payment could not be completed. Please try again or contact support.
          </p>
          <button
            onClick={onCancel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Try Again
          </button>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4">
          <div className="bg-green-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-green-700">
              🎉 Your membership has been activated successfully!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}