import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { PosView } from './components/POS/PosView.tsx';
import { ShiftsView } from './components/Shifts/ShiftsView.tsx';
import { InventoryView } from './components/Inventory/InventoryView.tsx';
import { TransfersView } from './components/Transfers/TransfersView.tsx';
import { SalesView } from './components/Sales/SalesView.tsx';
import { PurchasesExpensesView } from './components/PurchasesExpenses/PurchasesExpensesView.tsx';
import { ReportsView } from './components/Reports/ReportsView.tsx';
import { CurrenciesView } from './components/Currencies/CurrenciesView.tsx';
import { BranchesEmployeesView } from './components/BranchesEmployees/BranchesEmployeesView.tsx';
import { StorefrontView } from './components/Storefront/StorefrontView.tsx';
import { SubscriptionView } from './components/Subscription/SubscriptionView.tsx';
import { CentralAdminView } from './components/Admin/CentralAdminView.tsx';

import type {
  Tenant,
  Branch,
  Employee,
  Product,
  BranchTransfer,
  CashierShift,
  Sale,
  CurrencyConfig,
} from './types/index.ts';
import { api } from './lib/api.ts';
import {
  Users,
  Building,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  X,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('pos');

  // Application Data States
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transfers, setTransfers] = useState<BranchTransfer[]>([]);
  const [shifts, setShifts] = useState<CashierShift[]>([]);
  const [activeShift, setActiveShift] = useState<CashierShift | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>([]);

  // Actor / Role state for testing and permissions
  const [actor, setActor] = useState<{ id: string; name: string; role: string }>(api.getActor());

  // Offline / Network States
  const [isOffline, setIsOffline] = useState<boolean>(api.isOffline());
  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(api.isSimulatingOffline());
  const [pendingOfflineCount, setPendingOfflineCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'info'; text: string } | null>(null);

  // Available tenants for demo switching
  const [tenantsList, setTenantsList] = useState<any[]>([]);

  // Shift Modal Open Trigger
  const [isShiftModalRequested, setIsShiftModalRequested] = useState(false);

  // Load primary data
  const loadPrimaryData = async () => {
    try {
      const [tListRes, curTenantRes, brRes, empRes, prodRes, shiftsRes, currRes, salesRes, trfRes] =
        await Promise.allSettled([
          api.getTenantsList(),
          api.getCurrentTenant(),
          api.getBranches(),
          api.getEmployees(),
          api.getProducts(),
          api.getShifts(),
          api.getCurrencies(),
          api.getSales(),
          api.getTransfers(),
        ]);

      if (tListRes.status === 'fulfilled') setTenantsList(tListRes.value.tenants);
      if (curTenantRes.status === 'fulfilled') setTenant(curTenantRes.value.tenant);

      if (brRes.status === 'fulfilled') {
        setBranches(brRes.value.branches);
        const savedBranchId = api.getBranchId();
        const activeBr = brRes.value.branches.find((b) => b.id === savedBranchId) || brRes.value.branches[0] || null;
        setCurrentBranch(activeBr);
      }

      if (empRes.status === 'fulfilled') setEmployees(empRes.value.employees);
      if (prodRes.status === 'fulfilled') setProducts(prodRes.value.products);
      if (shiftsRes.status === 'fulfilled') {
        setShifts(shiftsRes.value.shifts);
        const openS = shiftsRes.value.shifts.find((s) => s.status === 'open');
        setActiveShift(openS || null);
      }
      if (currRes.status === 'fulfilled') setCurrencies(currRes.value.currencies);
      if (salesRes.status === 'fulfilled') setSales(salesRes.value.sales);
      if (trfRes.status === 'fulfilled') setTransfers(trfRes.value.transfers);

      // Check pending offline queue count
      const offlineCount = await api.getPendingOfflineCount();
      setPendingOfflineCount(offlineCount);
    } catch (err) {
      console.warn('Initialization error:', err);
    }
  };

  useEffect(() => {
    loadPrimaryData();

    // Listen to network status changes
    const unsub = api.onNetworkStatusChange((offline) => {
      setIsOffline(offline);
      setIsSimulatingOffline(api.isSimulatingOffline());

      if (!offline) {
        // Attempt background auto-sync when online returns
        handleSyncOffline();
      }
    });

    return () => unsub();
  }, []);

  // Background Sync Trigger
  const handleSyncOffline = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const res = await api.syncPendingOfflineSales();
      if (res.syncedCount > 0) {
        setNotification({
          type: 'success',
          text: `تمت بنجاح مزامنة (${res.syncedCount}) فواتير بيع من الدرج إلى الخادم السحابي!`,
        });
        loadPrimaryData();
      }
      const count = await api.getPendingOfflineCount();
      setPendingOfflineCount(count);
    } catch (err: any) {
      setNotification({
        type: 'warning',
        text: 'تعذر إتمام مزامنة بعض الفواتير حالياً، سيتم إعادة المحاولة تلقائياً.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle offline simulation
  const handleToggleSimulateOffline = () => {
    const isSim = api.toggleSimulateOffline();
    setIsOffline(isSim);
    setIsSimulatingOffline(isSim);

    if (isSim) {
      setNotification({
        type: 'warning',
        text: 'تم تفعيل وضع محاكاة انقطاع الإنترنت! يمكنك الآن تجربة البيع دون اتصال وسيتم تخزين الفواتير محلياً في IndexedDB.',
      });
    } else {
      setNotification({
        type: 'info',
        text: 'تمت استعادة الاتصال بالإنترنت! جاري ترحيل الفواتير المعلقة...',
      });
      handleSyncOffline();
    }
  };

  // On sale completed in POS
  const handleSaleCompleted = async (sale: Sale, isOfflineSale?: boolean) => {
    if (isOfflineSale) {
      const count = await api.getPendingOfflineCount();
      setPendingOfflineCount(count);
      setNotification({
        type: 'warning',
        text: `تم حفظ الفاتورة ${sale.invoiceNumber} محلياً دون اتصال. ستُرفع تلقائياً عند الاتصال.`,
      });
    } else {
      setNotification({
        type: 'success',
        text: `تم إصدار وحفظ الفاتورة ${sale.invoiceNumber} بنجاح.`,
      });
    }
    loadPrimaryData();
  };

  // Role Switcher for easy testing
  const handleActorSwitch = (newRole: string) => {
    let newActor = { id: 'emp_owner_rowad', name: 'أحمد الطيب الرواد', role: 'owner' };
    if (newRole === 'cashier') {
      newActor = { id: 'emp_cashier_kht', name: 'محمد عبد الله (كاشير)', role: 'cashier' };
    } else if (newRole === 'branch_manager') {
      newActor = { id: 'emp_mgr_kht', name: 'عثمان عبد الرحيم (مدير الفرع)', role: 'branch_manager' };
    } else if (newRole === 'accountant') {
      newActor = { id: 'emp_accountant_rowad', name: 'سارة مصطفى (المحاسب)', role: 'accountant' };
    } else if (newRole === 'super_admin') {
      newActor = { id: 'saas_admin', name: 'مدير المنصة المركزي', role: 'super_admin' };
    }
    setActor(newActor);
    api.setActor(newActor);
  };

  // Branch Switcher
  const handleBranchSwitch = (branchId: string) => {
    const found = branches.find((b) => b.id === branchId);
    if (found) {
      setCurrentBranch(found);
      api.setBranchId(found.id);
      loadPrimaryData();
    }
  };

  // Tenant Switcher
  const handleTenantSwitch = (tenantId: string) => {
    api.setTenantId(tenantId);
    loadPrimaryData();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Notification Toast */}
      {notification && (
        <div
          className={`fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg border text-xs flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-800 text-white border-emerald-700'
              : notification.type === 'warning'
              ? 'bg-amber-800 text-white border-amber-700'
              : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />}
          {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />}
          {notification.type === 'info' && <Clock className="w-4 h-4 text-blue-300 shrink-0" />}
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="text-white/70 hover:text-white p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        tenantName={tenant?.tradeName || tenant?.name || 'منصة سند'}
        branchName={currentBranch?.name || 'الفرع الرئيسي'}
        actor={actor}
        isOffline={isOffline}
        isSimulatingOffline={isSimulatingOffline}
        onToggleSimulateOffline={handleToggleSimulateOffline}
        pendingOfflineCount={pendingOfflineCount}
        onSyncOffline={handleSyncOffline}
        isSyncing={isSyncing}
        onOpenStorefront={() => setCurrentTab('store_orders')}
      />

      {/* Quick Testing Context Bar (Tenant, Branch & Role Switcher for Review) */}
      <div className="bg-slate-800 text-slate-300 text-[11px] px-6 py-1.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
        <div className="flex flex-wrap items-center gap-4">
          {/* Tenant Switcher */}
          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">المنشأة المستأجرة:</span>
            <select
              value={tenant?.id || ''}
              onChange={(e) => handleTenantSwitch(e.target.value)}
              className="bg-slate-900 text-white border border-slate-600 rounded px-2 py-0.5 text-[11px] focus:outline-none"
            >
              {tenantsList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.city})
                </option>
              ))}
            </select>
          </div>

          {/* Branch Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white">فرع العمل:</span>
            <select
              value={currentBranch?.id || ''}
              onChange={(e) => handleBranchSwitch(e.target.value)}
              className="bg-slate-900 text-white border border-slate-600 rounded px-2 py-0.5 text-[11px] focus:outline-none"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-white">دور المستخدم (RBAC):</span>
            <select
              value={actor.role}
              onChange={(e) => handleActorSwitch(e.target.value)}
              className="bg-slate-900 text-white border border-slate-600 rounded px-2 py-0.5 text-[11px] focus:outline-none font-semibold"
            >
              <option value="owner">المالك (أحمد الطيب - صلاحيات كاملة)</option>
              <option value="branch_manager">مدير فرع (عثمان عبد الرحيم)</option>
              <option value="cashier">كاشير نقاط البيع (محمد عبد الله)</option>
              <option value="accountant">محاسب مالي (سارة مصطفى)</option>
              <option value="super_admin">مدير المنصة المركزي (SaaS Super Admin)</option>
            </select>
          </div>
        </div>

        {/* Offline indicator quick status */}
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span>العملة الافتراضية: SDG (جنيه سوداني)</span>
          {pendingOfflineCount > 0 && (
            <span className="text-amber-400 font-bold">
              • فواتير أوفلاين معلقة: {pendingOfflineCount}
            </span>
          )}
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-auto">
        {currentTab === 'pos' && (
          <PosView
            products={products}
            currentBranch={currentBranch}
            activeShift={activeShift}
            currencies={currencies}
            onRefreshShift={loadPrimaryData}
            onOpenShiftModal={() => setCurrentTab('shifts')}
            isOffline={isOffline}
            onSaleCompleted={handleSaleCompleted}
          />
        )}

        {currentTab === 'shifts' && (
          <ShiftsView
            shifts={shifts}
            currentBranch={currentBranch}
            activeShift={activeShift}
            onRefresh={loadPrimaryData}
            actor={actor}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryView
            products={products}
            branches={branches}
            currentBranch={currentBranch}
            onRefresh={loadPrimaryData}
          />
        )}

        {currentTab === 'transfers' && (
          <TransfersView
            transfers={transfers}
            branches={branches}
            products={products}
            onRefresh={loadPrimaryData}
          />
        )}

        {currentTab === 'sales' && (
          <SalesView
            sales={sales}
            branches={branches}
            currentBranch={currentBranch}
            onRefresh={loadPrimaryData}
          />
        )}

        {currentTab === 'purchases_expenses' && (
          <PurchasesExpensesView
            branches={branches}
            currentBranch={currentBranch}
            currencies={currencies}
            onRefresh={loadPrimaryData}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView branches={branches} currentBranch={currentBranch} />
        )}

        {currentTab === 'branches_employees' && (
          <BranchesEmployeesView
            branches={branches}
            employees={employees}
            onRefresh={loadPrimaryData}
          />
        )}

        {currentTab === 'currencies' && (
          <CurrenciesView currencies={currencies} onRefresh={loadPrimaryData} />
        )}

        {currentTab === 'store_orders' && (
          <StorefrontView
            tenant={tenant}
            branches={branches}
            products={products}
            onRefresh={loadPrimaryData}
          />
        )}

        {currentTab === 'subscription' && (
          <SubscriptionView tenant={tenant} onRefresh={loadPrimaryData} />
        )}

        {currentTab === 'admin' && <CentralAdminView />}
      </main>
    </div>
  );
}
