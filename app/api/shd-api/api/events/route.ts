// // C:\Users\USER\Desktop\Projects\my-app\app\api\events\route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import Event from '@/models/Event';

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const events = await Event.find({ 
//       status: 'published',
//       availableSlots: { $gt: 0 }
//     })
//     .sort({ startDate: 1 })
//     .limit(50);

//     return NextResponse.json({ events });

//   } catch (error) {
//     console.error('Fetch events error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch events' },
//       { status: 500 }
//     );
//   }
// }


// C:\Users\Administrator\Desktop\my-app\app\api\events\route.ts
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Event from '@/shd-models/models/Event';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query: any = { status: 'published' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .sort({ startDate: 1 })
      .select('-__v'); // Exclude version field

    return NextResponse.json({ events });

  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}