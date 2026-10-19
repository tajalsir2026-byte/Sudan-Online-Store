import type { Product, Branch, Tenant } from "../types/index.ts";

export interface ClientCartItem {
  product: Product;
  quantity: number;
  isPreOrder?: boolean;
}

export type ClientActiveTab =
  | "catalog"
  | "pre_orders"
  | "wishlist"
  | "loyalty"
  | "track_order"
  | "branches_info";

export interface WishlistItem {
  productId: string;
  addedAt: string;
  originalPriceSdg: number;
}

export interface LoyaltyVoucher {
  id: string;
  code: string;
  title: string;
  description: string;
  pointsCost: number;
  discountType: "fixed_amount" | "free_shipping" | "percentage";
  discountValue: number; // in SDG or %
  minOrderValueSdg?: number;
  isRedeemed?: boolean;
  redeemedAt?: string;
  expiresAt: string;
}

export interface LoyaltyHistoryItem {
  id: string;
  type: "earned" | "redeemed" | "bonus";
  points: number;
  description: string;
  date: string;
  referenceOrderNumber?: string;
}

export interface LoyaltyAccount {
  customerName: string;
  customerPhone: string;
  currentPoints: number;
  lifetimePoints: number;
  tier: "bronze" | "silver" | "gold" | "diamond";
  history: LoyaltyHistoryItem[];
  activeVouchers: LoyaltyVoucher[];
}

export interface ClientCheckoutForm {
  customerName: string;
  customerPhone: string;
  deliveryMethod: "delivery" | "pickup";
  pickupBranchId: string;
  deliveryAddress: string;
  paymentMethod: "bankak" | "cash" | "crypto" | "later_preorder";
  bankakRef?: string;
  cryptoTxHash?: string;
  orderNotes?: string;
  appliedVoucher?: LoyaltyVoucher | null;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
}
