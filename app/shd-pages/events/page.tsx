// C:\Users\USER\Desktop\Projects\my-app\app\events\page.tsx
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
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  featured: boolean;
  organizer: string;
  image?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (category !== 'all' && event.category !== category) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return event.title.toLowerCase().includes(searchLower) ||
             event.venue.toLowerCase().includes(searchLower) ||
             event.city.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      workshop: '🔧',
      seminar: '🎓',
      conference: '🏛️',
      networking: '🤝',
      training: '📚',
      other: '📌'
    };
    return emojis[category as keyof typeof emojis] || '📌';
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header *
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">📅 Upcoming Events</h1>
          <p className="text-gray-600">Discover and book exciting events near you</p>
        </div>

        {/* Filters *
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 min-w-[200px]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Categories</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="conference">Conference</option>
            <option value="networking">Networking</option>
            <option value="training">Training</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Events Grid *
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white rounded-xl shadow hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {getCategoryEmoji(event.category)} {event.category}
                  </span>
                  {event.featured && (
                    <span className="text-amber-500">⭐ Featured</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📍 {event.venue}, {event.city}</p>
                  <p>📅 {new Date(event.startDate).toLocaleDateString()}</p>
                  <p>🕐 {event.startTime} - {event.endTime}</p>
                  <p className="font-semibold text-blue-600">💰 KSh {event.price}</p>
                  <p className="text-xs text-gray-500">
                    🎫 {event.availableSlots} slots available
                  </p>
                </div>

                <Link
                  href={`/events/${event._id}`}
                  className="mt-4 block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-500">No events found</p>
          </div>
        )}
      </div>
    </div>
  );
}*/

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
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  featured: boolean;
  organizer: string;
  image?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (category !== 'all' && event.category !== category) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return event.title.toLowerCase().includes(searchLower) ||
             event.venue.toLowerCase().includes(searchLower) ||
             event.city.toLowerCase().includes(searchLower);
    }
    return true;
  });

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
      workshop: 'bg-blue-100 text-blue-700 border-blue-200',
      seminar: 'bg-purple-100 text-purple-700 border-purple-200',
      conference: 'bg-amber-100 text-amber-700 border-amber-200',
      networking: 'bg-green-100 text-green-700 border-green-200',
      training: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header *
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary">
            📅 Upcoming Events
          </h1>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            Discover and book exciting events near you
          </p>
        </div>

        {/* Filters *
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
            >
              <option value="all">All Categories</option>
              <option value="workshop">🔧 Workshop</option>
              <option value="seminar">🎓 Seminar</option>
              <option value="conference">🏛️ Conference</option>
              <option value="networking">🤝 Networking</option>
              <option value="training">📚 Training</option>
              <option value="other">📌 Other</option>
            </select>
          </div>
        </div>

        {/* Results Count *
        {filteredEvents.length > 0 && (
          <p className="text-sm text-muted mb-4">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
            {category !== 'all' && ` in ${category}`}
          </p>
        )}

        {/* Events Grid *
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-secondary mb-2">No events found</h3>
            <p className="text-muted">
              {search || category !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Check back later for upcoming events'}
            </p>
            {(search || category !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
                className="mt-4 text-primary hover:text-accent-dark font-medium transition-colors duration-200"
              >
                Clear filters →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <div 
                key={event._id} 
                className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-surface hover:border-primary/20 group ${
                  event.featured ? 'ring-2 ring-amber-400 ring-offset-2' : ''
                }`}
              >
                <div className="p-5 sm:p-6">
                  {/* Header Badges *
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                      {getCategoryEmoji(event.category)} {event.category}
                    </span>
                    {event.featured && (
                      <span className="text-amber-500 text-sm font-medium flex items-center gap-1">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Title *
                  <h3 className="text-lg sm:text-xl font-bold text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {event.title}
                  </h3>

                  {/* Details *
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
                      <span>🕐</span>
                      <span>{event.startTime} - {event.endTime}</span>
                    </p>
                  </div>

                  {/* Price & Availability *
                  <div className="mt-4 pt-4 border-t border-surface">
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-black text-xl">
                        KSh {event.price.toLocaleString()}
                      </span>
                      <span className={`text-xs font-medium ${
                        event.availableSlots > 0 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {event.availableSlots > 0 
                          ? `🎫 ${event.availableSlots} slots` 
                          : 'Sold Out'}
                      </span>
                    </div>
                  </div>

                  {/* Book Button *
                  <Link
                    href={`/events/${event._id}`}
                    className={`mt-4 w-full block text-center px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${
                      event.availableSlots > 0
                        ? 'bg-primary hover:bg-accent-dark text-white'
                        : 'bg-muted/30 text-muted cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (event.availableSlots <= 0) e.preventDefault();
                    }}
                  >
                    {event.availableSlots > 0 ? 'Book Now' : 'Sold Out'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
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
  city: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  ticketTypes: TicketType[];
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  featured: boolean;
  organizer: string;
  image?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (category !== 'all' && event.category !== category) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return event.title.toLowerCase().includes(searchLower) ||
             event.venue.toLowerCase().includes(searchLower) ||
             event.city.toLowerCase().includes(searchLower);
    }
    return true;
  });

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
      workshop: 'bg-blue-100 text-blue-700 border-blue-200',
      seminar: 'bg-purple-100 text-purple-700 border-purple-200',
      conference: 'bg-amber-100 text-amber-700 border-amber-200',
      networking: 'bg-green-100 text-green-700 border-green-200',
      training: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getMinPrice = (ticketTypes: TicketType[]) => {
    if (!ticketTypes || ticketTypes.length === 0) return 0;
    return Math.min(...ticketTypes.map(t => t.price));
  };

  const getMaxPrice = (ticketTypes: TicketType[]) => {
    if (!ticketTypes || ticketTypes.length === 0) return 0;
    return Math.max(...ticketTypes.map(t => t.price));
  };

  const formatPriceRange = (ticketTypes: TicketType[]) => {
    if (!ticketTypes || ticketTypes.length === 0) return 'Free';
    const min = getMinPrice(ticketTypes);
    const max = getMaxPrice(ticketTypes);
    if (min === max) {
      return `KSh ${min.toLocaleString()}`;
    }
    return `KSh ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary">
            📅 Upcoming Events
          </h1>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            Discover and book exciting events near you
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
            >
              <option value="all">All Categories</option>
              <option value="workshop">🔧 Workshop</option>
              <option value="seminar">🎓 Seminar</option>
              <option value="conference">🏛️ Conference</option>
              <option value="networking">🤝 Networking</option>
              <option value="training">📚 Training</option>
              <option value="other">📌 Other</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {filteredEvents.length > 0 && (
          <p className="text-sm text-muted mb-4">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
            {category !== 'all' && ` in ${category}`}
          </p>
        )}

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-secondary mb-2">No events found</h3>
            <p className="text-muted">
              {search || category !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Check back later for upcoming events'}
            </p>
            {(search || category !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
                className="mt-4 text-primary hover:text-accent-dark font-medium transition-colors duration-200"
              >
                Clear filters →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <div 
                key={event._id} 
                className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-surface hover:border-primary/20 group ${
                  event.featured ? 'ring-2 ring-amber-400 ring-offset-2' : ''
                }`}
              >
                <div className="p-5 sm:p-6">
                  {/* Header Badges */}
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                      {getCategoryEmoji(event.category)} {event.category}
                    </span>
                    {event.featured && (
                      <span className="text-amber-500 text-sm font-medium flex items-center gap-1">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
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
                      <span>🕐</span>
                      <span>{event.startTime} - {event.endTime}</span>
                    </p>
                  </div>

                  {/* Ticket Types Preview */}
                  {event.ticketTypes && event.ticketTypes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-surface">
                      <div className="space-y-1">
                        {event.ticketTypes.slice(0, 2).map((ticket, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-muted">{ticket.name}</span>
                            <span className="font-medium text-secondary">
                              KSh {ticket.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {event.ticketTypes.length > 2 && (
                          <div className="text-xs text-muted text-center pt-1">
                            +{event.ticketTypes.length - 2} more ticket types
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price & Availability */}
                  <div className="mt-4 pt-4 border-t border-surface">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-primary font-black text-xl">
                          {formatPriceRange(event.ticketTypes)}
                        </span>
                        {event.ticketTypes && event.ticketTypes.length > 1 && (
                          <span className="text-xs text-muted block">from {getMinPrice(event.ticketTypes).toLocaleString()}</span>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${
                        event.availableSlots > 0 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {event.availableSlots > 0 
                          ? `🎫 ${event.availableSlots} slots` 
                          : 'Sold Out'}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link
                    href={`/events/${event._id}`}
                    className={`mt-4 w-full block text-center px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${
                      event.availableSlots > 0
                        ? 'bg-primary hover:bg-accent-dark text-white'
                        : 'bg-muted/30 text-muted cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (event.availableSlots <= 0) e.preventDefault();
                    }}
                  >
                    {event.availableSlots > 0 ? 'View Tickets' : 'Sold Out'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}