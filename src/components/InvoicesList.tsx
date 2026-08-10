import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SaleInvoice } from '../types';
import { InvoicePrintModal } from './InvoicePrintModal';
import { PurchaseModal } from './PurchaseModal';
import { EditInvoiceModal } from './EditInvoiceModal';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  Calendar,
  User,
  Phone,
  CheckCircle,
  Clock,
  Filter,
  Trash2,
  Edit,
} from 'lucide-react';

export const InvoicesList: React.FC = () => {
  const { sales, role, artworks, settings, deleteSale } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<SaleInvoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<SaleInvoice | null>(null);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artworkTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales
    .filter((s) => s.status === 'completed')
    .reduce((acc, curr) => acc + curr.finalPrice, 0);

  const pendingCount = sales.filter((s) => s.status === 'pending').length;

  return (
    <div className="space-y-8 pb-16 text-right">
      {/* Header Stat Overview */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Receipt className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-serif">سجل المبيعات وإصدار الفواتير</h2>
            <p className="text-xs text-zinc-400 mt-1">
              إدارة فواتير اقتناء لوحات الستيلو، معاينة وتصدير الفواتير الرسمية الموقعة
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="px-5 py-3 bg-zinc-950 rounded-2xl border border-zinc-800 text-left">
            <p className="text-[11px] text-zinc-400">إجمالي إيرادات الفواتير المكتملة:</p>
            <p className="text-xl font-extrabold text-amber-400 font-mono">
              {totalRevenue.toLocaleString()} <span className="text-xs font-sans text-amber-300">{settings.currency}</span>
            </p>
          </div>

          {role === 'admin' && (
            <button
              onClick={() => {
                const available = artworks.find((a) => a.status === 'available');
                if (!available) {
                  alert('لا توجد لوحات متاحة حالياً للبيع المباشر. يرجى إضافة لوحة جديدة أو تغيير حالة إحدى اللوحات إلى "متاحة".');
                  return;
                }
                setShowNewInvoiceModal(true);
              }}
              className="px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إصدار فاتورة بيع جديدة</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute top-3.5 right-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الفاتورة، اسم العميل، رقم الهاتف، أو اسم اللوحة..."
            className="w-full pl-4 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-medium focus:outline-none focus:border-amber-500 w-full sm:w-auto"
          >
            <option value="all">جميع الفواتير ({sales.length})</option>
            <option value="completed">المكتملة والمسددة</option>
            <option value="pending">طلبات معلقة ({pendingCount})</option>
          </select>
        </div>
      </div>

      {/* Invoices List / Grid */}
      {filteredSales.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-400 space-y-2">
          <Receipt className="w-10 h-10 mx-auto text-zinc-600" />
          <p className="text-base font-semibold">لا توجد فواتير مطابقة للبحث حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSales.map((inv, index) => {
            const isCompleted = inv.status === 'completed';

            return (
              <div
                key={inv.id ? `${inv.id}-${index}` : `invoice-${inv.invoiceNumber}-${index}`}
                className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-5 shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Invoice Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold rounded-lg">
                      {inv.invoiceNumber}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isCompleted ? 'مسددة ومكتملة' : 'طلب معلق (قيد التواصل)'}
                    </span>

                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {inv.saleDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-serif">{inv.artworkTitle}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      العميل: <strong className="text-zinc-200">{inv.customerName}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      {inv.customerPhone}
                    </span>
                    <span>العنوان: {inv.customerAddress}</span>
                  </div>
                </div>

                {/* Right Price & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800">
                  <div className="text-left">
                    <p className="text-[11px] text-zinc-400">القيمة الصافية:</p>
                    <p className="text-lg font-black text-amber-400 font-mono">
                      {inv.finalPrice.toLocaleString()} <span className="text-xs font-sans text-amber-300">{settings.currency}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-2 border border-zinc-700 transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      <span>معاينة وطباعة الفاتورة</span>
                    </button>
                    {role === 'admin' && (
                      <>
                        <button
                          onClick={() => setEditingInvoice(inv)}
                          className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-zinc-700 transition-all"
                          title="تعديل بيانات الفاتورة"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت تأكد من رغبتك في حذف الفاتورة رقم ${inv.invoiceNumber}؟`)) {
                              deleteSale(inv.id);
                            }
                          }}
                          className="p-2.5 bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 rounded-xl border border-zinc-700 transition-all"
                          title="حذف الفاتورة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Print View Modal */}
      <InvoicePrintModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* Edit Invoice Modal */}
      <EditInvoiceModal
        invoice={editingInvoice}
        onClose={() => setEditingInvoice(null)}
      />

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <PurchaseModal
          artwork={artworks.find((a) => a.status === 'available') || null}
          onClose={() => setShowNewInvoiceModal(false)}
        />
      )}
    </div>
  );
};
