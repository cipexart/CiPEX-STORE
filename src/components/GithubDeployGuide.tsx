import React, { useState } from 'react';
import { Github, Copy, Check, Terminal, ExternalLink, Rocket } from 'lucide-react';

export const GithubDeployGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const actionYaml = `name: Deploy CiPEX Stilo Art Store to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Application
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(actionYaml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 text-right">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-white flex items-center justify-center shrink-0 border border-zinc-700">
          <Github className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-serif">دليل الرفع والتطبيق المجاني على GitHub Pages (Action Workflow)</h3>
          <p className="text-xs text-zinc-400">خطوات رفع واستضافة نظام متجر CiPEX مجاناً بالكامل عبر غيت هوب أكشن</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-xs">1</span>
            <span>إنشاء المستودع</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            أنشئ المستودع الجديد على حسابك في GitHub وقم برفع ملفات المشروع إليه على فرع <code className="text-amber-300 font-mono">main</code>.
          </p>
        </div>

        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-xs">2</span>
            <span>إضافة ملف Workflow</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            أنشئ الملف <code className="text-amber-300 font-mono">.github/workflows/deploy.yml</code> والصق كود GitHub Action أدناه.
          </p>
        </div>

        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-xs">3</span>
            <span>تفعيل GitHub Pages</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            من إعدادات المستودع (Settings → Pages)، اختر المصدر: <strong className="text-white">GitHub Actions</strong> وستتم الاستضافة تلقائياً!
          </p>
        </div>
      </div>

      {/* Code YAML Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono text-zinc-300">.github/workflows/deploy.yml</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold rounded-xl text-xs transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'تم نسخ الكود!' : 'نسخ كود GitHub Action'}</span>
          </button>
        </div>

        <pre className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs font-mono text-amber-300/90 overflow-x-auto text-left dir-ltr max-h-64 leading-relaxed">
          {actionYaml}
        </pre>
      </div>
    </div>
  );
};
