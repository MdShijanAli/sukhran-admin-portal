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
