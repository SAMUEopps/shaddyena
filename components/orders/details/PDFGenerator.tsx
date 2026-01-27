'use client';

import { useState } from 'react';
import { Order } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface PDFGeneratorProps {
  order: Order;
}

export default function PDFGenerator({ order }: PDFGeneratorProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async () => {
    if (!order) return;

    setIsGeneratingPDF(true);
    setError(null);
    
    try {
      const [html2canvas, jsPDF] = await Promise.all([
        import('html2canvas').then(module => module.default),
        import('jspdf').then(module => module.default)
      ]);

      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '794px';
      pdfContainer.style.padding = '20px';
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.color = 'black';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';
      
      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="margin: 0; color: #333; font-size: 28px;">Shaddyna Order Invoice</h1>
          <p style="margin: 5px 0; color: #666;">Order ID: ${order.orderId}</p>
          <p style="margin: 5px 0; color: #666;">Date: ${OrderService.formatDate(order.createdAt)}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="flex: 1;">
            <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Customer Information</h2>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${OrderService.getBuyerName(order.buyerId)}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${OrderService.getBuyerEmail(order.buyerId)}</p>
          </div>
          <div style="flex: 1;">
            <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Shipping Address</h2>
            <p style="margin: 5px 0;">${order.shipping.address}</p>
            <p style="margin: 5px 0;">${order.shipping.city}, ${order.shipping.country}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shipping.phone}</p>
            ${order.shipping.instructions ? `<p style="margin: 5px 0;"><strong>Instructions:</strong> ${order.shipping.instructions}</p>` : ''}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Product</th>
                <th style="text-align: center; padding: 12px; border: 1px solid #ddd;">Qty</th>
                <th style="text-align: right; padding: 12px; border: 1px solid #ddd;">Price</th>
                <th style="text-align: right; padding: 12px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item, index) => `
                <tr key="${index}" style="${index % 2 === 0 ? 'background-color: #f8f9fa;' : ''}">
                  <td style="padding: 12px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="text-align: center; padding: 12px; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="text-align: right; padding: 12px; border: 1px solid #ddd;">${OrderService.formatCurrency(item.price, order.currency)}</td>
                  <td style="text-align: right; padding: 12px; border: 1px solid #ddd;">${OrderService.formatCurrency(item.price * item.quantity, order.currency)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="border-top: 2px solid #333; padding-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Subtotal:</strong></span>
            <span>${OrderService.formatCurrency(order.totalAmount - order.shippingFee - order.platformFee, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Shipping Fee:</strong></span>
            <span>${OrderService.formatCurrency(order.shippingFee, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Platform Fee:</strong></span>
            <span>${OrderService.formatCurrency(order.platformFee, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
            <span>Total Amount:</span>
            <span>${OrderService.formatCurrency(order.totalAmount, order.currency)}</span>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #ddd; padding-top: 20px;">
          <p>Thank you for your order!</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.fontFamily = 'Arial, sans-serif';
          }
        }
      });

      document.body.removeChild(pdfContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 5;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`order-${order.orderId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGeneratingPDF}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGeneratingPDF ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          Generating PDF...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </>
      )}
    </button>
  );
}