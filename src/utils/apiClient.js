import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ROUTE_PATH from "../constants/routes";
const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

const isTokenExpiringSoon = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;
    return timeUntilExpiry < 300;
  } catch (error) {
    return true;
  }
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await refreshClient.put("/api/auths/refresh-token", {
      refreshToken,
    });
    const { access_token: newToken, refresh_token: newRefreshToken } =
      response.data.data;

    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return newToken;
  } catch (error) {
    throw error;
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");

    if (accessToken && isTokenExpiringSoon(accessToken)) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {}
    }

    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return Promise.reject({
        message: "Yêu cầu quá thời gian chờ. Vui lòng thử lại.",
        code: "TIMEOUT",
        originalError: error,
      });
    }

    if (!error.response) {
      return Promise.reject({
        message: "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.",
        code: "NETWORK_ERROR",
        originalError: error,
      });
    }

    const originalRequest = error.config;

    if (originalRequest.url?.includes("/api/auths/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const refreshTokenResponse = await refreshClient.put(
          "/api/auths/refresh-token",
          { refreshToken },
        );

        const { access_token: newToken, refresh_token: newRefreshToken } =
          refreshTokenResponse.data.data;

        localStorage.setItem("accessToken", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

const apiFormClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {},
});

apiFormClient.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");

    if (accessToken && isTokenExpiringSoon(accessToken)) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {}
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiFormClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return Promise.reject({
        message: "Yêu cầu quá thời gian chờ. Vui lòng thử lại.",
        code: "TIMEOUT",
        originalError: error,
      });
    }

    if (!error.response) {
      return Promise.reject({
        message: "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.",
        code: "NETWORK_ERROR",
        originalError: error,
      });
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const refreshTokenResponse = await refreshClient.put(
          "/api/auths/refresh-token",
          { refreshToken },
        );

        const { access_token: newToken, refresh_token: newRefreshToken } =
          refreshTokenResponse.data.data;

        localStorage.setItem("accessToken", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiFormClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;

export { apiFormClient };
