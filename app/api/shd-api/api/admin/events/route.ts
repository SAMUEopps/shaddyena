// // C:\Users\USER\Desktop\Projects\my-app\app\api\admin\events\route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import Event from '@/models/Event';
// import { verifyToken } from '@/lib/auth';

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

//     const events = await Event.find()
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ events });

//   } catch (error) {
//     console.error('Fetch events error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch events' },
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
    
//     const event = await Event.create({
//       ...body,
//       createdBy: decoded.userId,
//       availableSlots: body.capacity
//     });

//     return NextResponse.json({
//       message: 'Event created successfully',
//       event
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Create event error:', error);
//     return NextResponse.json(
//       { error: 'Failed to create event' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest) {
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
//     const eventId = searchParams.get('id');

//     if (!eventId) {
//       return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
//     }

//     const event = await Event.findByIdAndDelete(eventId);
//     if (!event) {
//       return NextResponse.json({ error: 'Event not found' }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: 'Event deleted successfully'
//     });

//   } catch (error) {
//     console.error('Delete event error:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete event' },
//       { status: 500 }
//     );
//   }
// }

// C:\Users\Administrator\Desktop\my-app\app\api\admin\events\route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Event from '@/shd-models/models/Event';

export async function GET(req: NextRequest) {
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

    const events = await Event.find()
      .sort({ createdAt: -1 });

    return NextResponse.json({ events });

  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
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
    
    const event = await Event.create({
      ...body,
      createdBy: decoded.userId,
      availableSlots: body.capacity
    });

    return NextResponse.json({
      message: 'Event created successfully',
      event
    }, { status: 201 });

  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
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
    const eventId = searchParams.get('id');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}