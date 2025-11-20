export interface Role {
  id: string;
  display_name: string;
  description?: string;
  name: "admin" | "cxo" | "operator";
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

export interface Package {
  id: number;
  name: string;
  slug: string;
  description: string;
  imgUrl: string | null;
  image_url: string | null;
  packageType: "admin" | "custom";
  fixedPrice: number;
  discountPercent: number;
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
