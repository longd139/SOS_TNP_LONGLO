import axios from "axios";
import ROUTE_PATH from "../constants/routes";
const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
})

const refreshClient = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                localStorage.clear();
                window.location.href = ROUTE_PATH.LOGIN;
                return Promise.reject(error);
            }

            try {
                const refreshTokenResponse = await refreshClient.put('/api/auths/refresh-token', refreshToken);

                const { access_token: newToken, refresh_token: newRefreshToken } = refreshTokenResponse.data.data;

                localStorage.setItem("accessToken", newToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.replace(ROUTE_PATH.LOGIN);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

const apiFormClient = axios.create({
    baseURL: API_URL,
    headers: {}
})

apiFormClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiFormClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                localStorage.clear();
                window.location.href = ROUTE_PATH.LOGIN;
                return Promise.reject(error);
            }

            try {
                const refreshTokenResponse = await refreshClient.put('/api/auths/refresh-token', refreshToken);

                const { accessToken, refreshToken: newRefreshToken } = refreshTokenResponse.data.data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiFormClient(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.replace(ROUTE_PATH.LOGIN);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default apiClient;

export { apiFormClient };