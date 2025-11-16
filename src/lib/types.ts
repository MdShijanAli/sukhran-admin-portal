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
