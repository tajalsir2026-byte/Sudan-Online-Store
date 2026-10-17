export type TenantStatus = 'active' | 'suspended' | 'trial';

export interface TenantSettings {
  receiptHeader: string;
  receiptFooter: string;
  allowNegativeStock: boolean;
  defaultMaxDiscountPct: number;
  zatcaQrEnabled: boolean;
  taxNumber?: string;
  commercialRegNo?: string;
  bankakAccount?: string;
  bankakAccountName?: string;
  bankakPhone?: string;
  costingMethod: 'weighted_average' | 'fifo';
  // VAT / Sales Tax settings
  vatEnabled?: boolean;
  defaultVatPct?: number; // e.g. 15%
  taxIdentificationNumber?: string;
  pricesIncludeVat?: boolean; // true = tax inclusive, false = tax added at checkout
  showVatBreakdown?: boolean;
  showTaxPerItem?: boolean;
  loyaltyRateSdgPerPoint?: number; // e.g. 1000 SDG = 1 point
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  tradeName: string;
  logo?: string;
  taxNumber?: string;
  phone: string;
  city: string;
  address: string;
  currency: string; // Base currency: 'SDG'
  status: TenantStatus;
  subscriptionPlanId: string;
  subscriptionExpiresAt: string;
  settings: TenantSettings;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPriceSdg: number;
  maxBranches: number;
  maxEmployees: number;
  features: string[];
  isPopular?: boolean;
}

export type PaymentMethod = 'cash' | 'bankak' | 'fawry' | 'syberpay' | 'split';

export interface SubscriptionPayment {
  id: string;
  tenantId: string;
  planId: string;
  amountSdg: number;
  paymentMethod: 'bankak' | 'syberpay' | 'fawry';
  paymentRef: string;
  bankTransferSlipUrl?: string;
  status: 'pending_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewNote?: string;
  reviewedAt?: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  isMain: boolean;
  isActive: boolean;
  createdAt: string;
}

export type EmployeeRole =
  | 'owner'
  | 'branch_manager'
  | 'cashier'
  | 'inventory_officer'
  | 'accountant'
  | 'auditor'
  | 'super_admin';

export interface Employee {
  id: string;
  tenantId: string;
  branchId?: string; // If undefined or 'all', can access all branches
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  pin: string; // 4-digit PIN for cashier quick unlock
  permissions: string[];
  maxDiscountPct: number;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  unit: string; // e.g. 'حبة' | 'دستة' | 'كرتونة' | 'كجم' | 'لتر'
  purchaseCost: number;
  costCurrency: string; // e.g. 'SDG' | 'USD' | 'SAR'
  sellingPriceSdg: number;
  minStockAlert: number;
  minimumStock?: number; // alias for minStockAlert
  imageUrl?: string;
  isActive: boolean;
  isTaxExempt?: boolean; // Whether product is exempt from VAT
  customTaxRate?: number; // Custom VAT % override (if undefined, uses tenant default)
  createdAt: string;
}

export interface BranchInventory {
  id: string;
  tenantId: string;
  branchId: string;
  productId: string;
  quantity: number;
  minAlertQuantity: number;
  lastUpdated: string;
}

export type StockMovementType =
  | 'purchase_receive'
  | 'sale_deduction'
  | 'transfer_out'
  | 'transfer_in'
  | 'adjustment'
  | 'damage_expired'
  | 'return_refund';

export interface StockMovement {
  id: string;
  tenantId: string;
  branchId: string;
  productId: string;
  productName?: string;
  type: StockMovementType;
  quantityDelta: number; // can be positive or negative
  balanceAfter: number;
  costPerUnitSdg: number;
  totalValueSdg: number;
  referenceId?: string;
  actorName: string;
  reason: string;
  timestamp: string;
}

export type TransferStatus = 'requested' | 'dispatched' | 'received' | 'discrepancy_reported' | 'cancelled';

export interface TransferItem {
  productId: string;
  productName: string;
  requestedQty: number;
  dispatchedQty: number;
  receivedQty: number;
  notes?: string;
}

export interface BranchTransfer {
  id: string;
  tenantId: string;
  transferNumber: string;
  sourceBranchId: string;
  sourceBranchName: string;
  targetBranchId: string;
  targetBranchName: string;
  status: TransferStatus;
  items: TransferItem[];
  notes?: string;
  createdBy: string;
  dispatchedBy?: string;
  receivedBy?: string;
  createdAt: string;
  dispatchedAt?: string;
  receivedAt?: string;
}

export type ShiftStatus = 'open' | 'closed' | 'reviewed';

export interface CashierShift {
  id: string;
  tenantId: string;
  branchId: string;
  branchName: string;
  cashierId: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  openingCashSdg: number;
  expectedCashSdg: number;
  actualCashSdg?: number;
  differenceSdg?: number; // actual - expected
  totalSalesSdg: number;
  totalCashSalesSdg: number;
  totalBankakSalesSdg: number;
  totalCardSalesSdg: number;
  salesCount: number;
  refundsCount: number;
  refundsTotalSdg: number;
  status: ShiftStatus;
  closeNotes?: string;
  supervisorReviewedBy?: string;
  supervisorReviewNotes?: string;
  reviewedAt?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPriceSdg: number;
  discountSdg: number;
  totalSdg: number;
  costPerUnitSdg: number;
  notes?: string; // Quick order notes: 'بدون ثلج', 'تغليف هدايا', etc.
  isTaxExempt?: boolean;
  taxRate?: number;
  taxAmountSdg?: number;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  taxNumber?: string; // الرقم الضريبي للعميل (للشركات)
  loyaltyPoints: number; // نقاط الولاء التراكمية
  totalPurchasesSdg: number; // إجمالي قيمة المشتريات
  invoicesCount: number; // عدد الفواتير
  notes?: string;
  createdAt: string;
  lastPurchaseAt?: string;
}

