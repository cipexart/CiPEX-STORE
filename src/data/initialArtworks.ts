import { Artwork, SaleInvoice, InventoryLog, StoreSettings } from '../types';

export const INITIAL_ARTWORKS: Artwork[] = [];

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

