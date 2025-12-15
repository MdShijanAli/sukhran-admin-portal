export interface Role {
  id: string;
  display_name: string;
  description?: string;
  name: "admin" | "cxo" | "operator" | "customer";
}

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  mobile: string;
  email?: string;
  displayImage?: string;
  image_url?: string;
  preferredName?: string;
  role: Role;
  permissions?: string[];
  avatar?: string;
}

export interface Notification {
  id: string;
  type: "order" | "payment" | "delivery" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Error {
  error_code?: string;
  success: boolean;
  error_message?: string;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ForgotPassword {
  mobile: string;
  otp_code: string;
  password: string;
  password_confirmation: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imgUrl: string;
  displayOrder: number;
  isActive: boolean;
  businessId: string;
  created_at: string;
  updated_at: string;
  sub_categories_count: string;
  products_count: string;
  image_url: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id?: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CategoryFormData {
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  image?: File;
  subCategories: SubCategory[];
}

export interface PaginationMeta {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface CoverageArea {
  id: number;
  name: string;
  city: string;
  latitude: string;
  longitude: string;
  radius_km: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoverageAreaFormData {
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  is_active: boolean;
}

export interface CoverageAreaStats {
  total_areas: number;
  active_areas: number;
  inactive_areas: number;
  cities: string[];
}

export interface CoverageAreaPaginationMeta {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
  stats?: CoverageAreaStats;
}

export interface PackageProduct {
  id: number;
  name: string;
  slug: string;
  imgUrl: string | null;
  image_url: string | null;
}

export interface PackageSku {
  id: number;
  name: string;
  unitName: string;
  unitSize: number;
  currentPrice: number;
  imgUrl: string | null;
  image_url: string | null;
}

export interface PackageItem {
  id: number;
  product: PackageProduct;
  sku: PackageSku;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface PackagePricing {
  originalPrice: number;
  currentPrice: number;
  fixedPrice: number;
  discountPercent: number;
  calculatedDiscountPercent: number;
  savings: number;
}

export interface Package {
  id: number;
  name: string;
  slug: string;
  description: string;
  imgUrl: string | null;
  image_url: string | null;
  packageType: "admin" | "custom";
  fixedPrice: number;
  coinsReward: number;
  discountPercent: number;
  pricing?: PackagePricing;
  displayOrder: string;
  isActive: boolean;
  isFeatured: boolean;
  items: PackageItem[];
  created_at: string;
  updated_at: string;
}

export interface PackageFormData {
  name: string;
  description: string;
  packageType: "admin" | "custom";
  fixedPrice: number;
  discountPercent: number;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  imgUrl?: File;
  items: {
    productId: number | string;
    skuId: number | string;
    quantity: number;
  }[];
}

export interface CouponFormData {
  code: string;
  name: string;
  discount_type: "percentage" | "fixed";
  description?: string;
  discount_value: number;
  max_discount_amount?: number;
  min_order_amount: number;
  valid_from: string;
  valid_to: string;
  usage_limit_total: number;
  usage_limit_per_user: number;
  isActive: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discount: {
    type: "percentage" | "fixed";
    value: number;
    max_amount: number | null;
    formatted: string;
  };
  min_order_amount: number;
  validity: {
    from: string;
    to: string;
    is_valid_now: boolean;
    is_expired: boolean;
    is_upcoming: boolean;
  };
  usage: {
    limit_total: string;
    limit_per_user: string;
    count: string;
    remaining: number;
    total_discount_given: number;
  };
  isActive: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CouponStats {
  total_coupons: number;
  active_coupons: number;
  inactive_coupons: number;
  expired_coupons: number;
  valid_now: number;
  upcoming: number;
  usage: {
    total_usage: number;
    total_discount_given: number;
  };
  most_used_coupon: Coupon | null;
  highest_discount_coupon: Coupon | null;
}

export interface CouponPaginationMeta {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  statistics?: CouponStats;
}

export interface Transaction {
  id: number;
  transactionId: string;
  order: {
    orderId: string;
    status: string;
  } | null;
  customer: {
    id: number;
    name: string;
    email: string;
    mobile: string;
  };
  amount: number;
  currency: string;
  status: "success" | "pending" | "failed" | "refunded";
  paymentGateway: string;
  gatewayTransactionId: string | null;
  bankTransactionId: string | null;
  cardType: string | null;
  cardBrand: string | null;
  cardIssuer: string | null;
  cardIssuerCountry: string | null;
  cardSubBrand?: string | null;
  riskLevel?: string | null;
  riskTitle?: string | null;
  storeAmount?: string | null;
  gatewayStatus?: string | null;
  gatewayResponse: Record<string, unknown> | null;
  refundAmount: number | null;
  refundedAt: string | null;
  refundedBy: number | null;
  refundReason: string | null;
  failureReason: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionStats {
  total_transactions: number;
  total_amount: string;
  successful: number;
  failed: number;
  refunded: number;
  by_gateway: {
    sslcommerz: number;
    cod: number;
  };
  today: {
    transactions: number;
    amount: number;
  };
  this_month: {
    transactions: number;
    amount: string;
  };
}

export interface TransactionPaginationMeta extends PaginationMeta {
  stats?: TransactionStats;
}

// Package Settings Types
export interface PackageSetting {
  id: number;
  key: string;
  value: string;
  description: string;
  businessId: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleOption {
  id?: number;
  option_type: "schedule_months" | "frequency_per_month" | "delivery_time";
  value: string;
  label: string;
  display_order: number;
  isActive: boolean;
  isDefault: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PackageScheduleOptions {
  schedule_months: ScheduleOption[];
  frequency_per_month: ScheduleOption[];
  delivery_time: ScheduleOption[];
}

export interface ScheduleOptionFormData {
  option_type: "schedule_months" | "frequency_per_month" | "delivery_time";
  value: string;
  label: string;
  display_order: number;
  isActive: boolean;
  isDefault: boolean;
}

// Coin Management Types
export interface CoinUser {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  image?: string | null;
  image_url?: string | null;
}

export interface CoinTransaction {
  id: number;
  user: CoinUser;
  type: "earned" | "spent";
  amount: number;
  reason: string;
  description: string;
  balance_after: number;
  reference_id: string | null;
  created_at: string;
}

export interface CoinBalance {
  total_coins: number;
  locked_coins: number;
  available_coins: number;
}

export interface CoinStatistics {
  total_earned: number;
  total_spent: number;
  net_coins: number;
}

export interface UserCoinDetails {
  user: CoinUser;
  balance: CoinBalance;
  statistics: CoinStatistics;
  transactions: CoinTransaction[];
  pagination: PaginationMeta;
}

export interface TopHolder {
  user: CoinUser;
  total_coins: number;
  locked_coins: number;
  available_coins: number;
}

export interface CoinOverview {
  total_coins_in_circulation: number;
  total_locked_coins: number;
  total_available_coins: number;
  users_with_coins: number;
  coin_value: string;
}

export interface PeriodStats {
  earned: number;
  spent: number;
  net: number;
}

export interface ReasonBreakdown {
  reason: string;
  total: number;
  count: number;
}

export interface CoinBreakdown {
  earned_by_reason: ReasonBreakdown[];
  spent_by_reason: ReasonBreakdown[];
}

export interface DailyTrend {
  date: string;
  earned: number;
  spent: number;
  net: number;
}

export interface CoinStatisticsResponse {
  overview: CoinOverview;
  today: PeriodStats;
  this_week: PeriodStats;
  this_month: PeriodStats;
  all_time: PeriodStats;
  breakdown: CoinBreakdown;
  top_holders: TopHolder[];
  recent_transactions: CoinTransaction[];
  daily_trend: DailyTrend[];
}

export interface SendCoinPayload {
  user_id: number;
  amount: number;
  reason: string;
}

// Package Orders Types
export interface PackageOrderBatch {
  batch_id: string;
  customer: {
    id: number;
    name: string;
    email: string;
    mobile?: string;
  };
  schedule_months: string;
  frequency_per_month: string;
  total_orders: string | number;
  pending_count: string | number;
  payment_available_count: string | number;
  delivered_count: string | number;
  created_at: string;
}

export interface PackageOrderItem {
  product_id: string;
  sku_id: string;
  product_name: string;
  sku_name: string;
  quantity: string;
  unit_price: number;
  item_cost: number;
  image?: string | null;
}

export interface PackageOrder {
  id: number;
  orderId: string;
  sequence: string;
  delivery_month: string;
  delivery_number: string;
  preferred_delivery_time: string;
  status: string;
  is_locked: boolean;
  is_paused: boolean;
  paused_at: string | null;
  payment_available: boolean;
  delivery_date: string | null;
  payment_mode: string;
  payment_status: string;
  items_count: number;
  items: PackageOrderItem[];
  amounts: {
    subTotal: number;
    deliveryCharge: number;
    vat: number;
    grandTotal: number;
  };
  created_at: string;
}

export interface PackageBatchDetails {
  batch_id: string;
  customer: {
    id: number;
    name: string;
    email: string;
    mobile: string;
  };
  schedule_months: string;
  frequency_per_month: string;
  total_orders: number;
  orders: PackageOrder[];
}

export interface SetDeliveryDatePayload {
  delivery_date: string;
}

export interface ModifyItemsPayload {
  addons: Array<{
    product_id: number;
    sku_id: number;
    quantity: number;
  }>;
}

export interface PauseOrderPayload {
  reason: string;
}

export interface ResumeOrderPayload {
  reason: string;
}

export interface CancelOrderPayload {
  reason: string;
}
