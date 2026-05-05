// app/admin/categories/page.tsx
/*'use client';

import { useState, useEffect } from 'react';
//import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Grid,
  List,
  Search,
  Filter,
  X,
  Save,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  Folder,
  Image as ImageIcon,
  Tag,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  level: number;
  order: number;
  isActive: boolean;
  metadata: {
    productCount: number;
    popular: boolean;
    featured: boolean;
  };
  path: string;
  ancestors: string[];
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
    // const { data: session, status } = useSession();
const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    description: '',
    icon: '',
    image: '',
    order: 0,
    isActive: true,
    popular: false,
    featured: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCategories();
    }
  }, );

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setFlatCategories(data.categories);
      
      // Build tree structure
      const tree = buildCategoryTree(data.categories);
      setCategories(tree);
      
      // Expand root nodes by default
      const rootIds = tree.map(cat => cat._id);
      setExpandedNodes(new Set(rootIds));
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTree = (categories: Category[], parentId: string | null = null): Category[] => {
    const filtered = categories.filter(cat => 
      parentId === null ? !cat.parentId : cat.parentId === parentId
    );
    
    return filtered.map(cat => ({
      ...cat,
      children: buildCategoryTree(categories, cat._id)
    }));
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      parentId: '',
      description: '',
      icon: '',
      image: '',
      order: flatCategories.length,
      isActive: true,
      popular: false,
      featured: false
    });
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId || '',
      description: category.description || '',
      icon: category.icon || '',
      image: category.image || '',
      order: category.order,
      isActive: category.isActive,
      popular: category.metadata.popular,
      featured: category.metadata.featured
    });
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/categories?id=${category._id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete');
      }
      
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = editingCategory 
        ? `/api/admin/categories?id=${editingCategory._id}`
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          metadata: {
            popular: formData.popular,
            featured: formData.featured
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save category');
      }
      
      toast.success(editingCategory ? 'Category updated' : 'Category created');
      setShowForm(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = () => {
    if (!searchTerm) return categories;
    
    const searchLower = searchTerm.toLowerCase();
    const filterRecursive = (cats: Category[]): Category[] => {
      return cats.reduce((acc: Category[], cat) => {
        const matches = cat.name.toLowerCase().includes(searchLower) ||
                        cat.slug.toLowerCase().includes(searchLower) ||
                        (cat.description && cat.description.toLowerCase().includes(searchLower));
        
        const filteredChildren = cat.children ? filterRecursive(cat.children) : [];
        
        if (matches || filteredChildren.length > 0) {
          acc.push({
            ...cat,
            children: filteredChildren
          });
        }
        
        return acc;
      }, []);
    };
    
    return filterRecursive(categories);
  };

  const renderCategoryTree = (categories: Category[], level: number = 0) => {
    return categories.map((category) => {
      const isExpanded = expandedNodes.has(category._id);
      const hasChildren = category.children && category.children.length > 0;
      const productCount = category.metadata?.productCount || 0;
      
      return (
        <div key={category._id} className="relative">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors group ${
              !category.isActive ? 'opacity-60' : ''
            }`}
            style={{ marginLeft: `${level * 24}px` }}
          >
            <button
              onClick={() => hasChildren && toggleExpand(category._id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-primary-soft)]/20 transition-colors"
              disabled={!hasChildren}
            >
              {hasChildren && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
            </button>
            
            <div className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-soft)]/20 to-[var(--color-primary)]/20 flex items-center justify-center">
                {category.icon ? (
                  <span className="text-xl">{category.icon}</span>
                ) : (
                  <Folder className="w-5 h-5 text-[var(--color-primary)]" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[var(--color-text)]">
                    {category.name}
                  </h3>
                  {!category.isActive && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                      Inactive
                    </span>
                  )}
                  {category.metadata?.featured && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {category.metadata?.popular && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mt-1">
                  <span>Slug: {category.slug}</span>
                  <span>Level: {category.level}</span>
                  <span>Order: {category.order}</span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {productCount} products
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 rounded-lg hover:bg-[var(--color-primary-soft)]/20 text-[var(--color-primary)] transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category)}
                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {isExpanded && hasChildren && (
            <div className="ml-4">
              {renderCategoryTree(category.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderListView = () => {
    const filtered = flatCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return (
      <div className="space-y-2">
        {filtered.map((category) => (
          <div
            key={category._id}
            className={`flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:shadow-md transition-all ${
              !category.isActive ? 'opacity-60 bg-gray-50' : 'bg-[var(--color-surface)]'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-soft)]/20 to-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
              {category.icon ? (
                <span className="text-xl">{category.icon}</span>
              ) : (
                <Folder className="w-5 h-5 text-[var(--color-primary)]" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-[var(--color-text)]">
                  {category.name}
                </h3>
                <span className="text-xs text-[var(--color-text-muted)]">({category.slug})</span>
                {!category.isActive && (
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Inactive</span>
                )}
                {category.metadata?.featured && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Featured</span>
                )}
                {category.metadata?.popular && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Popular</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] mt-1">
                <span>Level {category.level}</span>
                <span>Order: {category.order}</span>
                <span>{category.metadata?.productCount || 0} products</span>
                {category.parentId && <span>Parent ID: {category.parentId}</span>}
              </div>
              {category.description && (
                <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1">
                  {category.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 rounded-lg hover:bg-[var(--color-primary-soft)]/20 text-[var(--color-primary)] transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category)}
                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Access Denied</h1>
          <p className="text-[var(--color-text-muted)] mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header *
      <div className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)]">
                Category Management
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Manage your product categories and subcategories
              </p>
            </div>
            
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Category
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar *
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 w-64"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-2 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'tree'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                }`}
              >
                <FolderTree className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Categories Display *
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
          {viewMode === 'tree' ? (
            <div className="space-y-1">
              {filteredCategories().length > 0 ? (
                renderCategoryTree(filteredCategories())
              ) : (
                <div className="text-center py-12">
                  <FolderTree className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
                  <p className="text-[var(--color-text-muted)]">No categories found</p>
                </div>
              )}
            </div>
          ) : (
            renderListView()
          )}
        </div>
      </div>
      
      {/* Create/Edit Modal *
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--color-surface)] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic Information *
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  placeholder="e.g., Electronics"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Parent Category
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">None (Top Level)</option>
                  {flatCategories
                    .filter(cat => cat.level < 4)
                    .map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {'  '.repeat(cat.level - 1)}{cat.name} (Level {cat.level})
                      </option>
                    ))}
                </select>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Maximum depth is 4 levels
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  placeholder="Category description..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="e.g., 📱"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text)]">Active</span>
                  </label>
                </div>
              </div>
              
              <div className="border-t border-[var(--color-border)] pt-4">
                <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">Metadata</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text)]">Featured Category</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text)]">Popular Category</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingCategory ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}*/

