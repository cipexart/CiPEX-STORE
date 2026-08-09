import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import {
  Palette,
  Receipt,
  BarChart3,
  Settings,
  ShieldCheck,
  UserCheck,
  Lock,
  CloudCheck,
  CloudOff,
  RefreshCw,
  PenTool,
} from 'lucide-react';

interface HeaderProps {
  onOpenLoginPage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLoginPage }) => {
  const {
    activeTab,
    setActiveTab,
    role,
    unlockAdmin,
    settings,
    sheetConnected,
    syncing,
    syncWithGoogleSheets,
    googleUser,
  } = useApp();

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockAdmin(pinInput)) {
      setShowPinModal(false);
      setPinInput('');
    }
  };

  const allNavItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'catalog', label: 'اللوحات الفنية المعروضة', icon: Palette },
    { id: 'invoices', label: 'المبيعات والفواتير', icon: Receipt },
    { id: 'analytics', label: 'تقارير الأداء والمخزون', icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات والربط', icon: Settings },
  ];

  const navItems = role === 'admin'
    ? allNavItems
    : allNavItems.filter((item) => item.id === 'catalog');

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 text-zinc-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Artist Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-extrabold shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
              <PenTool className="w-6 h-6 stroke-[2.5]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-zinc-950" title="فن القلم الجاف - Stilo" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-serif">
                  CiPEX <span className="text-amber-400 text-sm font-sans font-normal px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">Stilo Art</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                متجر وإدارة لوحات القلم الجاف للفنان CiPEX
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Role Badge */}
          <div className="flex items-center gap-3">
            {/* Google Sheets Sync Badge */}
            <button
              onClick={syncWithGoogleSheets}
              disabled={syncing}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                sheetConnected
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
              title={sheetConnected ? 'متصل بجوجل شيت - انقر للمزامنة' : 'غير متصل بجوجل شيت - انقر للربط'}
            >
              {syncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : sheetConnected ? (
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <CloudOff className="w-3.5 h-3.5 text-zinc-500" />
              )}
              <span className="hidden lg:inline">
                {syncing ? 'جاري المزامنة...' : sheetConnected ? 'مزامنة مع Google Sheet' : 'ربط Google Sheet'}
              </span>
            </button>

            {/* Role & Login Switcher Pill */}
            {role === 'admin' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">الأدمن (artcipex@gmail.com)</span>
                  <span className="sm:hidden">أدمن</span>
                </button>
                {onOpenLoginPage && (
                  <button
                    onClick={onOpenLoginPage}
                    className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl text-xs hover:bg-zinc-800 transition-all"
                    title="تبديل الحساب / صفحة تسجيل الدخول"
                  >
                    تبديل
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLoginPage || (() => setShowPinModal(true))}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-all"
                >
                  <UserCheck className="w-4 h-4 text-zinc-400" />
                  <span>وضع الزائر</span>
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    دخول الأدمن
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-zinc-800/60 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  isActive ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Unlock PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-right">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">تسجيل دخول الأدمن</h3>
            <p className="text-xs text-zinc-400 mb-6">
              أدخل رمز PIN للصلاحيات الكاملة (إضافة، تعديل، حذف اللوحات وإصدار الفواتير)
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">رمز PIN الأدمن</label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="افتراضي: 1234"
                  autoFocus
                  required
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-xl font-mono text-amber-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  تأكيد الدخول
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
