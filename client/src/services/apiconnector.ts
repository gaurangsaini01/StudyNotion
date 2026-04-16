import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const axiosInstance = axios.create({});

export function apiConnector<TResponse = unknown>(
  method: AxiosRequestConfig["method"],
  url: string,
  bodyData?: unknown,
  headers?: AxiosRequestConfig["headers"],
  params?: AxiosRequestConfig["params"]
): Promise<AxiosResponse<TResponse>> {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
  });
}
