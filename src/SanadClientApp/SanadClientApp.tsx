import React, { useState, useEffect } from 'react';
import { ClientHeader } from './components/ClientHeader.tsx';
import { ClientHeroBanner } from './components/ClientHeroBanner.tsx';
import { ClientProductCatalog } from './components/ClientProductCatalog.tsx';
import { ClientCartDrawer } from './components/ClientCartDrawer.tsx';
import { ClientOrderTracker } from './components/ClientOrderTracker.tsx';
import { ClientWishlistView } from './components/ClientWishlistView.tsx';
import { ClientLoyaltyDashboard } from './components/ClientLoyaltyDashboard.tsx';
import { SanadLogo } from '../components/Common/SanadLogo.tsx';
import type {
  ClientCartItem,
  ClientActiveTab,
  WishlistItem,
  LoyaltyAccount,
  LoyaltyVoucher,
  ProductReview,
} from './types.ts';
import type { Product, Branch, Tenant, StorefrontOrder } from '../types/index.ts';
import { api } from '../lib/api.ts';
import {
  MapPin,
  Phone,
  Building,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  CreditCard,
  LayoutDashboard,
  ExternalLink,
  Heart,
  Gift,
} from 'lucide-react';

interface SanadClientAppProps {
  onSwitchToAdmin: () => void;
}

