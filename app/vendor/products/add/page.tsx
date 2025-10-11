"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';

/* ------------------------------------------------------------------ */
/* 4-level tree (the one you provided)                                */
/* ------------------------------------------------------------------ */
const categoryTree = {
  Electronics: {
    "Mobiles & Accessories": {
      Smartphones: { Android: {}, iOS: {} },
      "Chargers & Cables": { "Fast Chargers": {}, "USB Cables": {} },
    },
    "Computers & Laptops": {
      Laptops: { "Gaming Laptops": {}, "Business Laptops": {} },
      "Computer Accessories": { Keyboards: {}, Mice: {} },
    },
  },
  Fashion: {
    Men: {
      Clothing: { Shirts: {}, Trousers: {} },
      Footwear: { Sneakers: {}, "Formal Shoes": {} },
    },
    Women: {
      Clothing: { Dresses: {}, "Tops & Blouses": {} },
      Accessories: { Bags: {}, Jewelry: {} },
    },
  },
  "Home & Kitchen": {
    Furniture: {
      "Living Room": { Sofas: {}, "Coffee Tables": {} },
      Bedroom: { Beds: {}, Wardrobes: {} },
    },
    "Kitchen Appliances": {
      "Cooking Appliances": { Microwaves: {}, Blenders: {} },
      "Small Appliances": { Toasters: {}, "Coffee Makers": {} },
    },
  },
  "Beauty & Personal Care": {
    Skincare: {
      Face: { Cleansers: {}, Moisturizers: {} },
      Body: { Lotions: {}, Scrubs: {} },
    },
    Haircare: {
      Shampoos: { "For Dry Hair": {}, "For Oily Hair": {} },
      "Hair Styling": { "Hair Dryers": {}, Straighteners: {} },
    },
  },
  "Food & Beverages": {
    Snacks: {
      "Chips & Crisps": { "Potato Chips": {}, "Tortilla Chips": {} },
      "Nuts & Seeds": { Almonds: {}, Cashews: {} },
    },
    Beverages: {
      "Soft Drinks": { Cola: {}, "Fruit Flavored": {} },
      "Hot Beverages": { Coffee: {}, Tea: {} },
    },
  },
  "Books & Stationery": {
    Books: {
      Fiction: { Novels: {}, "Short Stories": {} },
      "Non-Fiction": { Biographies: {}, "Self-Help": {} },
    },
    Stationery: {
      "Writing Supplies": { Pens: {}, Pencils: {} },
      "Paper Products": { Notebooks: {}, Diaries: {} },
    },
  },
} as const;

/* ------------------------------------------------------------------ */
/* Safe accessors                                                   */
/* ------------------------------------------------------------------ */
function keys<T extends object>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

