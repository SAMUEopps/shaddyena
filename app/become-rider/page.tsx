'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
  Bike,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  Car,
  Clock,
  TrendingUp,
  Shield,
  Users,
  Truck,
  CreditCard,
  Award,
  Star,
  DollarSign,
  Navigation,
  Calendar,
  BarChart3,
  HeartHandshake,
  ChevronRight,
  FileText,
  IdCard,
  AlertTriangle
} from 'lucide-react';

// Vehicle types for riders
const vehicleTypes: { id: string; name: string; icon: any; description: string; requirements: string }[] = [
  { 
    id: 'motorcycle', 
    name: 'Motorcycle', 
    icon: Bike, 
    description: 'Perfect for fast deliveries in urban areas',
    requirements: 'Valid motorcycle license, helmet, reflective jacket'
  },
  { 
    id: 'bicycle', 
    name: 'Bicycle', 
    icon: Bike, 
    description: 'Eco-friendly option for short distances',
    requirements: 'Bicycle, safety helmet, reflective gear'
  },
  { 
    id: 'car', 
    name: 'Car', 
    icon: Car, 
    description: 'Ideal for larger packages and bulk orders',
    requirements: 'Valid driving license, insurance, vehicle registration'
  },
  { 
    id: 'truck', 
    name: 'Truck/Van', 
    icon: Truck, 
    description: 'For heavy goods and large deliveries',
    requirements: 'Commercial license, insurance, vehicle registration'
  },
];

// Benefits of becoming a rider
const riderBenefits = [
  {
    icon: TrendingUp,
    title: 'Earn Competitive Rates',
    description: 'Get paid per delivery with bonus incentives',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    icon: Clock,
    title: 'Flexible Schedule',
    description: 'Work when you want, no fixed hours',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    icon: Shield,
    title: 'Insurance Coverage',
    description: 'Comprehensive insurance for all deliveries',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    icon: DollarSign,
    title: 'Daily Payouts',
    description: 'Get paid daily via M-Pesa',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join a community of professional riders',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20'
  },
  {
    icon: BarChart3,
    title: 'Performance Bonuses',
    description: 'Earn bonuses for excellent service',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20'
  },
];

// Requirements for riders
const requirements = [
  {
    icon: IdCard,
    title: 'Valid ID',
    description: 'National ID or Passport',
  },
  {
    icon: FileText,
    title: 'License',
    description: 'Valid driving/rider license',
  },
  {
    icon: Phone,
    title: 'Smartphone',
    description: 'Android or iOS smartphone',
  },
  {
    icon: MapPin,
    title: 'Location',
    description: 'Valid address in service area',
  },
];

interface FormData {
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
}

