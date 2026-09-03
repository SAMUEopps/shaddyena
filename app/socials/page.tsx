
"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const SOCIAL_URL = {
  tiktok: "https://www.tiktok.com/@protrix_254",
  instagram1: "https://www.instagram.com/protrix_254/",
  instagram2: "https://www.instagram.com/the_black_sg5/",
  whatsapp: "https://wa.me/qr/CPKEAG3QGX35L1",
};

export default function SocialsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // The QR points to this page.
    // Example:
    // https://yourdomain.com/socials

    const url = window.location.href;
    setQrUrl(url);

    generateQR(url);
  }, []);

  const generateQR = async (url: string) => {
    if (!canvasRef.current) return;

    await QRCode.toCanvas(canvasRef.current, url, {
      width: 2048,
      margin: 4,
      errorCorrectionLevel: "H",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  };

  const downloadQR = async () => {
    if (!qrUrl) return;

    const canvas = document.createElement("canvas");

    await QRCode.toCanvas(canvas, qrUrl, {
      width: 2048,
      margin: 4,
      errorCorrectionLevel: "H",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const link = document.createElement("a");

    link.download = "protrix-socials-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const openSocial = (url: string) => {
    window.location.href = url;
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-black text-3xl font-black">
            P
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Connect With Us
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Choose where you'd like to connect
          </p>
        </div>

        {/* Social buttons */}
        <div className="space-y-3">

          {/* TikTok */}
          <button
            onClick={() => openSocial(SOCIAL_URL.tiktok)}
            className="w-full rounded-2xl bg-white px-5 py-4 text-black font-semibold flex items-center justify-between transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">♪</span>
              <span>
                <span className="block text-left">TikTok</span>
                <span className="block text-left text-xs text-gray-500">
                  @protrix_254
                </span>
              </span>
            </span>

            <span>→</span>
          </button>

          {/* Instagram */}
          <button
            onClick={() => openSocial(SOCIAL_URL.instagram1)}
            className="w-full rounded-2xl bg-white px-5 py-4 text-black font-semibold flex items-center justify-between transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">◎</span>
              <span>
                <span className="block text-left">Instagram</span>
                <span className="block text-left text-xs text-gray-500">
                  @protrix_254
                </span>
              </span>
            </span>

            <span>→</span>
          </button>

          {/* Instagram 2 */}
          <button
            onClick={() => openSocial(SOCIAL_URL.instagram2)}
            className="w-full rounded-2xl bg-white px-5 py-4 text-black font-semibold flex items-center justify-between transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">◎</span>
              <span>
                <span className="block text-left">Instagram</span>
                <span className="block text-left text-xs text-gray-500">
                  @the_black_sg5
                </span>
              </span>
            </span>

            <span>→</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => openSocial(SOCIAL_URL.whatsapp)}
            className="w-full rounded-2xl bg-white px-5 py-4 text-black font-semibold flex items-center justify-between transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">◉</span>
              <span>
                <span className="block text-left">WhatsApp</span>
                <span className="block text-left text-xs text-gray-500">
                  Chat with us
                </span>
              </span>
            </span>

            <span>→</span>
          </button>

        </div>

        {/* QR generator section */}
        <div className="mt-10 rounded-3xl bg-white p-6 text-black">

          <div className="text-center">
            <h2 className="text-xl font-bold">
              Scan to Connect
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Scan this QR code to choose an account
            </p>
          </div>

          {/* QR */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-2xl bg-white p-4 shadow-xl">
              <canvas
                ref={canvasRef}
                className="h-64 w-64"
              />
            </div>
          </div>

          {/* Download */}
          <button
            onClick={downloadQR}
            className="mt-6 w-full rounded-xl bg-black px-5 py-4 text-white font-semibold transition hover:bg-gray-800 active:scale-[0.98]"
          >
            Download HQ QR Code
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            PNG • 2048 × 2048 • High Error Correction
          </p>
        </div>

        {/* URL */}
        {qrUrl && (
          <p className="mt-5 text-center text-xs text-gray-600 break-all">
            {qrUrl}
          </p>
        )}

      </div>
    </main>
  );
}
