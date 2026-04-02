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

"use client";
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
          router.push('/vendor/dashboard');
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
      {/* Hero Section */}
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
        {/* Message Alert */}
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
          {/* Section Navigation */}
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

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            {/* Basic Information Section */}
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

            {/* Category Section */}
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

            {/* Form Actions */}
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
}