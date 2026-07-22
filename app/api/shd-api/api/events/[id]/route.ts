// // // C:\Users\USER\Desktop\Projects\my-app\app\api\events\[id]\route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { connectToDatabase } from '@/lib/mongodb';
// // import Event from '@/models/Event';

// // export async function GET(
// //   req: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   try {
// //     await connectToDatabase();
    
// //     const event = await Event.findById(params.id);
// //     if (!event) {
// //       return NextResponse.json({ error: 'Event not found' }, { status: 404 });
// //     }

// //     return NextResponse.json({ event });

// //   } catch (error) {
// //     console.error('Fetch event error:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to fetch event' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // app/api/events/[id]/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import Event from '@/models/Event';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectToDatabase();

//     const { id } = await params;

//     const event = await Event.findById(id);

//     if (!event) {
//       return NextResponse.json(
//         { error: 'Event not found' },
//         { status: 404 }
//       );
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

// C:\Users\Administrator\Desktop\my-app\app\api\events\[id]\route.ts
import { NextRequest, NextResponse } from 'next/server';

import Event from '@/shd-models/models/Event';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const event = await Event.findById(id)
      .select('-__v');

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });

  } catch (error) {
    console.error('Fetch event error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}