// models/Category.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: mongoose.Types.ObjectId;
  level: number; // 1, 2, 3, 4
  order: number;
  isActive: boolean;
  metadata?: {
    productCount?: number;
    popular?: boolean;
    featured?: boolean;
  };
  path: string; // full path for easy querying e.g., "Electronics/Mobiles & Accessories/Smartphones"
  ancestors: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    image: { type: String, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
    level: { type: Number, required: true, min: 1, max: 4, default: 1 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metadata: {
      productCount: { type: Number, default: 0 },
      popular: { type: Boolean, default: false },
      featured: { type: Boolean, default: false },
    },
    path: { type: String, required: true }, // e.g., "Electronics/Mobiles & Accessories/Smartphones"
    ancestors: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true }
);

// Indexes for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ 'metadata.popular': 1 });
categorySchema.index({ 'metadata.featured': 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);