// app/admin/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Grid,
  List,
  Search,
  Filter,
  X,
  Save,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  Folder,
  Image as ImageIcon,
  Tag,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  level: number;
  order: number;
  isActive: boolean;
  metadata: {
    productCount: number;
    popular: boolean;
    featured: boolean;
  };
  path: string;
  ancestors: string[];
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const { user, } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    description: '',
    icon: '',
    image: '',
    order: 0,
    isActive: true,
    popular: false,
    featured: false
  });
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user,  router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCategories();
    }
  }, [user]); // Add user as dependency

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setFlatCategories(data.categories);
      
      // Build tree structure
      const tree = buildCategoryTree(data.categories);
      setCategories(tree);
      
      // Expand root nodes by default
      const rootIds = tree.map(cat => cat._id);
      setExpandedNodes(new Set(rootIds));
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTree = (categories: Category[], parentId: string | null = null): Category[] => {
    const filtered = categories.filter(cat => 
      parentId === null ? !cat.parentId : cat.parentId === parentId
    );
    
    return filtered.map(cat => ({
      ...cat,
      children: buildCategoryTree(categories, cat._id)
    }));
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      parentId: '',
      description: '',
      icon: '',
      image: '',
      order: flatCategories.length,
      isActive: true,
      popular: false,
      featured: false
    });
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId || '',
      description: category.description || '',
      icon: category.icon || '',
      image: category.image || '',
      order: category.order,
      isActive: category.isActive,
      popular: category.metadata.popular,
      featured: category.metadata.featured
    });
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/categories?id=${category._id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete');
      }
      
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = editingCategory 
        ? `/api/admin/categories?id=${editingCategory._id}`
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          metadata: {
            popular: formData.popular,
            featured: formData.featured
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save category');
      }
      
      toast.success(editingCategory ? 'Category updated' : 'Category created');
      setShowForm(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = () => {
    if (!searchTerm) return categories;
    
    const searchLower = searchTerm.toLowerCase();
    const filterRecursive = (cats: Category[]): Category[] => {
      return cats.reduce((acc: Category[], cat) => {
        const matches = cat.name.toLowerCase().includes(searchLower) ||
                        cat.slug.toLowerCase().includes(searchLower) ||
                        (cat.description && cat.description.toLowerCase().includes(searchLower));
        
        const filteredChildren = cat.children ? filterRecursive(cat.children) : [];
        
        if (matches || filteredChildren.length > 0) {
          acc.push({
            ...cat,
            children: filteredChildren
          });
        }
        
        return acc;
      }, []);
    };
    
    return filterRecursive(categories);
  };

  const renderCategoryTree = (categories: Category[], level: number = 0) => {
  return categories.map((category) => {
    const isExpanded = expandedNodes.has(category._id);
    const hasChildren = category.children && category.children.length > 0;
    const productCount = category.metadata?.productCount || 0;

    return (
      <div key={category._id} className="relative">
        <div
          className={`flex items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors group ${
            !category.isActive ? 'opacity-60' : ''
          }`}
          style={{ marginLeft: `${level * (typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 24)}px` }}
        >
          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => hasChildren && toggleExpand(category._id)}
            className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded hover:bg-[var(--color-primary-soft)]/20 transition-colors mt-1 sm:mt-0"
            disabled={!hasChildren}
          >
            {hasChildren &&
              (isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              ))}
          </button>

          {/* Icon */}
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-soft)]/20 to-[var(--color-primary)]/20 flex items-center justify-center">
            {category.icon ? (
              <span className="text-lg sm:text-xl">{category.icon}</span>
            ) : (
              <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)]" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name + Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="font-medium text-[var(--color-text)] text-sm sm:text-base truncate">
                {category.name}
              </h3>
              {!category.isActive && (
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                  Inactive
                </span>
              )}
              {category.metadata?.featured && (
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-0.5 sm:gap-1">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">Featured</span>
                </span>
              )}
              {category.metadata?.popular && (
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-0.5 sm:gap-1">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">Popular</span>
                </span>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-0.5 text-[10px] sm:text-xs text-[var(--color-text-muted)] mt-1">
              <span className="hidden sm:inline">Slug: {category.slug}</span>
              <span className="hidden sm:inline">Level: {category.level}</span>
              <span>Order: {category.order}</span>
              <span className="flex items-center gap-0.5 sm:gap-1">
                <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {productCount} products
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleEdit(category)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--color-primary-soft)]/20 text-[var(--color-primary)] transition-colors"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => handleDelete(category)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="ml-2 sm:ml-4">
            {renderCategoryTree(category.children!, level + 1)}
          </div>
        )}
      </div>
    );
  });
};

  /*const renderCategoryTree = (categories: Category[], level: number = 0) => {
    return categories.map((category) => {
      const isExpanded = expandedNodes.has(category._id);
      const hasChildren = category.children && category.children.length > 0;
      const productCount = category.metadata?.productCount || 0;
      
      return (
        <div key={category._id} className="relative">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors group ${
              !category.isActive ? 'opacity-60' : ''
            }`}
            style={{ marginLeft: `${level * 24}px` }}
          >
            <button
              onClick={() => hasChildren && toggleExpand(category._id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-primary-soft)]/20 transition-colors"
              disabled={!hasChildren}
            >
              {hasChildren && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
            </button>
            
            <div className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-soft)]/20 to-[var(--color-primary)]/20 flex items-center justify-center">
                {category.icon ? (
                  <span className="text-xl">{category.icon}</span>
                ) : (
                  <Folder className="w-5 h-5 text-[var(--color-primary)]" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[var(--color-text)]">
                    {category.name}
                  </h3>
                  {!category.isActive && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                      Inactive
                    </span>
                  )}
                  {category.metadata?.featured && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {category.metadata?.popular && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mt-1">
                  <span>Slug: {category.slug}</span>
                  <span>Level: {category.level}</span>
                  <span>Order: {category.order}</span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {productCount} products
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 rounded-lg hover:bg-[var(--color-primary-soft)]/20 text-[var(--color-primary)] transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category)}
                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {isExpanded && hasChildren && (
            <div className="ml-4">
              {renderCategoryTree(category.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };*/

  const renderListView = () => {
    const filtered = flatCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return (
      <div className="space-y-2">
        {filtered.map((category) => (
          <div
            key={category._id}
            className={`flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:shadow-md transition-all ${
              !category.isActive ? 'opacity-60 bg-gray-50' : 'bg-[var(--color-surface)]'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-soft)]/20 to-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
              {category.icon ? (
                <span className="text-xl">{category.icon}</span>
              ) : (
                <Folder className="w-5 h-5 text-[var(--color-primary)]" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-[var(--color-text)]">
                  {category.name}
                </h3>
                <span className="text-xs text-[var(--color-text-muted)]">({category.slug})</span>
                {!category.isActive && (
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Inactive</span>
                )}
                {category.metadata?.featured && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Featured</span>
                )}
                {category.metadata?.popular && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Popular</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] mt-1">
                <span>Level {category.level}</span>
                <span>Order: {category.order}</span>
                <span>{category.metadata?.productCount || 0} products</span>
                {category.parentId && <span>Parent ID: {category.parentId}</span>}
              </div>
              {category.description && (
                <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1">
                  {category.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 rounded-lg hover:bg-[var(--color-primary-soft)]/20 text-[var(--color-primary)] transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category)}
                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Show loading state
  if ( loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Access Denied</h1>
          <p className="text-[var(--color-text-muted)] mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Rest of your JSX remains the same */}
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)]">
                Category Management
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Manage your product categories and subcategories
              </p>
            </div>
            
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Category
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 w-64"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-2 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'tree'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                }`}
              >
                <FolderTree className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Categories Display */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
          {viewMode === 'tree' ? (
            <div className="space-y-1">
              {filteredCategories().length > 0 ? (
                renderCategoryTree(filteredCategories())
              ) : (
                <div className="text-center py-12">
                  <FolderTree className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
                  <p className="text-[var(--color-text-muted)]">No categories found</p>
                </div>
              )}
            </div>
          ) : (
            renderListView()
          )}
        </div>
      </div>
      
      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--color-surface)] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  placeholder="e.g., Electronics"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Parent Category
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">None (Top Level)</option>
                  {flatCategories
                    .filter(cat => cat.level < 4)
                    .map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {'  '.repeat(cat.level - 1)}{cat.name} (Level {cat.level})
                      </option>
                    ))}
                </select>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Maximum depth is 4 levels
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  placeholder="Category description..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="e.g., 📱"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text)]">Active</span>
                  </label>
                </div>
              </div>
              
              <div className="border-t border-[var(--color-border)] pt-4">
                <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">Metadata</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text)]">Featured Category</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text)]">Popular Category</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingCategory ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}