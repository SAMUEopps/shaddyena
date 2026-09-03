
"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const QR_URL = "https://www.shaddyna.com/socials/protrix_254/socials";

export default function QRGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = async () => {
    if (!canvasRef.current) return;

    await QRCode.toCanvas(canvasRef.current, QR_URL, {
      width: 2048,
      margin: 4,
      errorCorrectionLevel: "H",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    setGenerated(true);
  };

  const downloadQR = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");

    link.download = "protrix-socials-qr.png";
    link.href = canvasRef.current.toDataURL("image/png");

    link.click();
  };

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-10 text-black">
      <div className="mx-auto max-w-xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Social QR Generator
          </h1>

          <p className="mt-2 text-gray-500">
            Generate the permanent QR code for your social links.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">

          {/* QR */}
          <div className="flex justify-center">
            <div className="rounded-2xl border bg-white p-5">
              <canvas
                ref={canvasRef}
                className="h-80 w-80"
              />
            </div>
          </div>

          {/* Destination */}
          <div className="mt-6 rounded-xl bg-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500">
              QR DESTINATION
            </p>

            <p className="mt-1 break-all text-sm font-semibold">
              {QR_URL}
            </p>
          </div>

          {/* Status */}
          <div className="mt-4 text-center">
            {generated ? (
              <p className="text-sm font-medium text-green-600">
                ✓ QR code generated
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Generating QR code...
              </p>
            )}
          </div>

          {/* Download */}
          <button
            onClick={downloadQR}
            disabled={!generated}
            className="mt-6 w-full rounded-xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Download HQ QR Code
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            PNG • 2048 × 2048 • Error Correction H
          </p>

        </div>

      </div>
    </main>
  );
}
