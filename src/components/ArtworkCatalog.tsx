import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Artwork, ArtworkStatus } from '../types';
import { ArtworkDetailModal } from './ArtworkDetailModal';
import { ArtworkFormModal } from './ArtworkFormModal';
import { PurchaseModal } from './PurchaseModal';
import {
  Search,
  Plus,
  Filter,
  PenTool,
  Clock,
  Maximize2,
  CheckCircle,
  AlertCircle,
  Eye,
  ShoppingCart,
  Edit,
  Trash2,
  Sparkles,
  Award,
} from 'lucide-react';

export const ArtworkCatalog: React.FC = () => {
  const {
    artworks,
    role,
    deleteArtwork,
    changeArtworkStatus,
    settings,
    searchQuery,
    setSearchQuery,
    selectedColorFilter,
    setSelectedColorFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
  } = useApp();

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [purchaseArtwork, setPurchaseArtwork] = useState<Artwork | null>(null);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter artworks
  const filteredArtworks = artworks.filter((art) => {
    const matchesSearch =
      art.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesColor =
      selectedColorFilter === 'all' ||
      art.penColors.some((c) => c.toLowerCase().includes(selectedColorFilter.toLowerCase()));

    const matchesStatus =
      selectedStatusFilter === 'all' || art.status === selectedStatusFilter;

    return matchesSearch && matchesColor && matchesStatus;
  });

  const availableCount = artworks.filter((a) => a.status === 'available').length;
  const soldCount = artworks.filter((a) => a.status === 'sold').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl text-right space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
            <PenTool className="w-4 h-4 text-amber-400" />
            <span>معرض الفنان CiPEX للرسم بالقلم الجاف (Stilo Art)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-serif leading-tight">
            دقة التفاصيل وعمق الظلال بأقلام الجاف
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            مجموعة أصلية فريدة من اللوحات الفنية المرسومة يدويًا بالكامل بأقلام الستيلو، تستثمر مئات الساعات من التركيز والتظليل الدقيق. كل لوحة قطعة واحدة أصلية مصحوبة بشهادة الأصالة.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-semibold text-zinc-400 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>اللوحات المتاحة للاقتناء: <strong className="text-amber-400 font-mono text-sm">{availableCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>اللوحات المقتناة والمبيعة: <strong className="text-amber-400 font-mono text-sm">{soldCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>توقيع الفنان وشهادة الأصالة الرسمية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute top-3.5 right-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم اللوحة، التظليل، أو رقم شهادة الأصالة..."
            className="w-full pl-4 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pen Color Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-500 mr-2" />
            <button
              onClick={() => setSelectedColorFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedColorFilter === 'all'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              الجميع
            </button>
            <button
              onClick={() => setSelectedColorFilter('أزرق')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedColorFilter === 'أزرق'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🖊️ أزرق
            </button>
            <button
              onClick={() => setSelectedColorFilter('أسود')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedColorFilter === 'أسود'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🖊️ أسود
            </button>
            <button
              onClick={() => setSelectedColorFilter('أحمر')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedColorFilter === 'أحمر'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🖊️ أحمر
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="available">المتاحة فقط</option>
            <option value="reserved">المحجوزة</option>
            <option value="sold">المبيعة</option>
          </select>

          {/* Admin Add Button */}
          {role === 'admin' && (
            <button
              onClick={() => {
                setEditingArtwork(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة لوحة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {/* Artworks Exhibition Grid */}
      {artworks.length === 0 ? (
        <div className="bg-zinc-900/60 border border-dashed border-amber-500/30 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-serif">المعرض فارغ وجاهز للوحاتك الجديدة</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            تم مسح جميع اللوحات التجريبية بنجاح. يمكنك الآن بصفتك الأدمن البدء في إضافة لوحاتك الفنية الأصلية الحقيقية وتحديد أسعارها وتفاصيلها.
          </p>
          {role === 'admin' && (
            <button
              onClick={() => {
                setEditingArtwork(null);
                setIsFormOpen(true);
              }}
              className="mt-2 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-2xl text-xs inline-flex items-center gap-2 transition-all shadow-xl shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أول لوحة حقيقية الآن</span>
            </button>
          )}
        </div>
      ) : filteredArtworks.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-12 text-center text-zinc-400 space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-amber-500/50" />
          <p className="text-base font-semibold">لا توجد لوحات فنية تطابق معايير البحث المحددة</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedColorFilter('all');
              setSelectedStatusFilter('all');
            }}
            className="text-xs text-amber-400 hover:underline"
          >
            إعادة ضبط الفلاتر والبحث
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((art, index) => {
            const isAvailable = art.status === 'available';
            const isReserved = art.status === 'reserved';

            return (
              <div
                key={art.id ? `${art.id}-${index}` : `art-${index}`}
                className="group bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/90 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Artwork Image Container */}
                <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => setSelectedArtwork(art)}>
                  <img
                    src={art.imageUrl}
                    alt={art.titleAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-md backdrop-blur-md ${
                        isAvailable
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                          : isReserved
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-700/50'
                      }`}
                    >
                      {isAvailable ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3" />}
                      {isAvailable ? 'متاحة للبيع' : isReserved ? 'محجوزة' : 'مبيعة'}
                    </span>
                  </div>

                  {/* Drawing Hours Badge */}
                  <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-zinc-800 text-[11px] font-mono text-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{art.drawingHours}h رسم بالستيلو</span>
                  </div>

                  {/* Overlay Quick Zoom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-zinc-950/40 transition-opacity">
                    <span className="p-3 bg-zinc-900/90 text-amber-400 rounded-full border border-zinc-700 shadow-xl">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      onClick={() => setSelectedArtwork(art)}
                      className="text-lg font-bold text-white font-serif line-clamp-1 cursor-pointer hover:text-amber-400 transition-colors"
                    >
                      {art.titleAr}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3 h-3 text-zinc-500" />
                        {art.dimensions}
                      </span>
                      <span>•</span>
                      <span className="truncate">{art.paperType}</span>
                    </div>

                    {/* Pen colors tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {art.penColors.map((color, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] font-medium text-zinc-300">
                          🖊️ {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-zinc-400">القيمة الفنية:</p>
                      <p className="text-base font-extrabold text-amber-400 font-mono">
                        {art.price.toLocaleString()} <span className="text-xs font-sans text-amber-300">{settings.currency}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAvailable ? (
                        <button
                          onClick={() => setPurchaseArtwork(art)}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{role === 'admin' ? 'بيع مباشر' : 'طلب اقتناء'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedArtwork(art)}
                          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium"
                        >
                          عرض التفاصيل
                        </button>
                      )}

                      {/* Admin Quick Options */}
                      {role === 'admin' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingArtwork(art);
                              setIsFormOpen(true);
                            }}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-colors"
                            title="تعديل اللوحة"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت أؤكد حذف اللوحة "${art.titleAr}" من المخزون؟`)) {
                                deleteArtwork(art.id);
                              }
                            }}
                            className="p-2 bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 rounded-xl transition-colors"
                            title="حذف اللوحة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ArtworkDetailModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onOrderClick={(art) => setPurchaseArtwork(art)}
        onEditClick={(art) => {
          setEditingArtwork(art);
          setIsFormOpen(true);
        }}
      />

      <PurchaseModal
        artwork={purchaseArtwork}
        onClose={() => setPurchaseArtwork(null)}
      />

      <ArtworkFormModal
        isOpen={isFormOpen}
        artworkToEdit={editingArtwork}
        onClose={() => {
          setIsFormOpen(false);
          setEditingArtwork(null);
        }}
      />
    </div>
  );
};
