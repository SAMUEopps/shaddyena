// // app/shd-pages/vendor/components/AdvertisementManager.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';

// interface Advertisement {
//   _id: string;
//   imageUrl: string;
//   title: string;
//   description?: string;
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
//   paymentStatus: 'pending' | 'paid' | 'expired';
//   paymentAmount: number;
// }

// interface Props {
//   vendorId?: string;
//   vendorName?: string;
//   onShowMessage: (type: 'success' | 'error', text: string) => void;
// }

// const ADVERTISMENT_COST = 1; // Cost per week
// const MAX_DURATION_WEEKS = 4;

// export default function AdvertisementManager({ vendorId, vendorName, onShowMessage }: Props) {
//   const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     durationWeeks: 1,
//     link: '',
//   });

//   useEffect(() => {
//     fetchAdvertisements();
//   }, [vendorId]);

//   const fetchAdvertisements = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/shd-api/api/advertisements/vendor/${vendorId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setAdvertisements(data.advertisements || []);
//       }
//     } catch (error) {
//       console.error('Error fetching advertisements:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         onShowMessage('error', 'Please select an image file');
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         onShowMessage('error', 'Image must be less than 5MB');
//         return;
//       }

//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const uploadImage = async (
//   file: File
//   ): Promise<{ imageUrl: string; imagePublicId: string }> => {
//     const formData = new FormData();
//     formData.append('image', file);
//     formData.append('type', 'advertisement');

//     const response = await fetch('/api/shd-api/api/advertisements/upload', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to upload image');
//     }

//     const data = await response.json();

//     return {
//       imageUrl: data.imageUrl,
//       imagePublicId: data.publicId,
//     };
//   };

//   const handleCreateAd = async () => {
//     if (!selectedFile) {
//       onShowMessage('error', 'Please select an image');
//       return;
//     }

//     if (!formData.title.trim()) {
//       onShowMessage('error', 'Please enter a title');
//       return;
//     }

//     setUploading(true);
//     try {
//       // 1. Upload image
//       //const imageUrl = await uploadImage(selectedFile);
//       const { imageUrl, imagePublicId } = await uploadImage(selectedFile);

//       // 2. Calculate dates
//       const startDate = new Date();
//       const endDate = new Date();
//       endDate.setDate(endDate.getDate() + (formData.durationWeeks * 7));

//       // 3. Calculate payment amount
//       const paymentAmount = ADVERTISMENT_COST * formData.durationWeeks;

//       // 4. Create advertisement record
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/advertisements', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           imageUrl,
//           imagePublicId,
//           title: formData.title,
//           description: formData.description,
//           link: formData.link,
//           startDate: startDate.toISOString(),
//           endDate: endDate.toISOString(),
//           paymentAmount,
//           durationWeeks: formData.durationWeeks,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || 'Failed to create advertisement');
//       }

//       const data = await response.json();
      
//       // 5. Initiate payment
//       await initiatePayment(data.advertisement._id, paymentAmount);

//       // 6. Refresh list
//       await fetchAdvertisements();
//       resetForm();
//       onShowMessage('success', 'Advertisement created! Please complete payment.');

//     } catch (error: any) {
//       onShowMessage('error', error.message || 'Failed to create advertisement');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const initiatePayment = async (adId: string, amount: number) => {
//     setPaymentProcessing(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/advertisements/pay', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           adId,
//           amount,
//           purpose: 'advertisement'
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || 'Payment initiation failed');
//       }

//       const data = await response.json();
//       onShowMessage('success', 'Please complete payment on your phone');
//     } catch (error: any) {
//       onShowMessage('error', error.message || 'Payment failed');
//       throw error;
//     } finally {
//       setPaymentProcessing(false);
//     }
//   };

//   const resetForm = () => {
//     setShowForm(false);
//     setSelectedFile(null);
//     setPreviewUrl(null);
//     setFormData({
//       title: '',
//       description: '',
//       durationWeeks: 1,
//       link: '',
//     });
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-KE', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getStatusBadge = (ad: Advertisement) => {
//     const isExpired = new Date(ad.endDate) < new Date();
//     if (isExpired) return 'Expired';
//     if (ad.paymentStatus === 'pending') return 'Pending Payment';
//     if (ad.paymentStatus === 'paid' && ad.isActive) return 'Active';
//     return ad.paymentStatus;
//   };

//   const getStatusColor = (ad: Advertisement) => {
//     const status = getStatusBadge(ad);
//     if (status === 'Active') return 'bg-green-100 text-green-800';
//     if (status === 'Pending Payment') return 'bg-yellow-100 text-yellow-800';
//     if (status === 'Expired') return 'bg-gray-100 text-gray-800';
//     return 'bg-red-100 text-red-800';
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
//           <div className="space-y-3">
//             <div className="h-20 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow mb-6 p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Advertisements</h2>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
//         >
//           {showForm ? 'Cancel' : 'Post Advertisement'}
//         </button>
//       </div>