export const SanadClientApp: React.FC<SanadClientAppProps> = ({ onSwitchToAdmin }) => {
  const [activeTab, setActiveTab] = useState<ClientActiveTab>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);

  // Cart State
  const [cart, setCart] = useState<ClientCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sanad_client_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<LoyaltyVoucher | null>(null);

  // Wishlist State (Bookmark products)
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('sanad_client_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Initial sample wishlist for demonstration
    return [
      {
        productId: 'prod_sugar_50kg',
        addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        originalPriceSdg: 68000, // Higher than current to demo price drop!
      },
      {
        productId: 'prod_tea_ghazaltain',
        addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        originalPriceSdg: 26000,
      },
    ];
  });

  // Viewed Products State (for recommendations)
  const [viewedProductIds, setViewedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sanad_client_viewed');
      return saved ? JSON.parse(saved) : ['prod_sugar_50kg', 'prod_cooking_oil_4l'];
    } catch {
      return ['prod_sugar_50kg', 'prod_cooking_oil_4l'];
    }
  });

  // Loyalty Program Account State
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccount>(() => {
    try {
      const saved = localStorage.getItem('sanad_client_loyalty');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      customerName: 'محمد أحمد علي',
      customerPhone: '0912345678',
      currentPoints: 1450,
      lifetimePoints: 3200,
      tier: 'silver',
      history: [
        {
          id: 'h_1',
          type: 'earned',
          points: 350,
          description: 'نقاط مكتسبة من فاتورة طلب تمويني',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          referenceOrderNumber: 'ORD-2026-784',
        },
        {
          id: 'h_2',
          type: 'bonus',
          points: 500,
          description: 'مكافأة التسجيل والترحيب في سند',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'h_3',
          type: 'earned',
          points: 200,
          description: 'نقاط إضافية للدفع عبر بنكك',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      activeVouchers: [
        {
          id: 'vch_init_1',
          code: 'SANAD-LOYALTY-3K',
          title: 'قسيمة خصم 3,000 جنيه',
          description: 'خصم مباشر 3,000 SDG على أي طلب تتجاوز قيمته 20,000 SDG',
          pointsCost: 300,
          discountType: 'fixed_amount',
          discountValue: 3000,
          minOrderValueSdg: 20000,
          isRedeemed: true,
          redeemedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };
  });

  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  // Product Ratings and Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('sanad_product_reviews');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'rev_1',
        productId: 'prod_sugar_50kg',
        customerName: 'عثمان إبراهيم',
        rating: 5,
        comment: 'سكر كنانة الأبيض غني عن التعريف، نقي وممتاز للحلويات والتموين العائلي، والتوصيل وصل في أقل من 24 ساعة.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isVerifiedPurchase: true,
      },
      {
        id: 'rev_2',
        productId: 'prod_cooking_oil_4l',
        customerName: 'فاطمة بابكر',
        rating: 5,
        comment: 'زيت صباح أصلي وخفيف جداً، التغليف سليم بدون أي تسريب، والسعر هنا أرخص من السوق المفتوح.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isVerifiedPurchase: true,
      },
      {
        id: 'rev_3',
        productId: 'prod_sayga_flour_25kg',
        customerName: 'الشيف مهند البشير',
        rating: 5,
        comment: 'دقيق سيقا الفاخر رقم واحد في السودان للمخبوزات والفطائر، جودة متسقة وتاريخ إنتاج حديث جداً.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isVerifiedPurchase: true,
      },
      {
        id: 'rev_4',
        productId: 'prod_tea_ghazaltain',
        customerName: 'الصادق محمد أحمد',
        rating: 5,
        comment: 'شاي الغزالتين الأصلي الكيني، طعم مظبوط ولون رايق، استلمت الكرتونة من الفرع وكان التعامل راقي وسريع.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        isVerifiedPurchase: true,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sanad_product_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews:', e);
    }
  }, [reviews]);

  const handleAddReview = (newRevData: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const newRev: ProductReview = {
      id: `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...newRevData,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);

    // Award 20 loyalty points for submitting a review
    setLoyaltyAccount((prev) => ({
      ...prev,
      currentPoints: prev.currentPoints + 20,
      lifetimePoints: prev.lifetimePoints + 20,
      history: [
        {
          id: `h_${Date.now()}`,
          type: 'bonus',
          points: 20,
          description: `مكافأة نشر تقييم لمنتج في المتجر`,
          date: new Date().toISOString(),
        },
        ...prev.history,
      ],
    }));
  };

  const [isLoading, setIsLoading] = useState(true);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sanad_client_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to storage:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sanad_client_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist:', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('sanad_client_loyalty', JSON.stringify(loyaltyAccount));
    } catch (e) {
      console.warn('Failed to save loyalty account:', e);
    }
  }, [loyaltyAccount]);

  useEffect(() => {
    try {
      localStorage.setItem('sanad_client_viewed', JSON.stringify(viewedProductIds));
    } catch (e) {
      console.warn('Failed to save viewed products:', e);
    }
  }, [viewedProductIds]);

  // Load store data from API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, brRes, tRes] = await Promise.allSettled([
        api.getProducts(),
        api.getBranches(),
        api.getCurrentTenant(),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.products) {
        setProducts(prodRes.value.products);
      }
      if (brRes.status === 'fulfilled' && brRes.value.branches) {
        setBranches(brRes.value.branches);
        if (brRes.value.branches.length > 0 && !selectedBranch) {
          setSelectedBranch(brRes.value.branches[0]);
        }
      }
      if (tRes.status === 'fulfilled' && tRes.value.tenant) {
        setTenant(tRes.value.tenant);
      }
    } catch (err) {
      console.error('Failed to load client app data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, isPreOrder?: boolean) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        if (isPreOrder) next[existingIdx].isPreOrder = true;
        return next;
      }
      return [...prev, { product, quantity, isPreOrder }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.productId === product.id);
      if (exists) {
        return prev.filter((w) => w.productId !== product.id);
      }
      return [
        ...prev,
        {
          productId: product.id,
          addedAt: new Date().toISOString(),
          originalPriceSdg: product.sellingPriceSdg,
        },
      ];
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((w) => w.productId !== productId));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  const handleAddAllWishlistToCart = () => {
    wishlist.forEach((w) => {
      const prod = products.find((p) => p.id === w.productId);
      if (prod) {
        handleAddToCart(prod, 1, prod.isPreOrderAllowed || (prod.currentStock ?? 10) <= 0);
      }
    });
    setIsCartOpen(true);
  };

  // Tracking viewed products
  const handleProductViewed = (productId: string) => {
    setViewedProductIds((prev) => {
      const next = prev.filter((id) => id !== productId);
      next.unshift(productId);
      return next.slice(0, 15);
    });
  };

  // Loyalty operations
  const handleRedeemVoucher = (voucher: LoyaltyVoucher) => {
    setLoyaltyAccount((prev) => {
      const newPoints = Math.max(0, prev.currentPoints - voucher.pointsCost);
      const newHistoryItem = {
        id: `h_${Date.now()}`,
        type: 'redeemed' as const,
        points: -voucher.pointsCost,
        description: `استبدال ${voucher.pointsCost} نقطة مقابل: ${voucher.title}`,
        date: new Date().toISOString(),
      };

      return {
        ...prev,
        currentPoints: newPoints,
        activeVouchers: [voucher, ...prev.activeVouchers],
        history: [newHistoryItem, ...prev.history],
      };
    });
  };

  const handleApplyVoucherToCart = (voucher: LoyaltyVoucher | null) => {
    setAppliedVoucher(voucher);
    if (voucher) {
      setIsCartOpen(true);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.sellingPriceSdg * item.quantity,
    0
  );

  const handleOrderCompleted = (order: StorefrontOrder) => {
    setTrackingOrderNumber(order.orderNumber);
    // Award loyalty points for the order (e.g. 10 points per 1,000 SDG)
    const earnedPoints = Math.max(25, Math.floor(order.totalSdg / 1000) * 10);
    setLoyaltyAccount((prev) => ({
      ...prev,
      currentPoints: prev.currentPoints + earnedPoints,
      lifetimePoints: prev.lifetimePoints + earnedPoints,
      history: [
        {
          id: `h_${Date.now()}`,
          type: 'earned',
          points: earnedPoints,
          description: `نقاط مكتسبة من طلبك رقم ${order.orderNumber}`,
          date: new Date().toISOString(),
          referenceOrderNumber: order.orderNumber,
        },
        ...prev.history,
      ],
    }));

    // Switch to tracker tab
    setActiveTab('track_order');
  };

  const wishlistProductIds = wishlist.map((w) => w.productId);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans" dir="rtl">
      {/* Client Header */}
      <ClientHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        loyaltyPoints={loyaltyAccount.currentPoints}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        tenant={tenant}
        onSwitchToAdmin={onSwitchToAdmin}
        currency="SDG"
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tab 1: Product Catalog */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <ClientHeroBanner
              storeName={tenant?.tradeName || tenant?.name || 'سند للتجارة'}
              onExploreProducts={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExplorePreOrders={() => setActiveTab('pre_orders')}
              onTrackOrder={() => setActiveTab('track_order')}
            />

            <div id="catalog-section">
              <ClientProductCatalog
                products={products}
                branches={branches}
                selectedBranch={selectedBranch}
                searchQuery={searchQuery}
                onAddToCart={handleAddToCart}
                wishlistIds={wishlistProductIds}
                onToggleWishlist={handleToggleWishlist}
                viewedProductIds={viewedProductIds}
                onProductViewed={handleProductViewed}
                reviews={reviews}
                onAddReview={handleAddReview}
                currency="SDG"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Pre-Orders Only */}
        {activeTab === 'pre_orders' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 rounded-3xl p-6 md:p-8 shadow-lg">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>بوابة الحجز المسبق المعتمدة</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-950">
                  احجز شحنتك وبضاعتك قبل نفاد الكمية واستلمها بأولوية تامة
                </h2>
                <p className="text-xs md:text-sm font-medium text-slate-900 leading-relaxed">
                  تتيح لك منصة سند حجز السلع التموينية، الحبوب، الزيوت، والمعدات مع تثبيت سعر الشراء، والدفع بالكامل أو دفع عربون عبر بنكك، وضمان تخصيص الشحنة لك فور وصولها المستودعات.
                </p>
              </div>
            </div>

            <ClientProductCatalog
              products={products}
              branches={branches}
              selectedBranch={selectedBranch}
              searchQuery={searchQuery}
              onAddToCart={handleAddToCart}
              wishlistIds={wishlistProductIds}
              onToggleWishlist={handleToggleWishlist}
              viewedProductIds={viewedProductIds}
              onProductViewed={handleProductViewed}
              currency="SDG"
              forcePreOrderOnly={true}
            />
          </div>
        )}

        {/* Tab 3: Wishlist View (قائمة الرغبات) */}
        {activeTab === 'wishlist' && (
          <ClientWishlistView
            wishlist={wishlist}
            products={products}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onClearWishlist={handleClearWishlist}
            onAddToCart={handleAddToCart}
            onAddAllToCart={handleAddAllWishlistToCart}
            onExploreCatalog={() => setActiveTab('catalog')}
            currency="SDG"
          />
        )}

        {/* Tab 4: Loyalty Program Dashboard (لوحة الولاء والمكافآت) */}
        {activeTab === 'loyalty' && (
          <ClientLoyaltyDashboard
            loyaltyAccount={loyaltyAccount}
            onRedeemVoucher={handleRedeemVoucher}
            onApplyVoucherToCart={handleApplyVoucherToCart}
            activeAppliedVoucherId={appliedVoucher?.id}
            onExploreProducts={() => setActiveTab('catalog')}
            currency="SDG"
          />
        )}

        {/* Tab 5: Order Tracker */}
        {activeTab === 'track_order' && (
          <ClientOrderTracker
            branches={branches}
            initialOrderNumber={trackingOrderNumber}
            currency="SDG"
          />
        )}

        {/* Tab 6: Branches Information */}
        {activeTab === 'branches_info' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xs space-y-2">
              <h2 className="text-2xl font-black text-slate-900">شبكة فروعنا ومواقع الاستلام</h2>
              <p className="text-xs text-slate-500">
                يمكنك زيارة أي من فروعنا المنتشرة للاستلام المباشر أو الاستفسار أو الدفع نقداً.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{b.name}</h3>
                        <span className="text-[11px] text-slate-400 font-mono">{b.city}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      فرع معتمد
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b.address || 'وسط المدينة، السوق الكبير'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                      <a href={`tel:${b.phone}`} className="font-mono text-emerald-700 font-bold hover:underline">
                        {b.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>مواعيد العمل: يومياً من 8:00 صباحاً حتى 10:00 مساءً</span>
                    </div>
                  </div>

                  {b.phone && (
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `مرحباً بكم في ${b.name}، أرغب في الاستفسار عن توفر المنتجات.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors border border-emerald-200"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>محادثة واتساب مباشرة مع مدير الفرع</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <ClientCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        branches={branches}
        selectedBranch={selectedBranch}
        tenant={tenant}
        onOrderCompleted={handleOrderCompleted}
        appliedVoucher={appliedVoucher}
        onApplyVoucher={setAppliedVoucher}
        availableVouchers={loyaltyAccount.activeVouchers}
        currency="SDG"
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800 text-center md:text-right">
            <div className="flex items-center gap-3">
              <SanadLogo size="lg" theme="dark" variant="full" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
              <button onClick={() => setActiveTab('catalog')} className="hover:text-emerald-400">
                تصفح المنتجات
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('pre_orders')} className="hover:text-emerald-400">
                الطلبات المسبقة
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('wishlist')} className="hover:text-emerald-400">
                قائمة الرغبات ({wishlist.length})
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('loyalty')} className="hover:text-amber-400">
                نقاط الولاء ({loyaltyAccount.currentPoints})
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('track_order')} className="hover:text-emerald-400">
                تتبع الطلبات
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('branches_info')} className="hover:text-emerald-400">
                فروعنا
              </button>
              <span>•</span>
              <button
                onClick={onSwitchToAdmin}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>دخول الإدارة ونقاط البيع</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-right">
            <div>
              منصة سند للتجارة الذكية ونقاط البيع السحابية (Sanad POS & Commerce) © 2026. كافة الحقوق محفوظة.
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              بنية تحتية سحابية متقدمة · تدعم العمل دون اتصال وتعدد الفروع
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
