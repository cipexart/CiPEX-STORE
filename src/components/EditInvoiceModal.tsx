import React, { useState } from 'react';
import { SaleInvoice, PaymentMethod } from '../types';
import { useApp } from '../context/AppContext';
import { X, Save, Receipt, User, Phone, MapPin, CreditCard, Calendar, CheckCircle, Clock } from 'lucide-react';

interface EditInvoiceModalProps {
  invoice: SaleInvoice | null;
  onClose: () => void;
}

export const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({ invoice, onClose }) => {
  const { updateSale, settings } = useApp();

  if (!invoice) return null;

  const [customerName, setCustomerName] = useState(invoice.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(invoice.customerPhone || '');
  const [customerAddress, setCustomerAddress] = useState(invoice.customerAddress || '');
  const [artworkTitle, setArtworkTitle] = useState(invoice.artworkTitle || '');
  const [finalPrice, setFinalPrice] = useState(invoice.finalPrice || 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(invoice.paymentMethod || 'cash');
  const [status, setStatus] = useState<'completed' | 'pending' | 'cancelled'>(invoice.status || 'completed');
  const [saleDate, setSaleDate] = useState(invoice.saleDate || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(invoice.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: SaleInvoice = {
      ...invoice,
      customerName,
      customerPhone,
      customerAddress,
      artworkTitle,
      finalPrice: Number(finalPrice),
      paymentMethod,
      status,
      saleDate,
      notes,
    };

    updateSale(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-right space-y-6 shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-serif">تعديل الفاتورة</h2>
              <p className="text-xs text-zinc-400 font-mono">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Artwork Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">اسم اللوحة الفنية</label>
            <input
              type="text"
              required
              value={artworkTitle}
              onChange={(e) => setArtworkTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>اسم العميل / المقتني *</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>رقم الهاتف *</span>
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>عنوان التسليم والملاحظات</span>
            </label>
            <input
              type="text"
              required
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Financials & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">المبلغ النهائي ({settings.currency}) *</label>
              <input
                type="number"
                required
                min="0"
                value={finalPrice}
                onChange={(e) => setFinalPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>طريقة الدفع</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="cash">نقداً (Cash)</option>
                <option value="bank_transfer">تحويل بانكي</option>
                <option value="check">شيك مصرفي</option>
                <option value="card">بطاقة بنكية</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">حالة الفاتورة *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'completed' | 'pending' | 'cancelled')}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="completed">مسددة ومكتملة</option>
                <option value="pending">طلب معلق (قيد التواصل)</option>
                <option value="cancelled">ملغاة</option>
              </select>
            </div>
          </div>

          {/* Sale Date */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>تاريخ الفاتورة *</span>
            </label>
            <input
              type="date"
              required
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">ملاحظات إضافية على الفاتورة</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات خاصة بالتسليم أو الدفع..."
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات على الفاتورة</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-2xl transition-all text-sm"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
