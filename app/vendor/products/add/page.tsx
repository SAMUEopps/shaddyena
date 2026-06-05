/*"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';

/* ------------------------------------------------------------------ */
/* 4-level tree (the one you provided)                                */
/* ------------------------------------------------------------------ *
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
/* ------------------------------------------------------------------ *
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
/* ------------------------------------------------------------------ *
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
/* ------------------------------------------------------------------ *
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
  /* -------------------------------------------------------------- *
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
  /* -------------------------------------------------------------- *
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
  /* -------------------------------------------------------------- *
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

  /* ---------- specifications ---------- *
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

  /* ---------- tags ---------- *
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(p => ({ ...p, tags }));
  };

  /* ---------- submit ---------- *
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
  /* -------------------------------------------------------------- *
  if (!user || user.role !== 'vendor')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Only vendors can access this page.</p>
        </div>
      </div>
    );

  /* -------------------------------------------------------------- */
  /* Dynamic dropdown options                                       */
  /* -------------------------------------------------------------- *
  const level1 = keys(categoryTree);
  const level2 = formData.category ? getLevel2(formData.category) : [];
  const level3 = formData.category && formData.subcategory ? getLevel3(formData.category, formData.subcategory) : [];
  const level4 = formData.category && formData.subcategory && formData.subSubcategory
    ? getLevel4(formData.category, formData.subcategory, formData.subSubcategory)
    : [];  

  /* -------------------------------------------------------------- */
  /* Render                                                         */
  /* -------------------------------------------------------------- *
  return (
    <div className='min-h-screen bg-gray-50'>
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <button onClick={() => router.push('/?tab=dashboard')} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
              className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
              />
            </div>
          </div>
        </div>

        {/* Image Upload *
        <div>
          <h2 className="text-xl text-gray-700 font-semibold mb-4">Product Images</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
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

        {/* Category *
        <div>
          <h2 className="text-xl text-gray-700 font-semibold mb-4">Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={e => handleCategoryChange(1, e.target.value)}
                required
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
              >
                <option value="">-- Select Sub-sub-subcategory --</option>
                {level4.map(c => (
                  <option key={String(c)} value={c as string}>{c as string}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Specifications *
        <div>
          <h2 className="text-xl text-gray-700 font-semibold mb-4">Specifications</h2>
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

        {/* Shipping *
        <div>
          <h2 className="text-xl text-gray-700 font-semibold mb-4">Shipping Information</h2>
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
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags *
        <div>
          <h2 className="text-xl text-gray-700 font-semibold mb-4">Tags</h2>
          <input
            type="text"
            placeholder="Enter tags separated by commas (e.g., electronics, gadget, wireless)"
            onChange={handleTagsChange}
            className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
          />
          <p className="text-sm text-gray-500 mt-1">Current tags: {formData.tags.join(', ') || 'None'}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/?tab=dashboard')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] disabled:opacity-50"
          >
            {isLoading ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}*/


// app/vendor/products/add/page.tsx (updated sections)

/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';
import axios from 'axios';

