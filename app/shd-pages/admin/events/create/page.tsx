// C:\Users\USER\Desktop\Projects\my-app\app\admin\events\create\page.tsx
/*'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'workshop',
    venue: '',
    address: '',
    city: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    price: '',
    capacity: '',
    organizer: '',
    organizerEmail: '',
    organizerPhone: '',
    tags: '',
    highlights: '',
    requirements: '',
    whatsIncluded: '',
    featured: false,
    status: 'draft'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          tags: formData.tags.split(',').map(tag => tag.trim()),
          highlights: formData.highlights.split('\n').filter(h => h.trim()),
          requirements: formData.requirements.split('\n').filter(r => r.trim()),
          whatsIncluded: formData.whatsIncluded.split('\n').filter(w => w.trim())
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Event created successfully!');
        router.push('/admin/events');
      } else {
        setError(data.error || 'Failed to create event');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📅 Create Event</h1>
        <Link href="/admin/events" className="text-blue-600 hover:underline">
          ← Back to Events
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information *
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
                placeholder="Enter event title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border rounded-lg p-2"
                placeholder="Describe your event"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
                <option value="networking">Networking</option>
                <option value="training">Training</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg p-2"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full border rounded-lg p-2"
                placeholder="100"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Feature this event</label>
            </div>

            {/* Venue Information *
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-semibold mb-4">Venue Information</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
                placeholder="Venue name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
                placeholder="City"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
                placeholder="Full address"
              />
            </div>

            {/* Date and Time *
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-semibold mb-4">Date & Time</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Organizer Information *
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-semibold mb-4">Organizer Information</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Name *</label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
                placeholder="Organizer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Email *</label>
              <input
                type="email"
                name="organizerEmail"
                value={formData.organizerEmail}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
                placeholder="organizer@email.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Phone *</label>
              <input
                type="tel"
                name="organizerPhone"
                value={formData.organizerPhone}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
                placeholder="254712345678"
              />
            </div>

            {/* Additional Information *
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="workshop, training, business"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (one per line)</label>
              <textarea
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg p-2"
                placeholder="Expert speakers\nHands-on workshops\nNetworking opportunities"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg p-2"
                placeholder="Laptop\nInternet connection\nBasic knowledge"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">What's Included (one per line)</label>
              <textarea
                name="whatsIncluded"
                value={formData.whatsIncluded}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg p-2"
                placeholder="Training materials\nLunch\nCertificate of completion"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <Link
              href="/admin/events"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}*/


/*'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'workshop',
    venue: '',
    address: '',
    city: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    price: '',
    capacity: '',
    organizer: '',
    organizerEmail: '',
    organizerPhone: '',
    tags: '',
    highlights: '',
    requirements: '',
    whatsIncluded: '',
    featured: false,
    status: 'draft'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t),
          highlights: formData.highlights.split('\n').filter(h => h.trim()),
          requirements: formData.requirements.split('\n').filter(r => r.trim()),
          whatsIncluded: formData.whatsIncluded.split('\n').filter(w => w.trim())
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Event created successfully!' });
        setTimeout(() => {
          router.push('/admin/events');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create event' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header *
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary">
            📅 Create Event
          </h1>
          <p className="text-muted mt-1">
            Create a new event for the platform
          </p>
        </div>
        <Link 
          href="/admin/events" 
          className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>
      </div>

      {/* Messages *
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

      {/* Form *
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-8 border border-surface">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information *
          <div>
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📝</span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter event title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Describe your event"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                >
                  <option value="workshop">🔧 Workshop</option>
                  <option value="seminar">🎓 Seminar</option>
                  <option value="conference">🏛️ Conference</option>
                  <option value="networking">🤝 Networking</option>
                  <option value="training">📚 Training</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Price (KSh) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="100"
                />
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary focus:ring-primary border-surface rounded"
                />
                <label className="ml-2 text-sm font-medium text-secondary">
                  ⭐ Feature this event
                </label>
              </div>
            </div>
          </div>

          {/* Venue Information *
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📍</span>
              Venue Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Venue name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="City"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>

          {/* Date and Time *
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📅</span>
              Date & Time
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  End Time *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                />
              </div>
            </div>
          </div>

          {/* Organizer Information *
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">👤</span>
              Organizer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Organizer Name *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Organizer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Organizer Email *
                </label>
                <input
                  type="email"
                  name="organizerEmail"
                  value={formData.organizerEmail}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="organizer@email.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Organizer Phone *
                </label>
                <input
                  type="tel"
                  name="organizerPhone"
                  value={formData.organizerPhone}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="254712345678"
                />
              </div>
            </div>
          </div>

          {/* Additional Information *
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📋</span>
              Additional Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="workshop, training, business"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Highlights (one per line)
                </label>
                <textarea
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Expert speakers\nHands-on workshops\nNetworking opportunities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Requirements (one per line)
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Laptop\nInternet connection\nBasic knowledge"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  What's Included (one per line)
                </label>
                <textarea
                  name="whatsIncluded"
                  value={formData.whatsIncluded}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Training materials\nLunch\nCertificate of completion"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                >
                  <option value="draft">📝 Draft</option>
                  <option value="published">✅ Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions *
          <div className="flex flex-wrap gap-4 pt-4 border-t border-surface">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-bold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                '📅 Create Event'
              )}
            </button>
            <Link
              href="/admin/events"
              className="bg-surface hover:bg-surface/70 text-secondary px-8 py-3 rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}*/


