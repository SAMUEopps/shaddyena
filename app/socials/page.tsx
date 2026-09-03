
// "use client";

// import { useEffect, useRef, useState } from "react";
// import QRCode from "qrcode";

// const SOCIAL_URL = {
//   tiktok: "https://www.tiktok.com/@protrix_254",
//   instagram1: "https://www.instagram.com/protrix_254/",
//   instagram2: "https://www.instagram.com/the_black_sg5/",
//   whatsapp: "https://wa.me/qr/CPKEAG3QGX35L1",
// };

// export default function SocialsPage() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [qrUrl, setQrUrl] = useState("");

//   useEffect(() => {
//     // The QR points to this page.
//     // Example:
//     // https://yourdomain.com/socials

//     const url = window.location.href;
//     setQrUrl(url);

//     generateQR(url);
//   }, []);

//   const generateQR = async (url: string) => {
//     if (!canvasRef.current) return;

//     await QRCode.toCanvas(canvasRef.current, url, {
//       width: 2048,
//       margin: 4,
//       errorCorrectionLevel: "H",
//       color: {
//         dark: "#000000",
//         light: "#ffffff",
//       },
//     });
//   };

//   const downloadQR = async () => {
//     if (!qrUrl) return;

//     const canvas = document.createElement("canvas");

//     await QRCode.toCanvas(canvas, qrUrl, {
//       width: 2048,
//       margin: 4,
//       errorCorrectionLevel: "H",
//       color: {
//         dark: "#000000",
//         light: "#ffffff",
//       },
//     });

//     const link = document.createElement("a");

//     link.download = "protrix-socials-qr.png";
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   const openSocial = (url: string) => {
//     window.location.href = url;
//   };

//   return (
//     <main className="min-h-screen bg-black text-white flex items-center justify-center px-5 py-10">
//       <div className="w-full max-w-md">

//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-black text-3xl font-black">
//             P
//           </div>

//           <h1 className="text-3xl font-bold tracking-tight">
//             Connect With Us
//           </h1>

//           <p className="mt-2 text-sm text-gray-400">
//             Choose where you'd like to connect
//           </p>
//         </div>

//         {/* Social buttons */}
//         <div className="space-y-3">

//           {/* TikTok */}
//           <button
//             onClick={() => openSocial(SOCIAL_URL.tiktok)}
//             className="w-full rounded-2xl bg-white px-5 py-4 text-black font-semibold flex items-center justify-between transition hover:scale-[1.02] active:scale-[0.98]"
//           >
//             <span className="flex items-center gap-3">
//               <span className="text-2xl">♪</span>
//               <span>
//                 <span className="block text-left">TikTok</span>
//                 <span className="block text-left text-xs text-gray-500">
//                   @protrix_254
//                 </span>
//               </span>
//             </span>

//             <span>→</span>
//           </button>

//           {/* Instagram */}
//           <button
//             onClick={() => openSocial(SOCIAL_URL.instagram1)}
//             className="w-full rounded-2xl bg-white px-5 py-4 text-black font-semibold flex items-center justify-between transition hover:scale-[1.02] active:scale-[0.98]"
//           >
//             <span className="flex items-center gap-3">
//               <span className="text-2xl">◎</span>
//               <span>
//                 <span className="block text-left">Instagram</span>
//                 <span className="block text-left text-xs text-gray-500">
//                   @protrix_254
//                 </span>
//               </span>
//             </span>

//             <span>→</span>
//           </button>

//           {/* Instagram 2 */}
//           <button
//             onClick={() => openSocial(SOCIAL_URL.instagram2)}
//             className="w-full rounded-2xl bg-white px-5 py-4 text-black font-semibold flex items-center justify-between transition hover:scale-[1.02] active:scale-[0.98]"
//           >
//             <span className="flex items-center gap-3">
//               <span className="text-2xl">◎</span>
//               <span>
//                 <span className="block text-left">Instagram</span>
//                 <span className="block text-left text-xs text-gray-500">
//                   @the_black_sg5
//                 </span>
//               </span>
//             </span>

//             <span>→</span>
//           </button>

//           {/* WhatsApp */}
//           <button
//             onClick={() => openSocial(SOCIAL_URL.whatsapp)}
//             className="w-full rounded-2xl bg-white px-5 py-4 text-black font-semibold flex items-center justify-between transition hover:scale-[1.02] active:scale-[0.98]"
//           >
//             <span className="flex items-center gap-3">
//               <span className="text-2xl">◉</span>
//               <span>
//                 <span className="block text-left">WhatsApp</span>
//                 <span className="block text-left text-xs text-gray-500">
//                   Chat with us
//                 </span>
//               </span>
//             </span>

//             <span>→</span>
//           </button>

//         </div>

//         {/* QR generator section */}
//         <div className="mt-10 rounded-3xl bg-white p-6 text-black">

//           <div className="text-center">
//             <h2 className="text-xl font-bold">
//               Scan to Connect
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Scan this QR code to choose an account
//             </p>
//           </div>

//           {/* QR */}
//           <div className="mt-6 flex justify-center">
//             <div className="rounded-2xl bg-white p-4 shadow-xl">
//               <canvas
//                 ref={canvasRef}
//                 className="h-64 w-64"
//               />
//             </div>
//           </div>

//           {/* Download */}
//           <button
//             onClick={downloadQR}
//             className="mt-6 w-full rounded-xl bg-black px-5 py-4 text-white font-semibold transition hover:bg-gray-800 active:scale-[0.98]"
//           >
//             Download HQ QR Code
//           </button>

//           <p className="mt-3 text-center text-xs text-gray-400">
//             PNG • 2048 × 2048 • High Error Correction
//           </p>
//         </div>

//         {/* URL */}
//         {qrUrl && (
//           <p className="mt-5 text-center text-xs text-gray-600 break-all">
//             {qrUrl}
//           </p>
//         )}

//       </div>
//     </main>
//   );
// }



"use client";

const socials = [
  {
    name: "TikTok",
    username: "@protrix_254",
    icon: "♪",
    url: "https://www.tiktok.com/@projectronix254?_r=1&_t=ZS-99QTlRveno5",
  },
  {
    name: "Instagram",
    username: "@protrix_254",
    icon: "◎",
    url: "https://www.instagram.com/protrix_254/",
  },
  {
    name: "Instagram",
    username: "@the_black_sg5",
    icon: "◎",
    url: "https://www.instagram.com/the_black_sg5/",
  },
  {
    name: "WhatsApp",
    username: "Chat with us",
    icon: "◉",
    url: "https://wa.me/qr/CPKEAG3QGX35L1",
  },
];

export default function SocialsPage() {
  return (
    <main className="min-h-screen bg-black px-5 py-12 text-white">

      <div className="mx-auto w-full max-w-md">

        {/* Profile */}
        <div className="text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-black text-black shadow-xl">
            P
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Protrix
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Connect with us
          </p>

        </div>

        {/* Social links */}
        <div className="mt-10 space-y-4">

          {socials.map((social) => (
            <a
              key={`${social.name}-${social.username}`}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-black shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xl text-white">
                  {social.icon}
                </div>

                <div>
                  <p className="font-bold">
                    {social.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {social.username}
                  </p>
                </div>

              </div>

              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>

            </a>
          ))}

        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-600">
            Connect • Follow
          </p>
        </div>

      </div>

    </main>
  );
}