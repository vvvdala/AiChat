import axios from "axios";
import createAuthRefreshInterceptor from "@esmkit/axios-auth-refresh";

export const API_URL = `http://localhost:5000/api`;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

const refreshAuthLogic = async (failedRequest) => {
  const response = await axios.get(`${API_URL}/refresh`, {
    withCredentials: true,
  });
  const { accessToken } = response.data;
  localStorage.setItem("token", accessToken);
  failedRequest.config.headers["Authorization"] = `Bearer ${accessToken}`;
  return Promise.resolve();
};

createAuthRefreshInterceptor($api, refreshAuthLogic);

export default $api;
