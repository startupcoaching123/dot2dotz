import { API_BASE_URL, AUTH_ENDPOINTS } from "./api/endpoints";

let refreshPromise = null;

/**
 * Get cookie value by name (case-insensitive and support multiple aliases)
 */
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split("; ");
  const searchName = name.toLowerCase().trim();

  // 1. Try Exact Match (case-insensitive)
  for (let cookie of cookies) {
    const [key, ...valueParts] = cookie.split("=");
    if (key.trim().toLowerCase() === searchName) return valueParts.join("=");
  }

  // 2. Try Specific Alias Match if exact failed
  const aliases = {
    'access_token': ['accessToken', 'token', 'auth_token'],
    'accessToken': ['access_token', 'token', 'auth_token'],
    'refresh_token': ['refreshToken', 'refresh'],
    'refreshToken': ['refresh_token', 'refresh'],
    'token': ['access_token', 'accessToken']
  };

  const searchAliases = aliases[name] || aliases[searchName] || [];

  for (let cookie of cookies) {
    const [key, ...valueParts] = cookie.split("=");
    const trimmedKey = key.trim().toLowerCase();
    if (searchAliases.some(alias => alias.toLowerCase() === trimmedKey)) {
      return valueParts.join("=");
    }
  }

  // 3. Try LocalStorage Fallback for tokens
  if (searchName.includes('token') && typeof localStorage !== 'undefined') {
    const val = localStorage.getItem(name) || localStorage.getItem(searchName);
    if (val) return val;
    
    // Check common aliases in localStorage
    for (const alias of searchAliases) {
      const aliasVal = localStorage.getItem(alias);
      if (aliasVal) return aliasVal;
    }
  }

  return null;
};

const refreshToken = async () => {
  try {
    const rt = getCookie("refresh_token") || getCookie("refreshToken") || getCookie("token");
    const refreshUrl = AUTH_ENDPOINTS.REFRESH.startsWith('http') ? AUTH_ENDPOINTS.REFRESH : `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`;

    console.log("🔄 REFRESH ATTEMPT:", {
      url: refreshUrl,
      rtFromCookie: !!rt,
      documentVisibleCookies: document.cookie ? "Visible" : "Hidden/None"
    });

    const body = rt ? { refreshToken: rt, token: rt, refresh_token: rt } : {};

    const baseOptions = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(rt && {
          "Authorization": `Bearer ${rt}`,
          "x-refresh-token": rt,
          "Refresh-Token": rt
        })
      }
    };

    // Attempt 1: POST with Body
    let res = await fetch(refreshUrl, { ...baseOptions, method: "POST", body: JSON.stringify(body) });

    // Fallback logic for various statuses (401, 403, 404, 405)
    if (!res.ok) {
      console.log(`⚠️ Primary refresh failed (${res.status}), starting deep search for refresh endpoint...`);

      const variations = [
        { url: refreshUrl, method: "GET" }, // Some backends use GET
        { url: `${API_BASE_URL}/api/auth/refresh`, method: "GET" },
        { url: `${API_BASE_URL}/api/auth/token/refresh`, method: "POST" }
      ];

      for (const v of variations) {
        try {
          console.log(`Trying ${v.method} ${v.url}`);
          const fallbackRes = await fetch(v.url, {
            ...baseOptions,
            method: v.method,
            body: v.method === "POST" ? JSON.stringify(body) : undefined
          });

          if (fallbackRes.ok) {
            res = fallbackRes;
            console.log(`✅ Success via ${v.method} ${v.url}`);
            break;
          }
        } catch (e) { /* ignore individual failures */ }
      }
    }

    if (!res.ok) {
      console.error("❌ TOKEN REFRESH FAILED PERMANENTLY. Response status:", res.status);
      return false;
    }

    // Process success
    try {
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("ℹ️ Success, but response not JSON. Relying on Set-Cookie.");
        return true;
      }

      const newToken = data.accessToken || data.token ||
        (data.data && (data.data.accessToken || data.data.token)) ||
        (data.tokens && data.tokens.accessToken);

      const newRefreshToken = data.refreshToken ||
        (data.data && data.data.refreshToken) ||
        (data.tokens && data.tokens.refreshToken);

      if (newToken) {
        document.cookie = `access_token=${newToken}; path=/; max-age=3600; SameSite=Lax`;
        document.cookie = `accessToken=${newToken}; path=/; max-age=3600; SameSite=Lax`;
        localStorage.setItem('accessToken', newToken);
      }

      if (newRefreshToken) {
        document.cookie = `refresh_token=${newRefreshToken}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=604800; SameSite=Lax`;
        localStorage.setItem('refreshToken', newRefreshToken);
      }
    } catch (e) {
      console.warn("⚠️ Refresh success but error parsing token:", e);
    }

    console.log("✅ Token successfully refreshed");
    return true;

  } catch (error) {
    console.error("❌ Fatal refresh error:", error);
    return false;
  }
};

/**
 * Fetch wrapper with automatic auth handling
 */
const fetchWithAuth = async (url, options = {}) => {
  const accessToken = getCookie("access_token") || getCookie("accessToken") || getCookie("token");

  const headers = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  } else {
    delete headers["Content-Type"];
  }

  const config = {
    ...options,
    credentials: "include",
    headers,
  };

  try {
    const initialUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    let response = await fetch(initialUrl, config);

    if (response.status !== 401 && response.status !== 403) {
      return response;
    }

    console.log(`🔐 Access token expired (${response.status}), refreshing...`);

    if (!refreshPromise) {
      refreshPromise = refreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (!refreshed) {
      console.warn("🛑 Token refresh failed, original request will error out");
      return response;
    }

    // get new token after refresh
    const newAccessToken = getCookie("access_token") || getCookie("accessToken") || getCookie("token");

    const retryHeaders = {
      ...headers,
      Authorization: `Bearer ${newAccessToken}`,
    };

    const retryConfig = {
      ...config,
      headers: retryHeaders,
    };

    console.log("🔁 Retrying request");

    const finalUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    return await fetch(finalUrl, retryConfig);

  } catch (error) {
    console.error("❌ Network error:", error);
    throw error;
  }
};

export { API_BASE_URL };
export default fetchWithAuth;