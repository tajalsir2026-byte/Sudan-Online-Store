import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { api } from './lib/api.ts';
import type { Tenant, StorefrontOrder, Employee } from './types/index.ts';

import {
  Building2,
  Users,
  BarChart3,
  Bell,
  CheckCircle2,
  XCircle,
  LogOut,
  Menu,
  X,
  Plus,
  Eye,
  Store,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Filter,
  Search,
} from 'lucide-react';

/**
 * Super Admin App — منصة إدارة السند المركزية
 *
 * This app is for the platform owner to:
 * - Manage all tenants (merchants)
 * - Approve/reject new merchant applications
 * - View all orders and ads from all merchants
 * - See platform-wide analytics
 * - Manage subscriptions and payments
 */

// ===================== TYPES =====================
interface MerchantApplication {
  id: string;
  tenantId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

// ===================== LAYOUT =====================
function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'نظرة عامة', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/admin/tenants', label: 'المتاجر والتجار', icon: <Building2 className="w-5 h-5" /> },
    { path: '/admin/applications', label: 'طلبات الانضمام', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/orders', label: 'الطلبات العامة', icon: <ShoppingBag className="w-5 h-5" /> },
    { path: '/admin/ads', label: 'إعلانات الزبائن', icon: <Bell className="w-5 h-5" /> },
    { path: '/admin/payments', label: 'المدفوعات', icon: <DollarSign className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex font-sans">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen bg-white border-l border-slate-200 flex flex-col z-50 transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-sm">إدارة السند</h1>
                <p className="text-[10px] text-slate-500">Super Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden w-8 h-8 items-center justify-center rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
            <h2 className="font-bold text-slate-900">
              {navItems.find((n) => isActive(n.path))?.label || 'نظرة عامة'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">مدير المنصة</p>
              <p className="text-[10px] text-slate-500">superadmin@sanad.sd</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
              م
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

// ===================== DASHBOARD =====================
function AdminDashboard() {
  const [stats, setStats] = useState({
    tenants: 0,
    activeTenants: 0,
    branches: 0,
    pendingApplications: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingAds: 0,
  });
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tListRes] = await Promise.allSettled([api.getTenantsList()]);

      if (tListRes.status === 'fulfilled') {
        const tenantList = tListRes.value.tenants || [];
        setTenants(tenantList);
        setStats({
          tenants: tenantList.length,
          activeTenants: tenantList.filter((t: any) => t.status === 'active').length,
          branches: 0,
          pendingApplications: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingAds: 0,
        });
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-slate-200" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'المنشآت المسجلة', value: stats.tenants, sub: `${stats.activeTenants} نشطة`, icon: <Building2 className="w-6 h-6" />, color: 'emerald' },
    { label: 'الفروع المرتبطة', value: stats.branches, sub: 'متصل', icon: <Store className="w-6 h-6" />, color: 'blue' },
    { label: 'طلبات الانضمام', value: stats.pendingApplications, sub: 'بانتظار الموافقة', icon: <Users className="w-6 h-6" />, color: 'amber' },
    { label: 'الطلبات العامة', value: stats.totalOrders, sub: 'هذا الشهر', icon: <ShoppingBag className="w-6 h-6" />, color: 'purple' },
    { label: 'إعلانات الزبائن', value: stats.pendingAds, sub: 'بانتظار المراجعة', icon: <Bell className="w-6 h-6" />, color: 'rose' },
    { label: 'إجمالي الإيرادات', value: `${(stats.totalRevenue / 1000).toFixed(0)}K`, sub: 'ج.س', icon: <TrendingUp className="w-6 h-6" />, color: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${card.color}-50 text-${card.color}-600`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-600 mt-1">{card.label}</p>
            <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Tenants */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">آخر المتاجر المسجلة</h3>
          <button className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">عرض الكل</button>
        </div>
        {tenants.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">لا توجد متاجر مسجلة بعد</p>
        ) : (
          <div className="space-y-3">
            {tenants.slice(0, 5).map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {t.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.tradeName || t.name}</p>
                    <p className="text-xs text-slate-500">{t.city} · {t.status}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  t.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  t.status === 'trial' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {t.status === 'active' ? 'نشط' : t.status === 'trial' ? 'تجريبي' : 'موقوف'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== TENANTS LIST =====================
function TenantsView() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const res = await api.getTenantsList();
      setTenants(res.tenants || []);
    } catch (err) {
      console.error('Failed to load tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tenants.filter((t) => {
    const matchesSearch = (t.name || '').includes(search) || (t.tradeName || '').includes(search) || (t.city || '').includes(search);
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن متجر..."
            className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="trial">تجريبي</option>
          <option value="suspended">موقوف</option>
        </select>
      </div>

      {/* Tenants List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">لا توجد متاجر مطابقة للبحث</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-right p-4 font-semibold text-slate-700">التاجر</th>
                <th className="text-right p-4 font-semibold text-slate-700">المدينة</th>
                <th className="text-right p-4 font-semibold text-slate-700">الحالة</th>
                <th className="text-right p-4 font-semibold text-slate-700">الباقة</th>
                <th className="text-right p-4 font-semibold text-slate-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{t.tradeName || t.name}</p>
                      <p className="text-xs text-slate-500">{t.slug}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{t.city}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      t.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      t.status === 'trial' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {t.status === 'active' ? 'نشط' : t.status === 'trial' ? 'تجريبي' : 'موقوف'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{t.planId}</td>
                  <td className="p-4">
                    <button className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                      عرض
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===================== ORDERS VIEW =====================
function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/storefront/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4">جميع الطلبات من كل المتاجر</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">طلب #{order.orderNumber}</p>
                  <p className="text-xs text-slate-500">{order.customerName} · {order.customerPhone}</p>
                  <p className="text-xs text-slate-500 mt-1">{order.totalSdg.toLocaleString()} ج.س</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  order.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {order.status === 'new' ? 'جديد' :
                   order.status === 'preparing' ? 'قيد التجهيز' :
                   order.status === 'ready' ? 'جاهز' :
                   order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== ADS VIEW =====================
function AdsView() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const res = await fetch('/api/storefront/ads');
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } catch (err) {
      console.error('Failed to load ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adId: string) => {
    try {
      await fetch(`/api/storefront/ads/${adId}/approve`, { method: 'POST' });
      setAds(ads.map((a) => a.id === adId ? { ...a, status: 'approved' } : a));
    } catch (err) {
      console.error('Failed to approve ad:', err);
    }
  };

  const handleReject = async (adId: string) => {
    try {
      await fetch(`/api/storefront/ads/${adId}/reject`, { method: 'POST' });
      setAds(ads.map((a) => a.id === adId ? { ...a, status: 'rejected' } : a));
    } catch (err) {
      console.error('Failed to reject ad:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">إعلانات الزبائن (من تطبيق الجمهور)</h3>
          <span className="text-sm text-slate-500">
            {ads.filter((a) => a.status === 'pending').length} بانتظار المراجعة
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">لا توجد إعلانات بعد</p>
            <p className="text-xs text-slate-400 mt-1">الإعلانات المنشورة من تطبيق الزبون ستظهر هنا</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ads.map((ad) => (
              <div key={ad.id} className="p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900">{ad.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        ad.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {ad.status === 'pending' ? 'بانتظار المراجعة' :
                         ad.status === 'approved' ? 'مقبول' : 'مرفوض'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{ad.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>{ad.category}</span>
                      <span>{ad.city}</span>
                      <span>{ad.priceSdg?.toLocaleString()} ج.س</span>
                      <span>{ad.sellerName}</span>
                    </div>
                  </div>
                  {ad.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(ad.id)}
                        className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        title="قبول"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(ad.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                        title="رفض"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== APPLICATIONS VIEW =====================
function ApplicationsView() {
  const [applications, setApplications] = useState<MerchantApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await fetch('/api/admin/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">طلبات انضمام التجار</h3>
          <span className="text-sm text-slate-500">
            {applications.filter((a) => a.status === 'pending').length} معلق
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">لا توجد طلبات انضمام جديدة</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="p-4 rounded-xl border border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{app.businessName}</h4>
                    <p className="text-sm text-slate-600 mt-1">{app.ownerName}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                      <span>{app.email}</span>
                      <span>{app.phone}</span>
                      <span>{app.city}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {app.status === 'pending' ? (
                      <>
                        <button className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg">
                          قبول
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg">
                          رفض
                        </button>
                      </>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {app.status === 'approved' ? 'مقبول' : 'مرفوض'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== PAYMENTS VIEW =====================
function PaymentsView() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4">المدفوعات والاشتراكات</h3>
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">قيد التطوير</p>
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
export default function AdminApp() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/tenants" element={<AdminLayout><TenantsView /></AdminLayout>} />
      <Route path="/applications" element={<AdminLayout><ApplicationsView /></AdminLayout>} />
      <Route path="/orders" element={<AdminLayout><OrdersView /></AdminLayout>} />
      <Route path="/ads" element={<AdminLayout><AdsView /></AdminLayout>} />
      <Route path="/payments" element={<AdminLayout><PaymentsView /></AdminLayout>} />
    </Routes>
  );
}