//       {/* Create Ad Form */}
//       {showForm && (
//         <div className="border rounded-lg p-4 mb-6 bg-gray-50">
//           <h3 className="font-semibold mb-3">Post New Advertisement</h3>
          
//           {/* Image Upload */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Ad Image *</label>
//             <div className="flex items-center space-x-4">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="hidden"
//                 id="adImage"
//               />
//               <label
//                 htmlFor="adImage"
//                 className="px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
//               >
//                 Choose Image
//               </label>
//               {previewUrl && (
//                 <div className="relative w-20 h-20">
//                   <Image
//                     src={previewUrl}
//                     alt="Preview"
//                     fill
//                     className="object-cover rounded"
//                   />
//                 </div>
//               )}
//             </div>
//             <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG/WEBP</p>
//           </div>

//           {/* Title */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Title *</label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="e.g., 50% Off Summer Sale"
//             />
//           </div>

//           {/* Description */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Description</label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               rows={2}
//               placeholder="Describe your promotion..."
//             />
//           </div>

//           {/* Link */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Link (optional)</label>
//             <input
//               type="url"
//               value={formData.link}
//               onChange={(e) => setFormData({ ...formData, link: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="https://your-shop.com/sale"
//             />
//           </div>

//           {/* Duration */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Duration</label>
//             <select
//               value={formData.durationWeeks}
//               onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             >
//               {[1, 2, 3, 4].map(weeks => (
//                 <option key={weeks} value={weeks}>
//                   {weeks} week{weeks > 1 ? 's' : ''} - KES {(ADVERTISMENT_COST * weeks).toLocaleString()}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Submit */}
//           <button
//             onClick={handleCreateAd}
//             disabled={uploading || !selectedFile}
//             className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
//           >
//             {uploading ? 'Uploading...' : `Post Ad - KES ${(ADVERTISMENT_COST * formData.durationWeeks).toLocaleString()}`}
//           </button>
//         </div>
//       )}

//       {/* Advertisements List */}
//       {advertisements.length === 0 ? (
//         <p className="text-gray-500 text-center py-4">No advertisements posted yet</p>
//       ) : (
//         <div className="space-y-4">
//           {advertisements.map((ad) => (
//             <div key={ad._id} className="border rounded-lg p-4 flex items-start space-x-4">
//               <div className="relative w-24 h-24 flex-shrink-0">
//                 <Image
//                   src={ad.imageUrl}
//                   alt={ad.title}
//                   fill
//                   className="object-cover rounded"
//                 />
//               </div>
//               <div className="flex-1">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="font-semibold">{ad.title}</h4>
//                     {ad.description && (
//                       <p className="text-sm text-gray-600">{ad.description}</p>
//                     )}
//                   </div>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad)}`}>
//                     {getStatusBadge(ad)}
//                   </span>
//                 </div>
//                 <div className="text-sm text-gray-500 mt-1">
//                   <span>Duration: {formatDate(ad.startDate)} - {formatDate(ad.endDate)}</span>
//                   <span className="mx-2">•</span>
//                   <span>KES {ad.paymentAmount.toLocaleString()}</span>
//                 </div>
//                 {ad.paymentStatus === 'pending' && (
//                   <button
//                     onClick={() => initiatePayment(ad._id, ad.paymentAmount)}
//                     disabled={paymentProcessing}
//                     className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition"
//                   >
//                     {paymentProcessing ? 'Processing...' : 'Complete Payment'}
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// app/shd-pages/vendor/components/AdvertisementManager.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PaymentModal from '@/app/SHD-COMPONENTS/components/PaymentModal';

interface Advertisement {
  _id: string;
  imageUrl: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  paymentStatus: 'pending' | 'paid' | 'expired';
  paymentAmount: number;
}

interface Props {
  vendorId?: string;
  vendorName?: string;
  onShowMessage: (type: 'success' | 'error', text: string) => void;
}

const ADVERTISMENT_COST = 1; // Cost per week
const MAX_DURATION_WEEKS = 4;

