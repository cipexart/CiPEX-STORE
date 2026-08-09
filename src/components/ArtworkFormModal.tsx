import React, { useState, useEffect, useRef } from 'react';
import { Artwork, ArtworkStatus } from '../types';
import { useApp } from '../context/AppContext';
import { X, Plus, Save, Image as ImageIcon, Sparkles, Upload, Trash2, FolderOpen, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  artworkToEdit: Artwork | null;
  onClose: () => void;
}

export const ArtworkFormModal: React.FC<Props> = ({
  isOpen,
  artworkToEdit,
  onClose,
}) => {
  const { addArtwork, updateArtwork, settings } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titleAr, setTitleAr] = useState('');
  const [dimensions, setDimensions] = useState('50 × 70 سم');
  const [drawingHours, setDrawingHours] = useState(100);
  const [penColorsInput, setPenColorsInput] = useState('أزرق جاف داكن, أسود جاف');
  const [paperType, setPaperType] = useState('ورق فني فاخر Canson 300g');
  const [creationYear, setCreationYear] = useState('2024');
  const [price, setPrice] = useState(75000);
  const [status, setStatus] = useState<ArtworkStatus>('available');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [frameIncluded, setFrameIncluded] = useState(true);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');

  useEffect(() => {
    if (artworkToEdit) {
      setTitleAr(artworkToEdit.titleAr);
      setDimensions(artworkToEdit.dimensions);
      setDrawingHours(artworkToEdit.drawingHours);
      setPenColorsInput(artworkToEdit.penColors.join(', '));
      setPaperType(artworkToEdit.paperType);
      setCreationYear(artworkToEdit.creationYear);
      setPrice(artworkToEdit.price);
      setStatus(artworkToEdit.status);
      setImageUrl(artworkToEdit.imageUrl);
      setDescription(artworkToEdit.description);
      setCertificateNumber(artworkToEdit.certificateNumber);
      setFrameIncluded(artworkToEdit.frameIncluded);
    } else {
      // Default new artwork values
      setTitleAr('');
      setDimensions('50 × 70 سم');
      setDrawingHours(120);
      setPenColorsInput('أزرق جاف, أسود جاف');
      setPaperType('ورق كرتوني Canson 300g');
      setCreationYear('2024');
      setPrice(80000);
      setStatus('available');
      setImageUrl('');
      setDescription('لوحة مرسومة يدويًا بالقلم الجاف بواسطة الفنان CiPEX بخطوط وتظليل دقيق.');
      setCertificateNumber(`CIPEX-STILO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setFrameIncluded(true);
    }
  }, [artworkToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.src = result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          let quality = 0.7;
          let compressedBase64 = canvas.toDataURL('image/jpeg', quality);

          // Ensure base64 string length stays strictly under 38,000 characters for Google Sheets cell limit
          while (compressedBase64.length > 38000 && quality > 0.15) {
            quality -= 0.1;
            compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          }

          if (compressedBase64.length > 38000) {
            const smallCanvas = document.createElement('canvas');
            smallCanvas.width = Math.round(width * 0.6);
            smallCanvas.height = Math.round(height * 0.6);
            const smallCtx = smallCanvas.getContext('2d');
            if (smallCtx) {
              smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
              compressedBase64 = smallCanvas.toDataURL('image/jpeg', 0.5);
            }
          }

          setImageUrl(compressedBase64);
        } else {
          setImageUrl(result.substring(0, 38000));
        }
      };
      img.onerror = () => {
        setImageUrl(result.substring(0, 38000));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const colorsArray = penColorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const finalImageUrl = imageUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80';

    if (artworkToEdit) {
      updateArtwork({
        ...artworkToEdit,
        titleAr,
        dimensions,
        drawingHours: Number(drawingHours),
        penColors: colorsArray,
        paperType,
        creationYear,
        price: Number(price),
        status,
        imageUrl: finalImageUrl,
        description,
        certificateNumber,
        frameIncluded,
      });
    } else {
      addArtwork({
        titleAr,
        dimensions,
        drawingHours: Number(drawingHours),
        penColors: colorsArray,
        paperType,
        creationYear,
        price: Number(price),
        status,
        imageUrl: finalImageUrl,
        description,
        certificateNumber,
        frameIncluded,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full my-8 p-6 md:p-8 shadow-2xl relative text-right text-zinc-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              {artworkToEdit ? 'تعديل بيانات اللوحة الفنية' : 'إضافة لوحة رسم بالقلم الجاف جديدة'}
            </h3>
            <p className="text-xs text-zinc-400">إدخال المواصفات الفنية وساعات الرسم والقيم للمخزون</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">عنوان اللوحة (بالعربية) *</label>
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="مثال: بورتريه خيل أصيل - قلم جاف أزرق"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Grid: Hours, Price, Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">ساعات الرسم بالستيلو *</label>
              <input
                type="number"
                required
                min="1"
                value={drawingHours}
                onChange={(e) => setDrawingHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-amber-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">السعر ({settings.currency}) *</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-amber-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">سنة الإنجاز</label>
              <input
                type="text"
                value={creationYear}
                onChange={(e) => setCreationYear(e.target.value)}
                placeholder="2024"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Grid: Dimensions, Paper, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">الأبعاد والقياسات</label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="50 × 70 سم"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">نوع الورق الفني</label>
              <input
                type="text"
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
                placeholder="Canson 300g"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">حالة اللوحة بالمخزون</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArtworkStatus)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              >
                <option value="available">متاحة للبيع والعرض</option>
                <option value="reserved">محجوزة مؤقتاً</option>
                <option value="sold">مبيعة ومقتناة</option>
              </select>
            </div>
          </div>

          {/* Pen Colors Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              ألوان القلم الجاف (مفصولة بفاصلة)
            </label>
            <input
              type="text"
              value={penColorsInput}
              onChange={(e) => setPenColorsInput(e.target.value)}
              placeholder="أزرق جاف, أسود جاف, أحمر جاف"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Image Upload / Computer File Selection */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>صورة اللوحة الفنية *</span>
              </label>
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    imageTab === 'upload' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>من الحاسوب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    imageTab === 'url' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>رابط URL</span>
                </button>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {imageTab === 'upload' ? (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 hover:border-amber-500/80 bg-zinc-900/50 hover:bg-zinc-900 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-200">اضغط هنا لاختيار صورة اللوحة من حاسوبك</p>
                  <p className="text-xs text-zinc-500 mt-1">يدعم صيغ JPG, PNG, WEBP (يتم الضغط التلقائي للسرعة)</p>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>
            )}

            {/* Image Preview Thumbnail */}
            {imageUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 h-40 flex items-center justify-center group">
                <img
                  src={imageUrl}
                  alt="معاينة اللوحة"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-1.5 px-3 bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-lg"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>تغيير الصورة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="py-1.5 px-3 bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold rounded-xl text-xs flex items-center gap-1 border border-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Certificate Number */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">رقم شهادة الأصالة</label>
            <input
              type="text"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              placeholder="CIPEX-STILO-2024-XXX"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">الوصف والرؤية الفنية</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أضف تفاصيل أسلوب الرسم بالتظليل والنقط بالقلم الجاف..."
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Frame Included Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="frameCheck"
              checked={frameIncluded}
              onChange={(e) => setFrameIncluded(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="frameCheck" className="text-xs font-medium text-zinc-300 cursor-pointer">
              توفير إطار خشبي فاخر مدمج مع اللوحة
            </label>
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 pt-6 border-t border-zinc-800">
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {artworkToEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{artworkToEdit ? 'حفظ التعديلات' : 'حفظ وإضافة اللوحة للمخزون'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-2xl transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