// C:\Users\Administrator\Desktop\my-app\app\admin\events\create\page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TicketType {
  name: string;
  price: string;
  description: string;
  capacity: string;
}

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: 'Regular', price: '', description: '', capacity: '' }
  ]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'workshop',
    venue: '',
    address: '',
    city: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    capacity: '',
    organizer: '',
    organizerEmail: '',
    organizerPhone: '',
    tags: '',
    highlights: '',
    requirements: '',
    whatsIncluded: '',
    featured: false,
    status: 'draft'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleTicketChange = (index: number, field: keyof TicketType, value: string) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '', description: '', capacity: '' }]);
  };

  const removeTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate ticket types
    const invalidTickets = ticketTypes.some(t => !t.name.trim() || !t.price);
    if (invalidTickets) {
      setMessage({ type: 'error', text: 'Please fill in all ticket type names and prices' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity),
          ticketTypes: ticketTypes.map(t => ({
            ...t,
            price: parseFloat(t.price),
            capacity: t.capacity ? parseInt(t.capacity) : undefined
          })),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t),
          highlights: formData.highlights.split('\n').filter(h => h.trim()),
          requirements: formData.requirements.split('\n').filter(r => r.trim()),
          whatsIncluded: formData.whatsIncluded.split('\n').filter(w => w.trim())
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Event created successfully!' });
        setTimeout(() => {
          router.push('/admin/events');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create event' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary">
            📅 Create Event
          </h1>
          <p className="text-muted mt-1">
            Create a new event with customizable ticket types
          </p>
        </div>
        <Link 
          href="/admin/events" 
          className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
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

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-8 border border-surface">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📝</span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter event title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Describe your event"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                >
                  <option value="workshop">🔧 Workshop</option>
                  <option value="seminar">🎓 Seminar</option>
                  <option value="conference">🏛️ Conference</option>
                  <option value="networking">🤝 Networking</option>
                  <option value="training">📚 Training</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Total Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="100"
                />
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary focus:ring-primary border-surface rounded"
                />
                <label className="ml-2 text-sm font-medium text-secondary">
                  ⭐ Feature this event
                </label>
              </div>
            </div>
          </div>

          {/* Ticket Types - Dynamic */}
          <div className="border-t border-surface pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                <span className="text-primary">🎫</span>
                Ticket Types
              </h2>
              <button
                type="button"
                onClick={addTicketType}
                className="bg-primary hover:bg-accent-dark text-white px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
              >
                + Add Ticket Type
              </button>
            </div>
            
            <div className="space-y-4">
              {ticketTypes.map((ticket, index) => (
                <div key={index} className="bg-background rounded-xl p-4 border border-surface">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Ticket Name *
                      </label>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                        placeholder="e.g., VIP, Regular"
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Price (KSh) *
                      </label>
                      <input
                        type="number"
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                        placeholder="0"
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">
                        Capacity (Optional)
                      </label>
                      <input
                        type="number"
                        value={ticket.capacity}
                        onChange={(e) => handleTicketChange(index, 'capacity', e.target.value)}
                        placeholder="Unlimited"
                        className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        min="1"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-secondary mb-1.5">
                          Description
                        </label>
                        <input
                          type="text"
                          value={ticket.description}
                          onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                          placeholder="Benefits included"
                          className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                        />
                      </div>
                      {ticketTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTicketType(index)}
                          className="text-red-500 hover:text-red-700 p-2.5 rounded-xl transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">
              💡 Create multiple ticket types with different prices and capacities. Leave capacity empty for unlimited tickets.
            </p>
          </div>

          {/* Venue Information */}
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📍</span>
              Venue Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Venue name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="City"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📅</span>
              Date & Time
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  End Time *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                />
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">👤</span>
              Organizer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Organizer Name *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Organizer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Organizer Email *
                </label>
                <input
                  type="email"
                  name="organizerEmail"
                  value={formData.organizerEmail}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="organizer@email.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Organizer Phone *
                </label>
                <input
                  type="tel"
                  name="organizerPhone"
                  value={formData.organizerPhone}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="254712345678"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📋</span>
              Additional Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="workshop, training, business"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Highlights (one per line)
                </label>
                <textarea
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Expert speakers\nHands-on workshops\nNetworking opportunities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Requirements (one per line)
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Laptop\nInternet connection\nBasic knowledge"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  What's Included (one per line)
                </label>
                <textarea
                  name="whatsIncluded"
                  value={formData.whatsIncluded}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Training materials\nLunch\nCertificate of completion"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                >
                  <option value="draft">📝 Draft</option>
                  <option value="published">✅ Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-surface">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-bold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                '📅 Create Event'
              )}
            </button>
            <Link
              href="/admin/events"
              className="bg-surface hover:bg-surface/70 text-secondary px-8 py-3 rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}