export default function AdvertisementManager({ vendorId, vendorName, onShowMessage }: Props) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAdId, setPendingAdId] = useState<string | null>(null);
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationWeeks: 1,
    link: '',
  });

  useEffect(() => {
    fetchAdvertisements();
  }, [vendorId]);

  const fetchAdvertisements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/advertisements/vendor/${vendorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdvertisements(data.advertisements || []);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        onShowMessage('error', 'Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onShowMessage('error', 'Image must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (
    file: File
  ): Promise<{ imageUrl: string; imagePublicId: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'advertisement');

    const response = await fetch('/api/shd-api/api/advertisements/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();

    return {
      imageUrl: data.imageUrl,
      imagePublicId: data.publicId,
    };
  };

  const handleCreateAd = async () => {
    if (!selectedFile) {
      onShowMessage('error', 'Please select an image');
      return;
    }

    if (!formData.title.trim()) {
      onShowMessage('error', 'Please enter a title');
      return;
    }

    setUploading(true);
    try {
      // 1. Upload image
      const { imageUrl, imagePublicId } = await uploadImage(selectedFile);

      // 2. Calculate dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (formData.durationWeeks * 7));

      // 3. Calculate payment amount
      const paymentAmount = ADVERTISMENT_COST * formData.durationWeeks;

      // 4. Create advertisement record
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/advertisements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl,
          imagePublicId,
          title: formData.title,
          description: formData.description,
          link: formData.link,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          paymentAmount,
          durationWeeks: formData.durationWeeks,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create advertisement');
      }

      const data = await response.json();
      
      // 5. Open payment modal instead of initiating directly
      setPendingAdId(data.advertisement._id);
      setPendingAmount(paymentAmount);
      setShowPaymentModal(true);

      // 6. Refresh list
      await fetchAdvertisements();
      resetForm();

    } catch (error: any) {
      onShowMessage('error', error.message || 'Failed to create advertisement');
    } finally {
      setUploading(false);
    }
  };

  const handlePayment = async (amount: number, phoneNumber: string) => {
    if (!pendingAdId) {
      throw new Error('No advertisement selected for payment');
    }

    setPaymentProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/advertisements/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          adId: pendingAdId,
          amount,
          phoneNumber,
          purpose: 'advertisement'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment initiation failed');
      }

      const data = await response.json();
      
      // Payment initiated successfully
      setShowPaymentModal(false);
      setPendingAdId(null);
      onShowMessage('success', 'Payment initiated! Please complete on your phone.');
      
      // Refresh to update status
      await fetchAdvertisements();

    } catch (error: any) {
      onShowMessage('error', error.message || 'Payment failed');
      throw error;
    } finally {
      setPaymentProcessing(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({
      title: '',
      description: '',
      durationWeeks: 1,
      link: '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (ad: Advertisement) => {
    const isExpired = new Date(ad.endDate) < new Date();
    if (isExpired) return 'Expired';
    if (ad.paymentStatus === 'pending') return 'Pending Payment';
    if (ad.paymentStatus === 'paid' && ad.isActive) return 'Active';
    return ad.paymentStatus;
  };

  const getStatusColor = (ad: Advertisement) => {
    const status = getStatusBadge(ad);
    if (status === 'Active') return 'bg-green-100 text-green-800';
    if (status === 'Pending Payment') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Expired') return 'bg-gray-100 text-gray-800';
    return 'bg-red-100 text-red-800';
  };

  const handleOpenPaymentModal = (adId: string, amount: number) => {
    setPendingAdId(adId);
    setPendingAmount(amount);
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Advertisements</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            {showForm ? 'Cancel' : 'Post Advertisement'}
          </button>
        </div>

        {/* Create Ad Form */}
        {showForm && (
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="font-semibold mb-3">Post New Advertisement</h3>
            
            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Ad Image *</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="adImage"
                />
                <label
                  htmlFor="adImage"
                  className="px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  Choose Image
                </label>
                {previewUrl && (
                  <div className="relative w-20 h-20">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG/WEBP</p>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 50% Off Summer Sale"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
                placeholder="Describe your promotion..."
              />
            </div>

            {/* Link */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Link (optional)</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://your-shop.com/sale"
              />
            </div>

            {/* Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Duration</label>
              <select
                value={formData.durationWeeks}
                onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[1, 2, 3, 4].map(weeks => (
                  <option key={weeks} value={weeks}>
                    {weeks} week{weeks > 1 ? 's' : ''} - KES {(ADVERTISMENT_COST * weeks).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleCreateAd}
              disabled={uploading || !selectedFile}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {uploading ? 'Uploading...' : `Post Ad - KES ${(ADVERTISMENT_COST * formData.durationWeeks).toLocaleString()}`}
            </button>
          </div>
        )}

        {/* Advertisements List */}
        {advertisements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No advertisements posted yet</p>
        ) : (
          <div className="space-y-4">
            {advertisements.map((ad) => (
              <div key={ad._id} className="border rounded-lg p-4 flex items-start space-x-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{ad.title}</h4>
                      {ad.description && (
                        <p className="text-sm text-gray-600">{ad.description}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad)}`}>
                      {getStatusBadge(ad)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>Duration: {formatDate(ad.startDate)} - {formatDate(ad.endDate)}</span>
                    <span className="mx-2">•</span>
                    <span>KES {ad.paymentAmount.toLocaleString()}</span>
                  </div>
                  {ad.paymentStatus === 'pending' && (
                    <button
                      onClick={() => handleOpenPaymentModal(ad._id, ad.paymentAmount)}
                      disabled={paymentProcessing}
                      className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition"
                    >
                      {paymentProcessing ? 'Processing...' : 'Complete Payment'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingAdId(null);
        }}
        onPayment={handlePayment}
        isLoading={paymentProcessing}
        amount={pendingAmount}
        title="Pay for Advertisement"
        description="You will receive an M-Pesa STK Push on your phone to complete the payment. This will activate your advertisement."
        purpose="advertisement"
      />
    </>
  );
}