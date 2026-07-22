// C:\Users\USER\Desktop\Projects\my-app\models\Savings.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISavings extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  createdAt: Date;
}

const SavingsSchema = new Schema<ISavings>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  reference: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Savings || mongoose.model<ISavings>('Savings', SavingsSchema);