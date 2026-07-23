'use client';

import { useState } from 'react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: {
    businessName: string;
    ownerName: string;
    phoneNumber: string;
    businessLocation: string;
    payoutMethod: 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL';
    payoutDetails: {
      mpesaNumber?: string;
      pochiNumber?: string;
      tillNumber?: string;
      paybillNumber?: string;
      paybillAccount?: string;
    };
  };
  saving: boolean;
}

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  saving 
}: EditProfileModalProps) {
  const [form, setForm] = useState(initialData);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const renderPayoutFields = () => {
    switch (form.payoutMethod) {
      case 'MPESA':
        return (
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              MPESA Number
            </label>
            <input
              type="text"
              value={form.payoutDetails.mpesaNumber || ''}
              onChange={(e) => setForm({
                ...form,
                payoutDetails: { ...form.payoutDetails, mpesaNumber: e.target.value }
              })}
              className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary placeholder-muted"
              placeholder="Enter MPESA number"
            />
          </div>
        );
      case 'POCHI':
        return (
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              POCHI Number
            </label>
            <input
              type="text"
              value={form.payoutDetails.pochiNumber || ''}
              onChange={(e) => setForm({
                ...form,
                payoutDetails: { ...form.payoutDetails, pochiNumber: e.target.value }
              })}
              className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary placeholder-muted"
              placeholder="Enter POCHI number"
            />
          </div>
        );
      case 'TILL':
        return (
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Till Number
            </label>
            <input
              type="text"
              value={form.payoutDetails.tillNumber || ''}
              onChange={(e) => setForm({
                ...form,
                payoutDetails: { ...form.payoutDetails, tillNumber: e.target.value }
              })}
              className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary placeholder-muted"
              placeholder="Enter till number"
            />
          </div>
        );
      case 'PAYBILL':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Paybill Number
              </label>
              <input
                type="text"
                value={form.payoutDetails.paybillNumber || ''}
                onChange={(e) => setForm({
                  ...form,
                  payoutDetails: { ...form.payoutDetails, paybillNumber: e.target.value }
                })}
                className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary placeholder-muted"
                placeholder="Enter paybill number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                value={form.payoutDetails.paybillAccount || ''}
                onChange={(e) => setForm({
                  ...form,
                  payoutDetails: { ...form.payoutDetails, paybillAccount: e.target.value }
                })}
                className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary placeholder-muted"
                placeholder="Enter account number"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary">✏️ Edit Shop Details</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-secondary transition-colors duration-200 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Business Name
            </label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              required
              className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary placeholder-muted"
              placeholder="Enter business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Owner Name
            </label>
            <input
              type="text"
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              required
              className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary placeholder-muted"
              placeholder="Enter owner name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              required
              className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary placeholder-muted"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Business Location
            </label>
            <input
              type="text"
              value={form.businessLocation}
              onChange={(e) => setForm({ ...form, businessLocation: e.target.value })}
              required
              className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary placeholder-muted"
              placeholder="Enter business location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Payout Method
            </label>
            <select
              value={form.payoutMethod}
              onChange={(e) => setForm({ ...form, payoutMethod: e.target.value as any })}
              className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-sm sm:text-base text-secondary"
            >
              <option value="MPESA">MPESA</option>
              <option value="POCHI">POCHI</option>
              <option value="TILL">TILL</option>
              <option value="PAYBILL">PAYBILL</option>
            </select>
          </div>

          {renderPayoutFields()}

          <div className="flex flex-col xs:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary hover:bg-accent-dark text-white px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface hover:bg-surface/70 text-secondary px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-200 font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}