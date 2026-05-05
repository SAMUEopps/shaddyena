/*'use client';

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
}*/

/*'use client';

import { useState } from 'react';
import { Order } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';
import { FileText, Loader2, CheckCircle } from 'lucide-react';

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
      pdfContainer.style.padding = '40px';
      pdfContainer.style.backgroundColor = '#ffffff';
      pdfContainer.style.color = '#0f1c47';
      pdfContainer.style.fontFamily = "'Inter', 'Arial', sans-serif";
      
      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e50986; padding-bottom: 25px;">
          <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #e50986 0%, #ac286f 100%); border-radius: 12px; margin-bottom: 15px;">
            <span style="color: white; font-size: 14px; font-weight: 600;">SHADDYNA</span>
          </div>
          <h1 style="margin: 10px 0 5px; color: #0f1c47; font-size: 28px; font-weight: 700;">Order Invoice</h1>
          <p style="margin: 5px 0; color: #656c85; font-size: 14px;">Order ID: <strong style="color: #e50986;">${order.orderId}</strong></p>
          <p style="margin: 5px 0; color: #656c85; font-size: 14px;">Date: ${OrderService.formatDate(order.createdAt)}</p>
        </div>
        
        <div style="display: flex; gap: 30px; margin-bottom: 35px;">
          <div style="flex: 1; background: #f8eff9; padding: 20px; border-radius: 16px;">
            <h2 style="margin: 0 0 12px 0; color: #e50986; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span>👤</span> Customer Information
            </h2>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;"><strong>Name:</strong> ${OrderService.getBuyerName(order.buyerId)}</p>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;"><strong>Email:</strong> ${OrderService.getBuyerEmail(order.buyerId)}</p>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;"><strong>Phone:</strong> ${order.shipping.phone}</p>
          </div>
          <div style="flex: 1; background: #f8eff9; padding: 20px; border-radius: 16px;">
            <h2 style="margin: 0 0 12px 0; color: #e50986; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span>📍</span> Shipping Address
            </h2>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;">${order.shipping.address}</p>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;">${order.shipping.city}, ${order.shipping.country}</p>
            ${order.shipping.instructions ? `<p style="margin: 8px 0; color: #656c85; font-size: 13px; font-style: italic;">📝 ${order.shipping.instructions}</p>` : ''}
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0; color: #0f1c47; font-size: 18px; font-weight: 700; border-left: 3px solid #e50986; padding-left: 12px;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: linear-gradient(135deg, #e50986 0%, #ac286f 100%);">
                <th style="text-align: left; padding: 14px 12px; color: white; font-size: 13px; font-weight: 600; border-radius: 12px 0 0 0;">Product</th>
                <th style="text-align: center; padding: 14px 12px; color: white; font-size: 13px; font-weight: 600;">Qty</th>
                <th style="text-align: right; padding: 14px 12px; color: white; font-size: 13px; font-weight: 600;">Price</th>
                <th style="text-align: right; padding: 14px 12px; color: white; font-size: 13px; font-weight: 600; border-radius: 0 12px 0 0;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item, index) => `
                <tr style="border-bottom: 1px solid #e6e8f0;">
                  <td style="padding: 12px; color: #0f1c47; font-size: 14px;">
                    <strong>${item.name}</strong>
                    
                  </td>
                  <td style="text-align: center; padding: 12px; color: #0f1c47; font-size: 14px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 12px; color: #0f1c47; font-size: 14px;">${OrderService.formatCurrency(item.price, order.currency)}</td>
                  <td style="text-align: right; padding: 12px; color: #e50986; font-size: 14px; font-weight: 600;">${OrderService.formatCurrency(item.price * item.quantity, order.currency)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="background: #f8eff9; border-radius: 16px; padding: 20px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #656c85; font-size: 14px;">Subtotal</span>
            <span style="color: #0f1c47; font-size: 14px;">${OrderService.formatCurrency(order.totalAmount - order.shippingFee - order.platformFee, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #656c85; font-size: 14px;">Shipping Fee</span>
            <span style="color: #0f1c47; font-size: 14px;">${OrderService.formatCurrency(order.shippingFee, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #656c85; font-size: 14px;">Platform Fee</span>
            <span style="color: #0f1c47; font-size: 14px;">${OrderService.formatCurrency(order.platformFee, order.currency)}</span>
          </div>
          ${order.deliveryFeeTotal > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #656c85; font-size: 14px;">Delivery Fee</span>
            <span style="color: #0f1c47; font-size: 14px;">${OrderService.formatCurrency(order.deliveryFeeTotal, order.currency)}</span>
          </div>
          ` : ''}
          <div style="border-top: 2px solid #e6e8f0; margin-top: 15px; padding-top: 15px; display: flex; justify-content: space-between;">
            <span style="color: #0f1c47; font-size: 18px; font-weight: 700;">Total Amount</span>
            <span style="color: #e50986; font-size: 22px; font-weight: 700;">${OrderService.formatCurrency(order.totalAmount, order.currency)}</span>
          </div>
          ${order.paymentStatus === 'PAID' ? `
          <div style="margin-top: 15px; padding-top: 12px; border-top: 1px dashed #e6a3ca; text-align: center;">
            <span style="background: #16a34a20; color: #16a34a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">✓ Payment Confirmed</span>
          </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e6e8f0;">
          <p style="color: #656c85; font-size: 12px; margin: 0;">Thank you for shopping with Shaddyna!</p>
          <p style="color: #9ea4b7; font-size: 11px; margin: 5px 0 0;">For support, contact us at support@shaddyna.com</p>
          <p style="color: #9ea4b7; font-size: 10px; margin: 5px 0 0;">Generated on ${new Date().toLocaleString()}</p>
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
            clonedContainer.style.fontFamily = "'Inter', 'Arial', sans-serif";
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
      pdf.save(`Shaddyna_Invoice_${order.orderId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={generatePDF}
        disabled={isGeneratingPDF}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isGeneratingPDF ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <span>Download Invoice</span>
          </>
        )}
      </button>
      
      {error && (
        <div className="absolute top-full mt-2 right-0 z-10 px-4 py-2 bg-red-500 text-white text-sm rounded-xl shadow-lg animate-slide-in whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}*/

