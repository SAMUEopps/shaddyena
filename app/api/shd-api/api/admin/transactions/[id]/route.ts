// app/api/shd-api/api/admin/transactions/[id]/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import Order from '@/shd-models/models/Order';
import Vendor from '@/shd-models/models/Vendor';
import Organization from '@/shd-models/models/Organization';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// Next.js 15+ requires async params
type Params = Promise<{ id: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    // Ensure models are registered
    const OrganizationModel = mongoose.models.Organization || Organization;
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Build query to find by either _id or transactionId
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { transactionId: id };
    }

    // Find transaction - NO direct populate on orderId or vendorId
    const transaction = await Transaction.findOne(query)
      .populate({
        path: 'organizationId',
        select: 'name email settings',
        model: OrganizationModel
      });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Enrich with related data from metadata
    const enriched: any = transaction.toObject();
    
    // Get related order if exists in metadata
    if (transaction.metadata?.orderId) {
      try {
        const order = await Order.findById(transaction.metadata.orderId)
          .select('orderNumber totalAmount customerName customerPhone status items');
        if (order) {
          enriched.order = order;
        }
      } catch (e) {
        // Order not found
        console.log('Order not found:', transaction.metadata.orderId);
      }
    }
    
    // Get related vendor if exists in metadata
    if (transaction.metadata?.vendorId) {
      try {
        const vendor = await Vendor.findById(transaction.metadata.vendorId)
          .select('businessName businessEmail phoneNumber businessType address');
        if (vendor) {
          enriched.vendor = vendor;
        }
      } catch (e) {
        // Vendor not found
        console.log('Vendor not found:', transaction.metadata.vendorId);
      }
    }

    // Get related user if exists in metadata
    if (transaction.metadata?.userId) {
      try {
        const User = mongoose.models.User;
        if (User) {
          const user = await User.findById(transaction.metadata.userId)
            .select('name email phoneNumber');
          if (user) {
            enriched.user = user;
          }
        }
      } catch (e) {
        // User not found
      }
    }

    return NextResponse.json({ 
      success: true, 
      transaction: enriched 
    });

  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    
    // Build query to find by either _id or transactionId
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { transactionId: id };
    }
    
    // Check if transaction exists
    const existingTransaction = await Transaction.findOne(query);
    
    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Update only allowed fields
    const updateData: any = {};
    const updatableFields = [
      'status', 
      'amount', 
      'phoneNumber', 
      'receiptNumber', 
      'metadata',
      'accountReference',
      'externalReference',
      'errorMessage',
      'purpose'
    ];

    updatableFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Handle nested metadata updates
    if (body.metadata) {
      updateData.metadata = {
        ...existingTransaction.metadata,
        ...body.metadata
      };
    }

    // Add updatedAt
    updateData.updatedAt = new Date();

    const transaction = await Transaction.findOneAndUpdate(
      query,
      updateData,
      { new: true, runValidators: true }
    )
    .populate({
      path: 'organizationId',
      select: 'name email',
      model: mongoose.models.Organization || Organization
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Enrich response with related data
    const enriched: any = transaction.toObject();
    
    if (transaction.metadata?.orderId) {
      try {
        const order = await Order.findById(transaction.metadata.orderId)
          .select('orderNumber totalAmount customerName');
        if (order) {
          enriched.order = order;
        }
      } catch (e) {
        // Order not found
      }
    }
    
    if (transaction.metadata?.vendorId) {
      try {
        const vendor = await Vendor.findById(transaction.metadata.vendorId)
          .select('businessName businessEmail phoneNumber');
        if (vendor) {
          enriched.vendor = vendor;
        }
      } catch (e) {
        // Vendor not found
      }
    }

    return NextResponse.json({ 
      success: true, 
      transaction: enriched,
      message: 'Transaction updated successfully' 
    });

  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Build query to find by either _id or transactionId
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { transactionId: id };
    }

    // Find the transaction first
    const transaction = await Transaction.findOne(query);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Only allow deletion of pending or failed transactions
    if (transaction.status === 'success' || transaction.status === 'processing') {
      return NextResponse.json(
        { error: 'Cannot delete successful or processing transactions' },
        { status: 400 }
      );
    }

    // Delete the transaction
    await Transaction.deleteOne({ _id: transaction._id });

    return NextResponse.json({ 
      success: true,
      message: 'Transaction deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction: ' + (error as Error).message },
      { status: 500 }
    );
  }
}