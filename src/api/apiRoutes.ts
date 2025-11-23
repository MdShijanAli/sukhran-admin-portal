const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const createApiUrl = (endpoint: string) => {
  // Ensure there's no double slash when concatenating
  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const version = API_VERSION.startsWith("/") ? API_VERSION : `/${API_VERSION}`;
  const versionClean = version.endsWith("/") ? version.slice(0, -1) : version;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${versionClean}${path}`;
};

export const apiRoutes = {
  auth: {
    login: createApiUrl("auth/login"),
    logout: createApiUrl("auth/logout"),
    refreshToken: createApiUrl("auth/refresh-token"),
    forgotPassword: createApiUrl("auth/forgot-password"),
    changePassword: createApiUrl("auth/change-password"),
    verifyOTP: createApiUrl("auth/verify-otp"),
    resendOtp: createApiUrl("auth/resend-mobile-otp"),
    resetPassword: createApiUrl("auth/reset-password"),
  },

  profile: {
    getProfile: createApiUrl("auth/profile"),
    updateProfile: createApiUrl("auth/profile"),
  },

  users: {
    getAll: createApiUrl("admin/users"),
    getById: (id: number | string) => createApiUrl(`admin/users/${id}`),
    create: createApiUrl("admin/users"),
    update: (id: number | string) => createApiUrl(`admin/users/${id}`),
    delete: (id: number | string) => createApiUrl(`admin/users/${id}`),
    toggleUserStatus: (id: number | string) =>
      createApiUrl(`admin/users/${id}/toggle-status`),
    getUsersStatistics: createApiUrl("admin/users/statistics"),
    resetUserPassword: (id: number | string) =>
      createApiUrl(`admin/users/${id}/reset-password`),
  },

  categories: {
    getAll: createApiUrl("admin/categories"),
    getById: (id: number | string) => createApiUrl(`admin/categories/${id}`),
    create: createApiUrl("admin/categories"),
    createSubCategory: createApiUrl("admin/sub-categories"),
    getSubCategoryById: (id: number | string) =>
      createApiUrl(`admin/sub-categories/?categoryId=${id}`),
    updateSubCategory: (id: number | string) =>
      createApiUrl(`admin/sub-categories/${id}`),
    deleteSubCategory: (id: number | string) =>
      createApiUrl(`admin/sub-categories/${id}`),
    update: (id: number | string) => createApiUrl(`admin/categories/${id}`),
    delete: (id: number | string) => createApiUrl(`admin/categories/${id}`),
  },

  products: {
    getAll: createApiUrl("admin/products"),
    getById: (id: number | string) => createApiUrl(`admin/products/${id}`),
    create: createApiUrl("admin/products"),
    update: (id: number | string) => createApiUrl(`admin/products/${id}`),
    delete: (id: number | string) => createApiUrl(`admin/products/${id}`),
  },

  coverageAreas: {
    getAll: createApiUrl("admin/coverage-areas"),
    getById: (id: number | string) =>
      createApiUrl(`admin/coverage-areas/${id}`),
    create: createApiUrl("admin/coverage-areas"),
    update: (id: number | string) => createApiUrl(`admin/coverage-areas/${id}`),
    delete: (id: number | string) => createApiUrl(`admin/coverage-areas/${id}`),
    toggleCoverageAreaStatus: (id: number | string) =>
      createApiUrl(`admin/coverage-areas/${id}/toggle-status`),
  },

  packages: {
    getAll: createApiUrl("admin/packages"),
    getById: (id: number | string) => createApiUrl(`admin/packages/${id}`),
    create: createApiUrl("admin/packages"),
    update: (id: number | string) => createApiUrl(`admin/packages/${id}`),
    delete: (id: number | string) => createApiUrl(`admin/packages/${id}`),
  },
};
