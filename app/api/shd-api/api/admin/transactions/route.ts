// // app/api/admin/transactions/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Transaction from '@/shd-models/models/Transaction';
// import Order from '@/shd-models/models/Order';
// import Vendor from '@/shd-models/models/Vendor';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
//     }

//     const { searchParams } = new URL(req.url);
//     const status = searchParams.get('status');
//     const type = searchParams.get('type');
//     const phoneNumber = searchParams.get('phoneNumber');
//     const startDate = searchParams.get('startDate');
//     const endDate = searchParams.get('endDate');
//     const search = searchParams.get('search');
    
//     let query: any = {};
//     if (status) query.status = status;
//     if (type) query.type = type;
//     if (phoneNumber) query.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }

//     if (search) {
//       query.$or = [
//         { transactionId: { $regex: search, $options: 'i' } },
//         { receiptNumber: { $regex: search, $options: 'i' } },
//         { phoneNumber: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const transactions = await Transaction.find(query)
//       .populate('orderId', 'orderNumber totalAmount customerName')
//       .populate('vendorId', 'businessName businessEmail phoneNumber')
//       .sort({ createdAt: -1 });

//     // Get summary stats
//     const stats = await Transaction.aggregate([
//       { $match: query },
//       { 
//         $group: {
//           _id: null,
//           totalAmount: { $sum: '$amount' },
//           totalPending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] } },
//           totalSuccess: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] } },
//           totalFailed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, '$amount', 0] } },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Get status breakdown
//     const statusCounts = await Transaction.aggregate([
//       { $match: query },
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);

//     // Get type breakdown
//     const typeCounts = await Transaction.aggregate([
//       { $match: query },
//       { $group: { _id: '$type', count: { $sum: 1 }, total: { $sum: '$amount' } } }
//     ]);

//     return NextResponse.json({ 
//       success: true,
//       transactions,
//       total: transactions.length,
//       stats: stats[0] || {
//         totalAmount: 0,
//         totalPending: 0,
//         totalSuccess: 0,
//         totalFailed: 0,
//         count: 0
//       },
//       statusCounts,
//       typeCounts
//     });

//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch transactions' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
//     }

//     const body = await req.json();
    
//     // Generate unique transaction ID if not provided
//     if (!body.transactionId) {
//       body.transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
//     }

//     // Generate receipt number if not provided
//     if (!body.receiptNumber) {
//       body.receiptNumber = `RCP-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000)}`;
//     }

//     // Check if order exists if provided
//     if (body.orderId) {
//       const order = await Order.findById(body.orderId);
//       if (!order) {
//         return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//       }
//     }

//     // Check if vendor exists if provided
//     if (body.vendorId) {
//       const vendor = await Vendor.findById(body.vendorId);
//       if (!vendor) {
//         return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//       }
//     }

//     const transaction = await Transaction.create({
//       ...body,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     });

//     const populatedTransaction = await Transaction.findById(transaction._id)
//       .populate('orderId', 'orderNumber totalAmount customerName')
//       .populate('vendorId', 'businessName businessEmail phoneNumber');

//     return NextResponse.json({
//       success: true,
//       message: 'Transaction created successfully',
//       transaction: populatedTransaction
//     }, { status: 201 });

