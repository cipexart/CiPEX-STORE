import { Artwork, SaleInvoice, InventoryLog, StoreSettings } from '../types';

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'art-stilo-01',
    titleAr: 'شموخ الخيل الأصيل',
    titleEn: 'Noble Arabian Horse',
    dimensions: '50x70 سم',
    drawingHours: 85,
    penColors: ['أزرق جاف', 'أسود جاف'],
    paperType: 'ورق فني Canson 300g',
    creationYear: '2024',
    price: 3500,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
    description: 'لوحة فنية دقيقة جُسّدت بتفاصيل مذهلة ورسومات متقاطعة بالقلم الجاف الأزرق والأسود، تظهر شموخ وقوة الخيل العربي الأصيل.',
    certificateNumber: 'CIPEX-STILO-2024-001',
    frameIncluded: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-stilo-02',
    titleAr: 'أزقة القصبة العتيقة - الأوداية',
    titleEn: 'The Ancient Kasbah',
    dimensions: '60x80 سم',
    drawingHours: 110,
    penColors: ['أزرق جاف', 'بني جاف'],
    paperType: 'ورق فني أرشيفي 300g',
    creationYear: '2024',
    price: 4800,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    description: 'مشهد معماري معقد لأزقة القصبة العتيقة بالمغرب مع انعكاس الظلال والأبواب الخشبية القديمة مرسومة بالكامل بالقلم الجاف.',
    certificateNumber: 'CIPEX-STILO-2024-002',
    frameIncluded: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-stilo-03',
    titleAr: 'نظرة الصقر - دقة الستيلو',
    titleEn: 'Falcon Eye',
    dimensions: '40x50 سم',
    drawingHours: 60,
    penColors: ['أسود جاف'],
    paperType: 'ورق فني فاخر 300g',
    creationYear: '2024',
    price: 2900,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
    description: 'بورتريه بؤري حاد لنظرة صقر، مع إظهار أدق تفاصيل الريش وتدرجات الظل باستعمال القلم الجاف الأسود فقط.',
    certificateNumber: 'CIPEX-STILO-2024-003',
    frameIncluded: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-stilo-04',
    titleAr: 'بورتريه الرجل الأزرق - الصحراء',
    titleEn: 'Touareg Blue Man',
    dimensions: '50x65 سم',
    drawingHours: 75,
    penColors: ['أزرق جاف'],
    paperType: 'ورق ملمس خشبي 300g',
    creationYear: '2024',
    price: 3800,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    description: 'تجسيد رائع للملثم الصحراوي بعباءته الزرقاء النيلية وتجاعيد الحكمة، مرسومة بالقلم الجاف الأزرق المتدرج.',
    certificateNumber: 'CIPEX-STILO-2024-004',
    frameIncluded: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-stilo-05',
    titleAr: 'عازف الجنبري - روح كناوة',
    titleEn: 'Gnawa Guembri Player',
    dimensions: '50x70 سم',
    drawingHours: 95,
    penColors: ['أزرق جاف', 'أسود جاف'],
    paperType: 'ورق فني 300g',
    creationYear: '2024',
    price: 4200,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    description: 'لوحة تعبيرية تجسد حركة وإيقاع معلم كناوة وهو يعزف على آلة الجنبري التقليدية مع تفاصيل القراقب والزي الفلكلوري.',
    certificateNumber: 'CIPEX-STILO-2024-005',
    frameIncluded: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-stilo-06',
    titleAr: 'سحر المعمار المغربي والزليج',
    titleEn: 'Moroccan Zellige Architecture',
    dimensions: '70x100 سم',
    drawingHours: 140,
    penColors: ['أسود جاف', 'أزرق جاف', 'بني جاف'],
    paperType: 'ورق فني كبير 300g',
    creationYear: '2024',
    price: 6500,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    description: 'عمل فني ملحمي يستعرض النقوش الهندسية والزليج المغربي في الأقواس والرياضات القديمة، تطلب أكثر من 140 ساعة عمل دؤوبة.',
    certificateNumber: 'CIPEX-STILO-2024-006',
    frameIncluded: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_SALES: SaleInvoice[] = [];

export const INITIAL_LOGS: InventoryLog[] = [];

export const INITIAL_SETTINGS: StoreSettings = {
  artistName: 'الفنان CiPEX',
  studioName: 'CiPEX STORE - متجر واستوديو اللوحات الجافة (Stilo Art)',
  phone: '0699745621',
  whatsappPhone: '0699745621',
  email: 'artcipex@gmail.com',
  address: 'الدار البيضاء - المغرب',
  currency: 'د.م (MAD)',
  adminPin: '1234',
  sheetId: '1EWqSFQhgA7d0n6V37W0WvhP1UqkZalPPb2quS7kE1T4',
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1EWqSFQhgA7d0n6V37W0WvhP1UqkZalPPb2quS7kE1T4/edit',
  invoiceFooterAr: 'جميع اللوحات الفنية مرسومة يدويًا بالكامل بالقلم الجاف (ستيلو)، مصحوبة بشهادة الأصالة الرسمية وموقعة حصريًا من الفنان CiPEX.',
  autoSync: true,
  logoUrl: ''
};


