
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export const AUTH_ENDPOINTS = {
  LOGIN: `/api/auth/login`,
  REFRESH: `/api/auth/refresh`,
  LOGOUT: `/api/auth/logout`,
  FORGOT_PASSWORD: `/api/auth/forgot-password`,
  RESET_PASSWORD: `/api/auth/reset-password`,
  ME: `/api/auth/me`,
  CLIENT_REGISTER: `/api/clients/register`,
  VENDOR_REGISTER: `/api/vendors/register`,
  VENDOR_DRIVERS: (vendorId) => `/api/vendors/${vendorId}/drivers`,
  GET_CLIENTS: `/api/clients`,
  GET_VENDORS: `/api/vendors`,
  ADMIN: `/api/admin`,
  VEHICLES: `/api/vehicles`,
  LEADS: `/api/leads`,
  VENDOR_INCOMING_LEADS: `/api/leads/vendor/incoming`,
  PAYMENT_SLABS: `/api/payment-slabs`,
};
