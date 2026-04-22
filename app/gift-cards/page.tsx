// app/gift-cards/page.tsx
'use client';

import { useState } from 'react';
import { Gift, Send, Mail, Smartphone, CheckCircle, CreditCard, Sparkles, Heart, Star, Cake, Briefcase } from 'lucide-react';

interface GiftCardOption {
  value: number;
  label: string;
  popular?: boolean;
  icon?: React.ReactNode;
}

export default function GiftCardsPage() {
  const [selectedValue, setSelectedValue] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [message, setMessage] = useState('');
  const [occasion, setOccasion] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'sms'>('email');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const giftCardOptions: GiftCardOption[] = [
    { value: 500, label: 'KES 500', icon: <Star className="w-4 h-4" /> },
    { value: 1000, label: 'KES 1,000', popular: true, icon: <Heart className="w-4 h-4" /> },
    { value: 2500, label: 'KES 2,500', icon: <Sparkles className="w-4 h-4" /> },
    { value: 5000, label: 'KES 5,000', icon: <Cake className="w-4 h-4" /> },
    { value: 10000, label: 'KES 10,000', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const occasions = [
    { value: 'birthday', label: 'Birthday', icon: <Cake className="w-4 h-4" /> },
    { value: 'anniversary', label: 'Anniversary', icon: <Heart className="w-4 h-4" /> },
    { value: 'holiday', label: 'Holiday', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'thankyou', label: 'Thank You', icon: <Star className="w-4 h-4" /> },
    { value: 'justbecause', label: 'Just Because', icon: <Gift className="w-4 h-4" /> },
  ];

  const getFinalAmount = () => {
    if (customAmount && parseFloat(customAmount) >= 100) {
      return parseFloat(customAmount);
    }
    return selectedValue;
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/gift-cards/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getFinalAmount(),
          recipientName,
          recipientEmail: deliveryMethod === 'email' ? recipientEmail : undefined,
          recipientPhone: deliveryMethod === 'sms' ? recipientPhone : undefined,
          message,
          occasion,
          deliveryMethod
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          // Reset form
          setRecipientName('');
          setRecipientEmail('');
          setRecipientPhone('');
          setMessage('');
          setOccasion('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error purchasing gift card:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 py-12">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-4">
              <Gift className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Perfect for Gifting</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Gift Cards
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Give the gift of choice — let your loved ones pick what they want
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Gift Card Selection */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Choose an amount</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {giftCardOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedValue(option.value);
                    setCustomAmount('');
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedValue === option.value && !customAmount
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-[var(--color-border)] hover:border-purple-500/50'
                  }`}
                >
                  {option.popular && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Popular
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    {option.icon}
                    <span className="font-semibold text-[var(--color-text)]">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Custom Amount (KES)
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedValue(0);
                }}
                min="100"
                step="100"
                placeholder="Enter any amount (min KES 100)"
                className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Gift Card Value</p>
                <p className="text-4xl font-bold text-purple-600">
                  KSh {getFinalAmount().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Recipient Info */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Send to</h2>
            
            {/* Delivery Method */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setDeliveryMethod('email')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  deliveryMethod === 'email'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-[var(--color-border)]'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </button>
              <button
                onClick={() => setDeliveryMethod('sms')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  deliveryMethod === 'sms'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-[var(--color-border)]'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>SMS</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter their name"
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl"
                />
              </div>

              {deliveryMethod === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Recipient Phone *
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Occasion (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {occasions.map((occ) => (
                    <button
                      key={occ.value}
                      onClick={() => setOccasion(occ.value)}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                        occasion === occ.value
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      {occ.icon}
                      <span className="text-sm">{occ.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Personal Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Add a personal note..."
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl resize-none"
                />
              </div>

              {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Gift card purchased successfully!</span>
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={isProcessing || !recipientName || (deliveryMethod === 'email' ? !recipientEmail : !recipientPhone)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Purchase Gift Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--color-surface)] rounded-xl p-6 text-center border border-[var(--color-border)]">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Instant Delivery</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Gift cards are delivered instantly via email or SMS</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-6 text-center border border-[var(--color-border)]">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Wide Selection</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Can be used across thousands of products</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-6 text-center border border-[var(--color-border)]">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Perfect for Any Occasion</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Birthdays, holidays, or just because</p>
          </div>
        </div>
      </div>
    </div>
  );
}