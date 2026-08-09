import React, { useState } from 'react';
import { Artwork, PaymentMethod } from '../types';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, Check, ShieldCheck, Truck, Phone, User, MapPin } from 'lucide-react';

interface Props {
  artwork: Artwork | null;
  onClose: () => void;
}

export const PurchaseModal: React.FC<Props> = ({ artwork, onClose }) => {
  const { role, submitPurchaseRequest, createInvoiceAndRecordSale, settings } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');

  if (!artwork) return null;

  const finalPrice = Math.max(0, artwork.price - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'admin') {
      // Direct Sale Invoice creation by Admin
      createInvoiceAndRecordSale({
        artworkId: artwork.id,
        artworkTitle: artwork.titleAr,
        customerName,
        customerPhone,
        customerAddress,
        customerEmail,
        saleDate: new Date().toISOString().split('T')[0],
        originalPrice: artwork.price,
        discount: Number(discount),
        finalPrice,
        paymentMethod,
        status: 'completed',
        notes,
      });
    } else {
      // Visitor Purchase Request
      submitPurchaseRequest(
        artwork.id,
        customerName,
        customerPhone,
        customerAddress,
        notes
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full my-8 p-6 md:p-8 shadow-2xl relative text-right text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Summary */}
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              {role === 'admin' ? 'إصدار فاتورة بيع مباشرة' : 'طلب اقتناء لوحة فنية'}
            </h3>
            <p className="text-xs text-zinc-400">
              {role === 'admin'
                ? 'تسجيل عملية الشراء وإصدار فاتورة رسمية للعميل'
                : 'أدخل معلوماتك ليتم التواصل معك وحجز اللوحة الأصيلة'}
            </p>
          </div>
        </div>

        {/* Selected Artwork Card */}
        <div className="flex items-center gap-4 bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 mb-6">
          <img
            src={artwork.imageUrl}
            alt={artwork.titleAr}
            className="w-16 h-16 object-cover rounded-xl border border-zinc-800 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate font-serif">{artwork.titleAr}</h4>
            <p className="text-xs text-zinc-400">
              {artwork.dimensions} • {artwork.drawingHours} ساعة رسم بالستيلو
            </p>
            <p className="text-sm font-extrabold text-amber-400 font-mono mt-0.5">
              {artwork.price.toLocaleString()} {settings.currency}
            </p>
          </div>
        </div>

        {/* Purchase Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                اسم المقتني / العميل الكامل *
              </span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثال: أمين بن جلون"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  رقم الهاتف والتواصل * (صيغة: 0699745621)
                </span>
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0699745621"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">البريد الإلكتروني (اختياري)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                عنوان التسليم والاستلام (المدينة / الحي) *
              </span>
            </label>
            <input
              type="text"
              required
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="الدار البيضاء، حي المعاريف، المغرب"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Admin Discount & Payment Method Options */}
          {role === 'admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">مقدار الخصم الممنوح</label>
                <input
                  type="number"
                  min="0"
                  max={artwork.price}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">طريقة الدفع</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="cash">نقداً يداً بيد (Cash)</option>
                  <option value="transfer">تحويل بنكي / بريدي (CCP/BaridiMob)</option>
                  <option value="delivery">الدفع عند الاستلام (COD)</option>
                  <option value="card">بطاقة بنكية</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">ملاحظات أو طلبات خاصة</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: يرجى كتابة إهداء خاص في شهادة الأصالة..."
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Final Price Breakdown */}
          <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <span className="text-xs font-bold text-amber-300">المبلغ الإجمالي النهائي:</span>
            <span className="text-xl font-black text-amber-400 font-mono">
              {finalPrice.toLocaleString()} {settings.currency}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>تأتي اللوحة الفنية مصحوبة بشهادة الأصالة وتوقيع الفنان CiPEX الشخصي.</span>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              type="submit"
              className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>{role === 'admin' ? 'تأكيد البيع وإصدار الفاتورة' : 'إرسال طلب الاقتناء وحجز اللوحة'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-2xl transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
