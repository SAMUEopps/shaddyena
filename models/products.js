// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryPath: { type: String, required: true },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subSubcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subSubSubcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, trim: true },
    specifications: [{
      key: { type: String, required: true },
      value: { type: String, required: true }
    }],
    variants: [{
      name: { type: String, required: true },
      options: [{
        name: { type: String, required: true },
        price: { type: Number },
        stock: { type: Number, required: true, default: 0 },
        sku: { type: String, required: true }
      }]
    }],
    shipping: {
      weight: { type: Number, required: true },
      dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true }
      }
    },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopName: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ categoryId: 1 });
productSchema.index({ categoryPath: 1 });
productSchema.index({ vendorId: 1 });
productSchema.index({ shopId: 1 });
productSchema.index({ isActive: 1, isApproved: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ sku: 1 }, { unique: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);