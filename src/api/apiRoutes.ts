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
    verifyOTP: createApiUrl("auth/verify-otp"),
    resendOtp: createApiUrl("auth/resend-mobile-otp"),
    resetPassword: createApiUrl("auth/reset-password"),
  },
};
