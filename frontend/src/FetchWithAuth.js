const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

let refreshPromise = null;

const refreshToken = async () => {
  const res = await fetch(`${API_BASE_URL}/api/user/refresh`, {
    method: "POST",
    credentials: "include",
    redirect: "manual",
  });

  if (!res.ok) {
    // Clear auth state and redirect to login
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    window.location.href = "/login/client-ftl";
    throw new Error("Refresh failed");
  }

  return res;
};

const fetchWithAuth = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
    });

    // Access token expired
    if (res.status === 401) {
      if (!refreshPromise) {
        refreshPromise = refreshToken()
          .catch(() => {
            throw new Error("Session expired");
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;

      // Retry original request
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    }

    return res;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};

export { API_BASE_URL };
export default fetchWithAuth;