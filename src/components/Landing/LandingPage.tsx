import React, { useState } from 'react';
import {
  Shield,
  Store,
  Users,
  ArrowLeft,
  Cloud,
  Smartphone,
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Package,
  BarChart3,
  Globe,
  ShoppingCart,
  Gift,
  Star,
  Truck,
  Zap,
  Lock,
  Building2,
  MapPin,
  Phone,
  ChevronLeft,
} from 'lucide-react';

type View = 'landing' | 'admin' | 'merchant' | 'client';

const LandingPage: React.FC = () => {
  const [view, setView] = useState<View>('landing');

  if (view === 'admin') {
    return <AdminLogin onBack={() => setView('landing')} />;
  }

  if (view === 'merchant') {
    return <MerchantLogin onBack={() => setView('landing')} />;
  }

  if (view === 'client') {
    return <ClientLanding onBack={() => setView('landing')} />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 font-sans">
      {/* Top Nav */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 leading-tight">سـنـد</div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wider">SANAD POS & COMMERCE</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5" />
            <span>منصة آمنة ومحمية</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>المنصة السحابية الأولى للتجارة ونقاط البيع في السودان</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
          منظومة متكاملة لإدارة
          <br />
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            تجارتك من مكان واحد
          </span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          ثلاث تطبيقات متكاملة تخدم إدارة المنصة، التجار المشتركين، والعملاء النهائيين.
          <br />
          اختر طريقة دخولك للمتابعة:
        </p>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Card 1: Super Admin */}
          <button
            onClick={() => setView('admin')}
            className="group text-right bg-white rounded-3xl border border-slate-200 hover:border-violet-300 p-6 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-200 mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-[10px] font-bold text-violet-600 tracking-wider uppercase mb-2">Super Admin</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">إدارة المنصة</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              تحكم كامل في المنصة: متابعة التجار، تفعيل الاشتراكات، التحقق من المدفوعات، وإدارة المنشآت
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['متابعة التجار', 'الاشتراكات', 'المدفوعات', 'الأمان'].map((f) => (
                <span key={f} className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-medium rounded-md">
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1 text-violet-600 text-sm font-semibold group-hover:gap-2 transition-all">
              <span>دخول</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>

          {/* Card 2: Merchant */}
          <button
            onClick={() => setView('merchant')}
            className="group text-right bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-700" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-200 mb-4 group-hover:scale-110 transition-transform">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase mb-2">Merchant POS</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">تاجر السند</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              نقطة بيع سحابية متكاملة: إدارة المبيعات، المخزون، الفروع، الورديات، والتقارير المالية
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['نقطة بيع', 'مخزون', 'فروع', 'تقارير'].map((f) => (
                <span key={f} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-md">
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1 text-emerald-600 text-sm font-semibold group-hover:gap-2 transition-all">
              <span>دخول</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>

          {/* Card 3: Client */}
          <button
            onClick={() => setView('client')}
            className="group text-right bg-white rounded-3xl border border-slate-200 hover:border-amber-300 p-6 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="text-[10px] font-bold text-amber-600 tracking-wider uppercase mb-2">Public App</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">تطبيق الجمهور</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              تصفح المتاجر والمنتجات، اطلب أونلاين، اكسب نقاط الولاء، واستلم طلبك من أقرب فرع
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['تصفح', 'طلب', 'ولاء', 'توصيل'].map((f) => (
                <span key={f} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium rounded-md">
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1 text-amber-600 text-sm font-semibold group-hover:gap-2 transition-all">
              <span>تصفح</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
          {[
            { value: '500+', label: 'تاجر نشط', icon: Store },
            { value: '2,000+', label: 'فرع متصل', icon: Building2 },
            { value: '50,000+', label: 'عميل يومي', icon: Users },
            { value: '99.9%', label: 'جاهزية الخادم', icon: Zap },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/60 rounded-2xl border border-slate-200/60 p-4 backdrop-blur-sm">
              <stat.icon className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-700">منصة سند</span>
            <span className="text-slate-400">·</span>
            <span>SANAD POS & COMMERCE</span>
          </div>
          <p>المنصة السحابية الشاملة للتجارة ونقاط البيع الذكية في السودان · 2026</p>
        </div>
      </footer>
    </div>
  );
};

// ===================== ADMIN LOGIN =====================
function AdminLogin({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pin: password, role: 'super_admin' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      const data = await res.json();
      localStorage.setItem('sanad_access_token', data.accessToken);
      localStorage.setItem('sanad_auth_user', JSON.stringify(data.employee));
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>العودة للصفحة الرئيسية</span>
        </button>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-700 items-center justify-center shadow-2xl shadow-violet-500/30 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">إدارة المنصة</h1>
            <p className="text-sm text-violet-300 mt-1">Super Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-violet-200 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="admin@sanad.sd"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-violet-200 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold rounded-xl shadow-xl shadow-violet-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                'دخول آمن'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            الجلسة محمية ومشفرة · تنتهي تلقائياً بعد 12 ساعة
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== MERCHANT LOGIN =====================
function MerchantLogin({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'select' | 'login'>('select');
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [tenants, setTenants] = useState<any[]>([]);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (step === 'select') {
      fetch('/api/tenants/list')
        .then((r) => r.json())
        .then((data) => setTenants(data.tenants || []))
        .catch(() => {});
    }
  }, [step]);

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenant(tenantId);
    setStep('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, tenantId: selectedTenant }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      const data = await res.json();
      localStorage.setItem('sanad_access_token', data.accessToken);
      localStorage.setItem('sanad_auth_user', JSON.stringify(data.employee));
      localStorage.setItem('sanad_tenant_id', selectedTenant);
      window.location.href = '/pos';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'select') {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-lg">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>العودة للصفحة الرئيسية</span>
          </button>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 items-center justify-center shadow-2xl shadow-emerald-500/30 mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white">تاجر السند</h1>
              <p className="text-sm text-emerald-300 mt-1">اختر منشأتك للمتابعة</p>
            </div>

            <div className="space-y-3">
              {tenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTenantSelect(t.id)}
                  className="w-full text-right p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/30 rounded-2xl transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{t.tradeName || t.name}</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{t.city}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {t.status === 'active' ? 'نشط' : t.status}
                        </span>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <button
          onClick={() => setStep('select')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>العودة لاختيار المنشأة</span>
        </button>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 items-center justify-center shadow-2xl shadow-emerald-500/30 mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">تسجيل دخول الكاشير</h1>
            <p className="text-sm text-emerald-300 mt-1">أدخل رمز PIN للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-2">رمز PIN (4 أرقام)</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[0.5em] font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="••••"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || pin.length !== 4}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                'فتح نقطة البيع'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            للتواصل مع الدعم: support@sanad.sd · 0912345678
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== CLIENT LANDING =====================
function ClientLanding({ onBack }: { onBack: () => void }) {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 font-sans">
      {/* Top Nav */}
      <nav className="border-b border-amber-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span>عودة</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 leading-tight">سـنـد</div>
              <div className="text-[10px] text-slate-500 font-medium">تطبيق الجمهور</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-semibold mb-6">
          <Gift className="w-3.5 h-3.5" />
          <span>اكسب نقاط ولاء مع كل طلب!</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-6">
          تسوّق من
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent"> أقرب المتاجر </span>
          إليك
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          تصفّح آلاف المنتجات، اطلب أونلاين، واستلم من الفرع الأقرب أو نوصلها لباب بيتك.
          كل طلب يكسبك نقاط ولاء تستخدمها في خصومات فورية!
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
          {[
            { icon: ShoppingCart, title: 'تسوّق سهل', desc: 'واجهة بسيطة وسريعة' },
            { icon: Truck, title: 'توصيل سريع', desc: 'من الفرع الأقرب' },
            { icon: Gift, title: 'نقاط ولاء', desc: 'مكافآت على كل طلب' },
            { icon: Star, title: 'تقييمات حقيقية', desc: 'آراء العملاء الفعلية' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <f.icon className="w-7 h-7 text-amber-600 mx-auto mb-3" />
              <div className="font-bold text-slate-900 text-sm">{f.title}</div>
              <div className="text-xs text-slate-500 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-200/50 transition-all flex items-center justify-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5" />
            <span>ابدأ التسوّق الآن</span>
          </button>
          <button className="px-8 py-4 bg-white border-2 border-amber-200 hover:border-amber-300 text-amber-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-lg">
            <Smartphone className="w-5 h-5" />
            <span>تحميل التطبيق</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-100 bg-white/50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-slate-500">
          <p>منصة سند · تطبيق الجمهور · 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
