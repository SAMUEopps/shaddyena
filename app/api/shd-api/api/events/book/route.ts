// // // C:\Users\USER\Desktop\Projects\my-app\app\api\events\book\route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { connectToDatabase } from '@/lib/mongodb';
// // import Event from '@/models/Event';
// // import EventBooking from '@/models/EventBooking';
// // import User from '@/models/User';
// // import { verifyToken } from '@/lib/auth';

// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectToDatabase();
    
// //     const token = req.headers.get('authorization')?.split(' ')[1];
// //     if (!token) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const decoded = verifyToken(token);
// //     if (!decoded) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const body = await req.json();
// //     const { eventId, numberOfTickets, attendeeDetails, specialRequests } = body;

// //     // Validate event
// //     const event = await Event.findById(eventId);
// //     if (!event) {
// //       return NextResponse.json({ error: 'Event not found' }, { status: 404 });
// //     }

// //     if (event.status !== 'published') {
// //       return NextResponse.json({ error: 'Event is not available' }, { status: 400 });
// //     }

// //     if (event.availableSlots < numberOfTickets) {
// //       return NextResponse.json({ error: 'Not enough slots available' }, { status: 400 });
// //     }

// //     // Calculate total amount
// //     const totalAmount = event.price * numberOfTickets;

// //     // Create booking
// //     const booking = await EventBooking.create({
// //       eventId: event._id,
// //       userId: decoded.userId,
// //       numberOfTickets,
// //       totalAmount,
// //       attendeeDetails,
// //       specialRequests,
// //       status: 'confirmed',
// //       paymentStatus: 'paid' // For now, we'll mark as paid (you can integrate M-Pesa later)
// //     });

// //     // Update event slots
// //     event.bookedCount += numberOfTickets;
// //     event.availableSlots = event.capacity - event.bookedCount;
// //     await event.save();

// //     // Get user for notification
// //     const user = await User.findById(decoded.userId);

// //     // Here you would send email confirmation
// //     // For now, we'll just return success

// //     return NextResponse.json({
// //       message: 'Booking successful!',
// //       booking: {
// //         reference: booking.bookingReference,
// //         numberOfTickets: booking.numberOfTickets,
// //         totalAmount: booking.totalAmount,
// //         status: booking.status
// //       }
// //     }, { status: 201 });

// //   } catch (error) {
// //     console.error('Booking error:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to book event' },
// //       { status: 500 }
// //     );
// //   }
// // }


// // C:\Users\Administrator\Desktop\my-app\app\api\events\book\route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import Event from '@/models/Event';
// import EventBooking from '@/models/EventBooking';
// import User from '@/models/User';
// import { verifyToken } from '@/lib/auth';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await req.json();
//     const { eventId, ticketType, numberOfTickets, attendeeDetails, specialRequests } = body;

//     // Validate event
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return NextResponse.json({ error: 'Event not found' }, { status: 404 });
//     }

//     if (event.status !== 'published') {
//       return NextResponse.json({ error: 'Event is not available' }, { status: 400 });
//     }

//     if (event.availableSlots < numberOfTickets) {
//       return NextResponse.json({ error: 'Not enough slots available' }, { status: 400 });
//     }

//     // Find the ticket type
//     const ticketTypeData = event.ticketTypes.find((t: any) => t.name === ticketType);
//     if (!ticketTypeData) {
//       return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 });
//     }

//     // Check if ticket type has capacity limit
//     if (ticketTypeData.capacity) {
//       // Count how many tickets of this type have been booked
//       const bookedCount = await EventBooking.countDocuments({
//         eventId: event._id,
//         ticketType: ticketType,
//         status: { $in: ['confirmed', 'pending'] }
//       });
      
//       if (bookedCount + numberOfTickets > ticketTypeData.capacity) {
//         return NextResponse.json({ 
//           error: `Only ${ticketTypeData.capacity - bookedCount} ${ticketType} tickets remaining` 
//         }, { status: 400 });
//       }
//     }

//     // Calculate total amount
//     const pricePerTicket = ticketTypeData.price;
//     const totalAmount = pricePerTicket * numberOfTickets;

//     // Create booking
//     const booking = await EventBooking.create({
//       eventId: event._id,
//       userId: decoded.userId,
//       ticketType: ticketType,
//       numberOfTickets,
//       pricePerTicket,
//       totalAmount,
//       attendeeDetails,
//       specialRequests,
//       status: 'confirmed',
//       paymentStatus: 'paid' // For now, we'll mark as paid (you can integrate M-Pesa later)
//     });

