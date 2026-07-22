// // C:\Users\USER\Desktop\Projects\my-app\app\api\admin\events\[id]\route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Event from '@/shd-models/models/Event';
// import { NextRequest, NextResponse } from 'next/server';


// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
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

//     const event = await Event.findById(params.id);
//     if (!event) {
//       return NextResponse.json({ error: 'Event not found' }, { status: 404 });
//     }

//     return NextResponse.json({ event });

//   } catch (error) {
//     console.error('Fetch event error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch event' },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
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
    
//     const event = await Event.findByIdAndUpdate(
//       params.id,
//       { ...body, updatedAt: new Date() },
//       { new: true }
//     );

//     if (!event) {
//       return NextResponse.json({ error: 'Event not found' }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: 'Event updated successfully',
//       event
//     });

//   } catch (error) {
//     console.error('Update event error:', error);
//     return NextResponse.json(
//       { error: 'Failed to update event' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
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

//     const event = await Event.findByIdAndDelete(params.id);
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

import { verifyToken } from "@/shd-lib/lib/auth";
import { connectToDatabase } from "@/shd-lib/lib/mongodb";
import Event from "@/shd-models/models/Event";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Fetch event error:", error);

    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const event = await Event.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);

    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}