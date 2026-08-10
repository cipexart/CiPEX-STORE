import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GithubDeployGuide } from './GithubDeployGuide';
import {
  Settings,
  ShieldCheck,
  UserCheck,
  Lock,
  CloudCheck,
  CloudOff,
  RefreshCw,
  FileSpreadsheet,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Store,
  KeyRound,
  Eye,
  Edit,
  Trash2,
  Receipt,
  Download,
  Upload,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    role,
    setRole,
    unlockAdmin,
    settings,
    updateSettings,
    clearAllData,
    googleUser,
    googleToken,
    sheetConnected,
    syncing,
    handleGoogleLogin,
    handleGoogleLogout,
    syncWithGoogleSheets,
    pullFromGoogleSheets,
    verifyGoogleSheet,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [sheetIdInput, setSheetIdInput] = useState(settings.sheetId);

  // Store settings form state
  const [artistName, setArtistName] = useState(settings.artistName);
  const [studioName, setStudioName] = useState(settings.studioName);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsappPhone, setWhatsappPhone] = useState(settings.whatsappPhone || settings.phone || '0699745621');
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [invoiceFooterAr, setInvoiceFooterAr] = useState(settings.invoiceFooterAr);

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockAdmin(pinInput)) {
      setPinInput('');
    }
  };

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.trim().length < 4) {
      alert('يرجى إدخال رمز PIN مكون من 4 أرقام على الأقل');
      return;
    }
    updateSettings({ adminPin: newPin.trim() });
    setNewPin('');
    alert('تم تغيير رمز PIN الخاص بالأدمن بنجاح!');
  };

  const handleStoreSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      artistName,
      studioName,
      phone,
      whatsappPhone,
      email,
      address,
      currency,
      invoiceFooterAr,
    });
  };

  return (
    <div className="space-y-10 pb-20 text-right">
      {/* Settings Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-serif">إعدادات النظام والتحكم بالصلاحيات</h2>
            <p className="text-xs text-zinc-400 mt-1">
              الربط مع Google Sheets، إدارة صلاحيات الأدمن والزائر، ومعلومات الفواتير المطبوعة
            </p>
          </div>
        </div>

        {/* Current Role Badge */}
        <div className="px-4 py-2 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center gap-3">
          <div className="text-left">
            <p className="text-[10px] text-zinc-400">الوضع الحالي:</p>
            <p className="text-xs font-bold text-amber-400">
              {role === 'admin' ? 'أدمن (صلاحيات كاملة)' : 'زائر (عرض وطلب الشراء)'}
            </p>
          </div>
          {role === 'admin' ? (
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          ) : (
            <UserCheck className="w-6 h-6 text-zinc-400" />
          )}
        </div>
      </div>

      {/* 1. SECTION: Role & Authorization Manager (صلاحيات الأدمن والزائر) */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <KeyRound className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="text-xl font-bold text-white font-serif">1. إدارة الصلاحيات (الأدمن مقابل الزائر)</h3>
            <p className="text-xs text-zinc-400">التحكم في من يستطيع التعديل والإضافة وإصدار الفواتير</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visitor Role Info */}
          <div className={`p-6 rounded-2xl border transition-all ${role === 'visitor' ? 'bg-amber-500/5 border-amber-500/30' : 'bg-zinc-950 border-zinc-800'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-zinc-400" />
                <h4 className="text-base font-bold text-white">وضع الزائر (Visitor Mode)</h4>
              </div>
              {role === 'visitor' && <span className="px-2.5 py-1 bg-amber-500 text-zinc-950 text-xs font-bold rounded-lg">نشط حالياً</span>}
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              يظهر للزائر المعرض وتفاصيل اللوحات وسطحة الشراء بدون إمكانية التعديل أو الحذف أو الاطلاع على الفواتير الحساسة.
            </p>

            <ul className="space-y-2 text-xs text-zinc-300 mb-6">
              <li className="flex items-center gap-2"><Eye className="w-4 h-4 text-emerald-400" /> معاينة معرض اللوحات وتفاصيل الرسم بالقلم الجاف</li>
              <li className="flex items-center gap-2"><Receipt className="w-4 h-4 text-emerald-400" /> إرسال طلب اقتناء وحجز اللوحة (صفحة الشراء)</li>
              <li className="flex items-center gap-2 text-zinc-500"><Trash2 className="w-4 h-4 text-rose-500/50" /> ممتنع من إضافة، تعديل، أو حذف اللوحات</li>
            </ul>

            {role === 'admin' && (
              <button
                onClick={() => setRole('visitor')}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition-all"
              >
                التحويل إلى وضع الزائر للاختبار
              </button>
            )}
          </div>

          {/* Admin Role Info & Unlock */}
          <div className={`p-6 rounded-2xl border transition-all ${role === 'admin' ? 'bg-amber-500/10 border-amber-500/40' : 'bg-zinc-950 border-zinc-800'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-bold text-white">وضع الأدمن (Full Admin Access)</h4>
              </div>
              {role === 'admin' && <span className="px-2.5 py-1 bg-amber-500 text-zinc-950 text-xs font-bold rounded-lg">مفعل</span>}
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              صلاحية كاملة لإضافة اللوحات، تعديل الأسلوب والسعر، إصدار الفواتير الرسمية، ومزامنة الداتا مع Google Sheets.
            </p>

            <ul className="space-y-2 text-xs text-zinc-300 mb-6">
              <li className="flex items-center gap-2"><Edit className="w-4 h-4 text-amber-400" /> إضافة، تعديل، وحذف اللوحات من المخزون</li>
              <li className="flex items-center gap-2"><Receipt className="w-4 h-4 text-amber-400" /> إصدار وطباعة الفواتير الرسمية الموقعة</li>
              <li className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-amber-400" /> مزامنة وتخزين كامل الداتا في Google Sheet واحد</li>
            </ul>

            {role === 'visitor' ? (
              <form onSubmit={handlePinUnlock} className="space-y-3 pt-2 border-t border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-300">أدخل رمز PIN للأدمن للتفعيل:</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="افتراضي: 1234"
                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono text-amber-400 text-center focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
                  >
                    تأكيد PIN
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePinChange} className="space-y-3 pt-2 border-t border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-300">تغيير رمز PIN الأدمن الحالي:</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="رمز جديد (4 أرقام)"
                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono text-amber-400 text-center focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold rounded-xl text-xs border border-zinc-700"
                  >
                    حفظ الرمز
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. SECTION: Google Sheets Database Setup (تخزين الداتا في جوجل شيت واحد فقط باسم CiPEX STORE) */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-xl font-bold text-white font-serif">2. الربط والتخزين في Google Sheet واحد (CiPEX STORE)</h3>
              <p className="text-xs text-zinc-400">
                قاعدة البيانات الموحدة التي تولد وتدار من حساب الأدمن الرئيسي <span className="text-amber-400 font-mono font-bold">artcipex@gmail.com</span> لتعرض المحتوى للزائر تلقائياً.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sheetConnected ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                متصل بجوجل شيت "CiPEX STORE"
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                غير متصل
              </span>
            )}
          </div>
        </div>

        {/* OAuth Authentication Info Box */}
        <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white mb-1">حساب الأدمن المعتمد:</h4>
            <p className="text-xs text-zinc-300">
              بريد الأدمن الوحيد للتحكم وإصدار الشيت: <span className="text-amber-400 font-mono font-bold">artcipex@gmail.com</span>
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              {googleUser
                ? `الحساب الحالي: ${googleUser.email}`
                : 'الرجاء تسجيل الدخول بـ Google بحساب artcipex@gmail.com لمنح الصلاحية الكاملة لتوليد ومزامنة الشيت.'}
            </p>
          </div>

          {googleUser ? (
            <button
              onClick={handleGoogleLogout}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs"
            >
              تسجيل الخروج من Google
            </button>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="px-5 py-2.5 bg-white text-zinc-900 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg hover:bg-zinc-100 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>تسجيل الدخول بـ artcipex@gmail.com</span>
            </button>
          )}
        </div>

        {/* Spreadsheet Connection Form */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-zinc-300">معرف الشيت الرئيسي (Sheet ID - CiPEX STORE):</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={sheetIdInput}
              onChange={(e) => setSheetIdInput(e.target.value)}
              placeholder="اتركه فارغاً توليد شيت جديد تلقائياً باسم 'CiPEX STORE'"
              className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => verifyGoogleSheet(sheetIdInput)}
              disabled={syncing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
            >
              {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              <span>{sheetIdInput ? 'التحقق والربط' : 'إنشاء شيت "CiPEX STORE" تلقائياً'}</span>
            </button>
          </div>

          {settings.sheetUrl && (
            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-400">رابط الشيت المحفوظ (CiPEX STORE):</span>
              <a
                href={settings.sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>فتح Google Sheet "CiPEX STORE"</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Sync Actions */}
        <div className="pt-4 border-t border-zinc-800 flex flex-wrap gap-4">
          <button
            onClick={syncWithGoogleSheets}
            disabled={syncing}
            className="flex-1 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>رفع وتخزين كامل البيانات في Google Sheet الآن</span>
          </button>

          <button
            onClick={pullFromGoogleSheets}
            disabled={syncing}
            className="py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-all"
          >
            {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>استيراد البيانات من Google Sheet</span>
          </button>
        </div>
      </div>

      {/* 3. SECTION: Store Details & Artist Info */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <Store className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="text-xl font-bold text-white font-serif">3. بيانات المتجر ورأسية الفاتورة المطبوعة</h3>
            <p className="text-xs text-zinc-400">تحديث معلومات الفنان والعنوان الظاهر في شهادة الأصالة والفواتير</p>
          </div>
        </div>

        <form onSubmit={handleStoreSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">اسم الفنان *</label>
              <input
                type="text"
                required
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">اسم المعرض / الاستوديو *</label>
              <input
                type="text"
                required
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">رقم الهاتف للاتصال *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                <span>رقم الواتساب لاستقبال الطلبات *</span>
              </label>
              <input
                type="text"
                required
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="0699745621"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-emerald-500/40 rounded-xl text-sm text-emerald-300 font-mono focus:outline-none focus:border-emerald-400"
              />
              <p className="text-[10px] text-zinc-400 mt-1">يتلقى الطلبات المباشرة من الزوار عبر WhatsApp</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">البريد الإلكتروني *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">العملة المستعملة</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="د.م (MAD)"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-bold text-amber-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">عنوان الاستوديو والمعرض *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">تذييل الفاتورة وشهادة الأصالة</label>
            <textarea
              rows={2}
              value={invoiceFooterAr}
              onChange={(e) => setInvoiceFooterAr(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>حفظ إعدادات المتجر</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. SECTION: Reset / Clear Demo Data */}
      <div className="bg-rose-950/20 border border-rose-900/40 p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <Trash2 className="w-6 h-6 text-rose-400" />
          <div>
            <h3 className="text-xl font-bold text-white font-serif">حذف المحتوى والبيانات التجريبية</h3>
            <p className="text-xs text-rose-300/80">بدء متجر فارغ جديد بنسبة 100% لنشر لوحاتك ومبيعاتك الحقيقية</p>
          </div>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          عند الضغط على الزر أدناه، سيتم مسح اللوحات التجريبية، الفواتير التجريبية وسجلات النظام القديمة نهائياً، مع ضبط العملة تلقائياً إلى <strong className="text-amber-400 font-bold">د.م (MAD)</strong> ورقم الهاتف إلى <strong className="text-amber-400 font-bold">0699745621</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('هل أنت تأكد من رغبتك في حذف جميع اللوحات والفواتير التجريبية والبدء بمتجر فارغ جديد؟')) {
              clearAllData();
            }
          }}
          className="py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-600/20"
        >
          <Trash2 className="w-4 h-4" />
          <span>تصفير ومسح كافة البيانات التجريبية الآن</span>
        </button>
      </div>

      {/* 5. SECTION: GitHub Deploy Guide */}
      <GithubDeployGuide />
    </div>
  );
};
