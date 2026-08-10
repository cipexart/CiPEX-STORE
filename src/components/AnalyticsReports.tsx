import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  PackageCheck,
  History,
  PenTool,
  ShieldAlert,
} from 'lucide-react';

export const AnalyticsReports: React.FC = () => {
  const { artworks, sales, inventoryLogs, settings, role } = useApp();

  // Metrics Calculations
  const completedSales = sales.filter((s) => s.status === 'completed');
  const totalRevenue = completedSales.reduce((acc, curr) => acc + curr.finalPrice, 0);

  const availableArtworks = artworks.filter((a) => a.status === 'available');
  const soldArtworks = artworks.filter((a) => a.status === 'sold');
  const reservedArtworks = artworks.filter((a) => a.status === 'reserved');

  const availableValue = availableArtworks.reduce((acc, curr) => acc + curr.price, 0);
  const totalHoursInvested = artworks.reduce((acc, curr) => acc + curr.drawingHours, 0);
  const avgPrice = artworks.length > 0 ? Math.round(artworks.reduce((acc, curr) => acc + curr.price, 0) / artworks.length) : 0;

  // Chart Data 1: Inventory Status Breakdown
  const pieData = [
    { name: 'متاحة للبيع', value: availableArtworks.length, color: '#10b981' },
    { name: 'مبيعة ومقتناة', value: soldArtworks.length, color: '#f59e0b' },
    { name: 'محجوزة', value: reservedArtworks.length, color: '#ef4444' },
  ];

  // Chart Data 2: Ballpoint Pen Colors Distribution
  const colorCounts: Record<string, number> = {};
  artworks.forEach((art) => {
    art.penColors.forEach((color) => {
      const key = color.includes('أزرق') ? 'أزرق جاف' : color.includes('أسود') ? 'أسود جاف' : color.includes('أحمر') ? 'أحمر جاف' : 'ألوان أخرى';
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    });
  });

  const barColorData = Object.keys(colorCounts).map((key) => ({
    name: key,
    count: colorCounts[key],
  }));

  // Chart Data 3: Dynamic Sales trend data calculated from real completed sales
  const monthNamesArabic = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const salesByMonth: Record<string, number> = {};
  monthNamesArabic.forEach((m) => {
    salesByMonth[m] = 0;
  });

  completedSales.forEach((sale) => {
    if (sale.saleDate) {
      const date = new Date(sale.saleDate);
      if (!isNaN(date.getTime())) {
        const monthIdx = date.getMonth();
        const monthName = monthNamesArabic[monthIdx];
        if (monthName) {
          salesByMonth[monthName] = (salesByMonth[monthName] || 0) + (sale.finalPrice || 0);
        }
      }
    }
  });

  const monthlyTrendData = monthNamesArabic.map((month) => ({
    month,
    revenue: salesByMonth[month] || 0,
  }));

  return (
    <div className="space-y-8 pb-16 text-right">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-serif">تقارير الأداء الدوري وسجل المخزون</h2>
            <p className="text-xs text-zinc-400 mt-1">
              تحليلات مبيعات لوحات القلم الجاف، القيمة الاستثمارية للمخزون، وساعات العمل الفني للفنان CiPEX
            </p>
          </div>
        </div>

        {role === 'visitor' && (
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>عرض عام للإحصائيات (الأدمن يمتلك صلاحية كاملة للتعديل والمراجعة)</span>
          </div>
        )}
      </div>

      {/* Top Key Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">إجمالي مبيعات الفواتير</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {totalRevenue.toLocaleString()} <span className="text-xs font-sans text-emerald-300">{settings.currency}</span>
          </p>
          <p className="text-[11px] text-zinc-500 mt-2">من خلال {completedSales.length} فاتورة مسددة</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">قيمة اللوحات المتاحة بالمخزون</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">
            {availableValue.toLocaleString()} <span className="text-xs font-sans text-amber-300">{settings.currency}</span>
          </p>
          <p className="text-[11px] text-zinc-500 mt-2">{availableArtworks.length} لوحة جاهزة للاقتناء</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">ساعات الرسم بالستيلو المستثمرة</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-400 font-mono">
            {totalHoursInvested} <span className="text-xs font-sans text-blue-300">ساعة عمل دقيق</span>
          </p>
          <p className="text-[11px] text-zinc-500 mt-2">متوسط {Math.round(totalHoursInvested / (artworks.length || 1))}h لكل عمل فني</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">متوسط سعر اللوحة الفنية</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <PenTool className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-400 font-mono">
            {avgPrice.toLocaleString()} <span className="text-xs font-sans text-purple-300">{settings.currency}</span>
          </p>
          <p className="text-[11px] text-zinc-500 mt-2">إجمالي الأعمال بالمخزون: {artworks.length}</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Sales Revenue Area Chart */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-serif">مخطط الإيرادات والمبيعات الشهرية</h3>
            <span className="text-xs text-amber-400 font-mono">{settings.currency}</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#3f3f46',
                    borderRadius: '12px',
                    color: '#fff',
                    textAlign: 'right',
                  }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} ${settings.currency}`, 'المبيعات']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Inventory Status Pie Chart & Color Distribution */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-serif">حالة اللوحات بالمخزون ومبيعات الألوان</h3>
            <span className="text-xs text-zinc-400">توزيع نسبة المخزون</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#3f3f46',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{item.value} لوحة</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pen color breakdown */}
          <div className="pt-3 border-t border-zinc-800">
            <p className="text-xs text-zinc-400 mb-2 font-semibold">استخدام ألوان القلم الجاف في اللوحات المعروضة:</p>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barColorData}>
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Periodic Inventory Audit Log Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-serif">سجل حركة وتتبع المخزون الدوري (Inventory Log)</h3>
          </div>
          <span className="text-xs text-zinc-400">إجمالي الحركة: {inventoryLogs.length} سجل</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-zinc-400 text-xs border-b border-zinc-800">
                <th className="p-3 font-bold">الوقت والتاريخ</th>
                <th className="p-3 font-bold">اسم اللوحة الفنية</th>
                <th className="p-3 font-bold">نوع الحركة</th>
                <th className="p-3 font-bold">بواسطة</th>
                <th className="p-3 font-bold">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs">
              {inventoryLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3 font-mono text-zinc-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 font-bold text-white font-serif">{log.artworkTitle}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        log.action.includes('إضافة')
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.action.includes('بيع')
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : log.action.includes('حذف')
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-300 font-semibold">{log.changedBy}</td>
                  <td className="p-3 text-zinc-400">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
