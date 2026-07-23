// C:\Users\USER\Desktop\Projects\my-app\app\my-bookings\page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Booking {
  _id: string;
  bookingReference: string;
  eventId: {
    _id: string;
    title: string;
    venue: string;
    startDate: string;
    startTime: string;
  };
  numberOfTickets: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch('/api/events/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">🎫 My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-4xl mb-4">🎫</p>
            <p className="text-gray-500 mb-4">You haven't booked any events yet</p>
            <Link href="/events" className="text-blue-600 hover:underline">
              Browse Events →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-wrap items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{booking.eventId?.title || 'Event'}</h3>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(booking.eventId?.startDate).toLocaleDateString()} at {booking.eventId?.startTime}
                    </p>
                    <p className="text-sm text-gray-600">📍 {booking.eventId?.venue}</p>
                    <p className="text-sm">
                      🎫 {booking.numberOfTickets} tickets · KSh {booking.totalAmount}
                    </p>
                    <p className="text-xs text-gray-500">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">#{booking.bookingReference}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}