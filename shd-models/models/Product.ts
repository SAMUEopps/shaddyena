// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface IProduct extends Document {
// //   vendorId: mongoose.Types.ObjectId;
// //   name: string;
// //   price: number;
// //   stock: number;
// //   description: string;
// //   isActive: boolean;
// //   createdAt: Date;
// // }

// // const ProductSchema = new Schema<IProduct>({
// //   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
// //   name: { type: String, required: true },
// //   price: { type: Number, required: true },
// //   stock: { type: Number, required: true, default: 0 },
// //   description: { type: String },
// //   isActive: { type: Boolean, default: true },
// //   createdAt: { type: Date, default: Date.now }
// // });

// // export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// // models/Product.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IProduct extends Document {
//   vendorId: mongoose.Types.ObjectId;
//   name: string;
//   price: number;
//   stock: number;
//   description: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ProductSchema = new Schema<IProduct>({
//   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   stock: { type: Number, required: true, default: 0 },
//   description: { type: String },
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// }, {
//   timestamps: true // This will automatically manage createdAt and updatedAt
// });

// export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// models/Product.ts
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