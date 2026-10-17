import fs from 'fs';
import path from 'path';
import type {
  Tenant,
  SubscriptionPlan,
  SubscriptionPayment,
  Branch,
  Employee,
  Product,
  BranchInventory,
  StockMovement,
  BranchTransfer,
  CashierShift,
  Sale,
  ReturnRecord,
  CurrencyConfig,
  CurrencyRateHistory,
  StorefrontOrder,
  Expense,
  Purchase,
  AuditLog,
  AlbandarListing,
  AlbandarShowroom,
  Customer,
} from '../types/index.ts';

export interface DatabaseSchema {
  tenants: Tenant[];
  subscriptionPlans: SubscriptionPlan[];
  subscriptionPayments: SubscriptionPayment[];
  branches: Branch[];
  employees: Employee[];
  products: Product[];
  branchInventories: BranchInventory[];
  stockMovements: StockMovement[];
  branchTransfers: BranchTransfer[];
  cashierShifts: CashierShift[];
  sales: Sale[];
  returns: ReturnRecord[];
  customers: Customer[];
  currencies: CurrencyConfig[];
  currencyRateHistory: CurrencyRateHistory[];
  storefrontOrders: StorefrontOrder[];
  expenses: Expense[];
  purchases: Purchase[];
  auditLogs: AuditLog[];
  albandarListings: AlbandarListing[];
  albandarShowrooms: AlbandarShowroom[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data for Sudanese market
const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_starter',
    name: 'باقة التاجر المبتدئ (Starter)',
    description: 'مثالية للمتاجر الصغيرة والدكاكين الفردية',
    monthlyPriceSdg: 75000,
    maxBranches: 1,
    maxEmployees: 3,
    features: ['فرع واحد فقط', 'حتى 3 موظفين', 'نقطة بيع POS تعمل دون إنترنت', 'إدارة المخزون والباركود', 'تقارير المبيعات اليومية'],
  },
  {
    id: 'plan_growth',
    name: 'باقة الأعمال والنمو (Growth)',
    description: 'الأنسب للشركات ومحلات التجزئة ذات الفروع المتعددة',
    monthlyPriceSdg: 180000,
    maxBranches: 4,
    maxEmployees: 15,
    features: [
      'حتى 4 فروع مستقلة',
      'حتى 15 موظفاً مع صلاحيات مخصصة',
      'تحويلات المخزون بين الفروع مع محاضر الاستلام',
      'متجر إلكتروني عام مع استقبال طلبات الزبائن',
      'تعدد العملات وتكلفة البضاعة بدقة',
      'ربط الدفع الإلكتروني وبنكك',
    ],
    isPopular: true,
  },
  {
    id: 'plan_enterprise',
    name: 'باقة الشركات والمؤسسات (Enterprise)',
    description: 'شاملة لكبرى المؤسسات وسلاسل السوبرماركت',
    monthlyPriceSdg: 350000,
    maxBranches: 20,
    maxEmployees: 100,
    features: [
      'فروع غير محدودة (حتى 20 فرعاً)',
      'موظفون غير محدودين',
      'تقارير محاسبية تفصيلية وقوائم الأرباح والخسائر',
      'إدارة الورديات وتدقيق العجز والفائض المتقدم',
      'دعم فني مخصص على مدار 24 ساعة',
      'نسخ احتياطي فوري وسحابي آمن',
    ],
  },
];

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant_alrowad',
    slug: 'alrowad-trade',
    name: 'شركة الرواد للتجارة والمحاصيل',
    tradeName: 'الرواد ماركت وتوزيع الجملة',
    phone: '+249 91 234 5678',
    city: 'الخرطوم',
    address: 'السوق العربي - عمارة الرواد - الخرطوم',
    currency: 'SDG',
    status: 'active',
    subscriptionPlanId: 'plan_growth',
    subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    settings: {
      receiptHeader: 'شركة الرواد للتجارة والمواد الاستهلاكية\nالخرطوم - هاتف: 0912345678',
      receiptFooter: 'شكراً لزيارتكم! البضاعة المباعة ترد وتستبدل خلال 3 أيام مع إبراز الفاتورة.\nرقم الشكاوى: 0123456789',
      allowNegativeStock: false,
      defaultMaxDiscountPct: 15,
      zatcaQrEnabled: true,
      taxNumber: '1004892348',
      commercialRegNo: 'SD-KHT-2021-998',
      bankakAccount: '2498765',
      bankakAccountName: 'شركة الرواد للتجارة',
      bankakPhone: '0912345678',
      costingMethod: 'weighted_average',
      vatEnabled: true,
      defaultVatPct: 15,
      taxIdentificationNumber: '1004892348',
      pricesIncludeVat: false,
      showVatBreakdown: true,
      showTaxPerItem: true,
      loyaltyRateSdgPerPoint: 1000,
    },
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tenant_nile_boutique',
    slug: 'nile-boutique',
    name: 'بوتيك النيل للملابس والأناقة',
    tradeName: 'النيل فاشون',
    phone: '+249 92 888 7777',
    city: 'بورتسودان',
    address: 'سوق ديم سواكن - شارع الميناء - بورتسودان',
    currency: 'SDG',
    status: 'active',
    subscriptionPlanId: 'plan_starter',
    subscriptionExpiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    settings: {
      receiptHeader: 'بوتيك النيل للملابس والأناقة\nبورتسودان - ترحاباً بكم',
      receiptFooter: 'شكراً لاختياركم بوتيك النيل! تابعوا تشكيلتنا على الإنستغرام',
      allowNegativeStock: false,
      defaultMaxDiscountPct: 10,
      zatcaQrEnabled: true,
      taxNumber: '2005991823',
      commercialRegNo: 'SD-PSD-2023-412',
      bankakAccount: '3109844',
      bankakAccountName: 'بوتيك النيل',
      bankakPhone: '0928887777',
      costingMethod: 'fifo',
      vatEnabled: true,
      defaultVatPct: 15,
      taxIdentificationNumber: '2005991823',
      pricesIncludeVat: false,
      showVatBreakdown: true,
      showTaxPerItem: true,
      loyaltyRateSdgPerPoint: 1000,
    },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch_kht_main',
    tenantId: 'tenant_alrowad',
    name: 'فرع الخرطوم الرئيسي (الرياض / المشتل)',
    code: 'KHT-01',
    city: 'الخرطوم',
    address: 'تقاطع شارع المشتل مع الجزار، الرياض',
    phone: '0912345678',
    isMain: true,
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'branch_madani',
    tenantId: 'tenant_alrowad',
    name: 'فرع ود مدني (السوق الكبير)',
    code: 'MDN-02',
    city: 'ود مدني',
    address: 'السوق الكبير - بالقرب من البنك الأهلي المصري',
    phone: '0912345679',
    isMain: false,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'branch_psd_main',
    tenantId: 'tenant_nile_boutique',
    name: 'فرع بورتسودan الرئيسي',
    code: 'PSD-01',
    city: 'بورتسودان',
    address: 'شارع السيد علي الميرغني، وسط البلد',
    phone: '0928887777',
    isMain: true,
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp_owner_rowad',
    tenantId: 'tenant_alrowad',
    name: 'أحمد الطيب الرواد',
    email: 'ahmed@alrowad.sd',
    phone: '0912000001',
    role: 'owner',
    pin: '1234',
    permissions: ['all'],
    maxDiscountPct: 50,
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'emp_mgr_kht',
    tenantId: 'tenant_alrowad',
    branchId: 'branch_kht_main',
    name: 'عثمان عبد الرحيم (مدير فرع الخرطوم)',
    email: 'osman@alrowad.sd',
    phone: '0912000002',
    role: 'branch_manager',
    pin: '4321',
    permissions: ['pos:view', 'pos:sell', 'inventory:view', 'inventory:transfer', 'shifts:review', 'reports:view'],
    maxDiscountPct: 20,
    isActive: true,
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'emp_cashier_kht',
    tenantId: 'tenant_alrowad',
    branchId: 'branch_kht_main',
    name: 'محمد عبد الله (كاشير - الخرطوم)',
    email: 'mohamed@alrowad.sd',
    phone: '0912000003',
    role: 'cashier',
    pin: '0000',
    permissions: ['pos:view', 'pos:sell', 'shifts:manage'],
    maxDiscountPct: 10,
    isActive: true,
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'emp_inventory_rowad',
    tenantId: 'tenant_alrowad',
    name: 'إبراهيم علي (مسؤول المخزن)',
    email: 'ibrahim@alrowad.sd',
    phone: '0912000004',
    role: 'inventory_officer',
    pin: '5555',
    permissions: ['inventory:view', 'inventory:edit', 'inventory:transfer', 'purchases:manage'],
    maxDiscountPct: 0,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'emp_accountant_rowad',
    tenantId: 'tenant_alrowad',
    name: 'سارة مصطفى (المحاسب المالي)',
    email: 'sara@alrowad.sd',
    phone: '0912000005',
    role: 'accountant',
    pin: '7777',
    permissions: ['reports:view', 'expenses:manage', 'purchases:view', 'accounting:view'],
    maxDiscountPct: 0,
    isActive: true,
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_sugar_kenana',
    tenantId: 'tenant_alrowad',
    name: 'سكر كنانة نقي فاخر 10 كجم',
    sku: 'SUG-KEN-10KG',
    barcode: '628100123001',
    category: 'المواد التموينية والأساسية',
    unit: 'كيس 10 كجم',
    purchaseCost: 26000,
    costCurrency: 'SDG',
    sellingPriceSdg: 31500,
    minStockAlert: 15,
    minimumStock: 15,
    imageUrl: '/src/assets/images/product_sugar_kenana_1792173270044.jpg',
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod_cooking_oil',
    tenantId: 'tenant_alrowad',
    name: 'زيت صباح نقي للطهي 4.5 لتر',
    sku: 'OIL-SBH-4.5L',
    barcode: '628100123002',
    category: 'الزيوت والسمن',
    unit: 'جركن 4.5 لتر',
    purchaseCost: 19500,
    costCurrency: 'SDG',
    sellingPriceSdg: 23800,
    minStockAlert: 10,
    minimumStock: 10,
    imageUrl: '/src/assets/images/product_cooking_oil_1792173269992.jpg',
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod_sayga_flour',
    tenantId: 'tenant_alrowad',
    name: 'دقيق سيقا مخصوص فاخر 1 كجم',
    sku: 'FLR-SYG-1KG',
    barcode: '628100123003',
    category: 'المواد التموينية والأساسية',
    unit: 'باكت 1 كجم',
    purchaseCost: 2100,
    costCurrency: 'SDG',
    sellingPriceSdg: 2650,
    minStockAlert: 30,
    minimumStock: 30,
    imageUrl: '/src/assets/images/product_sayga_flour_1792173271374.jpg',
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod_tea_ghazal',
    tenantId: 'tenant_alrowad',
    name: 'شاي الغزالتين سيلاني فاخر 400 جم',
    sku: 'TEA-GHZ-400G',
    barcode: '628100123004',
    category: 'المشروبات والشاي',
    unit: 'علبة 400 جم',
    purchaseCost: 5800,
    costCurrency: 'SDG',
    sellingPriceSdg: 7200,
    minStockAlert: 15,
    minimumStock: 15,
    imageUrl: '/src/assets/images/product_tea_box_1792173271153.jpg',
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod_kapo_milk',
    tenantId: 'tenant_alrowad',
    name: 'حليب كابو بودرة كامل الدسم 2.25 كجم',
    sku: 'MLK-KAPO-2.25K',
    barcode: '628100123005',
    category: 'الألبان ومشتقاتها',
    unit: 'علبة صفيح',
    purchaseCost: 32000,
    costCurrency: 'SDG',
    sellingPriceSdg: 37500,
    minStockAlert: 10,
    minimumStock: 10,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod_badr_soap',
    tenantId: 'tenant_alrowad',
    name: 'صابون غسيل البدر دستة (12 قطعة)',
    sku: 'SOP-BDR-12PC',
    barcode: '628100123006',
    category: 'المنظفات والعناية المنزلية',
    unit: 'دستة (12 قطعة)',
    purchaseCost: 6500,
    costCurrency: 'SDG',
    sellingPriceSdg: 8200,
    minStockAlert: 15,
    minimumStock: 15,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod_coffee_beans',
    tenantId: 'tenant_alrowad',
    name: 'بن حبشي هرري درجة أولى 1 كجم',
    sku: 'COF-ETH-1KG',
    barcode: '628100123007',
    category: 'المشروبات والشاي',
    unit: 'كجم',
    purchaseCost: 11000,
    costCurrency: 'SDG',
    sellingPriceSdg: 14500,
    minStockAlert: 12,
    minimumStock: 12,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod_rice_prince',
    tenantId: 'tenant_alrowad',
    name: 'أرز مصري البرنس كامولينو 5 كجم',
    sku: 'RCE-PRN-5KG',
    barcode: '628100123008',
    category: 'المواد التموينية والأساسية',
    unit: 'كيس 5 كجم',
    purchaseCost: 13500,
    costCurrency: 'SDG',
    sellingPriceSdg: 16800,
    minStockAlert: 20,
    minimumStock: 20,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_INVENTORIES: BranchInventory[] = [
  // Branch Khartoum Main
  { id: 'inv_1', tenantId: 'tenant_alrowad', branchId: 'branch_kht_main', productId: 'prod_sugar_kenana', quantity: 45, minAlertQuantity: 15, lastUpdated: new Date().toISOString() },
  { id: 'inv_2', tenantId: 'tenant_alrowad', branchId: 'branch_kht_main', productId: 'prod_cooking_oil', quantity: 28, minAlertQuantity: 10, lastUpdated: new Date().toISOString() },
  { id: 'inv_3', tenantId: 'tenant_alrowad', branchId: 'branch_kht_main', productId: 'prod_sayga_flour', quantity: 120, minAlertQuantity: 30, lastUpdated: new Date().toISOString() },
  { id: 'inv_4', tenantId: 'tenant_alrowad', branchId: 'branch_kht_main', productId: 'prod_tea_ghazal', quantity: 6, minAlertQuantity: 15, lastUpdated: new Date().toISOString() }, // Low stock: 6 <= 15
  { id: 'inv_5', tenantId: 'tenant_alrowad', branchId: 'branch_kht_main', productId: 'prod_kapo_milk', quantity: 18, minAlertQuantity: 10, lastUpdated: new Date().toISOString() },
  { id: 'inv_6', tenantId: 'tenant_alrowad', branchId: 'branch_kht_main', productId: 'prod_badr_soap', quantity: 50, minAlertQuantity: 15, lastUpdated: new Date().toISOString() },
  { id: 'inv_7', tenantId: 'tenant_alrowad', branchId: 'branch_kht_main', productId: 'prod_coffee_beans', quantity: 4, minAlertQuantity: 12, lastUpdated: new Date().toISOString() }, // Low stock: 4 <= 12
  { id: 'inv_8', tenantId: 'tenant_alrowad', branchId: 'branch_kht_main', productId: 'prod_rice_prince', quantity: 8, minAlertQuantity: 20, lastUpdated: new Date().toISOString() }, // Low stock: 8 <= 20

  // Branch Wad Madani
  { id: 'inv_9', tenantId: 'tenant_alrowad', branchId: 'branch_madani', productId: 'prod_sugar_kenana', quantity: 20, minAlertQuantity: 10, lastUpdated: new Date().toISOString() },
  { id: 'inv_10', tenantId: 'tenant_alrowad', branchId: 'branch_madani', productId: 'prod_cooking_oil', quantity: 14, minAlertQuantity: 8, lastUpdated: new Date().toISOString() },
  { id: 'inv_11', tenantId: 'tenant_alrowad', branchId: 'branch_madani', productId: 'prod_sayga_flour', quantity: 55, minAlertQuantity: 20, lastUpdated: new Date().toISOString() },
  { id: 'inv_12', tenantId: 'tenant_alrowad', branchId: 'branch_madani', productId: 'prod_tea_ghazal', quantity: 5, minAlertQuantity: 15, lastUpdated: new Date().toISOString() }, // Low stock: 5 <= 15
  { id: 'inv_13', tenantId: 'tenant_alrowad', branchId: 'branch_madani', productId: 'prod_kapo_milk', quantity: 3, minAlertQuantity: 10, lastUpdated: new Date().toISOString() }, // Low stock: 3 <= 10
  { id: 'inv_14', tenantId: 'tenant_alrowad', branchId: 'branch_madani', productId: 'prod_badr_soap', quantity: 25, minAlertQuantity: 10, lastUpdated: new Date().toISOString() },
  { id: 'inv_15', tenantId: 'tenant_alrowad', branchId: 'branch_madani', productId: 'prod_coffee_beans', quantity: 2, minAlertQuantity: 12, lastUpdated: new Date().toISOString() }, // Low stock: 2 <= 12
  { id: 'inv_16', tenantId: 'tenant_alrowad', branchId: 'branch_madani', productId: 'prod_rice_prince', quantity: 18, minAlertQuantity: 20, lastUpdated: new Date().toISOString() },
];