'use client';

import { useState } from 'react';
import { Order } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';
import { FileText, Loader2 } from 'lucide-react';

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
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const pdfContainer = document.createElement('div');
      pdfContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 794px;
        padding: 40px;
        background-color: #ffffff;
        color: #0f1c47;
        font-family: 'Inter', 'Arial', sans-serif;
      `;

      const vendorGroups = order.suborders.map((suborder, index) => ({
        index: index + 1,
        shopId: suborder.shopId,
        items: suborder.items,
        subtotal: suborder.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        deliveryFee: suborder.deliveryFee,
      }));

      const itemsHtml = vendorGroups
        .map(
          (vendor) => `
        <div style="margin-bottom: 35px;">
          <div style="background: linear-gradient(135deg, #e50986 10%, #ac286f 100%); padding: 8px 16px; border-radius: 12px 12px 0 0;">
            <h3 style="margin: 0; color: white; font-size: 16px; font-weight: 600;">
              🏪 Vendor ${vendor.index}: ${vendor.shopId}
            </h3>
          </div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e6e8f0; border-top: none;">
            <thead>
              <tr style="background: #f8eff9;">
                <th style="text-align: left; padding: 12px; color: #0f1c47; font-size: 13px; font-weight: 600;">Product</th>
                <th style="text-align: center; padding: 12px; color: #0f1c47; font-size: 13px; font-weight: 600;">Qty</th>
                <th style="text-align: right; padding: 12px; color: #0f1c47; font-size: 13px; font-weight: 600;">Price</th>
                <th style="text-align: right; padding: 12px; color: #0f1c47; font-size: 13px; font-weight: 600;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${vendor.items
                .map(
                  (item) => `
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 10px 12px; color: #0f1c47; font-size: 13px;">
                    <strong>${item.name}</strong>
                  </td>
                  <td style="text-align: center; padding: 10px 12px; color: #0f1c47; font-size: 13px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 10px 12px; color: #0f1c47; font-size: 13px;">${OrderService.formatCurrency(item.price, order.currency)}</td>
                  <td style="text-align: right; padding: 10px 12px; color: #e50986; font-size: 13px; font-weight: 600;">${OrderService.formatCurrency(item.price * item.quantity, order.currency)}</td>
                </tr>
              `
                )
                .join('')}
              <tr style="background: #f8eff9;">
                <td colspan="3" style="text-align: right; padding: 10px 12px; font-weight: 600;">Subtotal:</td>
                <td style="text-align: right; padding: 10px 12px; color: #e50986; font-weight: 600;">${OrderService.formatCurrency(vendor.subtotal, order.currency)}</td>
              </tr>
              ${vendor.deliveryFee > 0 ? `
              <tr style="background: #f8eff9;">
                <td colspan="3" style="text-align: right; padding: 5px 12px; font-size: 12px;">Delivery Fee:</td>
                <td style="text-align: right; padding: 5px 12px; font-size: 12px;">${OrderService.formatCurrency(vendor.deliveryFee, order.currency)}</td>
              </tr>
              ` : ''}
              <tr style="background: #f8eff9;">
                <td colspan="3" style="text-align: right; padding: 10px 12px; font-weight: 700;">Vendor Total:</td>
                <td style="text-align: right; padding: 10px 12px; color: #e50986; font-weight: 700;">${OrderService.formatCurrency(vendor.subtotal + vendor.deliveryFee, order.currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
        )
        .join('');

      const subtotalAll = order.totalAmount - order.shippingFee - order.platformFee - order.deliveryFeeTotal;

      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e50986; padding-bottom: 25px;">
          <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #e50986 0%, #ac286f 100%); border-radius: 12px; margin-bottom: 15px;">
            <span style="color: white; font-size: 14px; font-weight: 600;">SHADDYNA</span>
          </div>
          <h1 style="margin: 10px 0 5px; color: #0f1c47; font-size: 28px; font-weight: 700;">Order Invoice</h1>
          <p style="margin: 5px 0; color: #656c85; font-size: 14px;">Order ID: <strong style="color: #e50986;">${order.orderId}</strong></p>
          <p style="margin: 5px 0; color: #656c85; font-size: 14px;">Date: ${OrderService.formatDate(order.createdAt)}</p>
          <p style="margin: 5px 0; color: #e50986; font-size: 13px; font-weight: 500;">Order Status: ${order.status}</p>
        </div>

        <div style="display: flex; gap: 30px; margin-bottom: 35px;">
          <div style="flex: 1; background: #f8eff9; padding: 20px; border-radius: 16px;">
            <h2 style="margin: 0 0 12px 0; color: #e50986; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span>👤</span> Customer Information
            </h2>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;"><strong>Name:</strong> ${OrderService.getBuyerName(order.buyerId)}</p>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;"><strong>Email:</strong> ${OrderService.getBuyerEmail(order.buyerId)}</p>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;"><strong>Phone:</strong> ${order.shipping.phone}</p>
          </div>
          <div style="flex: 1; background: #f8eff9; padding: 20px; border-radius: 16px;">
            <h2 style="margin: 0 0 12px 0; color: #e50986; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span>📍</span> Shipping Address
            </h2>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;">${order.shipping.address}</p>
            <p style="margin: 8px 0; color: #0f1c47; font-size: 14px;">${order.shipping.city}, ${order.shipping.country}</p>
            ${order.shipping.instructions ? `<p style="margin: 8px 0; color: #656c85; font-size: 13px; font-style: italic;">📝 ${order.shipping.instructions}</p>` : ''}
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0; color: #0f1c47; font-size: 18px; font-weight: 700; border-left: 3px solid #e50986; padding-left: 12px;">Order Items by Vendor</h2>
          ${itemsHtml}
        </div>

        <div style="background: #f8eff9; border-radius: 16px; padding: 20px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #656c85; font-size: 14px;">Subtotal (All Items)</span>
            <span style="color: #0f1c47; font-size: 14px;">${OrderService.formatCurrency(subtotalAll, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #656c85; font-size: 14px;">Total Delivery Fees</span>
            <span style="color: #0f1c47; font-size: 14px;">${OrderService.formatCurrency(order.deliveryFeeTotal, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #656c85; font-size: 14px;">Shipping Fee</span>
            <span style="color: #0f1c47; font-size: 14px;">${OrderService.formatCurrency(order.shippingFee, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #656c85; font-size: 14px;">Platform Fee</span>
            <span style="color: #0f1c47; font-size: 14px;">${OrderService.formatCurrency(order.platformFee, order.currency)}</span>
          </div>
          <div style="border-top: 2px solid #e6e8f0; margin-top: 15px; padding-top: 15px; display: flex; justify-content: space-between;">
            <span style="color: #0f1c47; font-size: 18px; font-weight: 700;">Total Amount</span>
            <span style="color: #e50986; font-size: 22px; font-weight: 700;">${OrderService.formatCurrency(order.totalAmount, order.currency)}</span>
          </div>
          ${order.paymentStatus === 'PAID' ? `
          <div style="margin-top: 15px; padding-top: 12px; border-top: 1px dashed #e6a3ca; text-align: center;">
            <span style="background: #16a34a20; color: #16a34a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">✓ Payment Confirmed</span>
          </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e6e8f0;">
          <p style="color: #656c85; font-size: 12px; margin: 0;">Thank you for shopping with Shaddyna!</p>
          <p style="color: #9ea4b7; font-size: 11px; margin: 5px 0 0;">For support, contact us at support@shaddyna.com</p>
          <p style="color: #9ea4b7; font-size: 10px; margin: 5px 0 0;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
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
      pdf.save(`Shaddyna_Invoice_${order.orderId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={generatePDF}
        disabled={isGeneratingPDF}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isGeneratingPDF ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <span>Download Invoice</span>
          </>
        )}
      </button>

      {error && (
        <div className="absolute top-full mt-2 right-0 z-10 px-4 py-2 bg-red-500 text-white text-sm rounded-xl shadow-lg whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}