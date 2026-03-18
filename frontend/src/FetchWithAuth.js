import { API_BASE_URL, AUTH_ENDPOINTS } from "./api/endpoints";

let refreshPromise = null;

/**
 * Get cookie value by name
 */
const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const parts = cookie.split("=");
    const key = parts[0];
    const value = parts.slice(1).join("=");
    if (key === name) return value;
  }
  return null;
};

/**
 * Refresh access token using refreshToken cookie
 */
const refreshToken = async () => {
  try {
    // Try the configured endpoint first
    let res = await fetch(AUTH_ENDPOINTS.REFRESH, {
      method: "POST",
      credentials: "include",
    });

    // Fallback to commonly used refresh-token if primary fails with 404
    if (res.status === 404) {
      console.log("⚠️ /auth/refresh returned 404, trying /auth/refresh-token...");
      res = await fetch("/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });
    }

    if (!res.ok) {
      console.log("❌ Refresh failed:", res.status);
      return false;
    }

    // Capture the token if it's in the body
    try {
      const data = await res.json();
      // Backend returns loginResponse inside data field: ApiResponse.success(loginResponse, "Token refreshed")
      const newToken = data.accessToken || 
                        data.token || 
                        (data.data && (data.data.accessToken || data.data.token));

      if (newToken) {
        console.log("💾 Updating access_token cookie from response body");
        // Set cookie manually if not already set by backend via Set-Cookie
        // Use access_token to match backend's naming convention
        document.cookie = `access_token=${newToken}; path=/; max-age=3600; SameSite=Lax`;
      }
    } catch (e) {
      // Not JSON, hope that cookies were set via Set-Cookie header
      console.log("ℹ️ Refresh response not JSON, assuming cookies were set via Set-Cookie header");
    }

    console.log("✅ Token refreshed successfully");
    return true;

  } catch (error) {
    console.error("❌ Refresh error:", error);
    return false;
  }
};

/**
 * Fetch wrapper with automatic auth handling
 */
const fetchWithAuth = async (url, options = {}) => {

  const accessToken = getCookie("access_token") || getCookie("accessToken");

  const config = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(options.headers || {}),
    },
  };

  try {
    let response = await fetch(url, config);

    if (response.status !== 401 && response.status !== 403) {
      return response;
    }

    console.log("🔐 Access token expired, refreshing...");

    if (!refreshPromise) {
      refreshPromise = refreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (!refreshed) {
      console.log("⚠️ Refresh failed");
      return response;
    }

    // get new token after refresh
    const newAccessToken = getCookie("access_token") || getCookie("accessToken");

    const retryConfig = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(newAccessToken && { Authorization: `Bearer ${newAccessToken}` }),
        ...(options.headers || {}),
      },
    };

    console.log("🔁 Retrying request");

    return await fetch(url, retryConfig);

  } catch (error) {
    console.error("❌ Network error:", error);
    throw error;
  }
};

export { API_BASE_URL };
export default fetchWithAuth;