import React from 'react';
import { Artwork } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Clock,
  Maximize2,
  Palette,
  FileText,
  Award,
  Frame,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Calendar,
  PenTool,
  Edit,
} from 'lucide-react';

interface Props {
  artwork: Artwork | null;
  onClose: () => void;
  onOrderClick: (art: Artwork) => void;
  onEditClick: (art: Artwork) => void;
}

export const ArtworkDetailModal: React.FC<Props> = ({
  artwork,
  onClose,
  onOrderClick,
  onEditClick,
}) => {
  const { role, settings } = useApp();

  if (!artwork) return null;

  const isAvailable = artwork.status === 'available';
  const isReserved = artwork.status === 'reserved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-4xl w-full my-8 overflow-hidden shadow-2xl relative text-right text-zinc-100 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 bg-zinc-950/80 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full border border-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Artwork Image View */}
        <div className="md:w-1/2 bg-zinc-950 p-6 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-l border-zinc-800">
          <img
            src={artwork.imageUrl}
            alt={artwork.titleAr}
            className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl border border-zinc-800/80"
          />

          <div className="absolute bottom-4 right-4 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
            <PenTool className="w-3.5 h-3.5 text-amber-400" />
            <span>رسم يدوي حقيقي بالقلم الجاف</span>
          </div>
        </div>

        {/* Details & Specs Section */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Status & Year Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  isAvailable
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : isReserved
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {isAvailable ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {isAvailable ? 'متاحة للاقتناء والبيع' : isReserved ? 'محجوزة مؤقتاً' : 'مبيعة ومقتناة'}
              </span>

              <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-700/50 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>إنجاز {artwork.creationYear}</span>
              </span>
            </div>

            {/* Artwork Title */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-serif leading-tight">
              {artwork.titleAr}
            </h2>

            {/* Price Tag */}
            <div className="text-2xl font-black text-amber-400 mb-6 font-mono">
              {artwork.price.toLocaleString()} <span className="text-sm font-sans font-medium text-amber-300">{settings.currency}</span>
            </div>

            {/* Ballpoint Technique Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>ساعات العمل الدقيق</span>
                </div>
                <p className="text-sm font-bold text-zinc-100 font-mono">{artwork.drawingHours} ساعة رسم بالستيلو</p>
              </div>

              <div className="bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                  <span>الأبعاد والقياس</span>
                </div>
                <p className="text-sm font-bold text-zinc-100">{artwork.dimensions}</p>
              </div>

              <div className="bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>نوع الورق الفني</span>
                </div>
                <p className="text-sm font-bold text-zinc-100 truncate">{artwork.paperType}</p>
              </div>

              <div className="bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <Frame className="w-4 h-4 text-amber-400" />
                  <span>الإطار الفاخر</span>
                </div>
                <p className="text-sm font-bold text-zinc-100">{artwork.frameIncluded ? 'متوفر ومشمول' : 'بدون إطار'}</p>
              </div>
            </div>

            {/* Pen Colors Used */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>ألوان أقلام الستيلو المستعملة:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {artwork.penColors.map((color, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs font-semibold"
                  >
                    🖊️ {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-zinc-400 mb-1">وصف ورؤية الفنان:</h4>
              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                {artwork.description}
              </p>
            </div>

            {/* Certificate Tag */}
            <div className="flex items-center gap-3 p-3 bg-amber-950/30 border border-amber-800/40 rounded-2xl mb-6">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-300">مرفقة بشهادة الأصالة الرسمية</p>
                <p className="text-[11px] text-amber-200/70 font-mono">رقم الشهادة: {artwork.certificateNumber}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex gap-3">
            {isAvailable ? (
              <button
                onClick={() => {
                  onClose();
                  onOrderClick(artwork);
                }}
                className="flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>طلب اقتناء هذه اللوحة</span>
              </button>
            ) : (
              <div className="flex-1 py-3 px-4 bg-zinc-800/80 text-zinc-400 rounded-2xl text-center text-xs font-semibold">
                هذه اللوحة مبيعة أو محجوزة حالياً
              </div>
            )}

            {role === 'admin' && (
              <button
                onClick={() => {
                  onClose();
                  onEditClick(artwork);
                }}
                className="px-5 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold rounded-2xl flex items-center gap-2 transition-all border border-zinc-700"
              >
                <Edit className="w-4 h-4" />
                <span>تعديل اللوحة</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
