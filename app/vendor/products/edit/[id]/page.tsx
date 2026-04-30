/*"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  sku: string;
  brand?: string;
  specifications: { key: string; value: string }[];
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  tags: string[];
}

const categories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Food & Beverages',
  'Health & Wellness',
  'Books & Stationery',
  'Automotive',
  'Other'
];

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    stock: 0,
    sku: '',
    specifications: [],
    shipping: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      }
    },
    tags: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data.product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage('Error loading product');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- helper ----------
function setNested<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.');
  const last = keys.pop()!;
  let cur: any = { ...obj };
  let ref = cur;
  for (const k of keys) ref = ref[k] = { ...ref[k] };
  ref[last] = value;
  return cur;
}

// ---------- handler ----------
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData(prev => setNested(prev, name, value));
};

  /*const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: grandchild 
          ? { ...prev[parent as keyof ProductFormData], [child]: { ...prev[parent][child], [grandchild]: value } }
          : { ...prev[parent as keyof ProductFormData], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };*

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => {
      const updatedSpecs = [...prev.specifications];
      updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
      return { ...prev, specifications: updatedSpecs };
    });
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Product updated successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error updating product');
      }
    } catch (error) {
      setMessage('Error updating product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff199c]" />
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Only vendors can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Back to Dashboard
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Information *
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (KSh)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice || ''}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              />
            </div>
          </div>
        </div>

        {/* Category *
        <div>
          <h2 className="text-xl font-semibold mb-4">Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              />
            </div>
          </div>
        </div>

        {/* Specifications *
        <div>
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                value={spec.key}
                onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecification}
            className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Add Specification
          </button>
        </div>

        {/* Shipping *
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (grams) *</label>
              <input
                type="number"
                name="shipping.weight"
                value={formData.shipping.weight}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm) *</label>
                <input
                  type="number"
                  name="shipping.dimensions.length"
                  value={formData.shipping.dimensions.length}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm) *</label>
                <input
                  type="number"
                  name="shipping.dimensions.width"
                  value={formData.shipping.dimensions.width}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) *</label>
                <input
                  type="number"
                  name="shipping.dimensions.height"
                  value={formData.shipping.dimensions.height}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags *
        <div>
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <input
            type="text"
            placeholder="Enter tags separated by commas (e.g., electronics, gadget, wireless)"
            value={formData.tags.join(', ')}
            onChange={handleTagsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
          />
          <p className="text-sm text-gray-500 mt-1">Current tags: {formData.tags.join(', ') || 'None'}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#ff199c] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] disabled:opacity-50"
          >
            {isSaving ? 'Updating Product...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}*/

/*"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  sku: string;
  brand?: string;
  specifications: { key: string; value: string }[];
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  tags: string[];
}

const categories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Food & Beverages',
  'Health & Wellness',
  'Books & Stationery',
  'Automotive',
  'Other'
];

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    stock: 0,
    sku: '',
    specifications: [],
    shipping: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      }
    },
    tags: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data.product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage('Error loading product');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- helper ----------
  function setNested<T>(obj: T, path: string, value: unknown): T {
    const keys = path.split('.');
    const last = keys.pop()!;
    let cur: any = { ...obj };
    let ref = cur;
    for (const k of keys) ref = ref[k] = { ...ref[k] };
    ref[last] = value;
    return cur;
  }

  // ---------- handler ----------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => setNested(prev, name, value));
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => {
      const updatedSpecs = [...prev.specifications];
      updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
      return { ...prev, specifications: updatedSpecs };
    });
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Product updated successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error updating product');
      }
    } catch (error) {
      setMessage('Error updating product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]" />
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Only vendors can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Back Arrow Header *
        <div className="flex items-center mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Main Header *
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Product</h1>
          <button
            onClick={() => router.push('/?tab=dashboard')}
            className="bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base w-full sm:w-auto"
          >
            Back to Dashboard
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} text-sm`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm sm:shadow p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Basic Information *
          <div>
            <h2 className="text-lg text-gray-700 sm:text-xl font-semibold mb-3 sm:mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="mt-3 sm:mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 mt-3 sm:mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (KSh)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Category *
          <div>
            <h2 className="text-lg sm:text-xl text-gray-700 font-semibold mb-3 sm:mb-4">Category</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Specifications *
          <div>
            <h2 className="text-lg text-gray-700 sm:text-xl font-semibold mb-3 sm:mb-4">Specifications</h2>
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex flex-col xs:flex-row items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={spec.key}
                  onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                  className="flex-1 text-gray-700 w-full xs:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                  className="flex-1 text-gray-700 w-full xs:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="w-full xs:w-auto px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecification}
              className="mt-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm sm:text-base"
            >
              Add Specification
            </button>
          </div>

          {/* Shipping *
          <div>
            <h2 className="text-lg text-gray-700 sm:text-xl font-semibold mb-3 sm:mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (grams) *</label>
                <input
                  type="number"
                  name="shipping.weight"
                  value={formData.shipping.weight}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm) *</label>
                  <input
                    type="number"
                    name="shipping.dimensions.length"
                    value={formData.shipping.dimensions.length}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm) *</label>
                  <input
                    type="number"
                    name="shipping.dimensions.width"
                    value={formData.shipping.dimensions.width}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) *</label>
                  <input
                    type="number"
                    name="shipping.dimensions.height"
                    value={formData.shipping.dimensions.height}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags *
          <div>
            <h2 className="text-lg sm:text-xl text-gray-700 font-semibold mb-3 sm:mb-4">Tags</h2>
            <input
              type="text"
              placeholder="Enter tags separated by commas (e.g., electronics, gadget, wireless)"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c] text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Current tags: {formData.tags.join(', ') || 'None'}</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md hover:bg-[#bf2c7e] disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
            >
              {isSaving ? 'Updating Product...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}*/

/*"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  Tag,
  Truck,
  Weight,
  Ruler,
  Plus,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Hash,
  DollarSign,
  Box,
  FileText,
  Layers,
  ShoppingBag,
  Clock,
  Sparkles
} from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  sku: string;
  brand?: string;
  specifications: { key: string; value: string }[];
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  tags: string[];
  isActive?: boolean;
}

const categories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Food & Beverages',
  'Health & Wellness',
  'Books & Stationery',
  'Automotive',
  'Other'
];

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    stock: 0,
    sku: '',
    specifications: [],
    shipping: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      }
    },
    tags: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data.product);
      } else {
        setMessage({ type: 'error', text: 'Error loading product' });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage({ type: 'error', text: 'Error loading product' });
    } finally {
      setIsLoading(false);
    }
  };

  function setNested<T>(obj: T, path: string, value: unknown): T {
    const keys = path.split('.');
    const last = keys.pop()!;
    let cur: any = { ...obj };
    let ref = cur;
    for (const k of keys) ref = ref[k] = { ...ref[k] };
    ref[last] = value;
    return cur;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: any = value;
    
    if (name === 'price' || name === 'originalPrice' || name === 'stock') {
      parsedValue = parseFloat(value) || 0;
    } else if (name.includes('shipping')) {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => setNested(prev, name, parsedValue));
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => {
      const updatedSpecs = [...prev.specifications];
      updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
      return { ...prev, specifications: updatedSpecs };
    });
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: 'info', text: 'Updating product...' });

    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product updated successfully! Redirecting...' });
        setTimeout(() => {
          router.push('/vendor-dashboard');
        }, 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Error updating product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating product' });
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <Package className="w-4 h-4" /> },
    { id: 'category', label: 'Category', icon: <Layers className="w-4 h-4" /> },
    { id: 'specs', label: 'Specifications', icon: <Tag className="w-4 h-4" /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
    { id: 'tags', label: 'Tags', icon: <Hash className="w-4 h-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h1>
          <p className="text-[var(--color-text-muted)] mb-6">Only vendors can access this page.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300">
            Go to Home
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section *
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 md:py-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-primary)] font-medium">Edit Product</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                Edit {formData.name || 'Product'}
              </h1>
              <p className="text-[var(--color-text-muted)] mt-2">
                Update your product information and settings
              </p>
            </div>
            <button
              onClick={() => router.push('/vendor-dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Message Alert *
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-slide-in ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-600' :
            message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-600' :
            'bg-blue-500/10 border border-blue-500/20 text-blue-600'
          }`}>
            {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {message.type === 'info' && <Package className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Section Navigation *
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 px-2">
                Sections
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Form *
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            {/* Basic Information Section *
            <div id="basic" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[var(--color-primary)]" />
                  Basic Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Wireless Bluetooth Headphones"
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., WH-1000XM4-BLK"
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Describe your product in detail... Features, benefits, materials, etc."
                    className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Price (KSh) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Original Price (KSh)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      <Box className="w-4 h-4 inline mr-1" />
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock || ''}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Sony, Apple, Samsung"
                    className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Category Section *
            <div id="category" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[var(--color-primary)]" />
                  Category
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Headphones, Smartphones"
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications Section *
            <div id="specs" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[var(--color-primary)]" />
                  Specifications
                </h2>
              </div>
              <div className="p-6">
                {formData.specifications.map((spec, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Specification name (e.g., Color)"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(idx, 'key', e.target.value)}
                      className="flex-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Black)"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(idx, 'value', e.target.value)}
                      className="flex-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(idx)}
                      className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecification}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-background-soft)] text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)]/10 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Specification
                </button>
              </div>
            </div>

            {/* Shipping Section *
            <div id="shipping" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[var(--color-primary)]" />
                  Shipping Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    <Weight className="w-4 h-4 inline mr-1" />
                    Weight (grams) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="shipping.weight"
                    value={formData.shipping.weight || ''}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="e.g., 500"
                    className="w-full md:w-1/2 px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                    <Ruler className="w-4 h-4 inline mr-1" />
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Length</label>
                      <input
                        type="number"
                        name="shipping.dimensions.length"
                        value={formData.shipping.dimensions.length || ''}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="cm"
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Width</label>
                      <input
                        type="number"
                        name="shipping.dimensions.width"
                        value={formData.shipping.dimensions.width || ''}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="cm"
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Height</label>
                      <input
                        type="number"
                        name="shipping.dimensions.height"
                        value={formData.shipping.dimensions.height || ''}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="cm"
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Section *
            <div id="tags" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Hash className="w-5 h-5 text-[var(--color-primary)]" />
                  Tags
                </h2>
              </div>
              <div className="p-6">
                <input
                  type="text"
                  placeholder="Enter tags separated by commas (e.g., electronics, wireless, headphones)"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions *
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-8">
              <button
                type="button"
                onClick={() => router.push('/vendor/dashboard')}
                className="px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Updating Product...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}*/


