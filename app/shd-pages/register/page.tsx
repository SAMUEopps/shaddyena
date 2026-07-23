// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: '',
//     phoneNumber: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formData.name,
//           phoneNumber: formData.phoneNumber,
//           email: formData.email,
//           password: formData.password,
//           role: 'customer'
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert('Registration successful! Please login.');
//         router.push('/login');
//       } else {
//         setError(data.error || 'Registration failed');
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
//         <div>
//           <h2 className="text-3xl font-bold text-center">Create Account</h2>
//           <p className="mt-2 text-center text-gray-600">Join Shaddyna Marketplace</p>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               placeholder="John Doe"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//             <input
//               type="text"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               placeholder="254712345678"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               placeholder="••••••••"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               placeholder="••••••••"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
//           >
//             {loading ? 'Creating account...' : 'Register'}
//           </button>
//         </form>

//         <div className="text-center space-y-4">

//         <Link 
//           href="/login" 
//           className="text-blue-600 hover:underline block"
//         >
//           Already have an account? Login
//         </Link>


//         <div className="border-t pt-4">

//           <p className="text-sm text-gray-600 mb-2">
//             Are you a business owner?
//           </p>


//           <Link
//             href="/vendor/register"
//             className="
//               inline-block
//               bg-green-100
//               text-green-700
//               px-5
//               py-2
//               rounded-lg
//               font-semibold
//               hover:bg-green-200
//               transition
//             "
//           >
//             🏪 Register Your Shop
//           </Link>

//         </div>

//       </div>
//       </div>
//     </div>
//   );
// }

// C:\Users\USER\Desktop\Projects\my-app\app\register\page.tsx (Updated with referral code support)
/*'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check for referral code in URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          role: 'customer',
          referralCode: formData.referralCode || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please login.');
        router.push('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Create Account</h2>
          <p className="mt-2 text-center text-gray-600">Join Shaddyna Marketplace</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {formData.referralCode && (
          <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
            🎯 Referral code applied: <strong>{formData.referralCode}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="254712345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Referral Code (Optional)</label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
              placeholder="Enter referral code"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="text-center space-y-4">
          <Link 
            href="/login" 
            className="text-blue-600 hover:underline block"
          >
            Already have an account? Login
          </Link>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              Are you a business owner?
            </p>
            <Link
              href="/vendor/register"
              className="
                inline-block
                bg-green-100
                text-green-700
                px-5
                py-2
                rounded-lg
                font-semibold
                hover:bg-green-200
                transition
              "
            >
              🏪 Register Your Shop
            </Link>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              Are you a delivery rider?
            </p>
            <Link
              href="/rider/register"
              className="
                inline-block
                bg-purple-100
                text-purple-700
                px-5
                py-2
                rounded-lg
                font-semibold
                hover:bg-purple-200
                transition
              "
            >
              🏍️ Register as Rider
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}*/





import { Suspense } from "react";
import RegisterForm from "./RegisterPageComponent";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}