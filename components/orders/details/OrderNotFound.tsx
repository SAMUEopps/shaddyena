import Link from 'next/link';

interface OrderNotFoundProps {
  isRider?: boolean;
}

export default function OrderNotFound({ isRider = false }: OrderNotFoundProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
        <p className="text-gray-600 mb-6">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <div className="flex gap-3 justify-center">
          <Link 
            href={isRider ? "/delivery/dashboard" : "/?tab=orders"}
            className="px-4 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors inline-block"
          >
            {isRider ? "Back to Dashboard" : "Back to Orders"}
          </Link>
          <Link 
            href="/"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}