// app/vendor/products/[id]/edit/page.tsx (Updated version)
/*'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Tag,
  Truck,
  Weight,
  Ruler,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Hash,
  DollarSign,
  Box,
  Layers,
  Sparkles,
  TrendingUp,
  Clock,
  Flame,
  Percent,
  Zap,
  Crown,
  Lock,
  AlertTriangle,
  Calendar,
  Gift
} from 'lucide-react';
import { SUBSCRIPTION_FEATURES, SubscriptionTier } from '@/types/subscription';

interface VendorSubscription {
  tier: SubscriptionTier;
  status: string;
  monthlyUsage: {
    todayDealsUsed: number;
    bestSellersUsed: number;
    newArrivalsUsed: number;
    clearanceUsed: number;
    giftCardsCreated: number;
  };
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  sku: string;
  brand?: string;
  specifications: { key: string; value: string }[];
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  tags: string[];
  isActive?: boolean;
  
  // Subscription categories
  subscriptionCategories: {
    isTodayDeal: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    isClearance: boolean;
    isGiftCard: boolean;
  };
  
  // Today's Deal specific
  dealDiscount?: number;
  dealExpiry?: string;
  dealStartDate?: string;
  
  // Clearance specific
  clearanceReason?: string;
  
  // Gift Card specific
  isGiftCardProduct?: boolean;
  giftCardValues?: number[];
}

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    stock: 0,
    sku: '',
    specifications: [],
    shipping: {
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 }
    },
    tags: [],
    subscriptionCategories: {
      isTodayDeal: false,
      isBestSeller: false,
      isNewArrival: false,
      isClearance: false,
      isGiftCard: false,
    }
  });
  
  const [vendorSubscription, setVendorSubscription] = useState<VendorSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState('basic');

  // Fetch product and vendor subscription
  useEffect(() => {
    if (productId && user) {
      Promise.all([fetchProduct(), fetchVendorSubscription()]);
    }
  }, [productId, user]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data.product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchVendorSubscription = async () => {
    try {
      const response = await fetch('/api/vendor/subscription/status');
      if (response.ok) {
        const data = await response.json();
        setVendorSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionFeatures = () => {
    if (!vendorSubscription) return SUBSCRIPTION_FEATURES.basic;
    return SUBSCRIPTION_FEATURES[vendorSubscription.tier];
  };

  const getRemainingUsage = (feature: keyof typeof SUBSCRIPTION_FEATURES.basic) => {
    if (!vendorSubscription) return 0;
    const features = SUBSCRIPTION_FEATURES[vendorSubscription.tier];
    const used = vendorSubscription.monthlyUsage[feature as keyof typeof vendorSubscription.monthlyUsage] || 0;
    const max = features[feature as keyof typeof features] as number;
    return max - used;
  };

  const canEnableFeature = (feature: string): { allowed: boolean; reason?: string } => {
    if (!vendorSubscription || vendorSubscription.status !== 'active') {
      return { allowed: false, reason: 'Active subscription required' };
    }
    
    const features = SUBSCRIPTION_FEATURES[vendorSubscription.tier];
    
    switch (feature) {
      case 'isTodayDeal':
        if (!features.canFeatureTodayDeals) {
          return { allowed: false, reason: `${vendorSubscription.tier} tier doesn't include Today's Deals. Upgrade to Growth or higher.` };
        }
        if (getRemainingUsage('todayDealsUsed') <= 0) {
          return { allowed: false, reason: 'Monthly Today\'s Deals limit reached. Upgrade or wait for next month.' };
        }
        break;
      case 'isBestSeller':
        if (!features.canFeatureBestSellers) {
          return { allowed: false, reason: `${vendorSubscription.tier} tier doesn't include Best Sellers. Upgrade to Growth or higher.` };
        }
        if (getRemainingUsage('bestSellersUsed') <= 0) {
          return { allowed: false, reason: 'Monthly Best Sellers limit reached.' };
        }
        break;
      case 'isNewArrival':
        if (!features.canFeatureNewArrivals) {
          return { allowed: false, reason: `${vendorSubscription.tier} tier doesn't include New Arrivals.` };
        }
        if (getRemainingUsage('newArrivalsUsed') <= 0) {
          return { allowed: false, reason: 'Monthly New Arrivals limit reached.' };
        }
        break;
      case 'isClearance':
        if (!features.canFeatureClearance) {
          return { allowed: false, reason: `${vendorSubscription.tier} tier doesn't include Clearance. Upgrade to Growth or higher.` };
        }
        if (getRemainingUsage('clearanceUsed') <= 0) {
          return { allowed: false, reason: 'Monthly Clearance limit reached.' };
        }
        break;
      case 'isGiftCard':
        if (!features.canFeatureGiftCards) {
          return { allowed: false, reason: `${vendorSubscription.tier} tier doesn't include Gift Cards. Upgrade to Pro or Elite.` };
        }
        break;
    }
    
    return { allowed: true };
  };

  const handleSubscriptionCategoryChange = (category: keyof typeof formData.subscriptionCategories, value: boolean) => {
    const check = canEnableFeature(category);
    if (!check.allowed && value) {
      setMessage({ type: 'error', text: check.reason || 'Feature not available' });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      subscriptionCategories: {
        ...prev.subscriptionCategories,
        [category]: value
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;
    
    if (name === 'price' || name === 'originalPrice' || name === 'stock' || name === 'dealDiscount') {
      parsedValue = parseFloat(value) || 0;
    } else if (name.includes('shipping')) {
      parsedValue = parseFloat(value) || 0;
    } else if (name === 'giftCardValues') {
      parsedValue = value.split(',').map((v: string) => parseFloat(v.trim())).filter((v: number) => !isNaN(v));
    }
    
    setFormData(prev => setNested(prev, name, parsedValue));
  };

  function setNested<T>(obj: T, path: string, value: unknown): T {
    const keys = path.split('.');
    const last = keys.pop()!;
    let cur: any = { ...obj };
    let ref = cur;
    for (const k of keys) ref = ref[k] = { ...ref[k] };
    ref[last] = value;
    return cur;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: 'info', text: 'Updating product...' });

    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product updated successfully! Redirecting...' });
        setTimeout(() => router.push('/vendor-dashboard'), 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Error updating product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating product' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h1>
          <p className="text-[var(--color-text-muted)] mb-6">Only vendors can access this page.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300">
            Go to Home
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const features = getSubscriptionFeatures();
  const tier = vendorSubscription?.tier || 'basic';

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section *
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-primary)] font-medium">Edit Product</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                Edit {formData.name || 'Product'}
              </h1>
              <p className="text-[var(--color-text-muted)] mt-2">
                Update your product information and visibility settings
              </p>
            </div>
            
            {/* Subscription Badge *
            <div className="bg-[var(--color-surface)] rounded-xl px-4 py-2 border border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 ${tier === 'elite' ? 'text-yellow-500' : tier === 'pro' ? 'text-purple-500' : tier === 'growth' ? 'text-green-500' : 'text-gray-500'}`} />
                <span className="text-sm font-medium capitalize">{tier} Plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Message Alert *
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-slide-in ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-600' :
            message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-600' :
            'bg-blue-500/10 border border-blue-500/20 text-blue-600'
          }`}>
            {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {message.type === 'info' && <Package className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Section Navigation *
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 px-2">
                Sections
              </h3>
              <nav className="space-y-1">
                {[
                  { id: 'basic', label: 'Basic Info', icon: <Package className="w-4 h-4" /> },
                  { id: 'category', label: 'Category', icon: <Layers className="w-4 h-4" /> },
                  { id: 'subscription', label: 'Visibility Features', icon: <TrendingUp className="w-4 h-4" /> },
                  { id: 'specs', label: 'Specifications', icon: <Tag className="w-4 h-4" /> },
                  { id: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
                  { id: 'tags', label: 'Tags', icon: <Hash className="w-4 h-4" /> },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Form *
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            {/* Basic Information Section - Same as before *
            <div id="basic" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[var(--color-primary)]" />
                  Basic Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                {/* ... existing basic info fields ... *
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Product Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">SKU *</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={5} className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Price (KSh) *</label>
                    <input type="number" name="price" value={formData.price || ''} onChange={handleInputChange} required min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Original Price</label>
                    <input type="number" name="originalPrice" value={formData.originalPrice || ''} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Stock *</label>
                    <input type="number" name="stock" value={formData.stock || ''} onChange={handleInputChange} required min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Brand</label>
                  <input type="text" name="brand" value={formData.brand || ''} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                </div>
              </div>
            </div>

            {/* Category Section *
            <div id="category" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[var(--color-primary)]" />
                  Category
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Category *</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                      <option value="">Select Category</option>
                      {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Personal Care', 'Sports & Outdoors', 'Toys & Games', 'Food & Beverages', 'Health & Wellness', 'Books & Stationery', 'Automotive', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Subcategory</label>
                    <input type="text" name="subcategory" value={formData.subcategory || ''} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* NEW: Subscription Visibility Features Section *
            <div id="subscription" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                  Visibility Features
                  {vendorSubscription?.status !== 'active' && (
                    <span className="ml-2 text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-full">Subscription Required</span>
                  )}
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Based on your {tier} plan. Upgrade to access more features.
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Today's Deals *
                <div className={`p-4 rounded-xl border transition-all ${formData.subscriptionCategories.isTodayDeal ? 'border-orange-500 bg-orange-500/5' : 'border-[var(--color-border)]'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${formData.subscriptionCategories.isTodayDeal ? 'bg-orange-500/20' : 'bg-[var(--color-background-soft)]'}`}>
                        <Flame className={`w-5 h-5 ${formData.subscriptionCategories.isTodayDeal ? 'text-orange-500' : 'text-[var(--color-text-muted)]'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--color-text)]">Today's Deal</h3>
                          {!features.canFeatureTodayDeals && (
                            <span className="text-xs bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Upgrade to Growth
                            </span>
                          )}
                          {features.canFeatureTodayDeals && vendorSubscription && (
                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                              {getRemainingUsage('todayDealsUsed')} of {features.maxTodayDealsPerMonth} remaining this month
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                          Feature your product with a time-limited discount. Creates urgency and drives conversions.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubscriptionCategoryChange('isTodayDeal', !formData.subscriptionCategories.isTodayDeal)}
                      disabled={!features.canFeatureTodayDeals}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.subscriptionCategories.isTodayDeal ? 'bg-orange-500' : 'bg-[var(--color-border)]'
                      } ${!features.canFeatureTodayDeals ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.subscriptionCategories.isTodayDeal ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  {formData.subscriptionCategories.isTodayDeal && (
                    <div className="mt-4 pl-11 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Discount (%)</label>
                          <input
                            type="number"
                            name="dealDiscount"
                            value={formData.dealDiscount || ''}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            required
                            placeholder="e.g., 20"
                            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Expiry Date</label>
                          <input
                            type="datetime-local"
                            name="dealExpiry"
                            value={formData.dealExpiry || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Best Sellers *
                <div className={`p-4 rounded-xl border transition-all ${formData.subscriptionCategories.isBestSeller ? 'border-green-500 bg-green-500/5' : 'border-[var(--color-border)]'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${formData.subscriptionCategories.isBestSeller ? 'bg-green-500/20' : 'bg-[var(--color-background-soft)]'}`}>
                        <TrendingUp className={`w-5 h-5 ${formData.subscriptionCategories.isBestSeller ? 'text-green-500' : 'text-[var(--color-text-muted)]'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--color-text)]">Best Seller</h3>
                          {!features.canFeatureBestSellers && (
                            <span className="text-xs bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Upgrade to Growth
                            </span>
                          )}
                          {features.canFeatureBestSellers && vendorSubscription && (
                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                              {getRemainingUsage('bestSellersUsed')} of {features.maxBestSellersPerMonth} remaining
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                          Showcase your top-performing products. Builds trust and social proof.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubscriptionCategoryChange('isBestSeller', !formData.subscriptionCategories.isBestSeller)}
                      disabled={!features.canFeatureBestSellers}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.subscriptionCategories.isBestSeller ? 'bg-green-500' : 'bg-[var(--color-border)]'
                      } ${!features.canFeatureBestSellers ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.subscriptionCategories.isBestSeller ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* New Arrivals *
                <div className={`p-4 rounded-xl border transition-all ${formData.subscriptionCategories.isNewArrival ? 'border-blue-500 bg-blue-500/5' : 'border-[var(--color-border)]'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${formData.subscriptionCategories.isNewArrival ? 'bg-blue-500/20' : 'bg-[var(--color-background-soft)]'}`}>
                        <Sparkles className={`w-5 h-5 ${formData.subscriptionCategories.isNewArrival ? 'text-blue-500' : 'text-[var(--color-text-muted)]'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--color-text)]">New Arrival</h3>
                          {!features.canFeatureNewArrivals && (
                            <span className="text-xs bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Basic plan includes 5/month
                            </span>
                          )}
                          {features.canFeatureNewArrivals && vendorSubscription && (
                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                              {getRemainingUsage('newArrivalsUsed')} of {features.maxNewArrivalsPerMonth} remaining
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                          Highlight new products. Keeps your store fresh and encourages repeat visits.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubscriptionCategoryChange('isNewArrival', !formData.subscriptionCategories.isNewArrival)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.subscriptionCategories.isNewArrival ? 'bg-blue-500' : 'bg-[var(--color-border)]'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.subscriptionCategories.isNewArrival ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Clearance *
                <div className={`p-4 rounded-xl border transition-all ${formData.subscriptionCategories.isClearance ? 'border-red-500 bg-red-500/5' : 'border-[var(--color-border)]'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${formData.subscriptionCategories.isClearance ? 'bg-red-500/20' : 'bg-[var(--color-background-soft)]'}`}>
                        <Percent className={`w-5 h-5 ${formData.subscriptionCategories.isClearance ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--color-text)]">Clearance</h3>
                          {!features.canFeatureClearance && (
                            <span className="text-xs bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Upgrade to Growth
                            </span>
                          )}
                          {features.canFeatureClearance && vendorSubscription && (
                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                              {getRemainingUsage('clearanceUsed')} of {features.maxClearanceItemsPerMonth} remaining
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                          Clear old inventory with deep discounts. Perfect for overstock or seasonal items.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubscriptionCategoryChange('isClearance', !formData.subscriptionCategories.isClearance)}
                      disabled={!features.canFeatureClearance}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.subscriptionCategories.isClearance ? 'bg-red-500' : 'bg-[var(--color-border)]'
                      } ${!features.canFeatureClearance ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.subscriptionCategories.isClearance ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  {formData.subscriptionCategories.isClearance && (
                    <div className="mt-4 pl-11">
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Clearance Reason</label>
                      <select
                        name="clearanceReason"
                        value={formData.clearanceReason || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm"
                      >
                        <option value="">Select reason</option>
                        <option value="overstock">Overstock / Excess Inventory</option>
                        <option value="old_inventory">Old Inventory / Discontinued</option>
                        <option value="seasonal">Seasonal Clearance</option>
                        <option value="discontinued">Discontinued Product</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Gift Cards *
                <div className={`p-4 rounded-xl border transition-all ${formData.subscriptionCategories.isGiftCard ? 'border-purple-500 bg-purple-500/5' : 'border-[var(--color-border)]'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${formData.subscriptionCategories.isGiftCard ? 'bg-purple-500/20' : 'bg-[var(--color-background-soft)]'}`}>
                        <Gift className={`w-5 h-5 ${formData.subscriptionCategories.isGiftCard ? 'text-purple-500' : 'text-[var(--color-text-muted)]'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--color-text)]">Gift Card</h3>
                          {!features.canFeatureGiftCards && (
                            <span className="text-xs bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Upgrade to Pro
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                          Sell digital gift cards. Perfect for gifting and increasing revenue.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubscriptionCategoryChange('isGiftCard', !formData.subscriptionCategories.isGiftCard)}
                      disabled={!features.canFeatureGiftCards}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.subscriptionCategories.isGiftCard ? 'bg-purple-500' : 'bg-[var(--color-border)]'
                      } ${!features.canFeatureGiftCards ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.subscriptionCategories.isGiftCard ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  {formData.subscriptionCategories.isGiftCard && (
                    <div className="mt-4 pl-11">
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Gift Card Values (KES) - Comma separated</label>
                      <input
                        type="text"
                        name="giftCardValues"
                        value={formData.giftCardValues?.join(', ') || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 500, 1000, 2500, 5000"
                        className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Upgrade Prompt for Basic Users *
                {tier === 'basic' && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">Unlock More Features</h4>
                        <p className="text-xs text-[var(--color-text-muted)] mb-3">
                          Upgrade to Growth or Pro plan to access Today's Deals, Best Sellers, Clearance, and Gift Cards.
                        </p>
                        <Link
                          href="/subscriptions"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
                        >
                          Upgrade Now
                          <ArrowLeft className="w-3 h-3 rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications Section *
            <div id="specs" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[var(--color-primary)]" />
                  Specifications
                </h2>
              </div>
              <div className="p-6">
                {formData.specifications.map((spec, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                    <input type="text" placeholder="Specification name" value={spec.key} onChange={(e) => {
                      const updated = [...formData.specifications];
                      updated[idx].key = e.target.value;
                      setFormData(prev => ({ ...prev, specifications: updated }));
                    }} className="flex-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    <input type="text" placeholder="Value" value={spec.value} onChange={(e) => {
                      const updated = [...formData.specifications];
                      updated[idx].value = e.target.value;
                      setFormData(prev => ({ ...prev, specifications: updated }));
                    }} className="flex-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== idx) }))} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }))} className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-background-soft)] text-[var(--color-primary)] rounded-xl">
                  <Plus className="w-4 h-4" /> Add Specification
                </button>
              </div>
            </div>

            {/* Shipping Section *
            <div id="shipping" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[var(--color-primary)]" />
                  Shipping Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Weight (grams) *</label>
                  <input type="number" name="shipping.weight" value={formData.shipping.weight || ''} onChange={handleInputChange} required min="0" className="w-full md:w-1/2 px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-3">Dimensions (cm)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Length</label>
                      <input type="number" name="shipping.dimensions.length" value={formData.shipping.dimensions.length || ''} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Width</label>
                      <input type="number" name="shipping.dimensions.width" value={formData.shipping.dimensions.width || ''} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Height</label>
                      <input type="number" name="shipping.dimensions.height" value={formData.shipping.dimensions.height || ''} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Section *
            <div id="tags" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Hash className="w-5 h-5 text-[var(--color-primary)]" />
                  Tags
                </h2>
              </div>
              <div className="p-6">
                <input type="text" placeholder="Enter tags separated by commas" value={formData.tags.join(', ')} onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))} className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
              </div>
            </div>

            {/* Form Actions *
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-8">
              <button type="button" onClick={() => router.push('/vendor-dashboard')} className="px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50">
                {isSaving ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Updating...</> : <><Save className="w-5 h-5" /> Update Product</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}*/


