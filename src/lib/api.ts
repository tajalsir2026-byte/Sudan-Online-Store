import type {
  Tenant,
  Branch,
  Employee,
  Product,
  BranchInventory,
  BranchTransfer,
  CashierShift,
  Sale,
  CurrencyConfig,
  CurrencyRateHistory,
  StorefrontOrder,
  Expense,
  Purchase,
  SubscriptionPlan,
  SubscriptionPayment,
  AuditLog,
  ReturnRecord,
  Customer,
  AlbandarListing,
  AlbandarShowroom,
} from '../types/index.ts';

import {
  cacheProductsLocally,
  getLocallyCachedProducts,
  saveOfflineSale,
  getPendingOfflineSales,
  clearSyncedSales,
} from './indexedDb.ts';

class ApiClient {
  private tenantId: string = 'tenant_alrowad';
  private currentActor = {
    id: 'emp_owner_rowad',
    name: 'أحمد الطيب الرواد',
    role: 'owner',
  };
  private currentBranchId: string = 'branch_kht_main';
  private isSimulatedOffline: boolean = false;
  private onOfflineStatusChangeCallbacks: ((isOffline: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedTenant = localStorage.getItem('sanad_tenant_id');
      if (savedTenant) this.tenantId = savedTenant;

      const savedBranch = localStorage.getItem('sanad_branch_id');
      if (savedBranch) this.currentBranchId = savedBranch;

      const savedActor = localStorage.getItem('sanad_actor');
      if (savedActor) {
        try {
          this.currentActor = JSON.parse(savedActor);
        } catch {
          // ignore
        }
      }

      window.addEventListener('online', () => this.handleNetworkChange());
      window.addEventListener('offline', () => this.handleNetworkChange());
    }
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public setTenantId(id: string) {
    this.tenantId = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sanad_tenant_id', id);
    }
  }

  public getBranchId(): string {
    return this.currentBranchId;
  }

