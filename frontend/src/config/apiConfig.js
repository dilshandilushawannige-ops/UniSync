/** Backend origin (no trailing slash). Set in frontend/.env: VITE_API_ORIGIN=http://localhost:8081 */
export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ?? "http://localhost:8081";

export const API_BASE_URL = `${API_ORIGIN}/api`;
