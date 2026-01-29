export interface Role {
  id: string;
  display_name: string;
  description?: string;
  name: "admin" | "cxo" | "operator" | "customer" | "super_admin";
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
  custom_route_id?: string | number;
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

export interface Brand {
  id: number;
  title: string;
  description: string;
  image: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BrandFormData {
  title: string;
  description: string;
  image?: File;
  is_active: boolean;
  display_order: number;
}

export interface BrandPaginationMeta extends PaginationMeta {
  stats?: {
    total_brands: number;
    active_brands: number;
    inactive_brands: number;
  };
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
  badge?: string;
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
  user_id: number;
  name: string;
  email: string;
  mobile?: string;
  image?: string | null;
  image_url?: string | null;
  balance: {
    total_coins: number;
    locked_coins: number;
    available_coins: number;
  };
  statistics: {
    total_earned: number;
    total_spent: number;
    net_coins: number;
  };
  last_transaction_date: string | null;
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
  package_name: string;
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

// Donation Types
export interface DonationChannel {
  id: number;
  name: string;
  description: string;
  image: string;
  image_url: string;
  targetAmount: number;
  collectedAmount: number;
  remainingAmount: number;
  progress: number;
  totalDonations: number;
  isActive: boolean;
  displayOrder: number;
  created_at: string;
  updated_at: string;
}

export interface DonationChannelFormData {
  name: string;
  description: string;
  targetAmount: number;
  isActive: boolean;
  display_order: number;
  imgUrl?: File;
}

export interface Donor {
  userId: string;
  name: string;
  email: string;
  mobile: string;
  isAnonymous: boolean;
}

export interface Donation {
  id: number;
  channel: {
    id: number;
    name: string;
    description?: string;
  };
  donor: Donor;
  amount: number;
  donationType: "standalone" | "product" | "package";
  paymentMethod: "cod" | "online" | "coins";
  paymentStatus: "pending" | "paid";
  transactionId: string | null;
  donorMessage: string | null;
  orderId: string | null;
  order?: unknown;
  donatedAt: string;
  created_at: string;
  updated_at?: string;
}

export interface DonationStatistics {
  overview: {
    totalCashDonations: number;
    totalCoinDonations: number;
    totalDonations: number;
    totalDonors: number;
    totalDonationCount: number;
    pendingDonations: number;
    failedDonations: number;
    averageDonation: number;
  };
  coinFulfillment: {
    totalCoinDonations: number;
    totalFulfilled: number;
    totalUnfulfilled: number;
    companyOwes: number;
    fulfillmentPercentage: number;
  };
  timeBased: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  byType: Record<
    string,
    {
      total: number;
      total_coins: number;
      count: string;
      type: string;
    }
  >;
  byPaymentMethod: Record<
    string,
    {
      total: number;
      count: string;
    }
  >;
  topChannels: Array<{
    id: number;
    name: string;
    totalDonations: number;
    cashDonations: number;
    coinDonations: number;
    donorCount: string;
    targetAmount: number;
    progressPercentage: number;
    unfulfilledCoins: number;
  }>;
  topDonors: Array<{
    userId: string;
    name: string;
    totalDonations: number;
    cashDonations: number;
    coinDonations: number;
    donationCount: string;
  }>;
  recentDonations: Array<{
    id: number;
    channel: string;
    donor: string;
    amount: number;
    type: string;
    coins: number;
    donatedAt: string;
  }>;
  dailyTrend: Array<{
    date: string;
    cash_total: number;
    coin_total: number;
    total: number;
    count: string;
  }>;
}

export interface CoinDonationReport {
  overview: {
    total_coin_donations: number;
    total_coin_donation_count: number;
    total_fulfilled: number;
    total_unfulfilled: number;
    company_owes: number;
    average_coin_donation: number;
  };
  by_channel: Array<{
    id: number;
    name: string;
    description: string;
    statistics: {
      total_coin_donations: number;
      total_cash_donations: number;
      total_donations: number;
      coin_donation_count: string;
    };
    fulfillment: {
      fulfilled_amount: number;
      unfulfilled_amount: number;
      company_owes: number;
      fulfillment_percentage: number;
    };
    target: {
      target_amount: number;
      progress_percentage: number;
    };
  }>;
  recent_donations: Array<{
    id: number;
    donor: string;
    channel: string;
    coins_donated: number;
    value: number;
    donated_at: string;
  }>;
  top_donors: Array<{
    userId: string;
    name: string;
    total_coins_donated: number;
    donation_count: string;
    total_value: number;
  }>;
}

export interface FulfillmentHistory {
  id: number;
  amount: number;
  notes: string;
  proof_document: string;
  fulfilled_by: {
    id: number;
    name: string;
    email: string;
  };
  fulfilled_at: string;
  created_at: string;
}

export interface FulfillCoinPayload {
  amount: number;
  notes: string;
  proof_document: File;
}

export interface ReorderChannelsPayload {
  channels: Array<{
    id: number;
    displayOrder: number;
  }>;
}

// Referral Types
export interface ReferralSettings {
  id: number;
  isEnabled: boolean;
  coinsPerReferral: number;
  minOrderAmount: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralUser {
  id: number;
  name: string;
  email: string;
  mobile: string;
  referral_code?: string;
  registered_at?: string;
}

export interface ReferralOrder {
  id: number;
  orderId: string;
  status?: string;
  paymentStatus?: string;
  grandTotal: number;
  created_at: string;
}

export interface ReferralTransaction {
  id: number;
  amount: number;
  balanceAfter: number;
  created_at: string;
}

export interface Referral {
  id: number;
  referrer: ReferralUser;
  referred_user: ReferralUser;
  status: "pending" | "locked" | "credited" | "cancelled";
  status_display: string;
  status_color?: string;
  coins_amount: number;
  first_order: ReferralOrder | null;
  coin_transaction: ReferralTransaction | null;
  credited_at: string | null;
  coin_transaction_id: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralStatistics {
  overview: {
    total_referrals: number;
    pending: number;
    locked: number;
    credited: number;
    cancelled: number;
  };
  coins: {
    total_distributed: number;
    pending_coins: number;
    locked_coins: number;
  };
  today: {
    new_referrals: number;
    coins_credited: number;
  };
  this_week: {
    new_referrals: number;
    coins_credited: number;
  };
  this_month: {
    new_referrals: number;
    coins_credited: number;
  };
  settings: {
    is_enabled: boolean;
    coins_per_referral: number;
    min_order_amount: number;
  };
}

export interface UserReferrals {
  user: ReferralUser;
  statistics: {
    referral_code: string;
    total_referred: number;
    pending_rewards: {
      count: number;
      total_coins: number;
    };
    locked_rewards: {
      count: number;
      total_coins: number;
    };
    credited_rewards: {
      count: number;
      total_coins: number;
    };
    total_coins_earned: number;
  };
  referrals: Array<{
    id: number;
    referred_user: ReferralUser;
    status: string;
    status_display: string;
    coins_amount: number;
    created_at: string;
  }>;
  meta: PaginationMeta;
}

// Banner Types
export interface BannerPackage {
  id: number;
  name: string;
  image: string | null;
}

export interface BannerProduct {
  id: number;
  name: string;
  image: string | null;
}

export interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_type: "none" | "product" | "package" | "url";
  url?: string;
  package_id?: string;
  package?: BannerPackage;
  product_id?: string;
  product?: BannerProduct;
  display_order: number;
  is_active: boolean;
  created_by: {
    id: number;
    name: string;
  };
  updated_by: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface BannerPaginationMeta extends PaginationMeta {
  stats?: {
    total_banners: number;
    active_banners: number;
    inactive_banners: number;
  };
}