  public setBranchId(id: string) {
    this.currentBranchId = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sanad_branch_id', id);
    }
  }

  public getActor() {
    return this.currentActor;
  }

  public setActor(actor: { id: string; name: string; role: string }) {
    this.currentActor = actor;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sanad_actor', JSON.stringify(actor));
    }
  }

  public isOffline(): boolean {
    if (this.isSimulatedOffline) return true;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
    return false;
  }

  public toggleSimulateOffline(simulate?: boolean): boolean {
    this.isSimulatedOffline = simulate !== undefined ? simulate : !this.isSimulatedOffline;
    this.handleNetworkChange();
    return this.isSimulatedOffline;
  }

  public isSimulatingOffline(): boolean {
    return this.isSimulatedOffline;
  }

  public onNetworkStatusChange(callback: (isOffline: boolean) => void) {
    this.onOfflineStatusChangeCallbacks.push(callback);
    return () => {
      this.onOfflineStatusChangeCallbacks = this.onOfflineStatusChangeCallbacks.filter((c) => c !== callback);
    };
  }

  private handleNetworkChange() {
    const offline = this.isOffline();
    for (const cb of this.onOfflineStatusChangeCallbacks) {
      cb(offline);
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-tenant-id': this.tenantId,
      'x-actor-id': this.currentActor.id,
      'x-actor-name': this.currentActor.name,
      'x-actor-role': this.currentActor.role,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (this.isOffline() && !endpoint.startsWith('/storefront/')) {
      throw new Error('OFFLINE_MODE');
    }

    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      let msg = 'حدث خطأ في استجابة الخادم';
      try {
        const data = await res.json();
        if (data.error) msg = data.error;
      } catch {
        // ignore
      }
      throw new Error(msg);
    }

    return res.json();
  }

  /* Tenant endpoints */
  public async getTenantsList(): Promise<{ tenants: any[] }> {
    return this.request('/tenants/list');
  }

  public async getCurrentTenant(): Promise<{ tenant: Tenant }> {
    return this.request('/tenants/current');
  }

  public async updateCurrentTenant(payload: Partial<Tenant>): Promise<{ success: boolean; tenant: Tenant }> {
    return this.request('/tenants/current', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  /* Branches */
  public async getBranches(): Promise<{ branches: Branch[] }> {
    return this.request('/branches');
  }

  public async createBranch(payload: Partial<Branch>): Promise<{ success: boolean; branch: Branch }> {
    return this.request('/branches', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /* Employees */
  public async getEmployees(): Promise<{ employees: Employee[] }> {
    return this.request('/employees');
  }

  public async createEmployee(payload: Partial<Employee>): Promise<{ success: boolean; employee: Employee }> {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /* Products & Inventory with Offline Fallback */
  public async getProducts(): Promise<{ products: Product[] }> {
    if (this.isOffline()) {
      const cached = await getLocallyCachedProducts();
      return { products: cached };
    }
    const res = await this.request<{ products: Product[] }>('/products');
    if (res.products) {
      cacheProductsLocally(res.products).catch((err) => console.warn('Cache error:', err));
    }
    return res;
  }

  public async createProduct(payload: any): Promise<{ success: boolean; product: Product }> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getInventory(branchId?: string): Promise<{ inventory: (BranchInventory & { product?: Product; branch?: Branch })[] }> {
    const q = branchId ? `?branchId=${branchId}` : '';
    return this.request(`/inventory${q}`);
  }

  public async adjustInventory(payload: {
    branchId: string;
    productId: string;
    delta: number;
    reason: string;
    type?: string;
  }): Promise<{ success: boolean; newBalance: number }> {
    return this.request('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getStockMovements(branchId?: string): Promise<{ movements: any[] }> {
    const q = branchId ? `?branchId=${branchId}` : '';
    return this.request(`/inventory/movements${q}`);
  }

  /* Branch Transfers */
  public async getTransfers(): Promise<{ transfers: BranchTransfer[] }> {
    return this.request('/transfers');
  }

  public async requestTransfer(payload: any): Promise<{ success: boolean; transfer: BranchTransfer }> {
    return this.request('/transfers/request', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async dispatchTransfer(id: string): Promise<{ success: boolean; transfer: BranchTransfer }> {
    return this.request(`/transfers/${id}/dispatch`, { method: 'POST' });
  }

  public async receiveTransfer(id: string, payload: any): Promise<{ success: boolean; transfer: BranchTransfer }> {
    return this.request(`/transfers/${id}/receive`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /* POS Shifts */
  public async getCurrentShift(cashierId?: string): Promise<{ shift: CashierShift | null }> {
    const q = cashierId ? `?cashierId=${cashierId}` : '';
    return this.request(`/pos/shifts/current${q}`);
  }

  public async openShift(payload: {
    branchId: string;
    openingCashSdg: number;
    cashierId?: string;
    cashierName?: string;
  }): Promise<{ success: boolean; shift: CashierShift }> {
    return this.request('/pos/shifts/open', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async closeShift(payload: {
    shiftId: string;
    actualCashSdg: number;
    closeNotes?: string;
  }): Promise<{ success: boolean; shift: CashierShift }> {
    return this.request('/pos/shifts/close', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async reviewShift(id: string, payload: { reviewNotes: string }): Promise<{ success: boolean; shift: CashierShift }> {
    return this.request(`/pos/shifts/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getShifts(): Promise<{ shifts: CashierShift[] }> {
    return this.request('/pos/shifts');
  }

  /* POS Sales with OFFLINE-FIRST support */
  public async recordSale(salePayload: any): Promise<{ success: boolean; sale: Sale; isOffline?: boolean }> {
    const saleId = salePayload.id || `sale_cli_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const invoiceNumber = salePayload.invoiceNumber || `INV-OFF-${Date.now().toString().slice(-6)}`;

    const fullSale: Sale = {
      ...salePayload,
      id: saleId,
      invoiceNumber,
      tenantId: this.tenantId,
      cashierId: this.currentActor.id,
      cashierName: this.currentActor.name,
      createdAt: new Date().toISOString(),
    };

    if (this.isOffline()) {
      fullSale.isOfflineCreated = true;
      await saveOfflineSale(fullSale);
      return { success: true, sale: fullSale, isOffline: true };
    }

    try {
      const res = await this.request<{ success: boolean; sale: Sale }>('/pos/sales', {
        method: 'POST',
        body: JSON.stringify(fullSale),
      });
      return { ...res, isOffline: false };
    } catch (err: any) {
      console.warn('Network error during online sale, saving offline:', err);
      fullSale.isOfflineCreated = true;
      await saveOfflineSale(fullSale);
      return { success: true, sale: fullSale, isOffline: true };
    }
  }

  public async getSales(branchId?: string): Promise<{ sales: Sale[] }> {
    const q = branchId ? `?branchId=${branchId}` : '';
    return this.request(`/pos/sales${q}`);
  }

  public async refundSale(
    saleId: string,
    payload: {
      reason: string;
      returnItems?: { productId: string; quantity: number }[];
    }
  ): Promise<{ success: boolean; returnRecord?: ReturnRecord; sale?: Sale }> {
    return this.request(`/pos/sales/${saleId}/refund`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getReturns(branchId?: string): Promise<{ returns: ReturnRecord[] }> {
    const q = branchId ? `?branchId=${branchId}` : '';
    return this.request(`/pos/returns${q}`);
  }

  /* Customers & Loyalty Points */
  public async getCustomers(search?: string): Promise<{ customers: Customer[] }> {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/pos/customers${q}`);
  }

  public async createCustomer(data: Partial<Customer>): Promise<{ success: boolean; customer: Customer }> {
    return this.request('/pos/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async updateCustomer(id: string, data: Partial<Customer>): Promise<{ success: boolean; customer: Customer }> {
    return this.request(`/pos/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async getCustomerHistory(id: string): Promise<{
    customer: Customer;
    sales: Sale[];
    summary: {
      totalInvoices: number;
      totalSpentSdg: number;
      averageInvoiceSdg: number;
      loyaltyPoints: number;
      lastPurchaseAt?: string;
    };
  }> {
    return this.request(`/pos/customers/${id}/history`);
  }

  /* Offline Sync Queue */
  public async syncPendingOfflineSales(): Promise<{ success: boolean; syncedCount: number; errors: any[] }> {
    const pending = await getPendingOfflineSales();
    if (!pending.length) {
      return { success: true, syncedCount: 0, errors: [] };
    }

    const res = await fetch('/api/sync/batch', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ sales: pending }),
    });

    if (!res.ok) {
      throw new Error('فشلت مزامنة المبيعات مع الخادم');
    }

    const result = await res.json();
    if (result.syncedIds && result.syncedIds.length) {
      await clearSyncedSales(result.syncedIds);
    }

    return result;
  }

  public async getPendingOfflineCount(): Promise<number> {
    const pending = await getPendingOfflineSales();
    return pending.length;
  }

  /* Multi-Currency */
  public async getCurrencies(): Promise<{ currencies: CurrencyConfig[] }> {
    return this.request('/currencies');
  }

  public async updateCurrencyRate(code: string, rateToSdg: number, isActive?: boolean): Promise<{ success: boolean; currency: CurrencyConfig }> {
    return this.request(`/currencies/${code}`, {
      method: 'PUT',
      body: JSON.stringify({ rateToSdg, isActive }),
    });
  }

  public async getCurrencyHistory(): Promise<{ history: CurrencyRateHistory[] }> {
    return this.request('/currencies/history');
  }

  /* Financial Reports */
  public async getReportsSummary(branchId?: string): Promise<{ summary: any }> {
    const q = branchId ? `?branchId=${branchId}` : '';
    return this.request(`/reports/summary${q}`);
  }

  /* Expenses & Purchases */
  public async getExpenses(): Promise<{ expenses: Expense[] }> {
    return this.request('/expenses');
  }

  public async createExpense(payload: any): Promise<{ success: boolean; expense: Expense }> {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getPurchases(): Promise<{ purchases: Purchase[] }> {
    return this.request('/purchases');
  }

  public async createPurchase(payload: {
    branchId: string;
    supplierName: string;
    invoiceNumber?: string;
    currency?: string;
    exchangeRate?: number;
    items: any[];
    paymentStatus?: 'paid' | 'partial' | 'credit';
    notes?: string;
  }): Promise<{ success: boolean; purchase: Purchase }> {
    return this.request('/purchases', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /* Storefront */
  public async getStorefront(slug: string): Promise<{ store: any; branches: any[]; products: any[] }> {
    const res = await fetch(`/api/storefront/${slug}`);
    if (!res.ok) throw new Error('المتجر غير متاح');
    return res.json();
  }

  public async submitStoreOrder(slug: string, payload: any): Promise<{ success: boolean; order: StorefrontOrder }> {
    const res = await fetch(`/api/storefront/${slug}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('فشل إرسال الطلب');
    return res.json();
  }

  public async getStorefrontOrders(): Promise<{ orders: StorefrontOrder[] }> {
    return this.request('/storefront-orders');
  }

  public async updateStoreOrderStatus(id: string, status: string, paymentStatus?: string): Promise<{ success: boolean }> {
    return this.request(`/storefront-orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus }),
    });
  }

  /* Subscriptions */
  public async getSubscriptionPlans(): Promise<{ plans: SubscriptionPlan[] }> {
    return this.request('/subscriptions/plans');
  }

  public async getCurrentSubscription(): Promise<{ tenant: Tenant; currentPlan: SubscriptionPlan; payments: SubscriptionPayment[] }> {
    return this.request('/subscriptions/current');
  }

  public async submitSubscriptionPayment(payload: {
    planId: string;
    amountSdg: number;
    paymentMethod: string;
    paymentRef: string;
    bankTransferSlipUrl?: string;
  }): Promise<{ success: boolean; payment: SubscriptionPayment }> {
    return this.request('/subscriptions/submit-payment', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /* Central SaaS Admin */
  public async getAdminTenants(): Promise<{ tenants: any[] }> {
    return this.request('/admin/tenants');
  }

  public async setTenantStatus(tenantId: string, status: string, reason?: string): Promise<{ success: boolean }> {
    return this.request(`/admin/tenants/${tenantId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, reason }),
    });
  }

  public async getAdminPayments(): Promise<{ payments: any[] }> {
    return this.request('/admin/payments');
  }

  public async reviewPayment(
    paymentId: string,
    decision: 'approved' | 'rejected',
    reviewNote?: string,
    reviewerName?: string
  ): Promise<{ success: boolean }> {
    return this.request(`/admin/payments/${paymentId}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, reviewNote, reviewerName }),
    });
  }

  public async getAdminStats(): Promise<{ stats: any }> {
    return this.request('/admin/stats');
  }

  public async getAuditLogs(): Promise<{ logs: AuditLog[] }> {
    return this.request('/audit-logs');
  }

  /* Albandar Marketplace & Classifieds */
  public async getAlbandarListings(params?: {
    category?: string;
    city?: string;
    search?: string;
    condition?: string;
  }): Promise<{ listings: AlbandarListing[] }> {
    const q = new URLSearchParams();
    if (params?.category && params.category !== 'all' && params.category !== 'الكل') {
      q.append('category', params.category);
    }
    if (params?.city && params.city !== 'all' && params.city !== 'الكل') {
      q.append('city', params.city);
    }
    if (params?.search) {
      q.append('search', params.search);
    }
    if (params?.condition && params.condition !== 'all' && params.condition !== 'الكل') {
      q.append('condition', params.condition);
    }
    const queryString = q.toString() ? `?${q.toString()}` : '';
    return this.request(`/albandar/listings${queryString}`);
  }

  public async createAlbandarListing(payload: Partial<AlbandarListing>): Promise<{ success: boolean; listing: AlbandarListing }> {
    return this.request('/albandar/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getAlbandarShowrooms(): Promise<{ showrooms: AlbandarShowroom[] }> {
    return this.request('/albandar/showrooms');
  }

  public async publishProductToAlbandar(
    productId: string,
    category?: string,
    condition?: string,
    locationDetails?: string
  ): Promise<{ success: boolean; listing: AlbandarListing }> {
    return this.request('/albandar/publish-product', {
      method: 'POST',
      body: JSON.stringify({ productId, category, condition, locationDetails }),
    });
  }

  public async incrementListingView(id: string): Promise<{ success: boolean; viewsCount: number }> {
    return this.request(`/albandar/listings/${id}/view`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();

