// C:\Users\USER\Desktop\Projects\my-app\app\rider\register\page.tsx
/*'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RiderRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // User information
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralCode: '',

    // Rider information
    fullName: '',
    nationalId: '',
    kraPin: '',
    vehicleType: 'MOTORCYCLE',
    vehicleRegistration: '',
    driverLicense: '',
    currentLocation: '',
    deliveryRadius: '10',

    // Payout
    payoutMethod: 'MPESA',
    mpesaNumber: '',
    pochiNumber: '',
    tillNumber: '',
    paybillNumber: '',
    paybillAccount: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const payload = {
      // User
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      referralCode: formData.referralCode || undefined,

      // Rider
      fullName: formData.fullName || formData.name,
      nationalId: formData.nationalId,
      kraPin: formData.kraPin || undefined,
      vehicleType: formData.vehicleType,
      vehicleRegistration: formData.vehicleRegistration,
      driverLicense: formData.driverLicense,
      currentLocation: {
        address: formData.currentLocation || ''
      },
      deliveryRadius: parseInt(formData.deliveryRadius),
      payoutMethod: formData.payoutMethod,
      payoutDetails: {
        mpesaNumber: formData.mpesaNumber || formData.phoneNumber,
        pochiNumber: formData.pochiNumber,
        tillNumber: formData.tillNumber,
        paybillNumber: formData.paybillNumber,
        paybillAccount: formData.paybillAccount
      }
    };

    try {
      const response = await fetch('/api/riders/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Rider registration successful!");
        router.push("/rider/dashboard");
      } else {
        setError(data.error || "Rider registration failed");
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-2">
          🏍️ Register as a Rider
        </h1>
        <p className="text-gray-600 mb-8">
          Join our delivery team and start earning today on Shaddyna
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ACCOUNT DETAILS *
          <div>
            <h2 className="text-xl font-bold mb-4">
              Account Information
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                name="referralCode"
                placeholder="Referral Code (Optional)"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full border p-3 rounded bg-gray-50"
              />
            </div>
          </div>

          {/* RIDER INFORMATION *
          <div>
            <h2 className="text-xl font-bold mb-4">
              Rider Information
            </h2>
            <div className="space-y-3">
              <input
                name="fullName"
                placeholder="Full Name (if different from above)"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                name="nationalId"
                placeholder="National ID"
                required
                value={formData.nationalId}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                name="kraPin"
                placeholder="KRA PIN (Optional)"
                value={formData.kraPin}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded"
              >
                <option value="MOTORCYCLE">Motorcycle</option>
                <option value="BICYCLE">Bicycle</option>
                <option value="CAR">Car</option>
                <option value="VAN">Van</option>
              </select>

              <input
                name="vehicleRegistration"
                placeholder="Vehicle Registration Number"
                required
                value={formData.vehicleRegistration}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                name="driverLicense"
                placeholder="Driver License Number"
                required
                value={formData.driverLicense}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                name="currentLocation"
                placeholder="Current Location/Base Address"
                value={formData.currentLocation}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                name="deliveryRadius"
                placeholder="Delivery Radius (km)"
                type="number"
                value={formData.deliveryRadius}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
            </div>
          </div>

          {/* PAYMENT DETAILS *
          <div>
            <h2 className="text-xl font-bold mb-4">
              Payment Details
            </h2>

            <select
              name="payoutMethod"
              value={formData.payoutMethod}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            >
              <option value="MPESA">M-Pesa</option>
              <option value="POCHI">Pochi</option>
              <option value="TILL">Till Number</option>
              <option value="PAYBILL">PayBill</option>
            </select>

            {formData.payoutMethod === "MPESA" && (
              <input
                name="mpesaNumber"
                placeholder="M-Pesa Number"
                value={formData.mpesaNumber}
                onChange={handleChange}
                className="w-full border p-3 rounded mt-3"
              />
            )}

            {formData.payoutMethod === "POCHI" && (
              <input
                name="pochiNumber"
                placeholder="Pochi Number"
                value={formData.pochiNumber}
                onChange={handleChange}
                className="w-full border p-3 rounded mt-3"
              />
            )}

            {formData.payoutMethod === "TILL" && (
              <input
                name="tillNumber"
                placeholder="Till Number"
                value={formData.tillNumber}
                onChange={handleChange}
                className="w-full border p-3 rounded mt-3"
              />
            )}

            {formData.payoutMethod === "PAYBILL" && (
              <div className="space-y-3 mt-3">
                <input
                  name="paybillNumber"
                  placeholder="PayBill Number"
                  value={formData.paybillNumber}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />
                <input
                  name="paybillAccount"
                  placeholder="Account Number"
                  value={formData.paybillAccount}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />
              </div>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register as Rider"}
          </button>
        </form>

        <div className="text-center space-y-4 mt-6">
          <Link 
            href="/login" 
            className="text-blue-600 hover:underline block"
          >
            Already have an account? Login
          </Link>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              Want to sell on Shaddyna?
            </p>
            <Link
              href="/vendor/register"
              className="
                inline-block
                bg-blue-100
                text-blue-700
                px-5
                py-2
                rounded-lg
                font-semibold
                hover:bg-blue-200
                transition
              "
            >
              🏪 Register Your Shop
            </Link>
            <span className="mx-2 text-gray-400">or</span>
            <Link
              href="/register"
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
              👤 Register as Customer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}*/


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RiderRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // User information
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralCode: '',

    // Rider information
    fullName: '',
    nationalId: '',
    kraPin: '',
    vehicleType: 'MOTORCYCLE',
    vehicleRegistration: '',
    driverLicense: '',
    currentLocation: '',
    deliveryRadius: '10',

    // Payout
    payoutMethod: 'MPESA',
    mpesaNumber: '',
    pochiNumber: '',
    tillNumber: '',
    paybillNumber: '',
    paybillAccount: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const payload = {
      // User
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      referralCode: formData.referralCode || undefined,

      // Rider
      fullName: formData.fullName || formData.name,
      nationalId: formData.nationalId,
      kraPin: formData.kraPin || undefined,
      vehicleType: formData.vehicleType,
      vehicleRegistration: formData.vehicleRegistration,
      driverLicense: formData.driverLicense,
      currentLocation: {
        address: formData.currentLocation || ''
      },
      deliveryRadius: parseInt(formData.deliveryRadius),
      payoutMethod: formData.payoutMethod,
      payoutDetails: {
        mpesaNumber: formData.mpesaNumber || formData.phoneNumber,
        pochiNumber: formData.pochiNumber,
        tillNumber: formData.tillNumber,
        paybillNumber: formData.paybillNumber,
        paybillAccount: formData.paybillAccount
      }
    };

    try {
      const response = await fetch('/api/shd-api/api/riders/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Rider registration successful!");
        router.push("/rider/dashboard");
      } else {
        setError(data.error || "Rider registration failed");
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-surface">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/register" 
              className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Registration
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-secondary">
              🏍️ Register as a Rider
            </h1>
            <p className="mt-2 text-muted">
              Join our delivery team and start earning today on Shaddyna
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Details */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-secondary mb-4">
                Account Information
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="referralCode"
                  placeholder="Referral Code (Optional)"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
              </div>
            </div>

            {/* Rider Information */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-secondary mb-4">
                Rider Information
              </h2>
              <div className="space-y-4">
                <input
                  name="fullName"
                  placeholder="Full Name (if different from above)"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="nationalId"
                  placeholder="National ID"
                  required
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="kraPin"
                  placeholder="KRA PIN (Optional)"
                  value={formData.kraPin}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                >
                  <option value="MOTORCYCLE">🏍️ Motorcycle</option>
                  <option value="BICYCLE">🚲 Bicycle</option>
                  <option value="CAR">🚗 Car</option>
                  <option value="VAN">🚐 Van</option>
                </select>
                <input
                  name="vehicleRegistration"
                  placeholder="Vehicle Registration Number"
                  required
                  value={formData.vehicleRegistration}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="driverLicense"
                  placeholder="Driver License Number"
                  required
                  value={formData.driverLicense}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="currentLocation"
                  placeholder="Current Location/Base Address"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="deliveryRadius"
                  placeholder="Delivery Radius (km)"
                  type="number"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-secondary mb-4">
                Payment Details
              </h2>

              <select
                name="payoutMethod"
                value={formData.payoutMethod}
                onChange={handleChange}
                className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
              >
                <option value="MPESA">M-Pesa</option>
                <option value="POCHI">Pochi</option>
                <option value="TILL">Till Number</option>
                <option value="PAYBILL">PayBill</option>
              </select>

              {formData.payoutMethod === "MPESA" && (
                <input
                  name="mpesaNumber"
                  placeholder="M-Pesa Number"
                  value={formData.mpesaNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted mt-3"
                />
              )}

              {formData.payoutMethod === "POCHI" && (
                <input
                  name="pochiNumber"
                  placeholder="Pochi Number"
                  value={formData.pochiNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted mt-3"
                />
              )}

              {formData.payoutMethod === "TILL" && (
                <input
                  name="tillNumber"
                  placeholder="Till Number"
                  value={formData.tillNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted mt-3"
                />
              )}

              {formData.payoutMethod === "PAYBILL" && (
                <div className="space-y-3 mt-3">
                  <input
                    name="paybillNumber"
                    placeholder="PayBill Number"
                    value={formData.paybillNumber}
                    onChange={handleChange}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                  <input
                    name="paybillAccount"
                    placeholder="Account Number"
                    value={formData.paybillAccount}
                    onChange={handleChange}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-accent-dark hover:bg-accent-dark/80 disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                'Register as Rider'
              )}
            </button>

            {/* Footer Links */}
            <div className="text-center space-y-4 pt-4 border-t border-surface">
              <Link 
                href="/login" 
                className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium block"
              >
                Already have an account? Login →
              </Link>

              <div className="pt-4">
                <p className="text-sm text-muted mb-3">
                  Want to sell on Shaddyna?
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/vendor/register"
                    className="inline-flex items-center gap-2 bg-blue-50 text-primary hover:bg-blue-100 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border border-blue-200"
                  >
                    🏪 Register Your Shop
                  </Link>
                  <span className="text-muted">or</span>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border border-green-200"
                  >
                    👤 Register as Customer
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}