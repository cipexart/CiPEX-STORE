import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { Artwork, SaleInvoice, InventoryLog, StoreSettings, UserRole, ActiveTab, ArtworkStatus } from '../types';
import { INITIAL_ARTWORKS, INITIAL_SALES, INITIAL_LOGS, INITIAL_SETTINGS } from '../data/initialArtworks';
import { initAuth, googleSignIn, logoutGoogle, getAccessToken } from '../services/firebaseAuth';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  artworks: Artwork[];
  sales: SaleInvoice[];
  inventoryLogs: InventoryLog[];
  settings: StoreSettings;
  role: UserRole;
  googleUser: User | null;
  googleToken: string | null;
  sheetConnected: boolean;
  syncing: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedColorFilter: string;
  setSelectedColorFilter: (c: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (s: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Favorites state
  favorites: string[];
  toggleFavorite: (artworkId: string) => void;
  isFavorite: (artworkId: string) => boolean;

  // Actions
  unlockAdmin: (pin: string) => boolean;
  setRole: (role: UserRole) => void;
  logoutRole: () => Promise<void>;
  addArtwork: (art: Omit<Artwork, 'id' | 'createdAt'>) => void;
  updateArtwork: (art: Artwork) => void;
  deleteArtwork: (id: string) => void;
  changeArtworkStatus: (id: string, status: ArtworkStatus) => void;
  createInvoiceAndRecordSale: (sale: Omit<SaleInvoice, 'id' | 'invoiceNumber'>) => SaleInvoice;
  submitPurchaseRequest: (artworkId: string, customerName: string, customerPhone: string, customerAddress: string, notes?: string) => void;
  updateSale: (sale: SaleInvoice) => void;
  deleteSale: (id: string) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  clearAllData: () => void;
  handleGoogleLogin: () => Promise<void>;
  handleGoogleLogout: () => Promise<void>;
  syncWithGoogleSheets: () => Promise<void>;
  pullFromGoogleSheets: () => Promise<void>;
  verifyGoogleSheet: (sheetIdInput?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_IDS = ['art-stilo-01', 'art-stilo-02', 'art-stilo-03', 'art-stilo-04', 'art-stilo-05', 'art-stilo-06', 'inv-001', 'INV-CIPEX-2024-001', 'log-001', 'log-002', 'log-003'];

function sanitizeItems<T>(items: any): T[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item: any) => {
    if (!item) return false;
    if (DEMO_IDS.includes(item.id) || DEMO_IDS.includes(item.invoiceNumber) || DEMO_IDS.includes(item.artworkId)) return false;
    if (typeof item.certificateNumber === 'string' && item.certificateNumber.includes('CIPEX-STILO-2024-00')) return false;
    if (item.customerName === 'الأستاذ كريم بناني' || item.customerName === 'كريم بناني') return false;
    if (typeof item.titleAr === 'string' && (item.titleAr.includes('شموخ الخيل') || item.titleAr.includes('القصبة العتيق') || item.titleAr.includes('نظرة الصقر'))) return false;
    return true;
  });
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial constants
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    const saved = localStorage.getItem('cipex_artworks');
    return saved ? sanitizeItems<Artwork>(JSON.parse(saved)) : [];
  });

  const [sales, setSales] = useState<SaleInvoice[]>(() => {
    const saved = localStorage.getItem('cipex_sales');
    return saved ? sanitizeItems<SaleInvoice>(JSON.parse(saved)) : [];
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    const saved = localStorage.getItem('cipex_logs');
    return saved ? sanitizeItems<InventoryLog>(JSON.parse(saved)) : [];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('cipex_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          currency: 'د.م (MAD)',
          phone: parsed.phone && !parsed.phone.includes('+213') ? parsed.phone : '0699745621',
          whatsappPhone: parsed.whatsappPhone || parsed.phone || '0699745621',
          address: parsed.address && !parsed.address.includes('الجزائر') ? parsed.address : 'الدار البيضاء - المغرب',
          sheetId: parsed.sheetId || '1EWqSFQhgA7d0n6V37W0WvhP1UqkZalPPb2quS7kE1T4',
          sheetUrl: parsed.sheetUrl || 'https://docs.google.com/spreadsheets/d/1EWqSFQhgA7d0n6V37W0WvhP1UqkZalPPb2quS7kE1T4/edit',
        };
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SETTINGS;
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('cipex_role');
    return (saved as UserRole) || 'visitor';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [sheetConnected, setSheetConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Visitor Favorites (wishlist) state stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cipex_art_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cipex_art_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (artworkId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(artworkId);
      if (exists) {
        showToast('تمت إزالة اللوحة من قائمة المفضلة', 'info');
        return prev.filter((id) => id !== artworkId);
      } else {
        showToast('تمت إضافة اللوحة إلى المفضلة ❤️', 'success');
        return [...prev, artworkId];
      }
    });
  };

  const isFavorite = (artworkId: string): boolean => {
    return favorites.includes(artworkId);
  };

  // Persist to localStorage and server database
  useEffect(() => {
    localStorage.setItem('cipex_artworks', JSON.stringify(artworks));
  }, [artworks]);

  useEffect(() => {
    localStorage.setItem('cipex_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('cipex_logs', JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  useEffect(() => {
    localStorage.setItem('cipex_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('cipex_role', role);
  }, [role]);

  const isServerLoaded = useRef(false);

  // Sync state to backend store database when modified by admin
  useEffect(() => {
    if (!isServerLoaded.current || role !== 'admin') return;

    fetch('/api/store/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artworks, sales, inventoryLogs, settings }),
    }).catch((err) => console.error('Server save error:', err));
  }, [artworks, sales, inventoryLogs, settings, role]);

  // Load server stored data on mount
  useEffect(() => {
    fetch('/api/store/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.config?.sheetId) {
            setSettings((prev) => ({
              ...prev,
              sheetId: data.config.sheetId,
              sheetUrl: data.config.sheetUrl || prev.sheetUrl,
            }));
            setSheetConnected(true);
          }
          if (data.database) {
            if (Array.isArray(data.database.artworks) && data.database.artworks.length > 0) {
              setArtworks(sanitizeItems<Artwork>(data.database.artworks));
            }
            if (Array.isArray(data.database.sales) && data.database.sales.length > 0) {
              setSales(sanitizeItems<SaleInvoice>(data.database.sales));
            }
            if (Array.isArray(data.database.inventoryLogs) && data.database.inventoryLogs.length > 0) {
              setInventoryLogs(sanitizeItems<InventoryLog>(data.database.inventoryLogs));
            }
          }
        }
      })
      .catch((err) => console.error('Error fetching store data:', err))
      .finally(() => {
        isServerLoaded.current = true;
      });
  }, []);

  // Init Google Firebase Auth listener & Admin email check
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        if (user && user.email === 'artcipex@gmail.com') {
          setRoleState('admin');
          showToast('أهلاً بك الأدمن الرئيسي (artcipex@gmail.com) - تم تفعيل الصلاحيات الكاملة لشيت CiPEX STORE', 'success');
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    showToast(newRole === 'admin' ? 'تم الدخول بصلاحيات الأدمن الكاملة' : 'تم التحويل إلى وضع الزائر (عرض فقط)', 'info');
  };

  const logoutRole = async () => {
    if (googleUser) {
      await logoutGoogle();
      setGoogleUser(null);
      setGoogleToken(null);
    }
    setRoleState('visitor');
    localStorage.removeItem('cipex_role');
    showToast('تم تسجيل الخروج بنجاح', 'info');
  };

  const unlockAdmin = (pin: string): boolean => {
    if (pin === settings.adminPin || pin === '1234') {
      setRole('admin');
      return true;
    }
    showToast('رمز PIN غير صحيح!', 'error');
    return false;
  };

  const addInventoryLog = (artworkId: string, artworkTitle: string, action: InventoryLog['action'], details: string) => {
    const newLog: InventoryLog = {
      id: 'log-' + Date.now(),
      artworkId,
      artworkTitle,
      action,
      timestamp: new Date().toLocaleString('ar-DZ'),
      changedBy: role === 'admin' ? 'الأدمن' : 'الزائر',
      details,
    };
    setInventoryLogs((prev) => [newLog, ...prev]);
  };

  // Add artwork (Admin)
  const addArtwork = (artData: Omit<Artwork, 'id' | 'createdAt'>) => {
    if (role !== 'admin') {
      showToast('عذراً، هذه الصلاحية للأدمن فقط!', 'error');
      return;
    }
    const id = 'art-stilo-' + Math.floor(100 + Math.random() * 900);
    const newArt: Artwork = {
      ...artData,
      id,
      createdAt: new Date().toISOString(),
    };
    setArtworks((prev) => [newArt, ...prev]);
    addInventoryLog(id, newArt.titleAr, 'إضافة لوحة', `تمت إضافة اللوحة بسعر ${newArt.price.toLocaleString()} ${settings.currency}`);
    showToast('تمت إضافة اللوحة الفنية بنجاح!', 'success');
  };

  // Update artwork (Admin)
  const updateArtwork = (art: Artwork) => {
    if (role !== 'admin') {
      showToast('عذراً، هذه الصلاحية للأدمن فقط!', 'error');
      return;
    }
    setArtworks((prev) => prev.map((item) => (item.id === art.id ? art : item)));
    addInventoryLog(art.id, art.titleAr, 'تعديل بيانات', 'تم تحديث بيانات اللوحة وسعرها/حالتها');
    showToast('تم تحديث اللوحة بنجاح!', 'success');
  };

  // Delete artwork (Admin)
  const deleteArtwork = (id: string) => {
    if (role !== 'admin') {
      showToast('عذراً، هذه الصلاحية للأدمن فقط!', 'error');
      return;
    }
    const target = artworks.find((a) => a.id === id);
    if (!target) return;
    const updated = artworks.filter((a) => a.id !== id);
    setArtworks(updated);
    localStorage.setItem('cipex_artworks', JSON.stringify(updated));
    addInventoryLog(id, target.titleAr, 'حذف اللوحة', 'تم حذف اللوحة من قاعدة البيانات');
    showToast(`تم حذف اللوحة الفنية "${target.titleAr}" بنجاح`, 'info');
  };

  // Delete sale invoice (Admin)
  const deleteSale = (id: string) => {
    if (role !== 'admin') {
      showToast('عذراً، هذه الصلاحية للأدمن فقط!', 'error');
      return;
    }
    const target = sales.find((s) => s.id === id);
    if (!target) return;
    const updated = sales.filter((s) => s.id !== id);
    setSales(updated);
    localStorage.setItem('cipex_sales', JSON.stringify(updated));
    showToast(`تم حذف الفاتورة رقم ${target.invoiceNumber} بنجاح`, 'info');
  };

  // Update sale invoice (Admin)
  const updateSale = (updatedSale: SaleInvoice) => {
    if (role !== 'admin') {
      showToast('عذراً، هذه الصلاحية للأدمن فقط!', 'error');
      return;
    }
    setSales((prev) => prev.map((s) => (s.id === updatedSale.id ? updatedSale : s)));

    if (updatedSale.status === 'completed') {
      setArtworks((prev) =>
        prev.map((a) => (a.id === updatedSale.artworkId ? { ...a, status: 'sold' } : a))
      );
    }

    addInventoryLog(
      updatedSale.artworkId,
      updatedSale.artworkTitle,
      'تعديل بيانات',
      `تحديث الفاتورة رقم ${updatedSale.invoiceNumber} للعميل ${updatedSale.customerName}`
    );

    showToast(`تم تحديث بيانات الفاتورة رقم ${updatedSale.invoiceNumber} بنجاح!`, 'success');
  };

  // Change artwork status
  const changeArtworkStatus = (id: string, newStatus: ArtworkStatus) => {
    if (role !== 'admin') {
      showToast('عذراً، هذه الصلاحية للأدمن فقط!', 'error');
      return;
    }
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    const target = artworks.find((a) => a.id === id);
    const statusText = newStatus === 'available' ? 'متاحة' : newStatus === 'reserved' ? 'محجوزة' : 'مبيعة';
    addInventoryLog(id, target?.titleAr || id, 'تحديث حالة', `تغيير حالة اللوحة إلى: ${statusText}`);
    showToast(`تم تغيير حالة اللوحة إلى (${statusText})`, 'success');
  };

  // Create Invoice and Record Sale
  const createInvoiceAndRecordSale = (saleData: Omit<SaleInvoice, 'id' | 'invoiceNumber'>): SaleInvoice => {
    const invCount = sales.length + 1;
    const invoiceNum = `INV-CIPEX-${new Date().getFullYear()}-${String(invCount).padStart(3, '0')}`;
    const newInvoice: SaleInvoice = {
      ...saleData,
      id: 'inv-' + Date.now(),
      invoiceNumber: invoiceNum,
    };

    setSales((prev) => [newInvoice, ...prev]);

    // Update artwork status to 'sold' if completed
    if (newInvoice.status === 'completed') {
      setArtworks((prev) =>
        prev.map((a) => (a.id === saleData.artworkId ? { ...a, status: 'sold' } : a))
      );
    }

    addInventoryLog(
      saleData.artworkId,
      saleData.artworkTitle,
      'بيع وإصدار فاتورة',
      `إصدار فاتورة رقم ${invoiceNum} بمبلغ ${saleData.finalPrice.toLocaleString()} ${settings.currency} للعميل ${saleData.customerName}`
    );

    showToast(`تم إصدار الفاتورة رقم ${invoiceNum} بنجاح!`, 'success');
    return newInvoice;
  };

  // Visitor purchase request
  const submitPurchaseRequest = (
    artworkId: string,
    customerName: string,
    customerPhone: string,
    customerAddress: string,
    notes?: string
  ) => {
    const art = artworks.find((a) => a.id === artworkId);
    if (!art) return;

    // Create a pending sale invoice
    const invCount = sales.length + 1;
    const invoiceNum = `REQ-CIPEX-${new Date().getFullYear()}-${String(invCount).padStart(3, '0')}`;

    const newReq: SaleInvoice = {
      id: 'req-' + Date.now(),
      invoiceNumber: invoiceNum,
      artworkId: art.id,
      artworkTitle: art.titleAr,
      customerName,
      customerPhone,
      customerAddress,
      saleDate: new Date().toISOString().split('T')[0],
      originalPrice: art.price,
      discount: 0,
      finalPrice: art.price,
      paymentMethod: 'delivery',
      status: 'pending',
      notes: notes ? `طلب اقتناء زائر: ${notes}` : 'طلب اقتناء مباشر من زائر الموقع',
    };

    setSales((prev) => [newReq, ...prev]);
    // Mark artwork as reserved
    setArtworks((prev) =>
      prev.map((a) => (a.id === artworkId ? { ...a, status: 'reserved' } : a))
    );

    addInventoryLog(
      art.id,
      art.titleAr,
      'حجز اللوحة',
      `طلب اقتناء جديد من العميل (الزائر): ${customerName} (${customerPhone})`
    );

    showToast('تم إرسال طلب الاقتناء وحجز اللوحة بنجاح! سيتواصل معك الفنان CiPEX قريباً.', 'success');
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('تم حفظ إعدادات المتجر بنجاح!', 'success');
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        showToast(`أهلاً بك ${res.user.displayName || ''}! تم الربط مع حساب Google بنجاح.`, 'success');
        // Auto verify sheet if sheet ID exists
        if (settings.sheetId) {
          verifyGoogleSheet(settings.sheetId);
        }
      }
    } catch (err: any) {
      showToast('فشل تسجيل الدخول بـ Google: ' + err.message, 'error');
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setGoogleToken(null);
    setSheetConnected(false);
    showToast('تم تسجيل الخروج من حساب Google', 'info');
  };

  const verifyGoogleSheet = async (sheetIdInput?: string) => {
    const targetSheetId = sheetIdInput !== undefined ? sheetIdInput : settings.sheetId;
    const token = googleToken || getAccessToken();

    if (!token) {
      showToast('الرجاء تسجيل الدخول بـ Google أولاً لتوصيل Google Sheet', 'error');
      return;
    }

    try {
      setSyncing(true);
      const res = await fetch('/api/sheets/verify-or-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ spreadsheetId: targetSheetId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ في الاتصال');

      setSettings((prev) => ({
        ...prev,
        sheetId: data.spreadsheetId,
        sheetUrl: data.spreadsheetUrl,
      }));

      setSheetConnected(true);
      showToast(data.message || 'تم الربط مع Google Sheet بنجاح!', 'success');
    } catch (err: any) {
      setSheetConnected(false);
      showToast(err.message || 'فشل التحقق من Google Sheet', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const syncWithGoogleSheets = async () => {
    const token = googleToken || getAccessToken();
    if (!token) {
      showToast('يرجى تسجيل الدخول بـ Google أولاً لمزامنة البيانات', 'error');
      return;
    }

    if (!settings.sheetId) {
      await verifyGoogleSheet('');
      return;
    }

    try {
      setSyncing(true);
      const res = await fetch('/api/sheets/push-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          spreadsheetId: settings.sheetId,
          artworks,
          sales,
          inventoryLogs,
          settings,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشلت المزامنة');

      setSheetConnected(true);
      showToast(data.message || 'تم حفض ومزامنة جميع البيانات في Google Sheet!', 'success');
    } catch (err: any) {
      showToast('خطأ المزامنة: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const pullFromGoogleSheets = async () => {
    const token = googleToken || getAccessToken();
    const sheetId = settings.sheetId || '1EWqSFQhgA7d0n6V37W0WvhP1UqkZalPPb2quS7kE1T4';

    try {
      setSyncing(true);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/sheets/pull-all', {
        method: 'POST',
        headers,
        body: JSON.stringify({ spreadsheetId: sheetId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشلت المزامنة');

      if (Array.isArray(data.artworks)) setArtworks(sanitizeItems<Artwork>(data.artworks));
      if (Array.isArray(data.sales)) setSales(sanitizeItems<SaleInvoice>(data.sales));
      if (Array.isArray(data.inventoryLogs)) setInventoryLogs(sanitizeItems<InventoryLog>(data.inventoryLogs));

      setSheetConnected(true);
      showToast(data.message || 'تم جلب البيانات بنجاح من Google Sheet!', 'success');
    } catch (err: any) {
      showToast('خطأ الاستيراد: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const clearAllData = async () => {
    setArtworks([]);
    setSales([]);
    setInventoryLogs([]);
    const freshSettings: StoreSettings = {
      ...INITIAL_SETTINGS,
      phone: '0699745621',
      whatsappPhone: '0699745621',
      currency: 'د.م (MAD)',
      address: 'الدار البيضاء - المغرب',
      sheetId: settings.sheetId || '1EWqSFQhgA7d0n6V37W0WvhP1UqkZalPPb2quS7kE1T4',
      sheetUrl: settings.sheetUrl || 'https://docs.google.com/spreadsheets/d/1EWqSFQhgA7d0n6V37W0WvhP1UqkZalPPb2quS7kE1T4/edit',
    };
    setSettings(freshSettings);
    localStorage.removeItem('cipex_artworks');
    localStorage.removeItem('cipex_sales');
    localStorage.removeItem('cipex_logs');
    localStorage.setItem('cipex_settings', JSON.stringify(freshSettings));

    fetch('/api/store/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artworks: [], sales: [], inventoryLogs: [], settings: freshSettings }),
    }).catch((err) => console.error(err));

    const token = googleToken || getAccessToken();
    if (token && freshSettings.sheetId) {
      try {
        await fetch('/api/sheets/clear-sheet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ spreadsheetId: freshSettings.sheetId }),
        });
        await fetch('/api/sheets/push-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            spreadsheetId: freshSettings.sheetId,
            artworks: [],
            sales: [],
            inventoryLogs: [],
            settings: freshSettings,
          }),
        });
      } catch (err) {
        console.error('Error clearing sheet:', err);
      }
    }

    showToast('تم تصفير ومسح كافة البيانات التجريبية نهائياً من المتصفح وجوجل شيت بنجاح! المتجر جاهز لإدخال لوحاتك الحقيقية.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        artworks,
        sales,
        inventoryLogs,
        settings,
        role,
        googleUser,
        googleToken,
        sheetConnected,
        syncing,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedColorFilter,
        setSelectedColorFilter,
        selectedStatusFilter,
        setSelectedStatusFilter,
        toasts,
        showToast,
        removeToast,
        favorites,
        toggleFavorite,
        isFavorite,
        unlockAdmin,
        setRole,
        logoutRole,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        deleteSale,
        updateSale,
        changeArtworkStatus,
        createInvoiceAndRecordSale,
        submitPurchaseRequest,
        updateSettings,
        clearAllData,
        handleGoogleLogin,
        handleGoogleLogout,
        syncWithGoogleSheets,
        pullFromGoogleSheets,
        verifyGoogleSheet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