export default function BecomeRiderPage() {
  const router = useRouter();
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    vehicleType: '',
    vehicleModel: '',
    vehiclePlate: '',
    idNumber: '',
    licenseNumber: '',
    location: '',
    emergencyContact: '',
    emergencyPhone: '',
    experienceYears: '',
    availability: 'full-time',
    referralCode: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Check if user is already a rider
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'delivery') {
        router.push('/delivery/dashboard');
      }
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setFormData((prev) => ({
      ...prev,
      vehicleType: vehicleTypes.find(v => v.id === vehicleId)?.name || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/become-rider', {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel,
        vehiclePlate: formData.vehiclePlate,
        idNumber: formData.idNumber,
        licenseNumber: formData.licenseNumber,
        location: formData.location,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        experienceYears: formData.experienceYears,
        availability: formData.availability,
        referralCode: formData.referralCode,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        await refreshUser();
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/delivery/dashboard');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
        <div className="max-w-md w-full bg-[var(--color-surface)] rounded-2xl shadow-xl p-8 text-center border border-[var(--color-border)]">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
            Application Submitted!
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            Thank you for applying to become a rider. Our team will review your application and get back to you within 24-48 hours.
          </p>
          <div className="bg-[var(--color-primary-soft)]/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-[var(--color-text)]">
              <strong>Next steps:</strong> Check your email for verification and onboarding instructions. You'll receive a call from our team to schedule training.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-alt)] to-[var(--color-primary-soft)] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10">
          <Bike className="w-full h-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Bike className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Become a Rider</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Join Our Delivery Fleet
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Be part of Kenya's fastest-growing delivery network. Flexible hours, competitive pay, and great benefits.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden">
              <div className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                  Rider Application
                </h2>
                <p className="text-[var(--color-text-muted)] mb-6">
                  Fill out the form below to join our delivery team
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                      <User className="w-5 h-5 text-[var(--color-primary)]" />
                      Personal Information
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                          <input
                            type="tel"
                            name="phoneNumber"
                            required
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                            placeholder="07XXXXXXXX"
                            pattern="[0-9]{10}"
                            maxLength={10}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          ID Number *
                        </label>
                        <input
                          type="text"
                          name="idNumber"
                          required
                          value={formData.idNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                          placeholder="National ID Number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-[var(--color-primary)]" />
                      Vehicle Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                        Vehicle Type *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {vehicleTypes.map((vehicle) => {
                          const Icon = vehicle.icon;
                          const isSelected = selectedVehicle === vehicle.id;
                          return (
                            <button
                              key={vehicle.id}
                              type="button"
                              onClick={() => handleVehicleSelect(vehicle.id)}
                              className={`p-3 rounded-xl border-2 transition-all text-center ${
                                isSelected
                                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/20'
                                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 bg-[var(--color-background)]'
                              }`}
                            >
                              <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`} />
                              <p className={`text-sm font-medium ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                                {vehicle.name}
                              </p>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                {vehicle.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                      {selectedVehicle && (
                        <div className="mt-3 p-3 bg-[var(--color-primary-soft)]/10 rounded-lg">
                          <p className="text-xs text-[var(--color-text-muted)]">
                            <strong>Requirements:</strong> {vehicleTypes.find(v => v.id === selectedVehicle)?.requirements}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Vehicle Model *
                        </label>
                        <input
                          type="text"
                          name="vehicleModel"
                          required
                          value={formData.vehicleModel}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                          placeholder="e.g., Honda CB150, Toyota Probox"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          License/Plate Number *
                        </label>
                        <input
                          type="text"
                          name="vehiclePlate"
                          required
                          value={formData.vehiclePlate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                          placeholder="Kxx 000X"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Driver's License Number *
                        </label>
                        <input
                          type="text"
                          name="licenseNumber"
                          required
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                          placeholder="License Number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Years of Experience
                        </label>
                        <select
                          name="experienceYears"
                          value={formData.experienceYears}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                        >
                          <option value="">Select experience</option>
                          <option value="0-1">0-1 year</option>
                          <option value="1-3">1-3 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5+">5+ years</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Location & Availability */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                      Location & Availability
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Base Location *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                          <input
                            type="text"
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                            placeholder="City, Area"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Availability *
                        </label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                        >
                          <option value="full-time">Full Time (40+ hrs/week)</option>
                          <option value="part-time">Part Time (20-30 hrs/week)</option>
                          <option value="weekend">Weekends Only</option>
                          <option value="evening">Evenings Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-[var(--color-primary)]" />
                      Emergency Contact
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Contact Name *
                        </label>
                        <input
                          type="text"
                          name="emergencyContact"
                          required
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                          placeholder="Emergency contact name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Emergency Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                          <input
                            type="tel"
                            name="emergencyPhone"
                            required
                            value={formData.emergencyPhone}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                            placeholder="07XXXXXXXX"
                            pattern="[0-9]{10}"
                            maxLength={10}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Referral Code */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Referral Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="Enter referral code if you have one"
                    />
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Get a bonus when you join using a referral code
                    </p>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[var(--color-primary)] rounded border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                    />
                    <label htmlFor="terms" className="text-sm text-[var(--color-text-muted)]">
                      I confirm that the information provided is accurate and I agree to the{' '}
                      <a href="/terms" className="text-[var(--color-primary)] hover:underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-[var(--color-primary)] hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Bike className="w-5 h-5" />
                        Become a Rider
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar - Benefits Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Requirements Card */}
              <div className="bg-gradient-to-br from-[var(--color-primary-soft)]/10 to-[var(--color-primary)]/5 rounded-2xl p-6 border border-[var(--color-border)]">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-[var(--color-primary)]" />
                  <h3 className="text-xl font-bold text-[var(--color-text)]">
                    Requirements
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {requirements.map((req, index) => {
                    const Icon = req.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[var(--color-primary-soft)]/20 flex-shrink-0">
                          <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[var(--color-text)] text-sm">
                            {req.title}
                          </h4>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {req.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Benefits Card */}
              <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-[var(--color-primary)]" />
                  <h3 className="text-xl font-bold text-[var(--color-text)]">
                    Rider Benefits
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {riderBenefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${benefit.bgColor} flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${benefit.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[var(--color-text)] text-sm">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Earnings Potential Card */}
              <div className="bg-[var(--color-primary-soft)]/10 rounded-2xl p-6 border border-[var(--color-border)] text-center">
                <DollarSign className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-3" />
                <h3 className="font-semibold text-[var(--color-text)] mb-2">
                  Earnings Potential
                </h3>
                <p className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                  KES 500 - 2,000
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  per day + bonuses
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span>Top earners make KES 50K+/month</span>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] text-center">
                <HeartHandshake className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-3" />
                <h3 className="font-semibold text-[var(--color-text)] mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  Have questions about becoming a rider? Our team is here to help.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors text-sm font-medium"
                >
                  Contact Support
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}