export interface MultiCurrencyPayment {
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  exchangeRate: number; // 1 Foreign = exchangeRate SDG
  totalForeign: number;
  amountReceivedForeign?: number;
  changeForeign?: number;
  changeSdg?: number;
}

export interface Sale {
  id: string; // UUID (generated client-side for offline resilience or server-side)
  tenantId: string;
  branchId: string;
  branchName: string;
  shiftId: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotalSdg: number;
  discountTotalSdg: number;
  taxTotalSdg: number;
  grandTotalSdg: number;
  paymentMethod: PaymentMethod;
  splitDetails?: {
    cashAmountSdg: number;
    bankakAmountSdg: number;
    fawryAmountSdg: number;
    cardAmountSdg: number;
  };
  multiCurrency?: MultiCurrencyPayment;
  paymentReference?: string; // e.g. Bankak transaction reference
  status: 'completed' | 'refunded' | 'partially_refunded';
  refundedAmountSdg?: number;
  cashierId: string;
  cashierName: string;
  isOfflineCreated: boolean;
  offlineSyncedAt?: string;
  createdAt: string;
}

export interface ThermalReceiptSettings {
  storeName: string;
  storeSubtitle: string;
  phone: string;
  address: string;
  taxNumber: string;
  commercialRegister: string;
  logoUrl?: string;
  footerMessage: string;
  secondaryFooter: string;
  defaultTemplate: '80mm' | '58mm' | 'a4';
  showQrCode: boolean;
  showCashierName: boolean;
  showKitchenNotes: boolean;
  showCustomerInfo: boolean;
  // VAT receipt presentation
  vatEnabled?: boolean;
  defaultVatPct?: number;
  showVatBreakdown?: boolean;
  showTaxPerItem?: boolean;
  pricesIncludeVat?: boolean;
  showLoyaltyPoints?: boolean;
}

export interface PosPrinterSettings {
  printerType: 'browser' | 'bluetooth' | 'network';
  bluetoothDeviceName?: string;
  networkIp?: string;
  networkPort?: number;
  autoPrintOnSale: boolean;
  paperWidth: '80mm' | '58mm';
  printCopies: number;
}

export interface ReturnRecord {
  id: string;
  tenantId: string;
  saleId: string;
  invoiceNumber: string;
  branchId: string;
  cashierId: string;
  cashierName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    refundAmountSdg: number;
  }[];
  totalRefundSdg: number;
  creditNoteNumber?: string;
  reason: string;
  createdAt: string;
}

export interface CurrencyConfig {
  code: string; // 'SDG' | 'USD' | 'SAR' | 'AED' | 'EUR' | 'QAR'
  name: string;
  symbol: string;
  rateToSdg: number; // 1 Foreign = rateToSdg SDG
  isBase: boolean;
  isActive: boolean;
  lastUpdated: string;
}

export interface CurrencyRateHistory {
  id: string;
  tenantId: string;
  currencyCode: string;
  oldRate: number;
  newRate: number;
  updatedBy: string;
  timestamp: string;
}

export interface StorefrontOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'pickup' | 'delivery';
  pickupBranchId?: string;
  deliveryAddress?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPriceSdg: number;
    totalSdg: number;
  }[];
  totalSdg: number;
  status: 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid_bankak' | 'paid_on_delivery';
  bankakRef?: string;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  tenantId: string;
  branchId: string;
  branchName: string;
  category: 'رواتب' | 'إيجار' | 'كهرباء ومياه' | 'نقل وتفريغ' | 'صيانة' | 'إعاشة وضيافة' | 'أخرى';
  amountSdg: number;
  description: string;
  paidBy: string;
  receiptNumber?: string;
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  costInCurrency: number;
  currency: string;
  exchangeRate: number;
  costSdg: number;
}

export interface Purchase {
  id: string;
  tenantId: string;
  branchId: string;
  branchName: string;
  supplierName: string;
  invoiceNumber: string;
  currency: string;
  exchangeRate: number;
  items: PurchaseItem[];
  totalCostSdg: number;
  paymentStatus: 'paid' | 'partial' | 'credit';
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  actorId: string;
  actorName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export type AlbandarMainCategory =
  | 'cars'
  | 'real_estate'
  | 'electronics'
  | 'groceries'
  | 'livestock_crops'
  | 'furniture_home'
  | 'fashion'
  | 'services';

export interface AlbandarListing {
  id: string;
  title: string;
  description: string;
  category: AlbandarMainCategory;
  categoryNameAr: string;
  priceSdg: number;
  priceUsd?: number;
  city: string;
  state: string;
  condition: string;
  imageUrl: string;
  additionalImages?: string[];
  sellerName: string;
  sellerType: 'merchant' | 'individual' | 'showroom';
  sellerPhone: string;
  sellerWhatsapp: string;
  isVerifiedMerchant: boolean;
  tenantId?: string;
  branchId?: string;
  viewsCount: number;
  featured: boolean;
  createdAt: string;
  locationDetails?: string;
  bankakAccount?: string;
}

export interface AlbandarShowroom {
  id: string;
  name: string;
  tradeName: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  logo: string;
  bannerImage: string;
  verified: boolean;
  rating: number;
  listingsCount: number;
  bio: string;
  bankakAccount?: string;
  tenantSlug?: string;
}

