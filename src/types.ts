export type ArtworkStatus = 'available' | 'reserved' | 'sold';

export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'delivery';

export interface Artwork {
  id: string;
  titleAr: string;
  titleEn?: string;
  dimensions: string; // e.g. "50 × 70 سم"
  drawingHours: number; // e.g. 120 ساعات رسم بالقلم الجاف
  penColors: string[]; // e.g. ["أزرق جاف", "أسود جاف", "أحمر جاف"]
  paperType: string; // e.g. "ورق كرتوني فني Canson 300g"
  creationYear: string;
  price: number; // Price in DZD or USD
  status: ArtworkStatus;
  imageUrl: string;
  description: string;
  certificateNumber: string; // e.g. "CIPEX-STILO-2024-001"
  frameIncluded: boolean;
  createdAt: string;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-CIPEX-2024-0801"
  artworkId: string;
  artworkTitle: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail?: string;
  saleDate: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
  sellerNotes?: string;
}

export interface InventoryLog {
  id: string;
  artworkId: string;
  artworkTitle: string;
  action: 'إضافة لوحة' | 'تعديل بيانات' | 'بيع وإصدار فاتورة' | 'حجز اللوحة' | 'حذف اللوحة' | 'تحديث حالة';
  timestamp: string;
  changedBy: 'الأدمن' | 'الزائر' | 'النظام';
  details: string;
}

export interface StoreSettings {
  artistName: string;
  studioName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  adminPin: string; // Default: '1234'
  sheetId: string;
  sheetUrl?: string;
  invoiceFooterAr: string;
  logoUrl?: string;
  autoSync: boolean;
}

export type UserRole = 'admin' | 'visitor';

export type ActiveTab = 'catalog' | 'invoices' | 'analytics' | 'settings';
