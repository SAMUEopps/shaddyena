// C:\Users\USER\Desktop\Projects\my-app\app\events\[id]\page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  address: string;
  city: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  organizer: string;
  organizerEmail: string;
  organizerPhone: string;
  tags: string[];
  highlights: string[];
  requirements: string[];
  whatsIncluded: string[];
  featured: boolean;
}

export default function EventDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    numberOfTickets: 1,
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    specialRequests: ''
  });

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();
      setEvent(data.event);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book this event');
      router.push('/login');
      return;
    }

    if (!event) return;

    try {
      const response = await fetch('/api/events/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId: event._id,
          numberOfTickets: bookingData.numberOfTickets,
          attendeeDetails: [{
            name: bookingData.attendeeName,
            email: bookingData.attendeeEmail,
            phone: bookingData.attendeePhone
          }],
          specialRequests: bookingData.specialRequests
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Booking successful! Check your email for confirmation.');
        router.push('/my-bookings');
      } else {
        alert(data.error || 'Failed to book event');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/events" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Event Header *
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <p className="opacity-90">{event.category}</p>
              </div>
              {event.featured && (
                <span className="bg-amber-500 px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Details *
              <div>
                <h2 className="text-xl font-bold mb-4">Event Details</h2>
                
                <div className="space-y-3">
                  <p><strong>📅 Date:</strong> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
                  <p><strong>🕐 Time:</strong> {event.startTime} - {event.endTime}</p>
                  <p><strong>📍 Location:</strong> {event.venue}</p>
                  <p><strong>🏙️ City:</strong> {event.city}</p>
                  <p><strong>📝 Address:</strong> {event.address}</p>
                  <p><strong>👤 Organizer:</strong> {event.organizer}</p>
                  <p><strong>📧 Email:</strong> {event.organizerEmail}</p>
                  <p><strong>📱 Phone:</strong> {event.organizerPhone}</p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>

                {event.highlights.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">✨ Highlights</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {event.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.whatsIncluded.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">✅ What's Included</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {event.whatsIncluded.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">📋 Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {event.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Form *
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Book This Event</h2>
                
                <div className="mb-4">
                  <p className="text-2xl font-bold text-blue-600">KSh {event.price}</p>
                  <p className="text-sm text-gray-500">
                    {event.availableSlots} slots available
                  </p>
                </div>

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Tickets *
                    </label>
                    <select
                      name="numberOfTickets"
                      value={bookingData.numberOfTickets}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2"
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="attendeeName"
                      value={bookingData.attendeeName}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="attendeeEmail"
                      value={bookingData.attendeeEmail}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="attendeePhone"
                      value={bookingData.attendeePhone}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={handleChange}
                      rows={2}
                      className="w-full border rounded-lg p-2"
                      placeholder="Any special requirements?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={event.availableSlots === 0}
                    className={`w-full py-3 rounded-lg font-semibold ${
                      event.availableSlots > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {event.availableSlots > 0 ? '💰 Book Now' : 'Sold Out'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    You'll receive a confirmation email after booking
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/

/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  address: string;
  city: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  organizer: string;
  organizerEmail: string;
  organizerPhone: string;
  tags: string[];
  highlights: string[];
  requirements: string[];
  whatsIncluded: string[];
  featured: boolean;
}

// Fix: params is now a Promise in Next.js 15
export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    numberOfTickets: 1,
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    specialRequests: ''
  });

  // Unwrap params using React.use()
  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setEventId(unwrappedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      setEvent(data.event);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book this event');
      router.push('/login');
      return;
    }

    if (!event) return;

    try {
      const response = await fetch('/api/events/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId: event._id,
          numberOfTickets: bookingData.numberOfTickets,
          attendeeDetails: [{
            name: bookingData.attendeeName,
            email: bookingData.attendeeEmail,
            phone: bookingData.attendeePhone
          }],
          specialRequests: bookingData.specialRequests
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Booking successful! Check your email for confirmation.');
        router.push('/my-bookings');
      } else {
        alert(data.error || 'Failed to book event');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/events" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Event Header *
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <p className="opacity-90">{event.category}</p>
              </div>
              {event.featured && (
                <span className="bg-amber-500 px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Details *
              <div>
                <h2 className="text-xl font-bold mb-4">Event Details</h2>
                
                <div className="space-y-3">
                  <p><strong>📅 Date:</strong> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
                  <p><strong>🕐 Time:</strong> {event.startTime} - {event.endTime}</p>
                  <p><strong>📍 Location:</strong> {event.venue}</p>
                  <p><strong>🏙️ City:</strong> {event.city}</p>
                  <p><strong>📝 Address:</strong> {event.address}</p>
                  <p><strong>👤 Organizer:</strong> {event.organizer}</p>
                  <p><strong>📧 Email:</strong> {event.organizerEmail}</p>
                  <p><strong>📱 Phone:</strong> {event.organizerPhone}</p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>

                {event.highlights.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">✨ Highlights</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {event.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.whatsIncluded.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">✅ What's Included</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {event.whatsIncluded.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">📋 Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {event.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Form *
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Book This Event</h2>
                
                <div className="mb-4">
                  <p className="text-2xl font-bold text-blue-600">KSh {event.price}</p>
                  <p className="text-sm text-gray-500">
                    {event.availableSlots} slots available
                  </p>
                </div>

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Tickets *
                    </label>
                    <select
                      name="numberOfTickets"
                      value={bookingData.numberOfTickets}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2"
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="attendeeName"
                      value={bookingData.attendeeName}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="attendeeEmail"
                      value={bookingData.attendeeEmail}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="attendeePhone"
                      value={bookingData.attendeePhone}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={handleChange}
                      rows={2}
                      className="w-full border rounded-lg p-2"
                      placeholder="Any special requirements?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={event.availableSlots === 0}
                    className={`w-full py-3 rounded-lg font-semibold ${
                      event.availableSlots > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {event.availableSlots > 0 ? '💰 Book Now' : 'Sold Out'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    You'll receive a confirmation email after booking
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/


/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  address: string;
  city: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  organizer: string;
  organizerEmail: string;
  organizerPhone: string;
  tags: string[];
  highlights: string[];
  requirements: string[];
  whatsIncluded: string[];
  featured: boolean;
}

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    numberOfTickets: 1,
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setEventId(unwrappedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      setEvent(data.event);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setMessage(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', text: 'Please login to book this event' });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      setBookingLoading(false);
      return;
    }

    if (!event) return;

    try {
      const response = await fetch('/api/events/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId: event._id,
          numberOfTickets: bookingData.numberOfTickets,
          attendeeDetails: [{
            name: bookingData.attendeeName,
            email: bookingData.attendeeEmail,
            phone: bookingData.attendeePhone
          }],
          specialRequests: bookingData.specialRequests
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Booking successful! Check your email for confirmation.' });
        setTimeout(() => {
          router.push('/my-bookings');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to book event' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      workshop: '🔧',
      seminar: '🎓',
      conference: '🏛️',
      networking: '🤝',
      training: '📚',
      other: '📌'
    };
    return emojis[category] || '📌';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      workshop: 'bg-blue-100 text-blue-700',
      seminar: 'bg-purple-100 text-purple-700',
      conference: 'bg-amber-100 text-amber-700',
      networking: 'bg-green-100 text-green-700',
      training: 'bg-indigo-100 text-indigo-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-secondary mb-2">Event not found</h2>
          <p className="text-muted mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/events" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button *
        <Link 
          href="/events" 
          className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>

        {/* Event Card *
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface">
          {/* Event Header *
          <div className="bg-gradient-to-r from-secondary to-secondary/80 p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {getCategoryEmoji(event.category)} {event.category}
                  </span>
                  {event.featured && (
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                  {event.title}
                </h1>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center min-w-[100px]">
                <p className="text-sm opacity-75">Price</p>
                <p className="text-xl sm:text-2xl font-bold">KSh {event.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Event Content *
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event Details - Left Column *
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Description *
                  <div>
                    <h2 className="text-lg font-bold text-secondary mb-3">About This Event</h2>
                    <p className="text-muted leading-relaxed">{event.description}</p>
                  </div>

                  {/* Details Grid *
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface/30 rounded-xl border border-surface">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="text-xs text-muted">Date</p>
                        <p className="font-medium text-secondary">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} - {new Date(event.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🕐</span>
                      <div>
                        <p className="text-xs text-muted">Time</p>
                        <p className="font-medium text-secondary">{event.startTime} - {event.endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-muted">Venue</p>
                        <p className="font-medium text-secondary">{event.venue}</p>
                        <p className="text-xs text-muted">{event.address}, {event.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <p className="text-xs text-muted">Organizer</p>
                        <p className="font-medium text-secondary">{event.organizer}</p>
                        <p className="text-xs text-muted">{event.organizerEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights *
                  {event.highlights.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">✨</span>
                        Highlights
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {event.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <span className="text-primary mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What's Included *
                  {event.whatsIncluded.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">✅</span>
                        What's Included
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {event.whatsIncluded.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <span className="text-green-500 mt-1">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements *
                  {event.requirements.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">📋</span>
                        Requirements
                      </h3>
                      <ul className="space-y-1">
                        {event.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <span className="text-amber-500 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags *
                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="bg-surface/50 px-3 py-1 rounded-full text-xs text-muted border border-surface">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Form - Right Column *
              <div className="lg:col-span-1">
                <div className="bg-surface/30 rounded-2xl p-6 border border-surface sticky top-24">
                  <h2 className="text-xl font-bold text-secondary mb-4">Book This Event</h2>
                  
                  <div className="mb-6">
                    <p className="text-3xl font-black text-primary">
                      KSh {event.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-medium ${
                        event.availableSlots > 0 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {event.availableSlots > 0 
                          ? `✅ ${event.availableSlots} slots available` 
                          : '❌ Sold Out'}
                      </span>
                    </div>
                  </div>

                  {/* Messages *
                  {message && (
                    <div className={`mb-4 p-3 rounded-xl border ${
                      message.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{message.type === 'success' ? '✅' : '❌'}</span>
                        <span>{message.text}</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Number of Tickets *
                      </label>
                      <select
                        name="numberOfTickets"
                        value={bookingData.numberOfTickets}
                        onChange={handleChange}
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="attendeeName"
                        value={bookingData.attendeeName}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="attendeeEmail"
                        value={bookingData.attendeeEmail}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="attendeePhone"
                        value={bookingData.attendeePhone}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        placeholder="254712345678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={handleChange}
                        rows={2}
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                        placeholder="Any special requirements?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={event.availableSlots === 0 || bookingLoading}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${
                        event.availableSlots > 0 && !bookingLoading
                          ? 'bg-primary hover:bg-accent-dark text-white'
                          : 'bg-muted/30 text-muted cursor-not-allowed'
                      }`}
                    >
                      {bookingLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : event.availableSlots > 0 ? (
                        '💰 Book Now'
                      ) : (
                        'Sold Out'
                      )}
                    </button>

                    <p className="text-xs text-muted text-center">
                      You'll receive a confirmation email after booking
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/


/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TicketType {
  name: string;
  price: number;
  description?: string;
  capacity?: number;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  address: string;
  city: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  ticketTypes: TicketType[];
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  organizer: string;
  organizerEmail: string;
  organizerPhone: string;
  tags: string[];
  highlights: string[];
  requirements: string[];
  whatsIncluded: string[];
  featured: boolean;
}

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [bookingData, setBookingData] = useState({
    numberOfTickets: 1,
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setEventId(unwrappedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      setEvent(data.event);
      // Auto-select first ticket type
      if (data.event?.ticketTypes?.length > 0) {
        setSelectedTicketType(data.event.ticketTypes[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedTicketPrice = () => {
    if (!event || !selectedTicketType) return 0;
    const ticket = event.ticketTypes.find(t => t.name === selectedTicketType);
    return ticket?.price || 0;
  };

  const getTotalAmount = () => {
    return getSelectedTicketPrice() * bookingData.numberOfTickets;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setMessage(null);

    if (!selectedTicketType) {
      setMessage({ type: 'error', text: 'Please select a ticket type' });
      setBookingLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', text: 'Please login to book this event' });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      setBookingLoading(false);
      return;
    }

    if (!event) return;

    try {
      const response = await fetch('/api/events/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId: event._id,
          ticketType: selectedTicketType,
          numberOfTickets: bookingData.numberOfTickets,
          attendeeDetails: [{
            name: bookingData.attendeeName,
            email: bookingData.attendeeEmail,
            phone: bookingData.attendeePhone
          }],
          specialRequests: bookingData.specialRequests
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Booking successful! Check your email for confirmation.' });
        setTimeout(() => {
          router.push('/my-bookings');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to book event' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      workshop: '🔧',
      seminar: '🎓',
      conference: '🏛️',
      networking: '🤝',
      training: '📚',
      other: '📌'
    };
    return emojis[category] || '📌';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      workshop: 'bg-blue-100 text-blue-700',
      seminar: 'bg-purple-100 text-purple-700',
      conference: 'bg-amber-100 text-amber-700',
      networking: 'bg-green-100 text-green-700',
      training: 'bg-indigo-100 text-indigo-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-secondary mb-2">Event not found</h2>
          <p className="text-muted mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/events" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button *
        <Link 
          href="/events" 
          className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>

        {/* Event Card *
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface">
          {/* Event Header *
          <div className="bg-gradient-to-r from-secondary to-secondary/80 p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {getCategoryEmoji(event.category)} {event.category}
                  </span>
                  {event.featured && (
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                  {event.title}
                </h1>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center min-w-[120px]">
                <p className="text-sm opacity-75">Starting from</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {event.ticketTypes && event.ticketTypes.length > 0 
                    ? `KSh ${Math.min(...event.ticketTypes.map(t => t.price)).toLocaleString()}`
                    : 'Free'}
                </p>
              </div>
            </div>
          </div>

          {/* Event Content *
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event Details - Left Column *
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Description *
                  <div>
                    <h2 className="text-lg font-bold text-secondary mb-3">About This Event</h2>
                    <p className="text-muted leading-relaxed">{event.description}</p>
                  </div>

                  {/* Ticket Types Display *
                  {event.ticketTypes && event.ticketTypes.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">🎫</span>
                        Available Ticket Types
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.ticketTypes.map((ticket, index) => (
                          <div key={index} className="bg-surface/30 border border-surface rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-secondary">{ticket.name}</h4>
                              <span className="text-primary font-black text-lg">
                                KSh {ticket.price.toLocaleString()}
                              </span>
                            </div>
                            {ticket.description && (
                              <p className="text-xs text-muted">{ticket.description}</p>
                            )}
                            {ticket.capacity && (
                              <p className="text-xs text-muted mt-1">
                                Limit: {ticket.capacity} tickets
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details Grid *
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface/30 rounded-xl border border-surface">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="text-xs text-muted">Date</p>
                        <p className="font-medium text-secondary">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} - {new Date(event.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🕐</span>
                      <div>
                        <p className="text-xs text-muted">Time</p>
                        <p className="font-medium text-secondary">{event.startTime} - {event.endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-muted">Venue</p>
                        <p className="font-medium text-secondary">{event.venue}</p>
                        <p className="text-xs text-muted">{event.address}, {event.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <p className="text-xs text-muted">Organizer</p>
                        <p className="font-medium text-secondary">{event.organizer}</p>
                        <p className="text-xs text-muted">{event.organizerEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights *
                  {event.highlights.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">✨</span>
                        Highlights
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {event.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <span className="text-primary mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What's Included *
                  {event.whatsIncluded.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">✅</span>
                        What's Included
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {event.whatsIncluded.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <span className="text-green-500 mt-1">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements *
                  {event.requirements.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">📋</span>
                        Requirements
                      </h3>
                      <ul className="space-y-1">
                        {event.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <span className="text-amber-500 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags *
                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="bg-surface/50 px-3 py-1 rounded-full text-xs text-muted border border-surface">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Form - Right Column *
              <div className="lg:col-span-1">
                <div className="bg-surface/30 rounded-2xl p-6 border border-surface sticky top-24">
                  <h2 className="text-xl font-bold text-secondary mb-4">Book This Event</h2>
                  
                  <div className="mb-6">
                    <p className="text-sm text-muted">Starting from</p>
                    <p className="text-3xl font-black text-primary">
                      {event.ticketTypes && event.ticketTypes.length > 0 
                        ? `KSh ${Math.min(...event.ticketTypes.map(t => t.price)).toLocaleString()}`
                        : 'Free'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-medium ${
                        event.availableSlots > 0 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {event.availableSlots > 0 
                          ? `✅ ${event.availableSlots} slots available` 
                          : '❌ Sold Out'}
                      </span>
                    </div>
                  </div>

                  {/* Messages *
                  {message && (
                    <div className={`mb-4 p-3 rounded-xl border ${
                      message.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{message.type === 'success' ? '✅' : '❌'}</span>
                        <span>{message.text}</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleBooking} className="space-y-4">
                    {/* Ticket Type Selection *
                    {event.ticketTypes && event.ticketTypes.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1.5">
                          Select Ticket Type *
                        </label>
                        <select
                          value={selectedTicketType}
                          onChange={(e) => setSelectedTicketType(e.target.value)}
                          className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                          required
                        >
                          {event.ticketTypes.map((ticket, index) => (
                            <option key={index} value={ticket.name}>
                              {ticket.name} - KSh {ticket.price.toLocaleString()}
                              {ticket.capacity ? ` (${ticket.capacity} available)` : ''}
                            </option>
                          ))}
                        </select>
                        {selectedTicketType && (
                          <div className="mt-2 p-2 bg-primary/5 rounded-lg">
                            <p className="text-sm font-medium text-primary">
                              Selected: {selectedTicketType} @ KSh {getSelectedTicketPrice().toLocaleString()} each
                            </p>
                            <p className="text-xs text-muted">
                              Total: KSh {getTotalAmount().toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Number of Tickets *
                      </label>
                      <select
                        name="numberOfTickets"
                        value={bookingData.numberOfTickets}
                        onChange={handleChange}
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="attendeeName"
                        value={bookingData.attendeeName}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="attendeeEmail"
                        value={bookingData.attendeeEmail}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="attendeePhone"
                        value={bookingData.attendeePhone}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        placeholder="254712345678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={handleChange}
                        rows={2}
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                        placeholder="Any special requirements?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={event.availableSlots === 0 || bookingLoading || !selectedTicketType}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${
                        event.availableSlots > 0 && !bookingLoading && selectedTicketType
                          ? 'bg-primary hover:bg-accent-dark text-white'
                          : 'bg-muted/30 text-muted cursor-not-allowed'
                      }`}
                    >
                      {bookingLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : event.availableSlots > 0 ? (
                        `💰 Book Now - KSh ${getTotalAmount().toLocaleString()}`
                      ) : (
                        'Sold Out'
                      )}
                    </button>

                    <p className="text-xs text-muted text-center">
                      You'll receive a confirmation email after booking
                    </p>
                  </form>
                </div>
              </div>
            </div>
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

interface TicketType {
  name: string;
  price: number;
  description?: string;
  capacity?: number;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  address: string;
  city: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  ticketTypes: TicketType[];
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  organizer: string;
  organizerEmail: string;
  organizerPhone: string;
  tags: string[];
  highlights: string[];
  requirements: string[];
  whatsIncluded: string[];
  featured: boolean;
}

interface BookingResponse {
  message: string;
  booking: {
    id: string;
    reference: string;
    ticketType: string;
    numberOfTickets: number;
    pricePerTicket: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
  };
  payment: {
    checkoutRequestId: string;
    merchantRequestId: string;
    message: string;
  };
}

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [bookingData, setBookingData] = useState({
    numberOfTickets: 1,
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'waiting' | 'complete'>('form');
  const [bookingReference, setBookingReference] = useState<string>('');

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setEventId(unwrappedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      setEvent(data.event);
      // Auto-select first ticket type
      if (data.event?.ticketTypes?.length > 0) {
        setSelectedTicketType(data.event.ticketTypes[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedTicketPrice = () => {
    if (!event || !selectedTicketType) return 0;
    const ticket = event.ticketTypes.find(t => t.name === selectedTicketType);
    return ticket?.price || 0;
  };

  const getTotalAmount = () => {
    return getSelectedTicketPrice() * bookingData.numberOfTickets;
  };

  const getAvailableTicketsForType = () => {
    if (!event || !selectedTicketType) return null;
    const ticket = event.ticketTypes.find(t => t.name === selectedTicketType);
    return ticket?.capacity || null;
  };

const handleBooking = async (e: React.FormEvent) => {
  e.preventDefault();
  setBookingLoading(true);
  setMessage(null);

  if (!selectedTicketType) {
    setMessage({ type: 'error', text: 'Please select a ticket type' });
    setBookingLoading(false);
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    setMessage({ type: 'error', text: 'Please login to book this event' });
    setTimeout(() => {
      router.push('/login');
    }, 1500);
    setBookingLoading(false);
    return;
  }

  if (!event) return;

  // Validate phone number - FIXED
  const cleanPhone = bookingData.attendeePhone.replace(/\s/g, '');
  
  // Check if phone is empty
  if (!cleanPhone) {
    setMessage({ type: 'error', text: 'Please enter your phone number' });
    setBookingLoading(false);
    return;
  }

  // Check if phone contains only numbers
  if (!/^\d+$/.test(cleanPhone)) {
    setMessage({ type: 'error', text: 'Please enter a valid phone number with only digits (e.g., 0712345678)' });
    setBookingLoading(false);
    return;
  }

  // Check length (Kenyan numbers are 10-12 digits including 0 or 254)
  if (cleanPhone.length < 10 || cleanPhone.length > 13) {
    setMessage({ type: 'error', text: 'Please enter a valid phone number (10-12 digits, e.g., 0712345678)' });
    setBookingLoading(false);
    return;
  }

  // Format phone number for M-Pesa
  let formattedPhoneForMpesa = cleanPhone;
  if (formattedPhoneForMpesa.startsWith('0')) {
    formattedPhoneForMpesa = `254${formattedPhoneForMpesa.substring(1)}`;
  } else if (formattedPhoneForMpesa.startsWith('254')) {
    // Already in correct format
    formattedPhoneForMpesa = cleanPhone;
  } else if (formattedPhoneForMpesa.startsWith('+254')) {
    formattedPhoneForMpesa = cleanPhone.substring(1);
  } else {
    // Assume it's a local number without country code
    formattedPhoneForMpesa = `254${cleanPhone}`;
  }

  // Final validation for M-Pesa format
  if (!formattedPhoneForMpesa.startsWith('254') || formattedPhoneForMpesa.length !== 12) {
    setMessage({ 
      type: 'error', 
      text: 'Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)' 
    });
    setBookingLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/events/book', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventId: event._id,
        ticketType: selectedTicketType,
        numberOfTickets: bookingData.numberOfTickets,
        attendeeDetails: [{
          name: bookingData.attendeeName,
          email: bookingData.attendeeEmail,
          phone: formattedPhoneForMpesa // Send formatted number for M-Pesa
        }],
        specialRequests: bookingData.specialRequests,
        phoneNumber: formattedPhoneForMpesa // M-Pesa phone number
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Payment initiated successfully
      const bookingData = data as BookingResponse;
      setBookingReference(bookingData.booking.reference);
      setPaymentStep('waiting');
      setMessage({ 
        type: 'info', 
        text: '📱 M-Pesa payment initiated! Please check your phone and enter your PIN to complete payment.' 
      });
      
      // Start polling for payment status
      pollPaymentStatus(bookingData.payment.checkoutRequestId);
    } else {
      setMessage({ type: 'error', text: data.error || 'Failed to book event' });
      setPaymentStep('form');
    }
  } catch (error: any) {
    setMessage({ type: 'error', text: error.message || 'An error occurred. Please try again.' });
    setPaymentStep('form');
  } finally {
    setBookingLoading(false);
  }
};
  const pollPaymentStatus = async (checkoutRequestId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max
    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/payments/status?checkoutRequestId=${checkoutRequestId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.status === 'completed') {
          clearInterval(interval);
          setPaymentStep('complete');
          setMessage({ 
            type: 'success', 
            text: '✅ Payment successful! Your booking has been confirmed. Check your email for details.' 
          });
          setTimeout(() => {
            router.push('/my-bookings');
          }, 3000);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setPaymentStep('form');
          setMessage({ 
            type: 'error', 
            text: '❌ Payment failed. Please try again.' 
          });
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPaymentStep('form');
        setMessage({ 
          type: 'error', 
          text: '⏰ Payment timeout. Please check your booking status in My Bookings.' 
        });
      }
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      workshop: '🔧',
      seminar: '🎓',
      conference: '🏛️',
      networking: '🤝',
      training: '📚',
      other: '📌'
    };
    return emojis[category] || '📌';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      workshop: 'bg-blue-100 text-blue-700',
      seminar: 'bg-purple-100 text-purple-700',
      conference: 'bg-amber-100 text-amber-700',
      networking: 'bg-green-100 text-green-700',
      training: 'bg-indigo-100 text-indigo-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-secondary mb-2">Event not found</h2>
          <p className="text-muted mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/events" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/events" 
          className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>

        {/* Event Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface">
          {/* Event Header */}
          <div className="bg-gradient-to-r from-secondary to-secondary/80 p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {getCategoryEmoji(event.category)} {event.category}
                  </span>
                  {event.featured && (
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                  {event.title}
                </h1>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center min-w-[120px]">
                <p className="text-sm opacity-75">Starting from</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {event.ticketTypes && event.ticketTypes.length > 0 
                    ? `KSh ${Math.min(...event.ticketTypes.map(t => t.price)).toLocaleString()}`
                    : 'Free'}
                </p>
              </div>
            </div>
          </div>

          {/* Event Content */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event Details - Left Column */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-bold text-secondary mb-3">About This Event</h2>
                    <p className="text-muted leading-relaxed">{event.description}</p>
                  </div>

                  {/* Ticket Types Display */}
                  {event.ticketTypes && event.ticketTypes.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">🎫</span>
                        Available Ticket Types
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.ticketTypes.map((ticket, index) => (
                          <div key={index} className="bg-surface/30 border border-surface rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-secondary">{ticket.name}</h4>
                              <span className="text-primary font-black text-lg">
                                KSh {ticket.price.toLocaleString()}
                              </span>
                            </div>
                            {ticket.description && (
                              <p className="text-xs text-muted">{ticket.description}</p>
                            )}
                            {ticket.capacity && (
                              <p className="text-xs text-muted mt-1">
                                Limit: {ticket.capacity} tickets
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface/30 rounded-xl border border-surface">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="text-xs text-muted">Date</p>
                        <p className="font-medium text-secondary">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} - {new Date(event.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🕐</span>
                      <div>
                        <p className="text-xs text-muted">Time</p>
                        <p className="font-medium text-secondary">{event.startTime} - {event.endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-muted">Venue</p>
                        <p className="font-medium text-secondary">{event.venue}</p>
                        <p className="text-xs text-muted">{event.address}, {event.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <p className="text-xs text-muted">Organizer</p>
                        <p className="font-medium text-secondary">{event.organizer}</p>
                        <p className="text-xs text-muted">{event.organizerEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  {event.highlights.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">✨</span>
                        Highlights
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {event.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <span className="text-primary mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What's Included */}
                  {event.whatsIncluded.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">✅</span>
                        What's Included
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {event.whatsIncluded.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <span className="text-green-500 mt-1">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements */}
                  {event.requirements.length > 0 && (
                    <div>
                      <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-primary">📋</span>
                        Requirements
                      </h3>
                      <ul className="space-y-1">
                        {event.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <span className="text-amber-500 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="bg-surface/50 px-3 py-1 rounded-full text-xs text-muted border border-surface">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Form - Right Column */}
              <div className="lg:col-span-1">
                <div className="bg-surface/30 rounded-2xl p-6 border border-surface sticky top-24">
                  <h2 className="text-xl font-bold text-secondary mb-4">Book This Event</h2>
                  
                  <div className="mb-6">
                    <p className="text-sm text-muted">Starting from</p>
                    <p className="text-3xl font-black text-primary">
                      {event.ticketTypes && event.ticketTypes.length > 0 
                        ? `KSh ${Math.min(...event.ticketTypes.map(t => t.price)).toLocaleString()}`
                        : 'Free'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-medium ${
                        event.availableSlots > 0 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {event.availableSlots > 0 
                          ? `✅ ${event.availableSlots} slots available` 
                          : '❌ Sold Out'}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  {message && (
                    <div className={`mb-4 p-3 rounded-xl border ${
                      message.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : message.type === 'info'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5">{message.type === 'success' ? '✅' : message.type === 'info' ? 'ℹ️' : '❌'}</span>
                        <span className="flex-1">{message.text}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment Status Indicator */}
                  {paymentStep === 'waiting' && (
                    <div className="mb-4 p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="animate-pulse flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-primary">Waiting for payment...</p>
                          <p className="text-xs text-muted">Booking Ref: {bookingReference}</p>
                          <p className="text-xs text-muted mt-1">Please check your phone and enter M-Pesa PIN</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentStep === 'complete' && (
                    <div className="mb-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎉</span>
                        <div>
                          <p className="font-semibold text-green-700">Booking Confirmed!</p>
                          <p className="text-xs text-muted">Ref: {bookingReference}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleBooking} className="space-y-4">
                    {/* Ticket Type Selection */}
                    {event.ticketTypes && event.ticketTypes.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1.5">
                          Select Ticket Type *
                        </label>
                        <select
                          value={selectedTicketType}
                          onChange={(e) => setSelectedTicketType(e.target.value)}
                          className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                          required
                          disabled={paymentStep === 'waiting'}
                        >
                          {event.ticketTypes.map((ticket, index) => {
                            const available = ticket.capacity ? 
                              ` (${ticket.capacity} available)` : '';
                            return (
                              <option key={index} value={ticket.name}>
                                {ticket.name} - KSh {ticket.price.toLocaleString()}{available}
                              </option>
                            );
                          })}
                        </select>
                        {selectedTicketType && (
                          <div className="mt-2 p-2 bg-primary/5 rounded-lg">
                            <p className="text-sm font-medium text-primary">
                              Selected: {selectedTicketType} @ KSh {getSelectedTicketPrice().toLocaleString()} each
                            </p>
                            <p className="text-xs text-muted">
                              Total: KSh {getTotalAmount().toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Number of Tickets *
                      </label>
                      <select
                        name="numberOfTickets"
                        value={bookingData.numberOfTickets}
                        onChange={handleChange}
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                        disabled={paymentStep === 'waiting'}
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="attendeeName"
                        value={bookingData.attendeeName}
                        onChange={handleChange}
                        required
                        disabled={paymentStep === 'waiting'}
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="attendeeEmail"
                        value={bookingData.attendeeEmail}
                        onChange={handleChange}
                        required
                        disabled={paymentStep === 'waiting'}
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        M-Pesa Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="attendeePhone"
                        value={bookingData.attendeePhone}
                        onChange={handleChange}
                        required
                        disabled={paymentStep === 'waiting'}
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        placeholder="0712345678"
                      />
                      <p className="text-xs text-muted mt-1">You'll receive an M-Pesa prompt on this number</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={handleChange}
                        rows={2}
                        disabled={paymentStep === 'waiting'}
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                        placeholder="Any special requirements?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={event.availableSlots === 0 || bookingLoading || !selectedTicketType || paymentStep === 'waiting'}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${
                        event.availableSlots > 0 && !bookingLoading && selectedTicketType && paymentStep !== 'waiting'
                          ? 'bg-primary hover:bg-accent-dark text-white'
                          : 'bg-muted/30 text-muted cursor-not-allowed'
                      }`}
                    >
                      {bookingLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : paymentStep === 'waiting' ? (
                        '⏳ Waiting for Payment...'
                      ) : event.availableSlots > 0 ? (
                        `💰 Pay with M-Pesa - KSh ${getTotalAmount().toLocaleString()}`
                      ) : (
                        'Sold Out'
                      )}
                    </button>

                    <p className="text-xs text-muted text-center">
                      You'll receive an M-Pesa prompt on your phone to complete payment
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}