// Types for dynamic categories
interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parentId?: string;
  children?: Category[];
}

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    categoryId: '',
    subcategoryId: '',
    subSubcategoryId: '',
    subSubSubcategoryId: '',
    images: [] as string[],
    stock: 0,
    sku: '',
    brand: '',
    specifications: [] as { key: string; value: string }[],
    shipping: { weight: 0, dimensions: { length: 0, width: 0, height: 0 } },
    tags: [] as string[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [subSubcategories, setSubSubcategories] = useState<Category[]>([]);
  const [subSubSubcategories, setSubSubSubcategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch top-level categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category?level=1');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const fetchSubcategories = async () => {
        try {
          const response = await axios.get(`/api/category?parentId=${formData.categoryId}`);
          setSubcategories(response.data.categories || []);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
    // Reset lower levels
    setFormData(prev => ({ ...prev, subcategoryId: '', subSubcategoryId: '', subSubSubcategoryId: '' }));
    setSubSubcategories([]);
    setSubSubSubcategories([]);
  }, [formData.categoryId]);

  // Fetch sub-subcategories when subcategory changes
  useEffect(() => {
    if (formData.subcategoryId) {
      const fetchSubSubcategories = async () => {
        try {
          const response = await axios.get(`/api/category?parentId=${formData.subcategoryId}`);
          setSubSubcategories(response.data.categories || []);
        } catch (error) {
          console.error('Error fetching sub-subcategories:', error);
        }
      };
      fetchSubSubcategories();
    } else {
      setSubSubcategories([]);
    }
    setFormData(prev => ({ ...prev, subSubcategoryId: '', subSubSubcategoryId: '' }));
    setSubSubSubcategories([]);
  }, [formData.subcategoryId]);

  // Fetch sub-sub-subcategories when subSubcategory changes
  useEffect(() => {
    if (formData.subSubcategoryId) {
      const fetchSubSubSubcategories = async () => {
        try {
          const response = await axios.get(`/api/category?parentId=${formData.subSubcategoryId}`);
          setSubSubSubcategories(response.data.categories || []);
        } catch (error) {
          console.error('Error fetching sub-sub-subcategories:', error);
        }
      };
      fetchSubSubSubcategories();
    } else {
      setSubSubSubcategories([]);
    }
    setFormData(prev => ({ ...prev, subSubSubcategoryId: '' }));
  }, [formData.subSubcategoryId]);

  // Image upload handlers
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

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Specifications handlers
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

  // Tags handler
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(p => ({ ...p, tags }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate category selection
    if (!formData.categoryId) {
      setMessage('Please select a category');
      setIsLoading(false);
      return;
    }

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

  // Auth guard
  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Only vendors can access this page.</p>
        </div>
      </div>
    );
  }

  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <button
            onClick={() => router.push('/?tab=dashboard')}
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
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                  className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                />
              </div>
            </div>
          </div>

          {/* Image Upload *
          <div>
            <h2 className="text-xl text-gray-700 font-semibold mb-4">Product Images</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
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

          {/* Category Selection - Dynamic *
          <div>
            <h2 className="text-xl text-gray-700 font-semibold mb-4">Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  required
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <select
                    value={formData.subcategoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategoryId: e.target.value }))}
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                  >
                    <option value="">-- Select Subcategory --</option>
                    {subcategories.map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {subSubcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-subcategory</label>
                  <select
                    value={formData.subSubcategoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, subSubcategoryId: e.target.value }))}
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                  >
                    <option value="">-- Select Sub-subcategory --</option>
                    {subSubcategories.map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {subSubSubcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-sub-subcategory</label>
                  <select
                    value={formData.subSubSubcategoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, subSubSubcategoryId: e.target.value }))}
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
                  >
                    <option value="">-- Select Sub-sub-subcategory --</option>
                    {subSubSubcategories.map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Specifications *
          <div>
            <h2 className="text-xl text-gray-700 font-semibold mb-4">Specifications</h2>
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

          {/* Shipping *
          <div>
            <h2 className="text-xl text-gray-700 font-semibold mb-4">Shipping Information</h2>
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
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
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
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
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
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
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
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags *
          <div>
            <h2 className="text-xl text-gray-700 font-semibold mb-4">Tags</h2>
            <input
              type="text"
              placeholder="Enter tags separated by commas (e.g., electronics, gadget, wireless)"
              onChange={handleTagsChange}
              className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
            />
            <p className="text-sm text-gray-500 mt-1">Current tags: {formData.tags.join(', ') || 'None'}</p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/?tab=dashboard')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md hover:bg-[#e5178a] disabled:opacity-50"
            >
              {isLoading ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}*/

/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  Tag,
  Image as ImageIcon,
  Layers,
  Truck,
  Weight,
  Ruler,
  Plus,
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Sparkles,
  Save,
  ShoppingBag,
  DollarSign,
  Box,
  Hash,
  FileText,
  Globe,
  Camera,
  FolderTree
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parentId?: string;
  children?: Category[];
}

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    categoryId: '',
    subcategoryId: '',
    subSubcategoryId: '',
    subSubSubcategoryId: '',
    images: [] as string[],
    stock: 0,
    sku: '',
    brand: '',
    specifications: [] as { key: string; value: string }[],
    shipping: { weight: 0, dimensions: { length: 0, width: 0, height: 0 } },
    tags: [] as string[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [subSubcategories, setSubSubcategories] = useState<Category[]>([]);
  const [subSubSubcategories, setSubSubSubcategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category?level=1');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      const fetchSubcategories = async () => {
        try {
          const response = await axios.get(`/api/category?parentId=${formData.categoryId}`);
          setSubcategories(response.data.categories || []);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
    setFormData(prev => ({ ...prev, subcategoryId: '', subSubcategoryId: '', subSubSubcategoryId: '' }));
    setSubSubcategories([]);
    setSubSubSubcategories([]);
  }, [formData.categoryId]);

  useEffect(() => {
    if (formData.subcategoryId) {
      const fetchSubSubcategories = async () => {
        try {
          const response = await axios.get(`/api/category?parentId=${formData.subcategoryId}`);
          setSubSubcategories(response.data.categories || []);
        } catch (error) {
          console.error('Error fetching sub-subcategories:', error);
        }
      };
      fetchSubSubcategories();
    } else {
      setSubSubcategories([]);
    }
    setFormData(prev => ({ ...prev, subSubcategoryId: '', subSubSubcategoryId: '' }));
    setSubSubSubcategories([]);
  }, [formData.subcategoryId]);

  useEffect(() => {
    if (formData.subSubcategoryId) {
      const fetchSubSubSubcategories = async () => {
        try {
          const response = await axios.get(`/api/category?parentId=${formData.subSubcategoryId}`);
          setSubSubSubcategories(response.data.categories || []);
        } catch (error) {
          console.error('Error fetching sub-sub-subcategories:', error);
        }
      };
      fetchSubSubSubcategories();
    } else {
      setSubSubSubcategories([]);
    }
    setFormData(prev => ({ ...prev, subSubSubcategoryId: '' }));
  }, [formData.subSubcategoryId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setMessage({ type: 'info', text: 'Uploading images...' });
    
    try {
      const uploadedUrls = await uploadMultipleToCloudinary(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      setImageFiles(prev => [...prev, ...files]);
      setMessage({ type: 'success', text: `${uploadedUrls.length} image(s) uploaded successfully!` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading images. Please try again.' });
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

  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  const keys = name.split('.');

  setFormData((prev) => {
    const newData: any = { ...prev };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];

    // Handle numbers properly
    const isNumberField = [
      'price',
      'originalPrice',
      'stock',
      'shipping.weight',
      'shipping.dimensions.length',
      'shipping.dimensions.width',
      'shipping.dimensions.height'
    ].includes(name);

    current[lastKey] = isNumberField
      ? parseFloat(value) || 0
      : value;

    return newData;
  });
};

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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(p => ({ ...p, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: 'info', text: 'Creating product...' });

    if (!formData.categoryId) {
      setMessage({ type: 'error', text: 'Please select a category' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Product created successfully! Redirecting...' });
        setTimeout(() => router.push('/'), 2000);
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.message || 'Error creating product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating product' });
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

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

  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading categories...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <Package className="w-4 h-4" /> },
    { id: 'images', label: 'Images', icon: <Camera className="w-4 h-4" /> },
    { id: 'category', label: 'Category', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'specs', label: 'Specifications', icon: <Tag className="w-4 h-4" /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
  ];

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
                <span className="text-sm text-[var(--color-primary)] font-medium">Vendor Dashboard</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">
                Add New Product
              </h1>
              <p className="text-[var(--color-text-muted)] mt-2">
                List your product and start selling to thousands of customers
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
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
          {/* Section Navigation - Sidebar *
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
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Sony, Apple, Samsung"
                    className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Images Section *
            <div id="images" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[var(--color-primary)]" />
                  Product Images
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Upload Images
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center transition-all ${!isUploading && 'hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'}`}>
                      <Upload className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3" />
                      <p className="text-[var(--color-text)] font-medium">Click or drag to upload</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">PNG, JPG, WEBP up to 5MB each</p>
                      {isUploading && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--color-primary)] border-t-transparent" />
                          <span className="text-sm text-[var(--color-primary)]">Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                      Uploaded Images ({formData.images.length})
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-background-soft)] border border-[var(--color-border)]">
                            <Image
                              src={url}
                              alt={`Product ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Section *
            <div id="category" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-[var(--color-primary)]" />
                  Category Selection
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {subcategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Subcategory</label>
                      <select
                        value={formData.subcategoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, subcategoryId: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      >
                        <option value="">-- Select Subcategory --</option>
                        {subcategories.map(sub => (
                          <option key={sub._id} value={sub._id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {subSubcategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Sub-subcategory</label>
                      <select
                        value={formData.subSubcategoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, subSubcategoryId: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      >
                        <option value="">-- Select Sub-subcategory --</option>
                        {subSubcategories.map(sub => (
                          <option key={sub._id} value={sub._id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {subSubSubcategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Sub-sub-subcategory</label>
                      <select
                        value={formData.subSubSubcategoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, subSubSubcategoryId: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      >
                        <option value="">-- Select Sub-sub-subcategory --</option>
                        {subSubSubcategories.map(sub => (
                          <option key={sub._id} value={sub._id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
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
                  <div key={idx} className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Specification name (e.g., Color)"
                      value={spec.key}
                      onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Black)"
                      value={spec.value}
                      onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
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

            {/* Tags Section *
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
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
                disabled={isLoading || isUploading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Product
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  Tag,
  Image as ImageIcon,
  Layers,
  Truck,
  Weight,
  Ruler,
  Plus,
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Sparkles,
  Save,
  ShoppingBag,
  DollarSign,
  Box,
  Hash,
  FileText,
  Globe,
  Camera,
  FolderTree
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parentId?: string;
  children?: Category[];
}

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    categoryId: '',
    subcategoryId: '',
    subSubcategoryId: '',
    subSubSubcategoryId: '',
    images: [] as string[],
    stock: 0,
    sku: '',
    brand: '',
    specifications: [] as { key: string; value: string }[],
    shipping: { weight: 0, dimensions: { length: 0, width: 0, height: 0 } },
    tags: [] as string[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [subSubcategories, setSubSubcategories] = useState<Category[]>([]);
  const [subSubSubcategories, setSubSubSubcategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState('basic');

  // "Other" option that will ALWAYS be available
  const OTHER_OPTION = { _id: 'other', name: 'Other', slug: 'other', level: 1 };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category?level=1');
        const fetchedCategories = response.data.categories || [];
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.categoryId && formData.categoryId !== 'other') {
      const fetchSubcategories = async () => {
        try {
          const response = await axios.get(`/api/category?parentId=${formData.categoryId}`);
          const fetchedSubcategories = response.data.categories || [];
          setSubcategories(fetchedSubcategories);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
          setSubcategories([]);
        }
      };
      fetchSubcategories();
    } else if (formData.categoryId === 'other') {
      setSubcategories([]);
    } else {
      setSubcategories([]);
    }
    setFormData(prev => ({ ...prev, subcategoryId: '', subSubcategoryId: '', subSubSubcategoryId: '' }));
    setSubSubcategories([]);
    setSubSubSubcategories([]);
  }, [formData.categoryId]);

  useEffect(() => {
    if (formData.subcategoryId && formData.subcategoryId !== 'other' && formData.subcategoryId !== 'other-sub') {
      const fetchSubSubcategories = async () => {
        try {
          const response = await axios.get(`/api/category?parentId=${formData.subcategoryId}`);
          const fetchedSubSubcategories = response.data.categories || [];
          setSubSubcategories(fetchedSubSubcategories);
        } catch (error) {
          console.error('Error fetching sub-subcategories:', error);
          setSubSubcategories([]);
        }
      };
      fetchSubSubcategories();
    } else {
      setSubSubcategories([]);
    }
    setFormData(prev => ({ ...prev, subSubcategoryId: '', subSubSubcategoryId: '' }));
    setSubSubSubcategories([]);
  }, [formData.subcategoryId]);

  useEffect(() => {
    if (formData.subSubcategoryId && formData.subSubcategoryId !== 'other' && formData.subSubcategoryId !== 'other-sub') {
      const fetchSubSubSubcategories = async () => {
        try {
          const response = await axios.get(`/api/category?parentId=${formData.subSubcategoryId}`);
          const fetchedSubSubSubcategories = response.data.categories || [];
          setSubSubSubcategories(fetchedSubSubSubcategories);
        } catch (error) {
          console.error('Error fetching sub-sub-subcategories:', error);
          setSubSubSubcategories([]);
        }
      };
      fetchSubSubSubcategories();
    } else {
      setSubSubSubcategories([]);
    }
    setFormData(prev => ({ ...prev, subSubSubcategoryId: '' }));
  }, [formData.subSubcategoryId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setMessage({ type: 'info', text: 'Uploading images...' });
    
    try {
      const uploadedUrls = await uploadMultipleToCloudinary(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      setImageFiles(prev => [...prev, ...files]);
      setMessage({ type: 'success', text: `${uploadedUrls.length} image(s) uploaded successfully!` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading images. Please try again.' });
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

  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  const keys = name.split('.');

  setFormData((prev) => {
    const newData: any = { ...prev };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];

    const isNumberField = [
      'price',
      'originalPrice',
      'stock',
      'shipping.weight',
      'shipping.dimensions.length',
      'shipping.dimensions.width',
      'shipping.dimensions.height'
    ].includes(name);

    current[lastKey] = isNumberField
      ? parseFloat(value) || 0
      : value;

    return newData;
  });
};

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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(p => ({ ...p, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: 'info', text: 'Creating product...' });

    if (!formData.categoryId) {
      setMessage({ type: 'error', text: 'Please select a category' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Product created successfully! Redirecting...' });
        setTimeout(() => router.push('/'), 2000);
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.message || 'Error creating product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating product' });
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Helper function to get categories with "Other" option ALWAYS included
  const getCategoriesWithOther = () => {
    return [OTHER_OPTION, ...categories];
  };

  // Helper function to get subcategories with "Other" option (only if a category is selected)
  const getSubcategoriesWithOther = () => {
    const options = [];
    if (formData.categoryId && formData.categoryId !== 'other') {
      options.push({ _id: 'other-sub', name: 'Other', slug: 'other', level: 2 });
    }
    return [...subcategories, ...options,];
  };

  // Helper for sub-subcategories
  const getSubSubcategoriesWithOther = () => {
    const options = [];
    if (formData.subcategoryId && formData.subcategoryId !== 'other' && formData.subcategoryId !== 'other-sub') {
      options.push({ _id: 'other-subsub', name: 'Other', slug: 'other', level: 3 });
    }
    return [...subSubcategories, ...options,];
  };

  // Helper for sub-sub-subcategories
  const getSubSubSubcategoriesWithOther = () => {
    const options = [];
    if (formData.subSubcategoryId && formData.subSubcategoryId !== 'other' && formData.subSubcategoryId !== 'other-sub' && formData.subSubcategoryId !== 'other-subsub') {
      options.push({ _id: 'other-subsubsub', name: 'Other', slug: 'other', level: 4 });
    }
    return [...subSubSubcategories, ...options];
  };

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

  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading categories...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <Package className="w-4 h-4" /> },
    { id: 'images', label: 'Images', icon: <Camera className="w-4 h-4" /> },
    { id: 'category', label: 'Category', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'specs', label: 'Specifications', icon: <Tag className="w-4 h-4" /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
  ];

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
                <span className="text-sm text-[var(--color-primary)] font-medium">Vendor Dashboard</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">
                Add New Product
              </h1>
              <p className="text-[var(--color-text-muted)] mt-2">
                List your product and start selling to thousands of customers
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
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
          {/* Section Navigation - Sidebar */}
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
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Sony, Apple, Samsung"
                    className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div id="images" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[var(--color-primary)]" />
                  Product Images
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Upload Images
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center transition-all ${!isUploading && 'hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'}`}>
                      <Upload className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3" />
                      <p className="text-[var(--color-text)] font-medium">Click or drag to upload</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">PNG, JPG, WEBP up to 5MB each</p>
                      {isUploading && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--color-primary)] border-t-transparent" />
                          <span className="text-sm text-[var(--color-primary)]">Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                      Uploaded Images ({formData.images.length})
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-background-soft)] border border-[var(--color-border)]">
                            <Image
                              src={url}
                              alt={`Product ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Section */}
            <div id="category" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden scroll-mt-24">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-[var(--color-primary)]" />
                  Category Selection
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    >
                      <option value="">-- Select Category --</option>
                      {getCategoriesWithOther().map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {formData.categoryId && getSubcategoriesWithOther().length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Subcategory</label>
                      <select
                        value={formData.subcategoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, subcategoryId: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      >
                        <option value="">-- Select Subcategory --</option>
                        {getSubcategoriesWithOther().map(sub => (
                          <option key={sub._id} value={sub._id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.subcategoryId && formData.subcategoryId !== 'other' && formData.subcategoryId !== 'other-sub' && getSubSubcategoriesWithOther().length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Sub-subcategory</label>
                      <select
                        value={formData.subSubcategoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, subSubcategoryId: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      >
                        <option value="">-- Select Sub-subcategory --</option>
                        {getSubSubcategoriesWithOther().map(sub => (
                          <option key={sub._id} value={sub._id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.subSubcategoryId && formData.subSubcategoryId !== 'other' && formData.subSubcategoryId !== 'other-sub' && formData.subSubcategoryId !== 'other-subsub' && getSubSubSubcategoriesWithOther().length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Sub-sub-subcategory</label>
                      <select
                        value={formData.subSubSubcategoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, subSubSubcategoryId: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                      >
                        <option value="">-- Select Sub-sub-subcategory --</option>
                        {getSubSubSubcategoriesWithOther().map(sub => (
                          <option key={sub._id} value={sub._id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
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
                  <div key={idx} className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Specification name (e.g., Color)"
                      value={spec.key}
                      onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Black)"
                      value={spec.value}
                      onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
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

            {/* Tags Section */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
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
                disabled={isLoading || isUploading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Product
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