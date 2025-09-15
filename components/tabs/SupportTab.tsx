interface SupportTabProps {
  role: 'customer' | 'vendor' | 'admin';
}
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";

export default function SupportTab({ role }: SupportTabProps) {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>('general');
  
  type FaqCategoryId = 'general' | 'account' | 'payments' | 'orders' | 'returns' | 'vendor';

  const faqCategories: { id: FaqCategoryId; name: string }[] = [
    { id: 'general', name: 'General Questions' },
    { id: 'account', name: 'Account & Registration' },
    { id: 'payments', name: 'Payments & M-Pesa' },
    { id: 'orders', name: 'Orders & Shipping' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'vendor', name: 'Vendor Support' },
  ];
  
  const faqItems: Record<FaqCategoryId, { question: string; answer: string }[]> = {
    general: [
      { question: 'What is ShopEase?', answer: 'ShopEase is a multi-vendor e-commerce platform that connects buyers with sellers across Kenya. We offer a secure shopping experience with M-Pesa integration for seamless payments.' },
      { question: 'How do I create an account?', answer: 'Click on the "Sign Up" button at the top right corner of the page. Fill in your details and verify your email address to activate your account.' },
    ],
    account: [
      { question: 'How do I reset my password?', answer: 'Click on "Forgot Password" on the login page. Enter your email address and we will send you a password reset link.' },
      { question: 'Can I have multiple accounts?', answer: 'No, each individual is allowed only one customer account. Vendors may have separate accounts for their business.' },
    ],
    payments: [
      { question: 'How does M-Pesa payment work?', answer: 'During checkout, select M-Pesa as your payment method. Enter your phone number and confirm the payment on your phone when prompted. The amount will be deducted from your M-Pesa balance.' },
      { question: 'Is my payment information secure?', answer: 'Yes, we use secure encryption for all transactions. We do not store your M-Pesa PIN or sensitive financial information.' },
    ],
    orders: [
      { question: 'How long does delivery take?', answer: 'Delivery times vary by vendor and location. Typically, orders are delivered within 2-5 business days within major cities, and 5-10 business days for other regions.' },
      { question: 'Can I track my order?', answer: 'Yes, once your order is shipped, you will receive a tracking number via email and SMS that you can use to monitor your delivery status.' },
    ],
    returns: [
      { question: 'What is your return policy?', answer: 'We offer a 7-day return policy for most items. Items must be unused and in original packaging. Some items may have different return policies as specified by the vendor.' },
      { question: 'How do I initiate a return?', answer: 'Go to your order history, select the item you want to return, and click "Return Item". Follow the instructions to complete your return request.' },
    ],
    vendor: [
      { question: 'How do I become a vendor?', answer: 'Click on "Become a Seller" on the homepage and complete the vendor application form. Our team will review your application and get back to you within 2 business days.' },
      { question: 'What commission does ShopEase charge?', answer: 'Our standard commission rate is 15% per sale. We offer reduced rates for high-volume sellers and subscription plans for featured placement.' },
    ],
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h1>
      
      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Help Center</h3>
          <p className="text-sm text-gray-600 mb-4">Find answers to frequently asked questions</p>
          <button 
            onClick={() => setActiveCategory('general')}
            className="bg-[#182155] text-white px-4 py-2 rounded-lg text-sm"
          >
            Browse FAQs
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 mb-4">Chat with our support team in real-time</p>
          <button className="bg-[#ff199c] text-white px-4 py-2 rounded-lg text-sm">
            Start Chat
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📧</span>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
            Contact Us
          </button>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
        </div>
        
        {/* FAQ Categories */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === category.id
                    ? 'bg-[#ff199c] text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        {faqItems[activeCategory].map((item, index) => (
          <div key={index} className="px-6 py-4">
            <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
            <p className="text-gray-600">{item.answer}</p>
          </div>
        ))}
      </div>
      
      {/* Contact Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Contact Support Team</h2>
        </div>
        <div className="px-6 py-4">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-[#ff199c] text-white px-6 py-2 rounded-lg font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}