// // C:\Users\USER\Desktop\Projects\my-app\app\profile\page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   phoneNumber: string;
//   role: 'customer' | 'vendor' | 'admin';
//   isVerified: boolean;
//   createdAt: string;
// }

// export default function ProfilePage() {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phoneNumber: ''
//   });
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       const response = await fetch('/api/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch profile');
//       }

//       const data = await response.json();
//       setUser(data.user);
//       setFormData({
//         name: data.user.name,
//         email: data.user.email,
//         phoneNumber: data.user.phoneNumber
//       });
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       setMessage({ type: 'error', text: 'Failed to load profile' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProfileUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage(null);
//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       const response = await fetch('/api/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update profile');
//       }

//       setUser(data.user);
//       setEditing(false);
//       setMessage({ type: 'success', text: 'Profile updated successfully!' });

//       // Update localStorage user data
//       const userStr = localStorage.getItem('user');
//       if (userStr) {
//         const storedUser = JSON.parse(userStr);
//         localStorage.setItem('user', JSON.stringify({
//           ...storedUser,
//           ...data.user
//         }));
//       }
//     } catch (error: any) {
//       setMessage({ type: 'error', text: error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordChange = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage(null);

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setMessage({ type: 'error', text: 'New passwords do not match' });
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       const response = await fetch('/api/profile/change-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           currentPassword: passwordData.currentPassword,
//           newPassword: passwordData.newPassword
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to change password');
//       }

//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//       setMessage({ type: 'success', text: 'Password changed successfully!' });
//     } catch (error: any) {
//       setMessage({ type: 'error', text: error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     router.push('/');
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   if (loading && !user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">Please login to view your profile</p>
//           <Link href="/login" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
//             Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="container mx-auto px-4 max-w-4xl">
//         {message && (
//           <div className={`mb-6 p-4 rounded-lg ${
//             message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Profile Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
//                   {user.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold">{user.name}</h1>
//                   <p className="text-blue-100 capitalize">{user.role}</p>
//                   <p className="text-blue-100 text-sm">
//                     Member since {formatDate(user.createdAt)}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-col items-end space-y-2">
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   user.isVerified ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
//                 }`}>
//                   {user.isVerified ? '✓ Verified' : 'Unverified'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Profile Content */}
//           <div className="p-6">
//             {!editing ? (
//               // View Mode
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
//                     <p className="mt-1 text-lg text-gray-900">{user.name}</p>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
//                     <p className="mt-1 text-lg text-gray-900">{user.email}</p>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
//                     <p className="mt-1 text-lg text-gray-900">{user.phoneNumber}</p>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Role</h3>
//                     <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-4 pt-4 border-t">
//                   <button
//                     onClick={() => setEditing(true)}
//                     className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
//                   >
//                     Edit Profile
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               // Edit Mode
//               <div className="space-y-8">
//                 <form onSubmit={handleProfileUpdate} className="space-y-6">
//                   <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Full Name
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         required
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Phone Number
//                       </label>
//                       <input
//                         type="tel"
//                         value={formData.phoneNumber}
//                         onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-4">
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//                     >
//                       {loading ? 'Saving...' : 'Save Changes'}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setEditing(false);
//                         setFormData({
//                           name: user.name,
//                           email: user.email,
//                           phoneNumber: user.phoneNumber
//                         });
//                       }}
//                       className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>

//                 {/* Change Password Section */}
//                 <div className="border-t pt-8">
//                   <form onSubmit={handlePasswordChange} className="space-y-6">
//                     <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Current Password
//                         </label>
//                         <input
//                           type="password"
//                           value={passwordData.currentPassword}
//                           onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           New Password
//                         </label>
//                         <input
//                           type="password"
//                           value={passwordData.newPassword}
//                           onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           required
//                           minLength={6}
//                         />
//                       </div>
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Confirm New Password
//                         </label>
//                         <input
//                           type="password"
//                           value={passwordData.confirmPassword}
//                           onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
//                     >
//                       {loading ? 'Changing Password...' : 'Change Password'}
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// C:\Users\USER\Desktop\Projects\my-app\app\profile\page.tsx (Updated with referral section)
/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'customer' | 'vendor' | 'admin';
  isVerified: boolean;
  createdAt: string;
  referralCode?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data.user);
      setFormData({
        name: data.user.name,
        email: data.user.email,
        phoneNumber: data.user.phoneNumber
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser(data.user);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      const userStr = localStorage.getItem('user');
      if (userStr) {
        const storedUser = JSON.parse(userStr);
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          ...data.user
        }));
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please login to view your profile</p>
          <Link href="/login" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header *
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-blue-100 capitalize">{user.role}</p>
                  <p className="text-blue-100 text-sm">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.isVerified ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {user.isVerified ? '✓ Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content *
          <div className="p-6">
            {!editing ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1 text-lg text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                    <p className="mt-1 text-lg text-gray-900">{user.phoneNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
                  </div>
                </div>

                {/* Quick Actions Buttons *
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Link 
                      href="/profile/referrals" 
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      📤 Referrals
                    </Link>
                    <button 
                      onClick={() => router.push('/orders')}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      📦 Orders
                    </button>
                    <button 
                      onClick={() => router.push('/payments')}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      💳 Payments
                    </button>
                    {user.role === 'customer' && (
                      <button 
                        onClick={() => router.push('/vendor/upgrade')}
                        className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors"
                      >
                        🏪 Upgrade to Vendor
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode (unchanged)
              <div className="space-y-8">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phoneNumber: user.phoneNumber
                        });
                      }}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                {/* Change Password Section *
                <div className="border-t pt-8">
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'customer' | 'vendor' | 'admin';
  isVerified: boolean;
  createdAt: string;
  referralCode?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/shd-api/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data.user);
      setFormData({
        name: data.user.name,
        email: data.user.email,
        phoneNumber: data.user.phoneNumber
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/shd-api/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser(data.user);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      const userStr = localStorage.getItem('user');
      if (userStr) {
        const storedUser = JSON.parse(userStr);
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          ...data.user
        }));
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/shd-api/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-muted text-lg mb-6">Please login to view your profile</p>
          <Link 
            href="/shd-pages/login" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
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

        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-surface">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-secondary to-secondary/80 px-6 py-8 sm:px-8 sm:py-10 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold border-2 border-white/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                  <p className="text-white/80 text-sm capitalize flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                    {user.role}
                  </p>
                  <p className="text-white/70 text-xs">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                  user.isVerified 
                    ? 'bg-green-500/90 text-white' 
                    : 'bg-yellow-500/90 text-white'
                }`}>
                  {user.isVerified ? '✓ Verified' : '⚠️ Unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            {!editing ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-surface/30 rounded-xl p-4 border border-surface">
                    <h3 className="text-sm font-medium text-muted">Full Name</h3>
                    <p className="mt-1 text-lg font-semibold text-secondary">{user.name}</p>
                  </div>
                  <div className="bg-surface/30 rounded-xl p-4 border border-surface">
                    <h3 className="text-sm font-medium text-muted">Email Address</h3>
                    <p className="mt-1 text-lg font-semibold text-secondary">{user.email}</p>
                  </div>
                  <div className="bg-surface/30 rounded-xl p-4 border border-surface">
                    <h3 className="text-sm font-medium text-muted">Phone Number</h3>
                    <p className="mt-1 text-lg font-semibold text-secondary">{user.phoneNumber}</p>
                  </div>
                  <div className="bg-surface/30 rounded-xl p-4 border border-surface">
                    <h3 className="text-sm font-medium text-muted">Role</h3>
                    <p className="mt-1 text-lg font-semibold text-secondary capitalize">{user.role}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-surface">
                  <h3 className="text-sm font-medium text-muted mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Link 
                      href="/shd/pages/profile/referrals" 
                      className="bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl hover:bg-purple-100 transition-all duration-200 border border-purple-200 font-medium text-sm"
                    >
                      📤 Referrals
                    </Link>
                    <button 
                      onClick={() => router.push('/shd-pages/orders')}
                      className="bg-blue-50 text-primary px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-all duration-200 border border-blue-200 font-medium text-sm"
                    >
                      📦 Orders
                    </button>
                    <button 
                      onClick={() => router.push('/shd-pages/payments')}
                      className="bg-green-50 text-green-700 px-4 py-2.5 rounded-xl hover:bg-green-100 transition-all duration-200 border border-green-200 font-medium text-sm"
                    >
                      💳 Payments
                    </button>
                    {user.role === 'customer' && (
                      <button 
                        onClick={() => router.push('/shd-pages/vendor/upgrade')}
                        className="bg-yellow-50 text-yellow-700 px-4 py-2.5 rounded-xl hover:bg-yellow-100 transition-all duration-200 border border-yellow-200 font-medium text-sm"
                      >
                        🏪 Upgrade to Vendor
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-surface">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-8">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <h2 className="text-xl font-bold text-secondary">Edit Profile</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phoneNumber: user.phoneNumber
                        });
                      }}
                      className="bg-surface hover:bg-surface/70 text-secondary px-6 py-2.5 rounded-xl transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                {/* Change Password Section */}
                <div className="border-t border-surface pt-8">
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <h2 className="text-xl font-bold text-secondary">Change Password</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1.5">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-secondary mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-accent-dark hover:bg-accent-dark/80 disabled:bg-muted disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
                    >
                      {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}