/*'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Tag,
  Truck,
  Hash,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Flame,
  Percent,
  Crown,
  Lock,
  Gift
} from 'lucide-react';
import { SUBSCRIPTION_FEATURES, SubscriptionTier, SubscriptionFeatures } from '@/types/subscription';

// Feature toggle keys from subscriptionCategories
type FeatureToggleKey = 'isTodayDeal' | 'isBestSeller' | 'isNewArrival' | 'isClearance' | 'isGiftCard';

// Usage counter keys from monthlyUsage
type MonthlyUsageKey = 'todayDealsUsed' | 'bestSellersUsed' | 'newArrivalsUsed' | 'clearanceUsed' | 'giftCardsCreated';

// Max limit keys from SubscriptionFeatures
type MaxLimitKey = keyof Pick<SubscriptionFeatures, 
  'maxTodayDealsPerMonth' | 'maxBestSellersPerMonth' | 'maxNewArrivalsPerMonth' | 'maxClearanceItemsPerMonth' | 'maxGiftCardsPerMonth'
>;

// Map feature toggle -> usage counter key
const FEATURE_TO_USAGE: Record<FeatureToggleKey, MonthlyUsageKey> = {
  isTodayDeal: 'todayDealsUsed',
  isBestSeller: 'bestSellersUsed',
  isNewArrival: 'newArrivalsUsed',
  isClearance: 'clearanceUsed',
  isGiftCard: 'giftCardsCreated'
};

// Map feature toggle -> max limit key
const FEATURE_TO_MAX: Record<FeatureToggleKey, MaxLimitKey> = {
  isTodayDeal: 'maxTodayDealsPerMonth',
  isBestSeller: 'maxBestSellersPerMonth',
  isNewArrival: 'maxNewArrivalsPerMonth',
  isClearance: 'maxClearanceItemsPerMonth',
  isGiftCard: 'maxGiftCardsPerMonth'
};

interface VendorSubscription {
  tier: SubscriptionTier;
  status: string;
  monthlyUsage: Record<MonthlyUsageKey, number>;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  sku: string;
  brand?: string;
  specifications: { key: string; value: string }[];
  shipping: {
    weight: number;
    dimensions: { length: number; width: number; height: number };
  };
  tags: string[];
  isActive?: boolean;
  subscriptionCategories: Record<FeatureToggleKey, boolean>;
  dealDiscount?: number;
  dealExpiry?: string;
  dealStartDate?: string;
  clearanceReason?: string;
  isGiftCardProduct?: boolean;
  giftCardValues?: number[];
}

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    stock: 0,
    sku: '',
    specifications: [],
    shipping: { weight: 0, dimensions: { length: 0, width: 0, height: 0 } },
    tags: [],
    subscriptionCategories: {
      isTodayDeal: false,
      isBestSeller: false,
      isNewArrival: false,
      isClearance: false,
      isGiftCard: false
    }
  });

  const [vendorSubscription, setVendorSubscription] = useState<VendorSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    if (productId && user) {
      Promise.all([fetchProduct(), fetchVendorSubscription()]);
    }
  }, [productId, user]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data.product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchVendorSubscription = async () => {
    try {
      const response = await fetch('/api/vendor/subscription/status');
      if (response.ok) {
        const data = await response.json();
        setVendorSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionFeatures = (): SubscriptionFeatures => {
    if (!vendorSubscription) return SUBSCRIPTION_FEATURES.basic;
    return SUBSCRIPTION_FEATURES[vendorSubscription.tier];
  };

  const getRemainingUsage = (feature: FeatureToggleKey): number => {
    if (!vendorSubscription) return 0;
    
    const used = vendorSubscription.monthlyUsage[FEATURE_TO_USAGE[feature]] || 0;
    const max = getSubscriptionFeatures()[FEATURE_TO_MAX[feature]];
    
    return max - used;
  };

  const canEnableFeature = (feature: FeatureToggleKey): { allowed: boolean; reason?: string } => {
    if (!vendorSubscription || vendorSubscription.status !== 'active') {
      return { allowed: false, reason: 'Active subscription required' };
    }

    const features = getSubscriptionFeatures();

    const capabilityMap: Record<FeatureToggleKey, keyof SubscriptionFeatures> = {
      isTodayDeal: 'canFeatureTodayDeals',
      isBestSeller: 'canFeatureBestSellers',
      isNewArrival: 'canFeatureNewArrivals',
      isClearance: 'canFeatureClearance',
      isGiftCard: 'canFeatureGiftCards'
    };

    if (!features[capabilityMap[feature]]) {
      const upgradeMap: Record<FeatureToggleKey, string> = {
        isTodayDeal: 'Growth',
        isBestSeller: 'Growth',
        isNewArrival: 'Basic',
        isClearance: 'Growth',
        isGiftCard: 'Pro'
      };
      return { 
        allowed: false, 
        reason: `${vendorSubscription.tier} tier doesn't include this feature. Upgrade to ${upgradeMap[feature]} or higher.` 
      };
    }

    const remaining = getRemainingUsage(feature);
    if (remaining <= 0) {
      return { allowed: false, reason: 'Monthly limit reached. Upgrade or wait for next month.' };
    }

    return { allowed: true };
  };

  const handleSubscriptionCategoryChange = (category: FeatureToggleKey, value: boolean) => {
    const check = canEnableFeature(category);
    if (!check.allowed && value) {
      setMessage({ type: 'error', text: check.reason || 'Feature not available' });
      return;
    }

    setFormData(prev => ({
      ...prev,
      subscriptionCategories: { ...prev.subscriptionCategories, [category]: value }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;

    if (name === 'price' || name === 'originalPrice' || name === 'stock' || name === 'dealDiscount') {
      parsedValue = parseFloat(value) || 0;
    } else if (name.includes('shipping')) {
      parsedValue = parseFloat(value) || 0;
    } else if (name === 'giftCardValues') {
      parsedValue = value.split(',').map((v: string) => parseFloat(v.trim())).filter((v: number) => !isNaN(v));
    }

    setFormData(prev => setNested(prev, name, parsedValue));
  };

  function setNested<T>(obj: T, path: string, value: unknown): T {
    const keys = path.split('.');
    const last = keys.pop()!;
    let cur: any = { ...obj };
    let ref = cur;
    for (const k of keys) ref = ref[k] = { ...ref[k] };
    ref[last] = value;
    return cur;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: 'info', text: 'Updating product...' });

    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product updated successfully! Redirecting...' });
        setTimeout(() => router.push('/vendor-dashboard'), 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Error updating product' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error updating product' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h1>
          <p className="text-[var(--color-text-muted)] mb-6">Only vendors can access this page.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300">
            Go to Home
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const features = getSubscriptionFeatures();
  const tier = vendorSubscription?.tier || 'basic';

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-primary)] font-medium">Edit Product</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                Edit {formData.name || 'Product'}
              </h1>
              <p className="text-[var(--color-text-muted)] mt-2">
                Update your product information and visibility settings
              </p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-xl px-4 py-2 border border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 ${tier === 'elite' ? 'text-yellow-500' : tier === 'pro' ? 'text-purple-500' : tier === 'growth' ? 'text-green-500' : 'text-gray-500'}`} />
                <span className="text-sm font-medium capitalize">{tier} Plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-slide-in ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-600' :
            message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-600' :
            'bg-blue-500/10 border border-blue-500/20 text-blue-600'
          }`}>
            {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {message.type === 'info' && <Package className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 px-2">Sections</h3>
              <nav className="space-y-1">
                {[
                  { id: 'basic', label: 'Basic Info', icon: <Package className="w-4 h-4" /> },
                  { id: 'category', label: 'Category', icon: <Tag className="w-4 h-4" /> },
                  { id: 'subscription', label: 'Visibility Features', icon: <TrendingUp className="w-4 h-4" /> },
                  { id: 'specs', label: 'Specifications', icon: <Hash className="w-4 h-4" /> },
                  { id: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
                  { id: 'tags', label: 'Tags', icon: <Hash className="w-4 h-4" /> },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            {/* Basic Info *
            <div id="basic" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[var(--color-primary)]" />
                  Basic Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Product Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">SKU *</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={5} className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Price (KSh) *</label>
                    <input type="number" name="price" value={formData.price || ''} onChange={handleInputChange} required min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Original Price</label>
                    <input type="number" name="originalPrice" value={formData.originalPrice || ''} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Stock *</label>
                    <input type="number" name="stock" value={formData.stock || ''} onChange={handleInputChange} required min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Brand</label>
                  <input type="text" name="brand" value={formData.brand || ''} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                </div>
              </div>
            </div>

            {/* Category *
            <div id="category" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[var(--color-primary)]" />
                  Category
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Category *</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                      <option value="">Select Category</option>
                      {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Personal Care', 'Sports & Outdoors', 'Toys & Games', 'Food & Beverages', 'Health & Wellness', 'Books & Stationery', 'Automotive', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Subcategory</label>
                    <input type="text" name="subcategory" value={formData.subcategory || ''} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Features *
            <div id="subscription" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                  Visibility Features
                  {vendorSubscription?.status !== 'active' && (
                    <span className="ml-2 text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-full">Subscription Required</span>
                  )}
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Based on your {tier} plan. Upgrade to access more features.
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Today's Deal *
                <FeatureToggle
                  title="Today's Deal"
                  description="Feature your product with a time-limited discount. Creates urgency and drives conversions."
                  icon={<Flame className="w-5 h-5" />}
                  featureKey="isTodayDeal"
                  color="orange"
                  formData={formData}
                  features={features}
                  vendorSubscription={vendorSubscription}
                  getRemainingUsage={getRemainingUsage}
                  onToggle={handleSubscriptionCategoryChange}
                >
                  {formData.subscriptionCategories.isTodayDeal && (
                    <div className="mt-4 pl-11 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Discount (%)</label>
                          <input type="number" name="dealDiscount" value={formData.dealDiscount || ''} onChange={handleInputChange} min="0" max="100" required placeholder="e.g., 20" className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Expiry Date</label>
                          <input type="datetime-local" name="dealExpiry" value={formData.dealExpiry || ''} onChange={handleInputChange} required className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm" />
                        </div>
                      </div>
                    </div>
                  )}
                </FeatureToggle>

                {/* Best Seller *
                <FeatureToggle
                  title="Best Seller"
                  description="Showcase your top-performing products. Builds trust and social proof."
                  icon={<TrendingUp className="w-5 h-5" />}
                  featureKey="isBestSeller"
                  color="green"
                  formData={formData}
                  features={features}
                  vendorSubscription={vendorSubscription}
                  getRemainingUsage={getRemainingUsage}
                  onToggle={handleSubscriptionCategoryChange}
                />

                {/* New Arrival *
                <FeatureToggle
                  title="New Arrival"
                  description="Highlight new products. Keeps your store fresh and encourages repeat visits."
                  icon={<Sparkles className="w-5 h-5" />}
                  featureKey="isNewArrival"
                  color="blue"
                  formData={formData}
                  features={features}
                  vendorSubscription={vendorSubscription}
                  getRemainingUsage={getRemainingUsage}
                  onToggle={handleSubscriptionCategoryChange}
                />

                {/* Clearance *
                <FeatureToggle
                  title="Clearance"
                  description="Clear old inventory with deep discounts. Perfect for overstock or seasonal items."
                  icon={<Percent className="w-5 h-5" />}
                  featureKey="isClearance"
                  color="red"
                  formData={formData}
                  features={features}
                  vendorSubscription={vendorSubscription}
                  getRemainingUsage={getRemainingUsage}
                  onToggle={handleSubscriptionCategoryChange}
                >
                  {formData.subscriptionCategories.isClearance && (
                    <div className="mt-4 pl-11">
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Clearance Reason</label>
                      <select name="clearanceReason" value={formData.clearanceReason || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm">
                        <option value="">Select reason</option>
                        <option value="overstock">Overstock / Excess Inventory</option>
                        <option value="old_inventory">Old Inventory / Discontinued</option>
                        <option value="seasonal">Seasonal Clearance</option>
                        <option value="discontinued">Discontinued Product</option>
                      </select>
                    </div>
                  )}
                </FeatureToggle>

                {/* Gift Card *
                <FeatureToggle
                  title="Gift Card"
                  description="Sell digital gift cards. Perfect for gifting and increasing revenue."
                  icon={<Gift className="w-5 h-5" />}
                  featureKey="isGiftCard"
                  color="purple"
                  formData={formData}
                  features={features}
                  vendorSubscription={vendorSubscription}
                  getRemainingUsage={getRemainingUsage}
                  onToggle={handleSubscriptionCategoryChange}
                >
                  {formData.subscriptionCategories.isGiftCard && (
                    <div className="mt-4 pl-11">
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Gift Card Values (KES) - Comma separated</label>
                      <input type="text" name="giftCardValues" value={formData.giftCardValues?.join(', ') || ''} onChange={handleInputChange} placeholder="e.g., 500, 1000, 2500, 5000" className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm" />
                    </div>
                  )}
                </FeatureToggle>

                {tier === 'basic' && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">Unlock More Features</h4>
                        <p className="text-xs text-[var(--color-text-muted)] mb-3">
                          Upgrade to Growth or Pro plan to access Today's Deals, Best Sellers, Clearance, and Gift Cards.
                        </p>
                        <Link href="/subscriptions" className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors">
                          Upgrade Now
                          <ArrowLeft className="w-3 h-3 rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications *
            <div id="specs" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[var(--color-primary)]" />
                  Specifications
                </h2>
              </div>
              <div className="p-6">
                {formData.specifications.map((spec, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                    <input type="text" placeholder="Specification name" value={spec.key} onChange={(e) => {
                      const updated = [...formData.specifications];
                      updated[idx].key = e.target.value;
                      setFormData(prev => ({ ...prev, specifications: updated }));
                    }} className="flex-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    <input type="text" placeholder="Value" value={spec.value} onChange={(e) => {
                      const updated = [...formData.specifications];
                      updated[idx].value = e.target.value;
                      setFormData(prev => ({ ...prev, specifications: updated }));
                    }} className="flex-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== idx) }))} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }))} className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-background-soft)] text-[var(--color-primary)] rounded-xl">
                  <Plus className="w-4 h-4" /> Add Specification
                </button>
              </div>
            </div>

            {/* Shipping *
            <div id="shipping" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[var(--color-primary)]" />
                  Shipping Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Weight (grams) *</label>
                  <input type="number" name="shipping.weight" value={formData.shipping.weight || ''} onChange={handleInputChange} required min="0" className="w-full md:w-1/2 px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-3">Dimensions (cm)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Length</label>
                      <input type="number" name="shipping.dimensions.length" value={formData.shipping.dimensions.length || ''} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Width</label>
                      <input type="number" name="shipping.dimensions.width" value={formData.shipping.dimensions.width || ''} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Height</label>
                      <input type="number" name="shipping.dimensions.height" value={formData.shipping.dimensions.height || ''} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags *
            <div id="tags" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Hash className="w-5 h-5 text-[var(--color-primary)]" />
                  Tags
                </h2>
              </div>
              <div className="p-6">
                <input type="text" placeholder="Enter tags separated by commas" value={formData.tags.join(', ')} onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))} className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl" />
              </div>
            </div>

            {/* Actions *
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-8">
              <button type="button" onClick={() => router.push('/vendor-dashboard')} className="px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50">
                {isSaving ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Updating...</> : <><Save className="w-5 h-5" /> Update Product</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Extracted reusable component to reduce duplication
function FeatureToggle({
  title,
  description,
  icon,
  featureKey,
  color,
  formData,
  features,
  vendorSubscription,
  getRemainingUsage,
  onToggle,
  children
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  featureKey: FeatureToggleKey;
  color: 'orange' | 'green' | 'blue' | 'red' | 'purple';
  formData: ProductFormData;
  features: SubscriptionFeatures;
  vendorSubscription: VendorSubscription | null;
  getRemainingUsage: (f: FeatureToggleKey) => number;
  onToggle: (key: FeatureToggleKey, val: boolean) => void;
  children?: React.ReactNode;
}) {
  const isEnabled = formData.subscriptionCategories[featureKey];
  
  const capabilityMap: Record<FeatureToggleKey, keyof SubscriptionFeatures> = {
    isTodayDeal: 'canFeatureTodayDeals',
    isBestSeller: 'canFeatureBestSellers',
    isNewArrival: 'canFeatureNewArrivals',
    isClearance: 'canFeatureClearance',
    isGiftCard: 'canFeatureGiftCards'
  };

  const canFeature = features[capabilityMap[featureKey]];
  const colorClasses = {
    orange: { border: 'border-orange-500', bg: 'bg-orange-500/5', iconBg: 'bg-orange-500/20', iconText: 'text-orange-500' },
    green: { border: 'border-green-500', bg: 'bg-green-500/5', iconBg: 'bg-green-500/20', iconText: 'text-green-500' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-500/5', iconBg: 'bg-blue-500/20', iconText: 'text-blue-500' },
    red: { border: 'border-red-500', bg: 'bg-red-500/5', iconBg: 'bg-red-500/20', iconText: 'text-red-500' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-500/5', iconBg: 'bg-purple-500/20', iconText: 'text-purple-500' }
  };
  const c = colorClasses[color];

  return (
    <div className={`p-4 rounded-xl border transition-all ${isEnabled ? `${c.border} ${c.bg}` : 'border-[var(--color-border)]'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isEnabled ? c.iconBg : 'bg-[var(--color-background-soft)]'}`}>
            <div className={isEnabled ? c.iconText : 'text-[var(--color-text-muted)]'}>{icon}</div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--color-text)]">{title}</h3>
              {!canFeature && (
                <span className="text-xs bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Upgrade required
                </span>
              )}
              {canFeature && vendorSubscription && (
                <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                  {getRemainingUsage(featureKey)} remaining this month
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggle(featureKey, !isEnabled)}
          disabled={!canFeature}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? c.iconText.replace('text-', 'bg-') : 'bg-[var(--color-border)]'
          } ${!canFeature ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
      {children}
    </div>
  );
}*/


