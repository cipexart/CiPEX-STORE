import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Eye, Sparkles, Palette, MapPin, Phone, CheckCircle, ArrowLeft, PenTool, Award, Clock, Layers } from 'lucide-react';

interface Props {
  onContinueAsVisitor: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<Props> = ({ onContinueAsVisitor, onLoginSuccess }) => {
  const { handleGoogleLogin, settings } = useApp();
  const [loading, setLoading] = useState(false);

  const onGoogleClick = async () => {
    setLoading(true);
    await handleGoogleLogin();
    setLoading(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar / Brand Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-zinc-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Palette className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-white tracking-wide">CiPEX STORE</h1>
            <p className="text-[11px] text-zinc-400 flex items-center gap-2">
              <span>رسم القلم الجاف (Stilo Art)</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <MapPin className="w-3 h-3" />
                {settings.address}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="hidden sm:inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full font-mono">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            {settings.phone}
          </span>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-full font-bold">
            {settings.currency}
          </span>
        </div>
      </header>

      {/* Main Login Options Container */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8 relative z-10 space-y-8">
        {/* Title and Intro */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام إدارة معارض اللوحات ومزامنة جوجل شيت</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight leading-tight">
            مرحباً بك في منصة <span className="text-amber-400">CiPEX STORE</span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            الرجاء اختيار صفة الدخول للنظام. الأدمن الرئيسي يمكنه التحكم الكامل في اللوحات والمبيعات والجداول، بينما يمكن للزائر تصفح الأعمال الفنية وطلب اقتنائها مباشرة.
          </p>
        </div>

        {/* 2 Main Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Admin Entry & Store Highlights Card */}
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-amber-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-300" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  صلاحيات كاملة (الأدمن)
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif">تسجيل الدخول كـ الأدمن</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  البريد المعتمد لإدارة النظام والتحكم بالشيت:
                  <span className="block font-mono text-amber-400 font-bold mt-1 text-sm">artcipex@gmail.com</span>
                </p>
              </div>

              {/* Unique Stilo Art & Admin Features Highlight Card */}
              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs border-b border-zinc-800 pb-2">
                  <PenTool className="w-4 h-4" />
                  <span>مميزات متجر وفن رسم الستيلو (CiPEX Stilo Art):</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">تقنية القلم الجاف (Stilo Art):</span>
                      <span className="text-[11px] text-zinc-400 leading-snug">رسم يدوي خالص وبصمة فنية دقيقة لا تقبل الخطأ بآلاف اللمسات المتناسقة.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">ساعات عمل وإتقان استثنائية:</span>
                      <span className="text-[11px] text-zinc-400 leading-snug">تتطلب كل لوحة عشرات الساعات من التظليل والتحكم لتأمين تفاصيل مبهرة.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">خامات فاخرة وشهادة أصالة:</span>
                      <span className="text-[11px] text-zinc-400 leading-snug">ورق كرتوني 300g مع شهادات أصالة موظفة ومسجلة برقم تسلسلي.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-zinc-800/80">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={onGoogleClick}
                disabled={loading}
                className="w-full py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{loading ? 'جاري الاتصال بـ Google...' : 'تسجيل الدخول بـ Google (artcipex@gmail.com)'}</span>
              </button>
            </div>
          </div>

          {/* Option 2: Visitor Entry */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">
                  استعراض واقتناء اللوحات
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif">الدخول كزائر للمعرض</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  تصفح اللوحات الفنية الأصلية المرسومة بالقلم الجاف. يمكنك عند اختيار أي لوحة إرسال طلب اقتناء وحجزها ببياناتك بالدرهم المغربي <span className="text-amber-400 font-bold">(د.م)</span>.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
                <p className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                  مميزات مقتنيات CiPEX STORE:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>شهادة أصالة رسمية موظفة وموقعة من الفنان CiPEX.</li>
                  <li>تسليم مباشر وموثوق في الدار البيضاء وجميع مدن المغرب.</li>
                  <li>طلب سريع برقم الهاتف والمكان بلمسة واحدة.</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={onContinueAsVisitor}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-2xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
            >
              <span>الدخول كزائر وتصفح المعرض مباشرة</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-zinc-800/60 text-center text-xs text-zinc-500 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 CiPEX STORE. جميع الحقوق محفوظة للفنان CiPEX.</p>
        <p className="font-mono text-[11px]">المقر الرئيسي: الدار البيضاء، المغرب | {settings.phone}</p>
      </footer>
    </div>
  );
};

