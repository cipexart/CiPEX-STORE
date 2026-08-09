import React from 'react';
import { SaleInvoice } from '../types';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, Award, PenTool, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  invoice: SaleInvoice | null;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<Props> = ({ invoice, onClose }) => {
  const { settings, artworks } = useApp();

  if (!invoice) return null;

  const artworkDetail = artworks.find((a) => a.id === invoice.artworkId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full my-8 p-6 sm:p-10 shadow-2xl relative text-right text-zinc-100 max-h-[95vh] overflow-y-auto">
        {/* Print Action Bar Header (Hidden on print) */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-8 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الفاتورة أو حفظ كـ PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Formal Invoice Sheet Canvas */}
        <div id="printable-invoice" className="bg-zinc-950 text-zinc-100 p-8 sm:p-12 rounded-3xl border border-zinc-800 space-y-8 font-sans print:p-0 print:border-0 print:bg-white print:text-zinc-900">
          {/* Header Branding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-zinc-800 print:border-zinc-300 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 font-black flex items-center justify-center print:bg-zinc-900 print:text-amber-400">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-black font-serif tracking-tight text-white print:text-zinc-900">
                    CiPEX <span className="text-amber-400 font-sans text-sm print:text-amber-600">Stilo Art Studio</span>
                  </h1>
                  <p className="text-xs text-zinc-400 print:text-zinc-600">{settings.studioName}</p>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-left space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold print:bg-zinc-100 print:border-zinc-300 print:text-zinc-800">
                {invoice.invoiceNumber}
              </span>
              <p className="text-xs text-zinc-400 print:text-zinc-600">تاريخ الإصدار: {invoice.saleDate}</p>
            </div>
          </div>

          {/* Customer & Artist Addresses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800/80 print:bg-zinc-50 print:border-zinc-200">
            {/* Customer Info */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider print:text-amber-700">معلومات المقتني / العميل:</h3>
              <p className="text-base font-bold text-white print:text-zinc-900">{invoice.customerName}</p>
              <p className="text-xs text-zinc-300 print:text-zinc-700">الهاتف: <span className="font-mono">{invoice.customerPhone}</span></p>
              <p className="text-xs text-zinc-300 print:text-zinc-700">العنوان: {invoice.customerAddress}</p>
              {invoice.customerEmail && (
                <p className="text-xs text-zinc-400 print:text-zinc-600">البريد: {invoice.customerEmail}</p>
              )}
            </div>

            {/* Artist Info */}
            <div className="space-y-2 text-right">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider print:text-amber-700">معلومات الفنان والجهة المصدرة:</h3>
              <p className="text-base font-bold text-white print:text-zinc-900">{settings.artistName}</p>
              <p className="text-xs text-zinc-300 print:text-zinc-700">الهاتف: <span className="font-mono">{settings.phone}</span></p>
              <p className="text-xs text-zinc-300 print:text-zinc-700">البريد: {settings.email}</p>
              <p className="text-xs text-zinc-400 print:text-zinc-600">المقر: {settings.address}</p>
            </div>
          </div>

          {/* Invoice Table Items */}
          <div>
            <h3 className="text-sm font-bold text-white print:text-zinc-900 mb-3 font-serif">تفاصيل اللوحة الفنية المباعة:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 text-xs border-b border-zinc-800 print:bg-zinc-200 print:text-zinc-800 print:border-zinc-300">
                    <th className="p-3 font-bold">اللوحة والمواصفات الفنية</th>
                    <th className="p-3 font-bold">الأبعاد وساعات الستيلو</th>
                    <th className="p-3 font-bold">رقم الشهادة</th>
                    <th className="p-3 font-bold text-left">السعر الأصلي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 print:divide-zinc-200 text-xs">
                  <tr>
                    <td className="p-3 font-bold text-white print:text-zinc-900">
                      <div>
                        <p className="font-serif text-sm">{invoice.artworkTitle}</p>
                        <p className="text-[11px] text-zinc-400 print:text-zinc-600 font-normal">
                          ألوان الستيلو: {artworkDetail?.penColors.join(', ') || 'أزرق/أسود جاف'}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-zinc-300 print:text-zinc-700">
                      {artworkDetail?.dimensions || '50x70 سم'} ({artworkDetail?.drawingHours || 120}h)
                    </td>
                    <td className="p-3 font-mono text-amber-400 print:text-amber-700">
                      {artworkDetail?.certificateNumber || 'CIPEX-STILO-2024'}
                    </td>
                    <td className="p-3 font-mono font-bold text-left text-zinc-200 print:text-zinc-900">
                      {invoice.originalPrice.toLocaleString()} {settings.currency}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Totals */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-zinc-800 print:border-zinc-300">
            <div className="space-y-1 text-xs text-zinc-400 print:text-zinc-600">
              <p className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 print:text-emerald-700" />
                طريقة الدفع: <strong className="text-zinc-200 print:text-zinc-800">{invoice.paymentMethod === 'cash' ? 'نقداً (Cash)' : invoice.paymentMethod === 'transfer' ? 'تحويل بنكي' : 'الدفع عند الاستلام'}</strong>
              </p>
              <p>حالة الفاتورة: <strong className="text-emerald-400 print:text-emerald-700">مسددة ومكتملة (Completed)</strong></p>
            </div>

            <div className="w-full sm:w-64 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 print:bg-zinc-100 print:border-zinc-300 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400 print:text-zinc-600">
                <span>المبلغ الأساسي:</span>
                <span className="font-mono">{invoice.originalPrice.toLocaleString()} {settings.currency}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                  <span>الخصم الممنوح:</span>
                  <span className="font-mono">-{invoice.discount.toLocaleString()} {settings.currency}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-amber-400 print:text-zinc-900 pt-2 border-t border-zinc-800 print:border-zinc-300">
                <span>الصافي النهائي:</span>
                <span className="font-mono">{invoice.finalPrice.toLocaleString()} {settings.currency}</span>
              </div>
            </div>
          </div>

          {/* Artist Guarantee & Signature Stamp Block */}
          <div className="pt-6 border-t border-zinc-800 print:border-zinc-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-xs text-zinc-400 print:text-zinc-700 max-w-md">
              <Award className="w-8 h-8 text-amber-400 shrink-0 print:text-amber-600" />
              <p className="leading-relaxed">{settings.invoiceFooterAr}</p>
            </div>

            {/* Signature Block */}
            <div className="text-center p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 print:bg-zinc-50 print:border-zinc-200 w-48">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">توقيع وختم الفنان</p>
              <div className="font-serif italic text-xl font-bold text-amber-400 print:text-zinc-900">
                Artist CiPEX
              </div>
              <p className="text-[9px] font-mono text-zinc-500 mt-1">Stilo Fine Art Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
