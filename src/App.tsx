import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ArtworkCatalog } from './components/ArtworkCatalog';
import { InvoicesList } from './components/InvoicesList';
import { AnalyticsReports } from './components/AnalyticsReports';
import { SettingsPage } from './components/SettingsPage';
import { LoginPage } from './components/LoginPage';
import { ToastContainer } from './components/ToastContainer';
import { PenTool, Award, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, settings, role, setRole } = useApp();
  const [showLoginPage, setShowLoginPage] = useState(true);

  const handleVisitorEnter = () => {
    setRole('visitor');
    setActiveTab('catalog');
    setShowLoginPage(false);
  };

  const handleAdminSuccess = () => {
    setShowLoginPage(false);
  };

  if (showLoginPage) {
    return (
      <>
        <LoginPage
          onContinueAsVisitor={handleVisitorEnter}
          onLoginSuccess={handleAdminSuccess}
        />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-zinc-950">
      <div>
        <Header onOpenLoginPage={() => setShowLoginPage(true)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {(activeTab === 'catalog' || activeTab === 'favorites') && <ArtworkCatalog />}
          {activeTab === 'invoices' && (role === 'admin' ? <InvoicesList /> : <ArtworkCatalog />)}
          {activeTab === 'analytics' && (role === 'admin' ? <AnalyticsReports /> : <ArtworkCatalog />)}
          {activeTab === 'settings' && (role === 'admin' ? <SettingsPage /> : <ArtworkCatalog />)}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/90 py-8 text-xs text-zinc-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-zinc-200">{settings.studioName}</span>
            <span>• جميع الحقوق محفوظة للفنان CiPEX © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>شهادات أصالة معتمدة</span>
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{role === 'admin' ? 'وضع الأدمن' : 'وضع الزائر'}</span>
            </span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