function getLevel2(cat: string) {
  return (categoryTree as any)[cat] ? keys((categoryTree as any)[cat]) : [];
}
function getLevel3(cat: string, sub: string) {
  const l2 = (categoryTree as any)[cat];
  return l2 && l2[sub] ? keys(l2[sub]) : [];
}
function getLevel4(cat: string, sub: string, subSub: string) {
  const l3 = (categoryTree as any)[cat]?.[sub];
  return l3 && l3[subSub] ? keys(l3[subSub]) : [];
}

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  subSubcategory?: string;
  subSubSubcategory?: string;
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
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();

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
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  /* -------------------------------------------------------------- */
  /* Helper – deep set                                              */
  /* -------------------------------------------------------------- */
  function setNested<T>(obj: T, path: string, value: unknown): T {
    const keys = path.split('.');
    const last = keys.pop()!;
    let cur: any = { ...obj };
    let ref = cur;
    for (const k of keys) ref = ref[k] = { ...ref[k] };
    ref[last] = value;
    return cur;
  }

  /* -------------------------------------------------------------- */
  /* Image Upload Handlers                                          */
  /* -------------------------------------------------------------- */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrls = await uploadMultipleToCloudinary(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      setImageFiles(prev => [...prev, ...files]);
      setMessage('Images uploaded successfully!');
    } catch (error) {
      setMessage('Error uploading images. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  /* -------------------------------------------------------------- */
  /* Handlers                                                       */
  /* -------------------------------------------------------------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => setNested(prev, name, value));
  };

  const handleCategoryChange = (level: 1 | 2 | 3 | 4, val: string) => {
    setFormData(prev => ({
      ...prev,
      category: level === 1 ? val : prev.category,
      subcategory: level === 1 ? '' : level === 2 ? val : prev.subcategory,
      subSubcategory: level <= 2 ? '' : level === 3 ? val : prev.subSubcategory,
      subSubSubcategory: level <= 3 ? '' : val,
    }));
  };

  /* ---------- specifications ---------- */
  const addSpecification = () =>
    setFormData(p => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  const removeSpecification = (idx: number) =>
    setFormData(p => ({ ...p, specifications: p.specifications.filter((_, i) => i !== idx) }));
  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) =>
    setFormData(p => {
      const copy = [...p.specifications];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, specifications: copy };
    });

  /* ---------- tags ---------- */
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(p => ({ ...p, tags }));
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Product created successfully!');
        setTimeout(() => router.push('/?tab=dashboard'), 2000);
      } else {
        const err = await res.json();
        setMessage(err.message || 'Error creating product');
      }
    } catch (error) {
      setMessage('Error creating product');
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------------------- */
  /* Auth guard                                                     */
  /* -------------------------------------------------------------- */
  if (!user || user.role !== 'vendor')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Only vendors can access this page.</p>
        </div>
      </div>
    );

  /* -------------------------------------------------------------- */
  /* Dynamic dropdown options                                       */
  /* -------------------------------------------------------------- */
  const level1 = keys(categoryTree);
  const level2 = formData.category ? getLevel2(formData.category) : [];
  const level3 = formData.category && formData.subcategory ? getLevel3(formData.category, formData.subcategory) : [];
  const level4 = formData.category && formData.subcategory && formData.subSubcategory
    ? getLevel4(formData.category, formData.subcategory, formData.subSubcategory)
    : [];  

  /* -------------------------------------------------------------- */
  /* Render                                                         */
  /* -------------------------------------------------------------- */
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <button onClick={() => router.push('/dashboard')} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
          Back to Dashboard
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Information */}
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

        {/* Image Upload */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">You can upload multiple images at once</p>
          </div>
          
          {isUploading && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
              Uploading images...
            </div>
          )}

          {formData.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Images ({formData.images.length})</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={e => handleCategoryChange(1, e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              >
                <option value="">-- Select Category --</option>
                {level1.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory *</label>
              <select
                value={formData.subcategory}
                onChange={e => handleCategoryChange(2, e.target.value)}
                required={level2.length > 0}
                disabled={!formData.category}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              >
                <option value="">-- Select Subcategory --</option>
                {level2.map(c => (
                  <option key={String(c)} value={c as string}>{c as string}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub-subcategory *</label>
              <select
                value={formData.subSubcategory}
                onChange={e => handleCategoryChange(3, e.target.value)}
                required={level3.length > 0}
                disabled={!formData.subcategory}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              >
                <option value="">-- Select Sub-subcategory --</option>
                {level3.map(c => (
                  <option key={String(c)} value={c as string}>{c as string}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub-sub-subcategory</label>
              <select
                value={formData.subSubSubcategory}
                onChange={e => handleCategoryChange(4, e.target.value)}
                required={level4.length > 0}
                disabled={!formData.subSubcategory}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff199c] focus:border-[#ff199c]"
              >
                <option value="">-- Select Sub-sub-subcategory --</option>
                {level4.map(c => (
                  <option key={String(c)} value={c as string}>{c as string}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          {formData.specifications.map((spec, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                value={spec.key}
                onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeSpecification(idx)}
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

        {/* Shipping */}
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

        {/* Tags */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <input
            type="text"
            placeholder="Enter tags separated by commas (e.g., electronics, gadget, wireless)"
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
            disabled={isLoading || isUploading}
            className="bg-[#ff199c] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] disabled:opacity-50"
          >
            {isLoading ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}