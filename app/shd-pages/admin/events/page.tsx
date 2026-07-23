// C:\Users\USER\Desktop\Projects\my-app\app\admin\events\page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  city: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  status: string;
  featured: boolean;
  organizer: string;
  createdAt: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Event deleted successfully');
        fetchEvents();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete event');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const toggleEventStatus = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'cancelled' : 'published';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert(`Event ${newStatus === 'published' ? 'published' : 'cancelled'} successfully`);
        fetchEvents();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update event status');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter !== 'all' && event.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return event.title.toLowerCase().includes(searchLower) ||
             event.venue.toLowerCase().includes(searchLower) ||
             event.city.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      workshop: 'bg-purple-100 text-purple-800',
      seminar: 'bg-blue-100 text-blue-800',
      conference: 'bg-indigo-100 text-indigo-800',
      networking: 'bg-pink-100 text-pink-800',
      training: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return badges[category as keyof typeof badges] || badges.other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📅 Events</h1>
        <Link
          href="/admin/events/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create Event
        </Link>
      </div>

      {/* Filters *
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-[200px]"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Events</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <span className="bg-gray-100 px-4 py-2 rounded-lg">
          Total: {filteredEvents.length} events
        </span>
      </div>

      {/* Events Grid *
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event._id} className="bg-white rounded-xl shadow hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryBadge(event.category)}`}>
                    {event.category}
                  </span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                {event.featured && (
                  <span className="text-amber-500">⭐ Featured</span>
                )}
              </div>

              <h3 className="text-lg font-bold mb-2 line-clamp-2">{event.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>📍 {event.venue}, {event.city}</p>
                <p>📅 {new Date(event.startDate).toLocaleDateString()}</p>
                <p>💰 KSh {event.price}</p>
                <p>🎫 {event.bookedCount}/{event.capacity} booked</p>
                <p className="text-xs text-gray-500">
                  Available: {event.availableSlots} slots
                </p>
              </div>

              <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                <Link
                  href={`/admin/events/${event._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </Link>
                <Link
                  href={`/admin/events/edit/${event._id}`}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleEventStatus(event._id, event.status)}
                  className={`text-sm font-medium ${
                    event.status === 'published'
                      ? 'text-red-600 hover:text-red-800'
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  {event.status === 'published' ? 'Cancel' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-4xl mb-4">📅</p>
          <p className="text-gray-500">No events found</p>
          <Link
            href="/admin/events/create"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Create your first event
          </Link>
        </div>
      )}
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  city: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  status: string;
  featured: boolean;
  organizer: string;
  createdAt: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Event deleted successfully' });
        fetchEvents();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete event' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const toggleEventStatus = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'cancelled' : 'published';
    const action = newStatus === 'published' ? 'published' : 'cancelled';
    
    if (!confirm(`Are you sure you want to ${action} this event?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Event ${action} successfully` });
        fetchEvents();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update event status' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter !== 'all' && event.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return event.title.toLowerCase().includes(searchLower) ||
             event.venue.toLowerCase().includes(searchLower) ||
             event.city.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 border-gray-200',
      published: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return badges[status] || badges.draft;
  };

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, string> = {
      workshop: 'bg-purple-100 text-purple-700 border-purple-200',
      seminar: 'bg-blue-100 text-blue-700 border-blue-200',
      conference: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      networking: 'bg-pink-100 text-pink-700 border-pink-200',
      training: 'bg-orange-100 text-orange-700 border-orange-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return badges[category] || badges.other;
  };

  const getStatusEmoji = (status: string) => {
    const emojis: Record<string, string> = {
      draft: '📝',
      published: '✅',
      cancelled: '❌',
      completed: '🎉'
    };
    return emojis[status] || '📌';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary">
            📅 Events
          </h1>
          <p className="text-muted mt-1">
            Manage all events on the platform
          </p>
        </div>
        <Link
          href="/admin/events/create"
          className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
        >
          + Create Event
        </Link>
      </div>

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

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
        >
          <option value="all">All Events</option>
          <option value="draft">📝 Draft</option>
          <option value="published">✅ Published</option>
          <option value="cancelled">❌ Cancelled</option>
          <option value="completed">🎉 Completed</option>
        </select>
        <span className="bg-surface/50 px-4 py-2.5 rounded-xl text-sm text-secondary font-medium border border-surface">
          Total: {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-bold text-secondary mb-2">No events found</h3>
          <p className="text-muted mb-6">
            {search || filter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first event'}
          </p>
          {(search || filter !== 'all') ? (
            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="text-primary hover:text-accent-dark font-medium transition-colors duration-200"
            >
              Clear filters →
            </button>
          ) : (
            <Link
              href="/admin/events/create"
              className="inline-block bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              Create Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event._id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-surface hover:border-primary/20 group"
            >
              <div className="p-5 sm:p-6">
                {/* Badges */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryBadge(event.category)}`}>
                      {event.category}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(event.status)}`}>
                      {getStatusEmoji(event.status)} {event.status}
                    </span>
                  </div>
                  {event.featured && (
                    <span className="text-amber-500 text-sm font-medium flex items-center gap-1">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {event.title}
                </h3>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <p className="text-muted flex items-center gap-2">
                    <span>📍</span>
                    <span>{event.venue}, {event.city}</span>
                  </p>
                  <p className="text-muted flex items-center gap-2">
                    <span>📅</span>
                    <span>
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </p>
                  <p className="text-muted flex items-center gap-2">
                    <span>💰</span>
                   <span className="font-medium text-primary">
  KSh {(event.price ?? 0).toLocaleString()}
</span>
                  </p>
                  <p className="text-muted flex items-center gap-2">
                    <span>🎫</span>
                    <span>{event.bookedCount}/{event.capacity} booked</span>
                  </p>
                  <p className={`text-xs font-medium ${
                    event.availableSlots > 0 ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {event.availableSlots > 0 
                      ? `✅ ${event.availableSlots} slots available` 
                      : '❌ Sold out'}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-surface flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/events/${event._id}`}
                    className="text-primary hover:text-accent-dark text-sm font-medium transition-colors duration-200"
                  >
                    View Details
                  </Link>
                  <span className="text-muted">|</span>
                  <Link
                    href={`/admin/events/edit/${event._id}`}
                    className="text-accent-dark hover:text-accent-dark/80 text-sm font-medium transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  <span className="text-muted">|</span>
                  <button
                    onClick={() => toggleEventStatus(event._id, event.status)}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      event.status === 'published'
                        ? 'text-red-500 hover:text-red-700'
                        : 'text-green-500 hover:text-green-700'
                    }`}
                  >
                    {event.status === 'published' ? 'Cancel' : 'Publish'}
                  </button>
                  <span className="text-muted">|</span>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}