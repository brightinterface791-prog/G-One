// Existing endpoint remains the fallback so deployments do not change behavior.
export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://doctor.brightinterface.in/public/index.php/api/v1',
  timeout: 15000,
} as const;
