/*'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Shop {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  productCount: number;
  totalEarned: number;
  createdAt: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops');
      const data = await response.json();
      setShops(data.shops || []);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.businessLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">🏪 All Shops</h1>
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {filteredShops.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? 'No shops match your search' : 'No shops registered yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <Link
              key={shop._id}
              href={`/shops/${shop._id}`}
              className="block border rounded-lg shadow hover:shadow-lg transition p-6 hover:border-blue-400"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-4xl">🏪</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold truncate">{shop.businessName}</h3>
                  <p className="text-gray-600 text-sm">👤 {shop.ownerName}</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm">📍 {shop.businessLocation}</p>
              <p className="text-gray-600 text-sm">📱 {shop.phoneNumber}</p>
              
              <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                <span className="text-gray-600">
                  📦 {shop.productCount} products
                </span>
                <span className="text-green-600 font-semibold">
                  KSh {shop.totalEarned?.toLocaleString() || 0}
                </span>
              </div>
              
              <div className="mt-3 text-center text-blue-600 text-sm font-medium">
                View Shop →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}*/


/*'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Shop {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  productCount: number;
  totalEarned: number;
  createdAt: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops');
      const data = await response.json();
      setShops(data.shops || []);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.businessLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        {/* Header Section *
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-secondary">
            🏪 All Shops
          </h1>
          <div className="w-full sm:w-auto flex-1 max-w-full sm:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-surface bg-white rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Results Info *
        {filteredShops.length > 0 && (
          <p className="text-muted text-sm mb-6">
            Showing {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        )}

        {/* Shops Grid *
        {filteredShops.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="text-6xl mb-4">
              {searchTerm ? '🔍' : '🏪'}
            </div>
            <p className="text-muted text-lg">
              {searchTerm ? 'No shops match your search' : 'No shops registered yet'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary hover:text-accent-dark font-medium transition-colors duration-200"
              >
                Clear search →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredShops.map((shop) => (
              <Link
                key={shop._id}
                href={`/shops/${shop._id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 sm:p-6 border border-surface hover:border-primary/20"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    🏪
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-secondary group-hover:text-primary transition-colors duration-200 truncate">
                      {shop.businessName}
                    </h3>
                    <p className="text-muted text-sm flex items-center gap-1.5 mt-0.5">
                      <span>👤</span> {shop.ownerName}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 mt-3">
                  <p className="text-muted text-sm flex items-center gap-1.5">
                    <span>📍</span> {shop.businessLocation}
                  </p>
                  <p className="text-muted text-sm flex items-center gap-1.5">
                    <span>📱</span> {shop.phoneNumber}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-surface flex flex-wrap items-center justify-between gap-2">
                  <span className="text-muted text-sm">
                    📦 {shop.productCount} product{shop.productCount !== 1 ? 's' : ''}
                  </span>
                  <span className="text-primary font-bold">
                    KSh {shop.totalEarned?.toLocaleString() || 0}
                  </span>
                </div>

                <div className="mt-4 text-center text-primary group-hover:text-accent-dark font-medium text-sm transition-colors duration-200">
                  View Shop →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}*/

// app/shops/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Shop {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  profileImage?: string;
  coverImage?: string;
  productCount: number;
  totalEarned: number;
  createdAt: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops');
      const data = await response.json();
      setShops(data.shops || []);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.businessLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-secondary">
            🏪 All Shops
          </h1>
          <div className="w-full sm:w-auto flex-1 max-w-full sm:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-surface bg-white rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {filteredShops.length > 0 && (
          <p className="text-muted text-sm mb-6">
            Showing {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        )}

        {/* Shops Grid */}
        {filteredShops.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="text-6xl mb-4">
              {searchTerm ? '🔍' : '🏪'}
            </div>
            <p className="text-muted text-lg">
              {searchTerm ? 'No shops match your search' : 'No shops registered yet'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary hover:text-accent-dark font-medium transition-colors duration-200"
              >
                Clear search →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredShops.map((shop) => (
              <Link
                key={shop._id}
                href={`/shops/${shop._id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface hover:border-primary/20"
              >
                {/* Shop Cover Image */}
                <div className="relative h-32 sm:h-40 bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden">
                  {shop.coverImage ? (
                    <Image
                      src={shop.coverImage}
                      alt={shop.businessName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🏪
                    </div>
                  )}
                  
                  {/* Profile Image Overlay */}
                  <div className="absolute -bottom-8 left-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden">
                      {shop.profileImage ? (
                        <Image
                          src={shop.profileImage}
                          alt={shop.businessName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🏪
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shop Info */}
                <div className="pt-10 pb-4 px-4 sm:px-5">
                  <h3 className="text-base sm:text-lg font-bold text-secondary group-hover:text-primary transition-colors duration-200 truncate">
                    {shop.businessName}
                  </h3>
                  
                  <div className="space-y-1 mt-2">
                    <p className="text-muted text-sm flex items-center gap-1.5">
                      <span>👤</span> {shop.ownerName}
                    </p>
                    <p className="text-muted text-sm flex items-center gap-1.5 truncate">
                      <span>📍</span> {shop.businessLocation}
                    </p>
                    <p className="text-muted text-sm flex items-center gap-1.5">
                      <span>📱</span> {shop.phoneNumber}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface flex flex-wrap items-center justify-between gap-2">
                    <span className="text-muted text-sm">
                      📦 {shop.productCount} product{shop.productCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-primary font-bold text-sm">
                      KSh {shop.totalEarned?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}