/*import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
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
  specifications: {
    key: string;
    value: string;
  }[];
  variants?: {
    name: string;
    options: {
      name: string;
      price?: number;
      stock: number;
      sku: string;
    }[];
  }[];
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  isActive: boolean;
  isApproved: boolean;
  rating?: {
    average: number;
    count: number;
  };
  vendorId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const specificationSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const variantOptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true }
});

const variantSchema = new Schema({
  name: { type: String, required: true },
  options: [variantOptionSchema]
});

const shippingSchema = new Schema({
  weight: { type: Number, required: true }, // in grams
  dimensions: {
    length: { type: Number, required: true }, // in cm
    width: { type: Number, required: true }, // in cm
    height: { type: Number, required: true } // in cm
  }
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, trim: true },
    specifications: [specificationSchema],
    variants: [variantSchema],
    shipping: shippingSchema,
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

// Indexes for better query performance
productSchema.index({ vendorId: 1 });
productSchema.index({ shopId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1, isApproved: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ price: 1 });
//productSchema.index({ sku: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);*/

import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
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
  specifications: {
    key: string;
    value: string;
  }[];
  variants?: {
    name: string;
    options: {
      name: string;
      price?: number;
      stock: number;
      sku: string;
    }[];
  }[];
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  isActive: boolean;
  isApproved: boolean;
  rating?: {
    average: number;
    count: number;
  };
  vendorId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const specificationSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const variantOptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true }
});

const variantSchema = new Schema({
  name: { type: String, required: true },
  options: [variantOptionSchema]
});

const shippingSchema = new Schema({
  weight: { type: Number, required: true }, // in grams
  dimensions: {
    length: { type: Number, required: true }, // in cm
    width: { type: Number, required: true }, // in cm
    height: { type: Number, required: true } // in cm
  }
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    subSubcategory: { type: String, trim: true },
    subSubSubcategory: { type: String, trim: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, trim: true },
    specifications: [specificationSchema],
    variants: [variantSchema],
    shipping: shippingSchema,
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

// Indexes for better query performance
productSchema.index({ vendorId: 1 });
productSchema.index({ shopId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ subSubcategory: 1 });
productSchema.index({ isActive: 1, isApproved: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ price: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);