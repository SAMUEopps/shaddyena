// import { NextRequest, NextResponse } from 'next/server';

// const allowedOrigins = new Set([
//   'http://127.0.0.1:5500',
//   'http://localhost:5500',
//   'https://www.shaddyna.com',
//   'https://shaddyna.com',
// ]);

// const corsHeaders = {
//   'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//   'Access-Control-Max-Age': '86400',
// };

// export function middleware(request: NextRequest) {
//   const origin = request.headers.get('origin') ?? '';
//   const isAllowedOrigin = allowedOrigins.has(origin);

//   // Handle CORS preflight
//   if (request.method === 'OPTIONS') {
//     const response = new NextResponse(null, {
//       status: isAllowedOrigin ? 204 : 403,
//     });

//     if (isAllowedOrigin) {
//       response.headers.set('Access-Control-Allow-Origin', origin);
//       response.headers.set(
//         'Access-Control-Allow-Credentials',
//         'true'
//       );

//       Object.entries(corsHeaders).forEach(([key, value]) => {
//         response.headers.set(key, value);
//       });
//     }

//     return response;
//   }

//   // Continue request to the actual API route
//   const response = NextResponse.next();

//   // Add CORS headers to actual API responses
//   if (isAllowedOrigin) {
//     response.headers.set('Access-Control-Allow-Origin', origin);
//     response.headers.set(
//       'Access-Control-Allow-Credentials',
//       'true'
//     );

//     Object.entries(corsHeaders).forEach(([key, value]) => {
//       response.headers.set(key, value);
//     });
//   }

//   return response;
// }

// export const config = {
//   matcher: ['/api/:path*'],
// };


import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = new Set([
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://www.shaddyna.com',
  'https://shaddyna.com',
]);

const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.has(origin);

  // Create request headers
  const requestHeaders = new Headers(request.headers);

  // Pass the current pathname to the layout
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, {
      status: isAllowedOrigin ? 204 : 403,
    });

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set(
        'Access-Control-Allow-Credentials',
        'true'
      );

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    return response;
  }

  // Continue request with pathname header
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add CORS headers to actual API responses
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set(
      'Access-Control-Allow-Credentials',
      'true'
    );

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};