// app/vendor/products/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Tag,
  Truck,
  Hash,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Flame,
  Percent,
  Crown,
  Lock,
  Gift,
  Loader2,
  Info,
  Zap,
  Shield
} from 'lucide-react';

type FeatureToggleKey = 'isTodayDeal' | 'isBestSeller' | 'isNewArrival' | 'isClearance' | 'isGiftCard';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  sku: string;
  brand?: string;
  specifications: { key: string; value: string }[];
  shipping: {
    weight: number;
    dimensions: { length: number; width: number; height: number };
  };
  tags: string[];
  isActive?: boolean;
  subscriptionCategories: Record<FeatureToggleKey, boolean>;
  dealDiscount?: number;
  dealExpiry?: string;
  dealStartDate?: string;
  clearanceReason?: string;
  isGiftCardProduct?: boolean;
  giftCardValues?: number[];
}

interface SubscriptionInfo {
  tier: string;
  status: string;
  remainingDays: number;
  monthlyUsage: {
    todayDealsUsed: number;
    bestSellersUsed: number;
    newArrivalsUsed: number;
    clearanceUsed: number;
    giftCardsCreated: number;
  };
  limits: {
    maxTodayDealsPerMonth: number;
    maxBestSellersPerMonth: number;
    maxNewArrivalsPerMonth: number;
    maxClearanceItemsPerMonth: number;
    maxGiftCardsPerMonth: number;
  };
  features: {
    canFeatureTodayDeals: boolean;
    canFeatureBestSellers: boolean;
    canFeatureNewArrivals: boolean;
    canFeatureClearance: boolean;
    canFeatureGiftCards: boolean;
  };
}

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    stock: 0,
    sku: '',
    specifications: [],
    shipping: { weight: 0, dimensions: { length: 0, width: 0, height: 0 } },
    tags: [],
    subscriptionCategories: {
      isTodayDeal: false,
      isBestSeller: false,
      isNewArrival: false,
      isClearance: false,
      isGiftCard: false
    }
  });

  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    if (productId && user) {
      Promise.all([fetchProduct(), fetchSubscriptionStatus()]);
    }
  }, [productId, user]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...data.product,
          dealExpiry: data.product.dealExpiry ? new Date(data.product.dealExpiry).toISOString().slice(0, 16) : '',
          dealStartDate: data.product.dealStartDate ? new Date(data.product.dealStartDate).toISOString().slice(0, 16) : '',
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to load product' });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage({ type: 'error', text: 'Error loading product' });
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/vendor/subscription/status');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionInfo({
          tier: data.subscription.tier,
          status: data.subscription.status,
          remainingDays: data.remainingDays,
          monthlyUsage: data.subscription.monthlyUsage,
          limits: {
            maxTodayDealsPerMonth: data.subscription.tier === 'basic' ? 0 : data.subscription.tier === 'growth' ? 10 : data.subscription.tier === 'pro' ? 30 : 100,
            maxBestSellersPerMonth: data.subscription.tier === 'basic' ? 0 : data.subscription.tier === 'growth' ? 15 : data.subscription.tier === 'pro' ? 50 : 200,
            maxNewArrivalsPerMonth: data.subscription.tier === 'basic' ? 5 : data.subscription.tier === 'growth' ? 20 : data.subscription.tier === 'pro' ? 100 : 500,
            maxClearanceItemsPerMonth: data.subscription.tier === 'basic' ? 0 : data.subscription.tier === 'growth' ? 10 : data.subscription.tier === 'pro' ? 30 : 100,
            maxGiftCardsPerMonth: data.subscription.tier === 'pro' ? 50 : data.subscription.tier === 'elite' ? 200 : 0,
          },
          features: {
            canFeatureTodayDeals: data.subscription.tier !== 'basic',
            canFeatureBestSellers: data.subscription.tier !== 'basic',
            canFeatureNewArrivals: true,
            canFeatureClearance: data.subscription.tier !== 'basic',
            canFeatureGiftCards: data.subscription.tier === 'pro' || data.subscription.tier === 'elite',
          }
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingUsage = (feature: FeatureToggleKey): number => {
    if (!subscriptionInfo) return 0;
    
    const usageMap = {
      isTodayDeal: subscriptionInfo.monthlyUsage.todayDealsUsed,
      isBestSeller: subscriptionInfo.monthlyUsage.bestSellersUsed,
      isNewArrival: subscriptionInfo.monthlyUsage.newArrivalsUsed,
      isClearance: subscriptionInfo.monthlyUsage.clearanceUsed,
      isGiftCard: subscriptionInfo.monthlyUsage.giftCardsCreated
    };
    
    const limitMap = {
      isTodayDeal: subscriptionInfo.limits.maxTodayDealsPerMonth,
      isBestSeller: subscriptionInfo.limits.maxBestSellersPerMonth,
      isNewArrival: subscriptionInfo.limits.maxNewArrivalsPerMonth,
      isClearance: subscriptionInfo.limits.maxClearanceItemsPerMonth,
      isGiftCard: subscriptionInfo.limits.maxGiftCardsPerMonth
    };
    
    const used = usageMap[feature];
    const max = limitMap[feature];
    
    return max - used;
  };

  const canEnableFeature = (feature: FeatureToggleKey): { allowed: boolean; reason?: string } => {
    if (!subscriptionInfo || subscriptionInfo.status !== 'active') {
      return { allowed: false, reason: 'Active subscription required' };
    }

    const featureMap = {
      isTodayDeal: subscriptionInfo.features.canFeatureTodayDeals,
      isBestSeller: subscriptionInfo.features.canFeatureBestSellers,
      isNewArrival: subscriptionInfo.features.canFeatureNewArrivals,
      isClearance: subscriptionInfo.features.canFeatureClearance,
      isGiftCard: subscriptionInfo.features.canFeatureGiftCards
    };

    if (!featureMap[feature]) {
      const upgradeMap = {
        isTodayDeal: 'Growth',
        isBestSeller: 'Growth',
        isNewArrival: 'Basic',
        isClearance: 'Growth',
        isGiftCard: 'Pro'
      };
      return { 
        allowed: false, 
        reason: `${subscriptionInfo.tier} tier doesn't include this feature. Upgrade to ${upgradeMap[feature]} or higher.` 
      };
    }

    const remaining = getRemainingUsage(feature);
    if (remaining <= 0 && subscriptionInfo.limits[`max${feature.replace('is', '')}PerMonth` as keyof typeof subscriptionInfo.limits] > 0) {
      return { allowed: false, reason: 'Monthly limit reached. Upgrade or wait for next month.' };
    }

    return { allowed: true };
  };

  const handleSubscriptionCategoryChange = (category: FeatureToggleKey, value: boolean) => {
    if (value && !formData.subscriptionCategories[category]) {
      const check = canEnableFeature(category);
      if (!check.allowed) {
        setMessage({ type: 'error', text: check.reason || 'Feature not available' });
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      subscriptionCategories: { ...prev.subscriptionCategories, [category]: value }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'originalPrice' || name === 'stock' || name === 'dealDiscount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name.includes('shipping.')) {
      const path = name.split('.');
      setFormData(prev => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          [path[1]]: path[1] === 'dimensions' 
            ? { ...prev.shipping.dimensions, [path[2]]: parseFloat(value) || 0 }
            : parseFloat(value) || 0
        }
      }));
    } else if (name === 'giftCardValues') {
      const values = value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
      setFormData(prev => ({ ...prev, giftCardValues: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: 'info', text: 'Updating product...' });

    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product updated successfully!' });
        // Refresh subscription info to show updated usage
        await fetchSubscriptionStatus();
        setTimeout(() => {
          router.push('/vendor-dashboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Error updating product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating product' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h1>
          <p className="text-[var(--color-text-muted)] mb-6">Only vendors can access this page.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300">
            Go to Home
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const tier = subscriptionInfo?.tier || 'basic';
  const tierColors = {
    basic: 'text-gray-500',
    growth: 'text-green-500',
    pro: 'text-purple-500',
    elite: 'text-yellow-500'
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-primary)] font-medium">Edit Product</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                Edit {formData.name || 'Product'}
              </h1>
              <p className="text-[var(--color-text-muted)] mt-2">
                Update your product information and visibility settings
              </p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-xl px-4 py-2 border border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 ${tierColors[tier as keyof typeof tierColors]}`} />
                <span className="text-sm font-medium capitalize">{tier} Plan</span>
                {subscriptionInfo && subscriptionInfo.remainingDays > 0 && (
                  <span className="text-xs text-[var(--color-text-muted)] ml-2">
                    ({subscriptionInfo.remainingDays} days left)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-600' :
            message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-600' :
            'bg-blue-500/10 border border-blue-500/20 text-blue-600'
          }`}>
            {message.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {message.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {message.type === 'info' && <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 px-2">
                Sections
              </h3>
              <nav className="space-y-1">
                {[
                  { id: 'basic', label: 'Basic Info', icon: <Package className="w-4 h-4" /> },
                  { id: 'category', label: 'Category', icon: <Tag className="w-4 h-4" /> },
                  { id: 'subscription', label: 'Visibility Features', icon: <TrendingUp className="w-4 h-4" /> },
                  { id: 'specs', label: 'Specifications', icon: <Hash className="w-4 h-4" /> },
                  { id: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
                  { id: 'tags', label: 'Tags', icon: <Hash className="w-4 h-4" /> },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            {/* Basic Info Section */}
            <div id="basic" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[var(--color-primary)]" />
                  Basic Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">SKU *</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Price (KES) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Original Price (Optional)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice || ''}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock || ''}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  />
                </div>
              </div>
            </div>

            {/* Category Section */}
            <div id="category" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[var(--color-primary)]" />
                  Category
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    >
                      <option value="">Select Category</option>
                      {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Personal Care', 'Sports & Outdoors', 'Toys & Games', 'Food & Beverages', 'Health & Wellness', 'Books & Stationery', 'Automotive', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Subcategory</label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Features Section */}
            <div id="subscription" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                  Visibility Features
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Boost your product visibility based on your {tier} plan
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Today's Deal */}
                <FeatureToggleCard
                  title="Today's Deal"
                  description="Feature your product with a time-limited discount. Creates urgency and drives conversions."
                  icon={<Flame className="w-5 h-5" />}
                  featureKey="isTodayDeal"
                  color="orange"
                  isEnabled={formData.subscriptionCategories.isTodayDeal}
                  canEnable={subscriptionInfo?.features.canFeatureTodayDeals || false}
                  remainingUsage={getRemainingUsage('isTodayDeal')}
                  maxLimit={subscriptionInfo?.limits.maxTodayDealsPerMonth || 0}
                  tier={tier}
                  onToggle={(value) => handleSubscriptionCategoryChange('isTodayDeal', value)}
                >
                  {formData.subscriptionCategories.isTodayDeal && (
                    <div className="mt-4 pl-11 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Discount (%) *</label>
                          <input
                            type="number"
                            name="dealDiscount"
                            value={formData.dealDiscount || ''}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            required
                            placeholder="e.g., 20"
                            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Expiry Date *</label>
                          <input
                            type="datetime-local"
                            name="dealExpiry"
                            value={formData.dealExpiry || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </FeatureToggleCard>

                {/* Best Seller */}
                <FeatureToggleCard
                  title="Best Seller"
                  description="Showcase your top-performing products. Builds trust and social proof."
                  icon={<TrendingUp className="w-5 h-5" />}
                  featureKey="isBestSeller"
                  color="green"
                  isEnabled={formData.subscriptionCategories.isBestSeller}
                  canEnable={subscriptionInfo?.features.canFeatureBestSellers || false}
                  remainingUsage={getRemainingUsage('isBestSeller')}
                  maxLimit={subscriptionInfo?.limits.maxBestSellersPerMonth || 0}
                  tier={tier}
                  onToggle={(value) => handleSubscriptionCategoryChange('isBestSeller', value)}
                />

                {/* New Arrival */}
                <FeatureToggleCard
                  title="New Arrival"
                  description="Highlight new products. Keeps your store fresh and encourages repeat visits."
                  icon={<Sparkles className="w-5 h-5" />}
                  featureKey="isNewArrival"
                  color="blue"
                  isEnabled={formData.subscriptionCategories.isNewArrival}
                  canEnable={subscriptionInfo?.features.canFeatureNewArrivals || false}
                  remainingUsage={getRemainingUsage('isNewArrival')}
                  maxLimit={subscriptionInfo?.limits.maxNewArrivalsPerMonth || 0}
                  tier={tier}
                  onToggle={(value) => handleSubscriptionCategoryChange('isNewArrival', value)}
                />

                {/* Clearance */}
                <FeatureToggleCard
                  title="Clearance"
                  description="Clear old inventory with deep discounts. Perfect for overstock or seasonal items."
                  icon={<Percent className="w-5 h-5" />}
                  featureKey="isClearance"
                  color="red"
                  isEnabled={formData.subscriptionCategories.isClearance}
                  canEnable={subscriptionInfo?.features.canFeatureClearance || false}
                  remainingUsage={getRemainingUsage('isClearance')}
                  maxLimit={subscriptionInfo?.limits.maxClearanceItemsPerMonth || 0}
                  tier={tier}
                  onToggle={(value) => handleSubscriptionCategoryChange('isClearance', value)}
                >
                  {formData.subscriptionCategories.isClearance && (
                    <div className="mt-4 pl-11">
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Clearance Reason</label>
                      <select
                        name="clearanceReason"
                        value={formData.clearanceReason || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      >
                        <option value="">Select reason</option>
                        <option value="overstock">Overstock / Excess Inventory</option>
                        <option value="old_inventory">Old Inventory / Discontinued</option>
                        <option value="seasonal">Seasonal Clearance</option>
                        <option value="discontinued">Discontinued Product</option>
                      </select>
                    </div>
                  )}
                </FeatureToggleCard>

                {/* Gift Card */}
                <FeatureToggleCard
                  title="Gift Card"
                  description="Sell digital gift cards. Perfect for gifting and increasing revenue."
                  icon={<Gift className="w-5 h-5" />}
                  featureKey="isGiftCard"
                  color="purple"
                  isEnabled={formData.subscriptionCategories.isGiftCard}
                  canEnable={subscriptionInfo?.features.canFeatureGiftCards || false}
                  remainingUsage={getRemainingUsage('isGiftCard')}
                  maxLimit={subscriptionInfo?.limits.maxGiftCardsPerMonth || 0}
                  tier={tier}
                  onToggle={(value) => handleSubscriptionCategoryChange('isGiftCard', value)}
                >
                  {formData.subscriptionCategories.isGiftCard && (
                    <div className="mt-4 pl-11">
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Gift Card Values (KES) - Comma separated</label>
                      <input
                        type="text"
                        name="giftCardValues"
                        value={formData.giftCardValues?.join(', ') || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 500, 1000, 2500, 5000"
                        className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      />
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Enter multiple values separated by commas
                      </p>
                    </div>
                  )}
                </FeatureToggleCard>

                {/* Upgrade Banner for Basic Plan */}
                {tier === 'basic' && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">Unlock More Features</h4>
                        <p className="text-xs text-[var(--color-text-muted)] mb-3">
                          Upgrade to Growth or Pro plan to access Today's Deals, Best Sellers, Clearance, and Gift Cards.
                        </p>
                        <Link href="/subscriptions" className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors">
                          Upgrade Now
                          <Zap className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications Section */}
            <div id="specs" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[var(--color-primary)]" />
                  Specifications
                </h2>
              </div>
              <div className="p-6">
                {formData.specifications.map((spec, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Specification name"
                      value={spec.key}
                      onChange={(e) => {
                        const updated = [...formData.specifications];
                        updated[idx].key = e.target.value;
                        setFormData(prev => ({ ...prev, specifications: updated }));
                      }}
                      className="flex-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => {
                        const updated = [...formData.specifications];
                        updated[idx].value = e.target.value;
                        setFormData(prev => ({ ...prev, specifications: updated }));
                      }}
                      className="flex-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== idx) }))}
                      className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }))}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-background-soft)] text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)]/10 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Specification
                </button>
              </div>
            </div>

            {/* Shipping Section */}
            <div id="shipping" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[var(--color-primary)]" />
                  Shipping Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Weight (grams) *</label>
                  <input
                    type="number"
                    name="shipping.weight"
                    value={formData.shipping.weight || ''}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full md:w-1/2 px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-3">Dimensions (cm)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Length</label>
                      <input
                        type="number"
                        name="shipping.dimensions.length"
                        value={formData.shipping.dimensions.length || ''}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Width</label>
                      <input
                        type="number"
                        name="shipping.dimensions.width"
                        value={formData.shipping.dimensions.width || ''}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">Height</label>
                      <input
                        type="number"
                        name="shipping.dimensions.height"
                        value={formData.shipping.dimensions.height || ''}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div id="tags" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Hash className="w-5 h-5 text-[var(--color-primary)]" />
                  Tags
                </h2>
              </div>
              <div className="p-6">
                <input
                  type="text"
                  placeholder="Enter tags separated by commas"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
                  className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  Tags help customers find your products. Separate multiple tags with commas.
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-8">
              <button
                type="button"
                onClick={() => router.push('/vendor-dashboard')}
                className="px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium hover:border-[var(--color-primary)] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Feature Toggle Card Component
interface FeatureToggleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  featureKey: string;
  color: 'orange' | 'green' | 'blue' | 'red' | 'purple';
  isEnabled: boolean;
  canEnable: boolean;
  remainingUsage: number;
  maxLimit: number;
  tier: string;
  onToggle: (value: boolean) => void;
  children?: React.ReactNode;
}

function FeatureToggleCard({
  title,
  description,
  icon,
  color,
  isEnabled,
  canEnable,
  remainingUsage,
  maxLimit,
  tier,
  onToggle,
  children
}: FeatureToggleCardProps) {
  const colorClasses = {
    orange: { border: 'border-orange-500', bg: 'bg-orange-500/5', iconBg: 'bg-orange-500/20', iconText: 'text-orange-500', toggle: 'bg-orange-500' },
    green: { border: 'border-green-500', bg: 'bg-green-500/5', iconBg: 'bg-green-500/20', iconText: 'text-green-500', toggle: 'bg-green-500' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-500/5', iconBg: 'bg-blue-500/20', iconText: 'text-blue-500', toggle: 'bg-blue-500' },
    red: { border: 'border-red-500', bg: 'bg-red-500/5', iconBg: 'bg-red-500/20', iconText: 'text-red-500', toggle: 'bg-red-500' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-500/5', iconBg: 'bg-purple-500/20', iconText: 'text-purple-500', toggle: 'bg-purple-500' }
  };
  const c = colorClasses[color];

  const isUpgradeRequired = !canEnable && maxLimit === 0;
  const isLimitReached = canEnable && remainingUsage <= 0 && maxLimit > 0;

  return (
    <div className={`p-4 rounded-xl border transition-all ${isEnabled ? `${c.border} ${c.bg}` : 'border-[var(--color-border)]'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${isEnabled ? c.iconBg : 'bg-[var(--color-background-soft)]'}`}>
            <div className={isEnabled ? c.iconText : 'text-[var(--color-text-muted)]'}>{icon}</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-[var(--color-text)]">{title}</h3>
              {isUpgradeRequired && (
                <span className="text-xs bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Upgrade to {title === 'Gift Card' ? 'Pro' : 'Growth'}
                </span>
              )}
              {isLimitReached && (
                <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Limit reached
                </span>
              )}
              {canEnable && !isLimitReached && remainingUsage > 0 && (
                <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                  {remainingUsage} of {maxLimit} remaining
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{description}</p>
            {isUpgradeRequired && (
              <div className="mt-2">
                <Link
                  href="/subscriptions"
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline"
                >
                  Upgrade your plan to unlock
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!isEnabled)}
          disabled={!canEnable || isLimitReached}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? c.toggle : 'bg-[var(--color-border)]'
          } ${(!canEnable || isLimitReached) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
      {children}
    </div>
  );
}

// Add missing ChevronRight import
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);