//   } catch (error: any) {
//     console.error('Error creating transaction:', error);
//     if (error.code === 11000) {
//       return NextResponse.json(
//         { error: 'Transaction ID already exists' },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { error: 'Failed to create transaction' },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/admin/transactions/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import Order from '@/shd-models/models/Order';
import Vendor from '@/shd-models/models/Vendor';
import Organization from '@/shd-models/models/Organization';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Ensure Organization model is registered
    const OrganizationModel = mongoose.models.Organization || Organization;
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const phoneNumber = searchParams.get('phoneNumber');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const organizationId = searchParams.get('organizationId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    // If organizationId is provided, filter by it
    if (organizationId) {
      query.organizationId = organizationId;
    }
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (phoneNumber) query.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { accountReference: { $regex: search, $options: 'i' } },
        { externalReference: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const totalCount = await Transaction.countDocuments(query);

    // Get transactions with proper population
    const transactions = await Transaction.find(query)
      .populate({
        path: 'organizationId',
        select: 'name email',
        model: OrganizationModel
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Enrich transactions with related data
    const enrichedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const enriched: any = transaction.toObject();
        
        // Check if this transaction is related to an order via metadata or external references
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
        
        // Check if this transaction is related to a vendor
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
        
        // If externalEntityType and externalEntityId are present, try to fetch the entity
        if (transaction.externalEntityType && transaction.externalEntityId) {
          enriched.externalEntity = {
            type: transaction.externalEntityType,
            id: transaction.externalEntityId
          };
        }
        
        return enriched;
      })
    );

    // Get summary stats
    const stats = await Transaction.aggregate([
      { $match: query },
      { 
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalPending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] } },
          totalProcessing: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, '$amount', 0] } },
          totalSuccess: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] } },
          totalFailed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, '$amount', 0] } },
          totalCancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, '$amount', 0] } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get status breakdown
    const statusCounts = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    // Get type breakdown
    const typeCounts = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    // Get category breakdown
    const categoryCounts = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    return NextResponse.json({ 
      success: true,
      transactions: enrichedTransactions,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      },
      stats: stats[0] || {
        totalAmount: 0,
        totalPending: 0,
        totalProcessing: 0,
        totalSuccess: 0,
        totalFailed: 0,
        totalCancelled: 0,
        count: 0
      },
      statusCounts,
      typeCounts,
      categoryCounts
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
    
    // Generate unique transaction ID if not provided
    if (!body.transactionId) {
      body.transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    // Generate receipt number if not provided
    if (!body.receiptNumber) {
      body.receiptNumber = `RCP-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000)}`;
    }

    // Validate required fields
    if (!body.organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    if (!body.amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    if (!body.type) {
      return NextResponse.json(
        { error: 'Transaction type is required' },
        { status: 400 }
      );
    }

    if (!body.category) {
      return NextResponse.json(
        { error: 'Transaction category is required' },
        { status: 400 }
      );
    }

    // Check if order exists if provided in metadata
    if (body.metadata?.orderId) {
      const order = await Order.findById(body.metadata.orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
    }

    // Check if vendor exists if provided in metadata
    if (body.metadata?.vendorId) {
      const vendor = await Vendor.findById(body.metadata.vendorId);
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
    }

    // Check if organization exists
    const organization = await Organization.findById(body.organizationId);
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Check for duplicate idempotency key
    if (body.idempotencyKey) {
      const existing = await Transaction.findOne({
        organizationId: body.organizationId,
        idempotencyKey: body.idempotencyKey
      });
      if (existing) {
        return NextResponse.json({
          success: true,
          message: 'Transaction already exists with this idempotency key',
          transaction: existing
        }, { status: 200 });
      }
    }

    const transaction = await Transaction.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate({
        path: 'organizationId',
        select: 'name email',
        model: mongoose.models.Organization || Organization
      });

    return NextResponse.json({
      success: true,
      message: 'Transaction created successfully',
      transaction: populatedTransaction
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating transaction:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Transaction ID or Idempotency key already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create transaction: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
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
    const { transactionId, ...updateData } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Update the transaction
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { transactionId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate({
      path: 'organizationId',
      select: 'name email',
      model: mongoose.models.Organization || Organization
    });

    return NextResponse.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction: updatedTransaction
    });

  } catch (error: any) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Only allow deletion of pending or failed transactions
    if (transaction.status === 'success' || transaction.status === 'processing') {
      return NextResponse.json(
        { error: 'Cannot delete successful or processing transactions' },
        { status: 400 }
      );
    }

    await Transaction.deleteOne({ transactionId });

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction: ' + error.message },
      { status: 500 }
    );
  }
}