const INITIAL_CURRENCIES: CurrencyConfig[] = [
  { code: 'SDG', name: 'جنيه سوداني', symbol: 'ج.س', rateToSdg: 1, isBase: true, isActive: true, lastUpdated: new Date().toISOString() },
  { code: 'USD', name: 'دولار أمريكي', symbol: '$', rateToSdg: 2750, isBase: false, isActive: true, lastUpdated: new Date().toISOString() },
  { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س', rateToSdg: 733.33, isBase: false, isActive: true, lastUpdated: new Date().toISOString() },
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ', rateToSdg: 748.5, isBase: false, isActive: true, lastUpdated: new Date().toISOString() },
  { code: 'EUR', name: 'يورو أوروبي', symbol: '€', rateToSdg: 2980, isBase: false, isActive: true, lastUpdated: new Date().toISOString() },
  { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق', rateToSdg: 755, isBase: false, isActive: true, lastUpdated: new Date().toISOString() },
];

const INITIAL_SHIFTS: CashierShift[] = [
  {
    id: 'shift_kht_001',
    tenantId: 'tenant_alrowad',
    branchId: 'branch_kht_main',
    branchName: 'فرع الخرطوم الرئيسي (الرياض / المشتل)',
    cashierId: 'emp_cashier_kht',
    cashierName: 'محمد عبد الله (كاشير - الخرطوم)',
    openedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    openingCashSdg: 50000,
    expectedCashSdg: 144500,
    status: 'open',
    totalSalesSdg: 236000,
    totalCashSalesSdg: 94500,
    totalBankakSalesSdg: 121500,
    totalCardSalesSdg: 20000,
    salesCount: 6,
    refundsCount: 0,
    refundsTotalSdg: 0,
  },
];

const INITIAL_SALES: Sale[] = [
  {
    id: 'sale_demo_1',
    tenantId: 'tenant_alrowad',
    branchId: 'branch_kht_main',
    branchName: 'فرع الخرطوم الرئيسي',
    shiftId: 'shift_kht_001',
    invoiceNumber: 'INV-2026-00101',
    customerName: 'الأستاذ هاشم ميرغني',
    customerPhone: '0912111222',
    items: [
      {
        productId: 'prod_sugar_kenana',
        productName: 'سكر كنانة نقي فاخر 10 كجم',
        unit: 'كيس 10 كجم',
        quantity: 2,
        unitPriceSdg: 31500,
        discountSdg: 0,
        totalSdg: 63000,
        costPerUnitSdg: 26000,
      },
      {
        productId: 'prod_cooking_oil',
        productName: 'زيت صباح نقي للطهي 4.5 لتر',
        unit: 'جركن 4.5 لتر',
        quantity: 1,
        unitPriceSdg: 23800,
        discountSdg: 0,
        totalSdg: 23800,
        costPerUnitSdg: 19500,
      },
    ],
    subtotalSdg: 86800,
    discountTotalSdg: 0,
    taxTotalSdg: 0,
    grandTotalSdg: 86800,
    paymentMethod: 'bankak',
    paymentReference: 'BNK-TXN-8849201',
    status: 'completed',
    cashierId: 'emp_cashier_kht',
    cashierName: 'محمد عبد الله',
    isOfflineCreated: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sale_demo_2',
    tenantId: 'tenant_alrowad',
    branchId: 'branch_kht_main',
    branchName: 'فرع الخرطوم الرئيسي',
    shiftId: 'shift_kht_001',
    invoiceNumber: 'INV-2026-00102',
    customerName: 'عميل نقدي',
    items: [
      {
        productId: 'prod_tea_ghazal',
        productName: 'شاي الغزالتين سيلاني فاخر 400 جم',
        unit: 'علبة 400 جم',
        quantity: 3,
        unitPriceSdg: 7200,
        discountSdg: 600,
        totalSdg: 21000,
        costPerUnitSdg: 5800,
      },
      {
        productId: 'prod_sayga_flour',
        productName: 'دقيق سيقا مخصوص فاخر 1 كجم',
        unit: 'باكت 1 كجم',
        quantity: 5,
        unitPriceSdg: 2650,
        discountSdg: 0,
        totalSdg: 13250,
        costPerUnitSdg: 2100,
      },
    ],
    subtotalSdg: 34850,
    discountTotalSdg: 600,
    taxTotalSdg: 0,
    grandTotalSdg: 34250,
    paymentMethod: 'cash',
    status: 'completed',
    cashierId: 'emp_cashier_kht',
    cashierName: 'محمد عبد الله',
    isOfflineCreated: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_01',
    tenantId: 'tenant_alrowad',
    name: 'م. عبد العظيم الفاتح',
    phone: '0912389441',
    email: 'abdelazim.f@gmail.com',
    city: 'الخرطوم',
    address: 'الرياض - شارع المشتل',
    loyaltyPoints: 340,
    totalPurchasesSdg: 485000,
    invoicesCount: 6,
    notes: 'عميل دائم - يفضل التوصيل السريع للمنزل',
    createdAt: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
    lastPurchaseAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cust_02',
    tenantId: 'tenant_alrowad',
    name: 'د. فاطمة عثمان أحمد',
    phone: '0911223344',
    email: 'dr.fatima@hotmail.com',
    city: 'الخرطوم',
    address: 'المعمورة - مربع 69',
    loyaltyPoints: 185,
    totalPurchasesSdg: 230000,
    invoicesCount: 3,
    notes: 'طبيبة بالعيادات المجمعة - تسوق دوري للسلع المنزلية',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    lastPurchaseAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cust_03',
    tenantId: 'tenant_alrowad',
    name: 'شركة الأفق للاستشارات الهندسية',
    phone: '0123998877',
    email: 'procurement@alofuq.sd',
    city: 'الخرطوم',
    address: 'العمارات - شارع 15',
    taxNumber: '1008823194',
    loyaltyPoints: 850,
    totalPurchasesSdg: 1250000,
    invoicesCount: 12,
    notes: 'مشتريات مكتبية ومواد ضيافة بفواتير ضريبية معتمدة للشركة',
    createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
    lastPurchaseAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cust_04',
    tenantId: 'tenant_alrowad',
    name: 'الأستاذ هاشم ميرغني',
    phone: '0912111222',
    email: 'hashem.m@yahoo.com',
    city: 'الخرطوم',
    address: 'الصحافة شرق',
    loyaltyPoints: 120,
    totalPurchasesSdg: 165000,
    invoicesCount: 2,
    notes: 'عميل أستاذ جامعي',
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    lastPurchaseAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cust_05',
    tenantId: 'tenant_nile_boutique',
    name: 'سارة خالد البدوي',
    phone: '0912556677',
    email: 'sara.kh@gmail.com',
    city: 'بورتسودان',
    address: 'حي الشاطئ',
    loyaltyPoints: 95,
    totalPurchasesSdg: 140000,
    invoicesCount: 2,
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    lastPurchaseAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_TRANSFERS: BranchTransfer[] = [
  {
    id: 'trf_001',
    tenantId: 'tenant_alrowad',
    transferNumber: 'TRF-2026-001',
    sourceBranchId: 'branch_kht_main',
    sourceBranchName: 'فرع الخرطوم الرئيسي',
    targetBranchId: 'branch_madani',
    targetBranchName: 'فرع ود مدني',
    status: 'received',
    items: [
      { productId: 'prod_sugar_kenana', productName: 'سكر كنانة نقي فاخر 10 كجم', requestedQty: 10, dispatchedQty: 10, receivedQty: 10 },
      { productId: 'prod_cooking_oil', productName: 'زيت صباح نقي للطهي 4.5 لتر', requestedQty: 5, dispatchedQty: 5, receivedQty: 5 },
    ],
    notes: 'تعزيز مخزون فرع ود مدني لمواكبة الطلب الأسبوعي',
    createdBy: 'أحمد الطيب الرواد',
    dispatchedBy: 'إبراهيم علي',
    receivedBy: 'عبد القادر موسى',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dispatchedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_001',
    tenantId: 'tenant_alrowad',
    branchId: 'branch_kht_main',
    branchName: 'فرع الخرطوم الرئيسي',
    category: 'كهرباء ومياه',
    amountSdg: 45000,
    description: 'شراء كروت كهرباء تجارية للمحل والإنارة والثلاجات',
    paidBy: 'عثمان عبد الرحيم',
    receiptNumber: 'ELEC-2026-90',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exp_002',
    tenantId: 'tenant_alrowad',
    branchId: 'branch_kht_main',
    branchName: 'فرع الخرطوم الرئيسي',
    category: 'نقل وتفريغ',
    amountSdg: 30000,
    description: 'عتالة وتنزيل شحنة سكر وزيوت من المستودع المركزي',
    paidBy: 'إبراهيم علي',
    receiptNumber: 'LOG-771',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'purch_001',
    tenantId: 'tenant_alrowad',
    branchId: 'branch_kht_main',
    branchName: 'فرع الخرطوم الرئيسي',
    supplierName: 'شركة السكر السودانية المحدودة',
    invoiceNumber: 'SUP-SUG-8821',
    currency: 'SDG',
    exchangeRate: 1,
    items: [
      {
        productId: 'prod_sugar_kenana',
        productName: 'سكر كنانة نقي فاخر 10 كجم',
        quantity: 100,
        costInCurrency: 26000,
        currency: 'SDG',
        exchangeRate: 1,
        costSdg: 2600000,
      },
    ],
    totalCostSdg: 2600000,
    paymentStatus: 'paid',
    notes: 'شراء دفعة شهرية مباشرة من المورد',
    createdBy: 'أحمد الطيب الرواد',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'purch_002',
    tenantId: 'tenant_alrowad',
    branchId: 'branch_kht_main',
    branchName: 'فرع الخرطوم الرئيسي',
    supplierName: 'مؤسسة الشاي العالمية (دبي)',
    invoiceNumber: 'IMP-TEA-2026',
    currency: 'AED',
    exchangeRate: 748.5,
    items: [
      {
        productId: 'prod_tea_ghazal',
        productName: 'شاي الغزالتين سيلاني فاخر 400 جم',
        quantity: 100,
        costInCurrency: 7.75, // 7.75 AED * 748.5 = ~5800 SDG
        currency: 'AED',
        exchangeRate: 748.5,
        costSdg: 580087.5,
      },
    ],
    totalCostSdg: 580087.5,
    paymentStatus: 'paid',
    notes: 'استيراد بالدرهم الإماراتي مع قيد سعر الصرف التاريخي الفعلي',
    createdBy: 'أحمد الطيب الرواد',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_STORE_ORDERS: StorefrontOrder[] = [
  {
    id: 'ord_101',
    tenantId: 'tenant_alrowad',
    orderNumber: 'ORD-2026-901',
    customerName: 'فاطمة عبد المنعم',
    customerPhone: '0912445566',
    deliveryMethod: 'delivery',
    deliveryAddress: 'حي الصفا، الخرطوم - قرب مسجد النور',
    items: [
      { productId: 'prod_cooking_oil', productName: 'زيت صباح نقي للطهي 4.5 لتر', quantity: 1, unitPriceSdg: 23800, totalSdg: 23800 },
      { productId: 'prod_sugar_kenana', productName: 'سكر كنانة نقي فاخر 10 كجم', quantity: 1, unitPriceSdg: 31500, totalSdg: 31500 },
    ],
    totalSdg: 55300,
    status: 'new',
    paymentStatus: 'paid_bankak',
    bankakRef: 'BNK-APP-998231',
    notes: 'يرجى الاتصال قبل الوصول للتسليم',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
];

const INITIAL_PAYMENTS: SubscriptionPayment[] = [
  {
    id: 'pay_sub_01',
    tenantId: 'tenant_alrowad',
    planId: 'plan_growth',
    amountSdg: 180000,
    paymentMethod: 'bankak',
    paymentRef: 'BNK-TXN-1099238',
    bankTransferSlipUrl: '/src/assets/images/sanad_pos_hero_1792173270140.jpg',
    status: 'approved',
    submittedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: 'إدارة منصة سند المركزية',
    reviewNote: 'تم التحقق من مطابقة الحساب والإيداع وتفعيل الاشتراك لمدة شهر إضافي',
    reviewedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pay_sub_02',
    tenantId: 'tenant_nile_boutique',
    planId: 'plan_starter',
    amountSdg: 75000,
    paymentMethod: 'bankak',
    paymentRef: 'BNK-TXN-2049182',
    status: 'pending_review',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    tenantId: 'tenant_alrowad',
    actorId: 'emp_owner_rowad',
    actorName: 'أحمد الطيب الرواد',
    action: 'DISPATCH_TRANSFER',
    entity: 'BranchTransfer',
    entityId: 'trf_001',
    details: 'إرسال شحنة بضاعة من فرع الخرطوم إلى فرع ود مدني بعد المعاينة',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'aud_2',
    tenantId: 'tenant_alrowad',
    actorId: 'emp_cashier_kht',
    actorName: 'محمد عبد الله',
    action: 'OPEN_SHIFT',
    entity: 'CashierShift',
    entityId: 'shift_kht_001',
    details: 'افتتاح وردية الصباح برصيد نقدي أولي قدره 50,000 ج.س',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_ALBANDAR_SHOWROOMS: AlbandarShowroom[] = [
  {
    id: 'shw_albandar_motors',
    name: 'معرض البندر الدولي للسيارات والمعدات',
    tradeName: 'البندر موتورز - بورتسودان',
    category: 'سيارات ومركبات',
    city: 'بورتسودان',
    address: 'شارع ديم سواكن - بجوار الميناء الجنوبي',
    phone: '+249912300456',
    whatsapp: '+249912300456',
    logo: '/src/assets/images/albander_hyundai_car_1792184093653.jpg',
    bannerImage: '/src/assets/images/albander_pickup_truck_1792184123630.jpg',
    verified: true,
    rating: 4.9,
    listingsCount: 28,
    bio: 'معرض معتمد لبيع وشراء كافة أنواع السيارات، البكاسي، الركشات والشاحنات وارد الخليج والوكيل.',
    bankakAccount: '2847591',
  },
  {
    id: 'shw_alrowad',
    name: 'مؤسسة الرواد التجارية والاستيراد',
    tradeName: 'الرواد للمواد التموينية والجملة',
    category: 'سلع ومواد تموينية',
    city: 'عطبرة',
    address: 'السوق الكبير - مجمع الرواد التجاري',
    phone: '+249912345678',
    whatsapp: '+249912345678',
    logo: '/src/assets/images/product_sugar_kenana_1792173270044.jpg',
    bannerImage: '/src/assets/images/sanad_pos_hero_1792173270140.jpg',
    verified: true,
    rating: 4.8,
    listingsCount: 45,
    bio: 'وكلاء كبرى الشركات الغذائية (كنانة، صباح، سيقا، الغزالتين) - بيع جملة وتجزئة لكافة ولايات السودان.',
    bankakAccount: '1982736',
    tenantSlug: 'alrowad-co',
  },
  {
    id: 'shw_neelain_tech',
    name: 'مركز النيلين للتقنية والطاقة الشمسية',
    tradeName: 'النيلين إلكترونكس',
    category: 'هواتف وإلكترونيات',
    city: 'كسلا',
    address: 'السوق الشعبي - شارع المدارس',
    phone: '+249900112233',
    whatsapp: '+249900112233',
    logo: '/src/assets/images/albander_macbook_laptop_1792184108039.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    rating: 4.9,
    listingsCount: 34,
    bio: 'أحدث الهواتف الذكية، أجهزة الكمبيوتر، ومنظومات الطاقة الشمسية الهجينة والبطاريات عالية الكفاءة.',
    bankakAccount: '3109482',
  },
  {
    id: 'shw_gedaref_crops',
    name: 'وكالة القضارف للمحاصيل والثروة الحيوانية',
    tradeName: 'بورصة محاصيل الفشقة',
    category: 'محاصيل وثروة حيوانية',
    city: 'القضارف',
    address: 'بورصة أسواق المحاصيل - القضارف',
    phone: '+249915556677',
    whatsapp: '+249915556677',
    logo: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    rating: 4.7,
    listingsCount: 19,
    bio: 'توريد وتصدير السمسم الأبيض والأحمر، الصمغ العربي، الفول السوداني والمواشي الحية بأسعار البورصة.',
    bankakAccount: '4452109',
  },
];

const INITIAL_ALBANDAR_LISTINGS: AlbandarListing[] = [
  {
    id: 'alb_car_01',
    title: 'هيونداي أفانتي HD موديل 2018 خالية من الملاحظات وارد الخليج',
    description: 'عربية شاذة وكرت، ترخيص بورتسودان جمرك كامل، مكيف ثلاجة، قير أوتوماتيك، شاشة وكاميرا، كفرات جديدة مع بطارية زيرو، السعر قابل للتفاوض البسيط بعد المعاينة.',
    category: 'cars',
    categoryNameAr: 'سيارات ومركبات',
    priceSdg: 18500000,
    priceUsd: 6850,
    city: 'بورتسودان',
    state: 'البحر الأحمر',
    condition: 'مستعمل بحالة ممتازة',
    imageUrl: '/src/assets/images/albander_hyundai_car_1792184093653.jpg',
    sellerName: 'معرض البندر للسيارات',
    sellerType: 'showroom',
    sellerPhone: '+249912300456',
    sellerWhatsapp: '+249912300456',
    isVerifiedMerchant: true,
    viewsCount: 1420,
    featured: true,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    locationDetails: 'حي المطار - شارع ديم سواكن الرئيسي',
    bankakAccount: '2847591',
  },
  {
    id: 'alb_car_02',
    title: 'تويوتا هايلوكس دبل كابينة موديل 2022 GLX ديزل أصلية',
    description: 'بوكس دبل كاب ما شاء الله صلاة النبي، دفع رباعي 4x4، مكنة كبيرة ديزل تيربو، استهلاك وقود ممتاز، مفحوصة ومجمركة بالكامل في القضارف جاهزة للتحويل.',
    category: 'cars',
    categoryNameAr: 'سيارات ومركبات',
    priceSdg: 52000000,
    priceUsd: 19250,
    city: 'القضارف',
    state: 'القضارف',
    condition: 'وارد دبي',
    imageUrl: '/src/assets/images/albander_pickup_truck_1792184123630.jpg',
    sellerName: 'شركة القضارف للتجارة والآليات',
    sellerType: 'merchant',
    sellerPhone: '+249123456789',
    sellerWhatsapp: '+249123456789',
    isVerifiedMerchant: true,
    viewsCount: 980,
    featured: true,
    createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    locationDetails: 'المنطقة الصناعية - القضارف',
    bankakAccount: '1982736',
  },
  {
    id: 'alb_elec_01',
    title: 'أبل ماك بوك برو M3 Pro سعة 512 جيجابايت كرتونة زيرو',
    description: 'Apple MacBook Pro M3 Pro Chip, 18GB Unified Memory, 512GB SSD, Retina XDR Display. جهاز جديد لم يُفتح وارد الوكيل، ضمان سنة كاملة، بطارية تدوم حتى 22 ساعة.',
    category: 'electronics',
    categoryNameAr: 'هواتف وإلكترونيات',
    priceSdg: 4200000,
    priceUsd: 1550,
    city: 'عطبرة',
    state: 'نهر النيل',
    condition: 'جديد بالكرتونة',
    imageUrl: '/src/assets/images/albander_macbook_laptop_1792184108039.jpg',
    sellerName: 'متجر النيلين للتقنية والأجهزة',
    sellerType: 'showroom',
    sellerPhone: '+249900112233',
    sellerWhatsapp: '+249900112233',
    isVerifiedMerchant: true,
    viewsCount: 760,
    featured: true,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    locationDetails: 'السوق الكبير - عمارة السلام',
    bankakAccount: '3109482',
  },
  {
    id: 'alb_prop_01',
    title: 'شقة مفروشة راقية VIP للإيجار الشهري واليومي حي المطار',
    description: 'شقة سوبر ديلوكس 3 غرف وصالة وهول كبير، 2 حمام، مطبخ مجهز بكافة الأجهزة الكهربائية، مكيفات سبليت في كل الغرف، مولد كهربائي أوتوماتيكي ومياه متوفرة 24 ساعة، حراسة ومصعد.',
    category: 'real_estate',
    categoryNameAr: 'عقارات وأراضي',
    priceSdg: 950000,
    priceUsd: 350,
    city: 'بورتسودان',
    state: 'البحر الأحمر',
    condition: 'مفروشة بالكامل',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    sellerName: 'الدار للخدمات العقارية',
    sellerType: 'merchant',
    sellerPhone: '+249911223344',
    sellerWhatsapp: '+249911223344',
    isVerifiedMerchant: true,
    viewsCount: 2310,
    featured: true,
    createdAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    locationDetails: 'بورتسودان - حي المطار جوار صالة كبار الزوار',
  },
  {
    id: 'alb_crops_01',
    title: 'سمسم القضارف الأبيض درجة أولى للتصدير (جوال 100 كجم)',
    description: 'سمسم أبيض نخب أول غربلة وتعبئة حديثة، مواصفات قياسية للتصدير والمعاصر، خالي من الشوائب بنسبة 99.5%، متوفر كميات كبيرة من المخزن مباشرة للتسليم.',
    category: 'livestock_crops',
    categoryNameAr: 'محاصيل وثروة حيوانية',
    priceSdg: 185000,
    priceUsd: 68,
    city: 'القضارف',
    state: 'القضارف',
    condition: 'إنتاج محلي نخب أول',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    sellerName: 'وكالة محاصيل الفشقة',
    sellerType: 'merchant',
    sellerPhone: '+249915556677',
    sellerWhatsapp: '+249915556677',
    isVerifiedMerchant: true,
    viewsCount: 890,
    featured: false,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    locationDetails: 'مخازن المنطقة الصناعية بالقضارف',
  },
  {
    id: 'alb_groc_01',
    title: 'سكر كنانة نقي فاخر عبوة 10 كجم و50 كجم جملة للمتاجر',
    description: 'سكر كنانة نقي أبيض بلورات فاخرة، الكميات متوفرة في كافة فروعنا مع إمكانية التوصيل والشحن لكافة مدن ولاية البحر الأحمر ونهر النيل، دفع عبر بنكك مباشرة.',
    category: 'groceries',
    categoryNameAr: 'سلع ومواد تموينية',
    priceSdg: 31500,
    priceUsd: 12,
    city: 'عطبرة',
    state: 'نهر النيل',
    condition: 'جديد إنتاج كنانة',
    imageUrl: '/src/assets/images/product_sugar_kenana_1792173270044.jpg',
    sellerName: 'مؤسسة الرواد التجارية (المتجر المعتمد)',
    sellerType: 'merchant',
    sellerPhone: '+249912345678',
    sellerWhatsapp: '+249912345678',
    isVerifiedMerchant: true,
    viewsCount: 3120,
    featured: true,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    locationDetails: 'سوق عطبرة الكبير - مجمع الرواد',
    bankakAccount: '1982736',
  },
  {
    id: 'alb_elec_02',
    title: 'سامسونج جالكسي S24 ألترا 512 جيجابايت تيتانيوم كرتونة',
    description: 'Samsung Galaxy S24 Ultra 512GB Titanium Grey, شريحتين Nano-SIM + eSIM، قلم S-Pen مدمج، يدعم الذكاء الاصطناعي Galaxy AI بالكامل، ملحقات أصلية كاملة.',
    category: 'electronics',
    categoryNameAr: 'هواتف وإلكترونيات',
    priceSdg: 2950000,
    priceUsd: 1090,
    city: 'كسلا',
    state: 'كسلا',
    condition: 'جديد كرتونة',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    sellerName: 'البرنس للموبايل والإلكترونيات',
    sellerType: 'individual',
    sellerPhone: '+249918765432',
    sellerWhatsapp: '+249918765432',
    isVerifiedMerchant: false,
    viewsCount: 1140,
    featured: false,
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    locationDetails: 'كسلا - السوق الشعبي',
  },
  {
    id: 'alb_prop_02',
    title: 'منزل لودبيرنق مسلح تشطيب سوبر ديلوكس حي النهضة',
    description: 'مساحة 400 متر مربع، مبني لودبيرنق يركب طابقين إضافية، 4 غرف، صالون كبير، 3 حمامات، حوش واسع سيراميك، جاهز للسكن الفوري، شهادة بحث ملك حر.',
    category: 'real_estate',
    categoryNameAr: 'عقارات وأراضي',
    priceSdg: 48000000,
    priceUsd: 17800,
    city: 'عطبرة',
    state: 'نهر النيل',
    condition: 'جديد',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    sellerName: 'مكتب الوفاق العقاري',
    sellerType: 'merchant',
    sellerPhone: '+249922334455',
    sellerWhatsapp: '+249922334455',
    isVerifiedMerchant: true,
    viewsCount: 1890,
    featured: false,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    locationDetails: 'عطبرة - حي النهضة مربع 4',
  },
  {
    id: 'alb_fash_01',
    title: 'ثياب سودانية توتال سويسري حرير كريب مع تطريز شك يدوي',
    description: 'أرقى تشكيلة ثياب مناسبات وأعراس، قماش توتال سويسري أصلي بارد وثابت، تطريز حرير وشك خرز يدوي فاخر، ألوان زاهية وكميات حصرية للأناقة السودانية.',
    category: 'fashion',
    categoryNameAr: 'أزياء وموضة',
    priceSdg: 450000,
    priceUsd: 165,
    city: 'بورتسودان',
    state: 'البحر الأحمر',
    condition: 'جديد أصلي',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    sellerName: 'بوتيك النيلين للأزياء الراقية',
    sellerType: 'merchant',
    sellerPhone: '+249912987654',
    sellerWhatsapp: '+249912987654',
    isVerifiedMerchant: true,
    viewsCount: 650,
    featured: false,
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    locationDetails: 'بورتسودان - شارع البلدية',
  },
  {
    id: 'alb_serv_01',
    title: 'خدمات تخليص جمركي وترحيل بضائع ميناء بورتسودان',
    description: 'تخليص ومناولة كافة الحاويات والبضائع بالميناء الجنوبي والشمالي، سرعة في الإجراءات الجمركية، تأمين أساطيل شاحنات للنقل والتوزيع لكافة الولايات.',
    category: 'services',
    categoryNameAr: 'خدمات وأعمال',
    priceSdg: 120000,
    priceUsd: 45,
    city: 'بورتسودان',
    state: 'البحر الأحمر',
    condition: 'خدمة معتمدة',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    sellerName: 'مكتب البندر للخدمات اللوجستية والتخليص',
    sellerType: 'showroom',
    sellerPhone: '+249911998877',
    sellerWhatsapp: '+249911998877',
    isVerifiedMerchant: true,
    viewsCount: 1350,
    featured: true,
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    locationDetails: 'بورتسودان - قرب رئاسة هيئة الموانئ البحرية',
  },
];

class Database {
  private data: DatabaseSchema;
  private isPersisted: boolean = false;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.albandarListings || parsed.albandarListings.length === 0) {
          parsed.albandarListings = INITIAL_ALBANDAR_LISTINGS;
        }
        if (!parsed.albandarShowrooms || parsed.albandarShowrooms.length === 0) {
          parsed.albandarShowrooms = INITIAL_ALBANDAR_SHOWROOMS;
        }
        if (!parsed.customers || parsed.customers.length === 0) {
          parsed.customers = INITIAL_CUSTOMERS;
        }
        // Ensure tenants have default VAT configuration
        if (Array.isArray(parsed.tenants)) {
          for (const t of parsed.tenants) {
            if (!t.settings) t.settings = {} as any;
            if (t.settings.vatEnabled === undefined) {
              t.settings.vatEnabled = true;
              t.settings.defaultVatPct = 15;
              t.settings.taxIdentificationNumber = t.settings.taxNumber || '1004892348';
              t.settings.pricesIncludeVat = false;
              t.settings.showVatBreakdown = true;
              t.settings.showTaxPerItem = true;
              t.settings.loyaltyRateSdgPerPoint = 1000;
            }
          }
        }
        this.isPersisted = true;
        return parsed;
      }
    } catch (err) {
      console.warn('[DB] Failed to load from file, using seeded defaults:', err);
    }

    const initialData: DatabaseSchema = {
      tenants: INITIAL_TENANTS,
      subscriptionPlans: INITIAL_PLANS,
      subscriptionPayments: INITIAL_PAYMENTS,
      branches: INITIAL_BRANCHES,
      employees: INITIAL_EMPLOYEES,
      products: INITIAL_PRODUCTS,
      branchInventories: INITIAL_INVENTORIES,
      stockMovements: [],
      branchTransfers: INITIAL_TRANSFERS,
      cashierShifts: INITIAL_SHIFTS,
      sales: INITIAL_SALES,
      returns: [],
      customers: INITIAL_CUSTOMERS,
      currencies: INITIAL_CURRENCIES,
      currencyRateHistory: [],
      storefrontOrders: INITIAL_STORE_ORDERS,
      expenses: INITIAL_EXPENSES,
      purchases: INITIAL_PURCHASES,
      auditLogs: INITIAL_AUDIT_LOGS,
      albandarListings: INITIAL_ALBANDAR_LISTINGS,
      albandarShowrooms: INITIAL_ALBANDAR_SHOWROOMS,
    };

    this.save(initialData);
    return initialData;
  }

  private save(data?: DatabaseSchema) {
    const toSave = data || this.data;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
      this.isPersisted = true;
    } catch (err) {
      console.warn('[DB] Could not write to disk, holding in memory:', err);
    }
  }

  // Get raw schema (safe reference copy)
  public getSchema(): DatabaseSchema {
    return this.data;
  }

  public commit() {
    this.save();
  }

  // Tenant helper
  public getTenant(tenantId: string): Tenant | undefined {
    return this.data.tenants.find((t) => t.id === tenantId);
  }

  public getTenantBySlug(slug: string): Tenant | undefined {
    return this.data.tenants.find((t) => t.slug === slug);
  }

  // Branch helper
  public getBranches(tenantId: string): Branch[] {
    return this.data.branches.filter((b) => b.tenantId === tenantId);
  }

  // Products helper
  public getProducts(tenantId: string): Product[] {
    return this.data.products.filter((p) => p.tenantId === tenantId);
  }

  // Inventory helper
  public getInventory(tenantId: string, branchId?: string): (BranchInventory & { product?: Product; branch?: Branch })[] {
    return this.data.branchInventories
      .filter((inv) => inv.tenantId === tenantId && (!branchId || inv.branchId === branchId))
      .map((inv) => {
        const product = this.data.products.find((p) => p.id === inv.productId);
        const branch = this.data.branches.find((b) => b.id === inv.branchId);
        return {
          ...inv,
          product,
          branch,
        };
      });
  }

  // Get stock for a specific branch and product
  public getProductStock(tenantId: string, branchId: string, productId: string): number {
    const inv = this.data.branchInventories.find(
      (i) => i.tenantId === tenantId && i.branchId === branchId && i.productId === productId
    );
    return inv ? inv.quantity : 0;
  }

  // Adjust stock atomically with reason and movement logging
  public adjustStock(params: {
    tenantId: string;
    branchId: string;
    productId: string;
    delta: number;
    type: StockMovement['type'];
    reason: string;
    actorName: string;
    referenceId?: string;
  }): { success: boolean; newBalance: number; error?: string } {
    let inv = this.data.branchInventories.find(
      (i) => i.tenantId === params.tenantId && i.branchId === params.branchId && i.productId === params.productId
    );

    const product = this.data.products.find((p) => p.id === params.productId && p.tenantId === params.tenantId);
    const tenant = this.getTenant(params.tenantId);

    const currentQty = inv ? inv.quantity : 0;
    const newQty = currentQty + params.delta;

    // Disallow negative stock if merchant policy enforces strict no negative stock
    if (newQty < 0 && (!tenant || !tenant.settings.allowNegativeStock)) {
      return {
        success: false,
        newBalance: currentQty,
        error: `الرصيد المتاح غير كافٍ (${currentQty}) ولا يمكن خصم الكمية المطلوبة دون رصيد سالب.`,
      };
    }

    if (!inv) {
      inv = {
        id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        tenantId: params.tenantId,
        branchId: params.branchId,
        productId: params.productId,
        quantity: newQty,
        minAlertQuantity: product ? product.minStockAlert : 5,
        lastUpdated: new Date().toISOString(),
      };
      this.data.branchInventories.push(inv);
    } else {
      inv.quantity = newQty;
      inv.lastUpdated = new Date().toISOString();
    }

    // Record movement
    const movement: StockMovement = {
      id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: params.tenantId,
      branchId: params.branchId,
      productId: params.productId,
      productName: product?.name || 'غير معروف',
      type: params.type,
      quantityDelta: params.delta,
      balanceAfter: newQty,
      costPerUnitSdg: product?.purchaseCost || 0,
      totalValueSdg: Math.abs(params.delta) * (product?.purchaseCost || 0),
      referenceId: params.referenceId,
      actorName: params.actorName,
      reason: params.reason,
      timestamp: new Date().toISOString(),
    };
    this.data.stockMovements.unshift(movement);

    this.commit();
    return { success: true, newBalance: newQty };
  }

  // Audit logging helper
  public logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    const log: AuditLog = {
      ...entry,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    this.commit();
    return log;
  }

  // Albandar Marketplace Helpers
  public getAlbandarListings(): AlbandarListing[] {
    return this.data.albandarListings || [];
  }

  public addAlbandarListing(listing: AlbandarListing): AlbandarListing {
    if (!this.data.albandarListings) {
      this.data.albandarListings = [];
    }
    this.data.albandarListings.unshift(listing);
    this.commit();
    return listing;
  }

  public getAlbandarShowrooms(): AlbandarShowroom[] {
    return this.data.albandarShowrooms || [];
  }

  // Customer Management & Loyalty Points
  public getCustomers(tenantId: string, search?: string): Customer[] {
    let list = (this.data.customers || []).filter((c) => c.tenantId === tenantId);
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.taxNumber && c.taxNumber.includes(q))
      );
    }
    return list;
  }

  public getCustomer(tenantId: string, id: string): Customer | undefined {
    return (this.data.customers || []).find((c) => c.id === id && c.tenantId === tenantId);
  }

  public addCustomer(customer: Customer): Customer {
    if (!this.data.customers) this.data.customers = [];
    this.data.customers.unshift(customer);
    this.commit();
    return customer;
  }

  public updateCustomer(tenantId: string, id: string, updates: Partial<Customer>): Customer | null {
    if (!this.data.customers) this.data.customers = [];
    const idx = this.data.customers.findIndex((c) => c.id === id && c.tenantId === tenantId);
    if (idx === -1) return null;
    this.data.customers[idx] = { ...this.data.customers[idx], ...updates };
    this.commit();
    return this.data.customers[idx];
  }

  public recordCustomerSale(tenantId: string, customerId: string, saleGrandTotalSdg: number) {
    if (!this.data.customers) this.data.customers = [];
    const cust = this.data.customers.find((c) => c.id === customerId && c.tenantId === tenantId);
    if (cust) {
      const tenant = this.getTenant(tenantId);
      const rate = tenant?.settings?.loyaltyRateSdgPerPoint || 1000;
      const earnedPoints = Math.max(1, Math.floor(saleGrandTotalSdg / rate));
      cust.loyaltyPoints = (cust.loyaltyPoints || 0) + earnedPoints;
      cust.totalPurchasesSdg = (cust.totalPurchasesSdg || 0) + saleGrandTotalSdg;
      cust.invoicesCount = (cust.invoicesCount || 0) + 1;
      cust.lastPurchaseAt = new Date().toISOString();
      this.commit();
      return { cust, earnedPoints };
    }
    return null;
  }
}

export const db = new Database();

