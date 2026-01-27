import { JSX } from "react";

interface OrdersListProps<T> {
  orders: T[];
  renderOrderRow: (order: T) => JSX.Element;
  tableHeaders: JSX.Element;
  renderEmptyState: () => JSX.Element;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  totalOrders?: number;
}

export default function OrdersList<T>({
  orders,
  renderOrderRow,
  tableHeaders,
  renderEmptyState,
  currentPage,
  totalPages,
  setCurrentPage,
  totalOrders
}: OrdersListProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {orders.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {tableHeaders}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(renderOrderRow)}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                  {totalOrders !== undefined && ` (${totalOrders} total)`}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}