//     // Update event slots
//     event.bookedCount += numberOfTickets;
//     event.availableSlots = event.capacity - event.bookedCount;
//     await event.save();

//     // Get user for notification
//     const user = await User.findById(decoded.userId);

//     // Here you would send email confirmation

//     return NextResponse.json({
//       message: 'Booking successful!',
//       booking: {
//         reference: booking.bookingReference,
//         ticketType: booking.ticketType,
//         numberOfTickets: booking.numberOfTickets,
//         pricePerTicket: booking.pricePerTicket,
//         totalAmount: booking.totalAmount,
//         status: booking.status
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Booking error:', error);
//     return NextResponse.json(
//       { error: 'Failed to book event' },
//       { status: 500 }
//     );
//   }
// }

// C:\Users\Administrator\Desktop\my-app\app\api\events\book\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/Event';
import EventBooking from '@/models/EventBooking';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { initSTKPush } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      eventId, 
      ticketType, 
      numberOfTickets, 
      attendeeDetails, 
      specialRequests,
      phoneNumber // M-Pesa phone number
    } = body;

    // Validate required fields
    if (!eventId || !ticketType || !numberOfTickets || !attendeeDetails || !phoneNumber) {
      return NextResponse.json({ 
        error: 'Missing required fields: eventId, ticketType, numberOfTickets, attendeeDetails, phoneNumber' 
      }, { status: 400 });
    }

    // Validate event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.status !== 'published') {
      return NextResponse.json({ error: 'Event is not available' }, { status: 400 });
    }

    if (event.availableSlots < numberOfTickets) {
      return NextResponse.json({ error: 'Not enough slots available' }, { status: 400 });
    }

    // Find the ticket type
    const ticketTypeData = event.ticketTypes.find((t: any) => t.name === ticketType);
    if (!ticketTypeData) {
      return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 });
    }

    // Check if ticket type has capacity limit
    if (ticketTypeData.capacity) {
      const bookedCount = await EventBooking.countDocuments({
        eventId: event._id,
        ticketType: ticketType,
        status: { $in: ['confirmed', 'pending'] }
      });
      
      if (bookedCount + numberOfTickets > ticketTypeData.capacity) {
        return NextResponse.json({ 
          error: `Only ${ticketTypeData.capacity - bookedCount} ${ticketType} tickets remaining` 
        }, { status: 400 });
      }
    }

    // Calculate total amount
    const pricePerTicket = ticketTypeData.price;
    const totalAmount = pricePerTicket * numberOfTickets;

    // Format phone number for M-Pesa (remove leading 0 if present)
    const formattedPhone = phoneNumber.startsWith('0') 
      ? `254${phoneNumber.substring(1)}` 
      : phoneNumber.startsWith('254') 
        ? phoneNumber 
        : `254${phoneNumber}`;

    // Generate a unique account reference for the transaction
    const accountReference = `EVT${Date.now().toString().slice(-8)}`;

    // Create booking with pending status
    const booking = new EventBooking({
      eventId: event._id,
      userId: decoded.userId,
      ticketType: ticketType,
      numberOfTickets,
      pricePerTicket,
      totalAmount,
      attendeeDetails,
      specialRequests,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Save booking to generate bookingReference
    await booking.save();

    try {
      // Initiate M-Pesa payment
      const mpesaResponse = await initSTKPush(
        formattedPhone,
        totalAmount,
        accountReference
      );

      // Update booking with checkout request ID
      booking.checkoutRequestId = mpesaResponse.CheckoutRequestID;
      await booking.save();

      return NextResponse.json({
        message: 'Payment initiated successfully',
        booking: {
          id: booking._id,
          reference: booking.bookingReference,
          ticketType: booking.ticketType,
          numberOfTickets: booking.numberOfTickets,
          pricePerTicket: booking.pricePerTicket,
          totalAmount: booking.totalAmount,
          status: booking.status,
          paymentStatus: booking.paymentStatus
        },
        payment: {
          checkoutRequestId: mpesaResponse.CheckoutRequestID,
          merchantRequestId: mpesaResponse.MerchantRequestID,
          message: 'Please complete payment on your phone'
        }
      }, { status: 201 });

    } catch (mpesaError: any) {
      console.error('M-Pesa error:', mpesaError);
      
      // Update booking to failed status
      booking.status = 'cancelled';
      booking.paymentStatus = 'refunded';
      await booking.save();
      
      return NextResponse.json({
        error: 'Payment initiation failed',
        details: mpesaError.response?.data?.errorMessage || mpesaError.message
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Booking error:', error);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to book event', details: error.message },
      { status: 500 }
    );
  }
}