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

/*import mongoose, { Document, Schema } from 'mongoose';

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
  shopName: string;
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
    shopName: { type: String, required: true, trim: true },
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

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);*/

// models/Product.ts (updated)
/*import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: mongoose.Types.ObjectId; // Reference to Category
  categoryPath: string; // Store full path for easy querying
  subcategoryId?: mongoose.Types.ObjectId;
  subSubcategoryId?: mongoose.Types.ObjectId;
  subSubSubcategoryId?: mongoose.Types.ObjectId;
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
  shopName: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryPath: { type: String, required: true }, // Store full path for easier queries
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    subSubcategoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    subSubSubcategoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
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
      weight: { type: Number, required: false },
      dimensions: {
        length: { type: Number, required: false },
        width: { type: Number, required: false },
        height: { type: Number, required: false }
      }
    },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
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

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);*/

/*import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: mongoose.Types.ObjectId;
  categoryPath: string;
  subcategoryId?: mongoose.Types.ObjectId;
  subSubcategoryId?: mongoose.Types.ObjectId;
  subSubSubcategoryId?: mongoose.Types.ObjectId;
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
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
  };
  isActive: boolean;
  isApproved: boolean;
  rating?: {
    average: number;
    count: number;
  };

    // NEW: Subscription-based categorization
  subscriptionCategories: {
    isTodayDeal: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    isClearance: boolean;
    isGiftCard: boolean;
  };
  
  // For Today's Deals
  dealDiscount?: number;
  dealExpiry?: Date;
  dealStartDate?: Date;
  
  // For Clearance
  clearanceReason?: 'overstock' | 'old_inventory' | 'seasonal' | 'discontinued';
  originalStockCount?: number;
  
  // For Gift Cards
  isGiftCardProduct?: boolean;
  giftCardValues?: number[];
  
  // Tracking for limits
  featuredAt?: Date;
  featuredExpiresAt?: Date;
  monthlyFeatureCount?: number;

  vendorId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  shopName: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },

    originalPrice: { type: Number, min: 0 },

    // 🔥 MAIN CATEGORY (REQUIRED)
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    // 🔥 FULL PATH (FOR FAST FILTERING)
    categoryPath: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ SAFE OPTIONAL CATEGORY LEVELS
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      set: (v: any) => (v === "" || v === null ? undefined : v),
    },

    subSubcategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      set: (v: any) => (v === "" || v === null ? undefined : v),
    },

    subSubSubcategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      set: (v: any) => (v === "" || v === null ? undefined : v),
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    specifications: [
      {
        key: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
      },
    ],

    variants: [
      {
        name: { type: String, required: true, trim: true },
        options: [
          {
            name: { type: String, required: true, trim: true },
            price: { type: Number, min: 0 },
            stock: { type: Number, required: true, default: 0, min: 0 },
            sku: { type: String, required: true, trim: true },
          },
        ],
      },
    ],

    shipping: {
      weight: { type: Number, min: 0 },
      dimensions: {
        length: { type: Number, min: 0 },
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 },
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],



      subscriptionCategories: {
      isTodayDeal: { type: Boolean, default: false },
      isBestSeller: { type: Boolean, default: false },
      isNewArrival: { type: Boolean, default: false },
      isClearance: { type: Boolean, default: false },
      isGiftCard: { type: Boolean, default: false },
    },
    
    dealDiscount: { type: Number, min: 0, max: 100 },
    dealExpiry: { type: Date },
    dealStartDate: { type: Date },
    
    clearanceReason: { 
      type: String, 
      enum: ['overstock', 'old_inventory', 'seasonal', 'discontinued'] 
    },
    originalStockCount: { type: Number },
    
    isGiftCardProduct: { type: Boolean, default: false },
    giftCardValues: [{ type: Number }],
    
    featuredAt: { type: Date },
    featuredExpiresAt: { type: Date },
    monthlyFeatureCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);


// 🔍 INDEXES (optimized)
productSchema.index({ categoryId: 1 });
productSchema.index({ categoryPath: 1 });
productSchema.index({ vendorId: 1 });
productSchema.index({ shopId: 1 });
productSchema.index({ isActive: 1, isApproved: 1 });
productSchema.index({ price: 1 });
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.index({ 'subscriptionCategories.isTodayDeal': 1, dealExpiry: 1 });
productSchema.index({ 'subscriptionCategories.isBestSeller': 1 });
productSchema.index({ 'subscriptionCategories.isNewArrival': 1, createdAt: -1 });
productSchema.index({ 'subscriptionCategories.isClearance': 1 });
productSchema.index({ 'subscriptionCategories.isGiftCard': 1 });

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', productSchema);*/

  import mongoose, { Schema, Document } from 'mongoose';
  
  export interface IProduct extends Document {
    vendorId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    stock: number;
    description: string;
    image?: string; // Cloudinary URL
    imagePublicId?: string; // Cloudinary public ID for deletion
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const ProductSchema = new Schema<IProduct>({
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String },
    image: { type: String },
    imagePublicId: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, {
    timestamps: true
  });
  
  export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);