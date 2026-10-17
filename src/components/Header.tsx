import React from 'react';
import {
  Store,
  ShoppingCart,
  Layers,
  BarChart3,
  ArrowLeftRight,
  ShieldAlert,
  Globe,
  Coins,
  CreditCard,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  UserCheck,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  tenantName: string;
  branchName: string;
  actor: { name: string; role: string };
  isOffline: boolean;
  isSimulatingOffline: boolean;
  onToggleSimulateOffline: () => void;
  pendingOfflineCount: number;
  onSyncOffline: () => void;
  isSyncing: boolean;
  onOpenStorefront: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  tenantName,
  branchName,
  actor,
  isOffline,
  isSimulatingOffline,
  onToggleSimulateOffline,
  pendingOfflineCount,
  onSyncOffline,
  isSyncing,
  onOpenStorefront,
}) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'المالك';
      case 'branch_manager':
        return 'مدير فرع';
      case 'cashier':
        return 'كاشير';
      case 'inventory_officer':
        return 'مسؤول مخزون';
      case 'accountant':
        return 'محاسب';
      case 'super_admin':
        return 'مدير المنصة';
      default:
        return 'موظف';
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      {/* Top Bar Contract: 3 Zones */}
      <div className="flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single-element brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            س
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              منصة سند للتجارة الذكية
            </span>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {tenantName} · {branchName}
            </span>
          </div>
        </div>

        {/* Zone 2: Primary navigation links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('pos')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'pos'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            نقطة البيع (POS)
          </button>
          <button
            onClick={() => onTabChange('inventory')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'inventory'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            المخزون والمنتجات
          </button>
          <button
            onClick={() => onTabChange('transfers')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'transfers'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            تحويلات الفروع
          </button>
          <button
            onClick={() => onTabChange('shifts')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'shifts'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            الورديات والخزينة
          </button>
          <button
            onClick={() => onTabChange('reports')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'reports'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            المحاسبة والتقارير
          </button>
          <button
            onClick={() => onTabChange('admin')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'admin'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            إدارة المنصة المركزية
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Offline indicator & simulation button */}
          <button
            onClick={onToggleSimulateOffline}
            title={isOffline ? 'اضغط للاتصال بالإنترنت' : 'اضغط لمحاكاة انقطاع الإنترنت وتجربة الكاشير دون اتصال'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span>وضع دون اتصال {isSimulatingOffline && '(محاكاة)'}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>متصل بالخادم</span>
              </>
            )}
          </button>

          {/* Pending Sync Button if any */}
          {pendingOfflineCount > 0 && (
            <button
              onClick={onSyncOffline}
              disabled={isSyncing || isOffline}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>مزامنة ({pendingOfflineCount}) فواتير</span>
            </button>
          )}

          {/* Public Storefront button */}
          <button
            onClick={onOpenStorefront}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <span>المتجر الإلكتروني</span>
          </button>

          {/* Current Actor Tag */}
          <div className="flex items-center gap-2 pl-2 border-r border-slate-200 pr-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
              {actor.name.slice(0, 1)}
            </div>
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800 leading-tight">{actor.name}</span>
              <span className="text-[11px] text-slate-500">{getRoleLabel(actor.role)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary workspace navigation bar for all modules */}
      <div className="flex items-center gap-2 px-6 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto text-xs">
        <button
          onClick={() => onTabChange('pos')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'pos' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>الكاشير (POS)</span>
        </button>
        <button
          onClick={() => onTabChange('inventory')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'inventory' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>المخزون والمنتجات</span>
        </button>
        <button
          onClick={() => onTabChange('transfers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'transfers' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>تحويلات الفروع</span>
        </button>
        <button
          onClick={() => onTabChange('shifts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'shifts' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>الورديات ومطابقة الخزينة</span>
        </button>
        <button
          onClick={() => onTabChange('sales')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'sales' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>سجل المبيعات والفواتير</span>
        </button>
        <button
          onClick={() => onTabChange('purchases_expenses')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'purchases_expenses' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>المشتريات والمصروفات</span>
        </button>
        <button
          onClick={() => onTabChange('reports')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'reports' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>التقارير والأرباح</span>
        </button>
        <button
          onClick={() => onTabChange('branches_employees')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'branches_employees' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>الفروع والموظفين</span>
        </button>
        <button
          onClick={() => onTabChange('currencies')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'currencies' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>العملات والصرف (6 عملات)</span>
        </button>
        <button
          onClick={() => onTabChange('store_orders')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'store_orders' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>طلبات المتجر الإلكتروني</span>
        </button>
        <button
          onClick={() => onTabChange('subscription')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'subscription' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>الاشتراك والباقات</span>
        </button>
        <button
          onClick={() => onTabChange('admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'admin' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>إدارة المنصة المركزية</span>
        </button>
      </div>
    </header>
  );
};
