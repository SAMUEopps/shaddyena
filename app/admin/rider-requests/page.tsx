'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Bike,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  IdCard,
  FileText,
  AlertTriangle,
  RefreshCw,
  Loader2,
  MessageSquare,
  Calendar,
  TrendingUp,
  Users,
  Award,
  DollarSign,
  X,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface RiderRequest {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  vehicleType: string;
  vehicleModel: string;
  vehiclePlate: string;
  idNumber: string;
  licenseNumber: string;
  location: string;
  emergencyContact: string;
  emergencyPhone: string;
  experienceYears: string;
  availability: string;
  referralCode?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  reviewedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviewedAt?: string;
  createdAt: string;
}

export default function AdminRiderRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<RiderRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RiderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [selectedRequest, setSelectedRequest] = useState<RiderRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    filterRequests();
  }, [requests, searchQuery]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/rider-requests?page=${currentPage}&limit=${itemsPerPage}&status=${statusFilter}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
        setFilteredRequests(data.requests);
        setTotalPages(data.totalPages);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching rider requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    if (!searchQuery) {
      setFilteredRequests(requests);
      return;
    }

    const filtered = requests.filter(request =>
      request.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.phoneNumber.includes(searchQuery) ||
      request.idNumber.includes(searchQuery) ||
      request.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRequests(filtered);
  };

  const handleViewDetails = (request: RiderRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || '');
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    setProcessingAction(true);
    try {
      const response = await fetch(`/api/admin/rider-requests/${selectedRequest._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'approve', 
          adminNotes: adminNotes || 'Application approved'
        }),
      });

      if (response.ok) {
        await fetchRequests();
        setShowModal(false);
        setSelectedRequest(null);
        setAdminNotes('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    if (!adminNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setProcessingAction(true);
    try {
      const response = await fetch(`/api/admin/rider-requests/${selectedRequest._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reject', 
          adminNotes: adminNotes 
        }),
      });

      if (response.ok) {
        await fetchRequests();
        setShowModal(false);
        setSelectedRequest(null);
        setAdminNotes('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/admin/rider-requests/${requestId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchRequests();
      } else {
        alert('Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-500', text: 'Pending', icon: Clock };
      case 'approved':
        return { color: 'bg-green-500', text: 'Approved', icon: CheckCircle };
      case 'rejected':
        return { color: 'bg-red-500', text: 'Rejected', icon: XCircle };
      default:
        return { color: 'bg-gray-500', text: 'Unknown', icon: Clock };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Bike className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
                Rider Applications
              </h1>
              <p className="text-sm text-gray-500 mt-1">Review and manage delivery rider applications</p>
            </div>
            <button
              onClick={() => fetchRequests()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.pending}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Pending Review</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.approved}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Approved Riders</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.rejected}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Rejected Applications</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, ID, or plate number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'approved'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search' : 'No rider applications to review'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => {
                    const status = getStatusBadge(request.status);
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{request.fullName}</p>
                            <p className="text-xs text-gray-500 mt-0.5">ID: {request.idNumber}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              {request.phoneNumber}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {request.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{request.vehicleType}</p>
                            <p className="text-xs text-gray-500">{request.vehicleModel}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Plate: {request.vehiclePlate}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {request.location}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600">{formatDate(request.createdAt)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.text}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {request.status === 'pending' && (
                              <button
                                onClick={() => handleDelete(request._id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-indigo-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.fullName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">ID Number</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.idNumber}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Location</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.location}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Experience</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.experienceYears} years</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Availability</label>
                    <p className="text-gray-900 mt-1 capitalize">{selectedRequest.availability}</p>
                  </div>
                  {selectedRequest.referralCode && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Referral Code</label>
                      <p className="text-gray-900 mt-1">{selectedRequest.referralCode}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Car className="w-5 h-5 text-indigo-600" />
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Vehicle Type</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.vehicleType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Vehicle Model</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.vehicleModel}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">License/Plate Number</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.vehiclePlate}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Driver's License</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.licenseNumber}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-indigo-600" />
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Contact Name</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.emergencyContact}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Contact Phone</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.emergencyPhone}</p>
                  </div>
                </div>
              </div>

              {/* Admin Notes & Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Review & Decision
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes {selectedRequest.status === 'pending' && '*'}
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add notes about the decision..."
                      disabled={selectedRequest.status !== 'pending'}
                    />
                  </div>

                  {selectedRequest.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={handleApprove}
                        disabled={processingAction}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {processingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve Application
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={processingAction}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {processingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Reject Application
                      </button>
                    </div>
                  )}

                  {selectedRequest.status !== 'pending' && (
                    <div className={`p-4 rounded-lg ${
                      selectedRequest.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <p className="text-sm font-medium mb-2">
                        {selectedRequest.status === 'approved' ? '✓ Application Approved' : '✗ Application Rejected'}
                      </p>
                      {selectedRequest.adminNotes && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Notes:</strong> {selectedRequest.adminNotes}
                        </p>
                      )}
                      {selectedRequest.reviewedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Reviewed on: {formatDate(selectedRequest.reviewedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}