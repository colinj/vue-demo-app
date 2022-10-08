import axios from "axios";
import qs from "qs";
import type { ExtractRouteParams } from "./_route-params";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const createService = () =>
  axios.create({
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    responseType: "json",
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  });

const assignBaseUrl = (service: AxiosInstance, baseUrl: string) => {
  service.defaults.baseURL = baseUrl;
};

const apiServices: { [K: string]: AxiosInstance } = {
  default: createService(),
};

export const initApiServices = (name: string, url: string) => {
  assignBaseUrl(apiServices[name], url);
};

const createUrl = (str: string, obj: Record<string, string | number> = {}) =>
  str.replace(/\{(.*?)}/g, (x, g) => (obj[g] as string) ?? "");

interface HttpOptions {
  service: "default";
  basePath: string;
}

function GET(
  httpOptions: HttpOptions
): <T extends string, ConfigOpts = unknown>(
  path?: T,
  config?: (options: ConfigOpts) => AxiosRequestConfig
) => T extends `${string}{${string}`
  ? <Output = void>(params: ExtractRouteParams<T> & ConfigOpts) => Promise<AxiosResponse<Output>>
  : ConfigOpts extends object
  ? <Output = void>(params: ConfigOpts) => Promise<AxiosResponse<Output>>
  : <Output = void>() => Promise<AxiosResponse<Output>>;

function GET(httpOptions: HttpOptions) {
  return function <T extends string, ConfigOpts = unknown>(
    path?: T,
    config?: (options: ConfigOpts) => AxiosRequestConfig
  ) {
    const axiosInstance = apiServices[httpOptions.service];
    const urlPath = path ?? "";
    if (urlPath.indexOf("{") < 0 && !config) {
      return <Output>() => axiosInstance.get<Output>(httpOptions.basePath + urlPath);
    } else {
      return <Output>(params: ExtractRouteParams<T> & ConfigOpts) => {
        const url = httpOptions.basePath + createUrl(urlPath, params);
        return axiosInstance.get<Output>(url, config && params && config(params));
      };
    }
  };
}

function PUT(
  httpOptions: HttpOptions
): <T extends string, ConfigOpts = unknown>(
  path?: T,
  config?: (options: ConfigOpts) => AxiosRequestConfig
) => T extends `${string}{${string}`
  ? <Input, Output = void>(params: ExtractRouteParams<T> & ConfigOpts, data: Input) => Promise<AxiosResponse<Output>>
  : ConfigOpts extends object
  ? <Input, Output = void>(params: ConfigOpts, data: Input) => Promise<AxiosResponse<Output>>
  : <Input, Output = void>(data: Input) => Promise<AxiosResponse<Output>>;

function PUT(httpOptions: HttpOptions) {
  const axiosInstance = apiServices[httpOptions.service];

  return function <T extends string, ConfigOpts = unknown>(
    path?: T,
    config?: (options: ConfigOpts) => AxiosRequestConfig
  ) {
    const urlPath = path ?? "";
    if (urlPath.indexOf("{") < 0 && !config) {
      return <Input, Output = void>(data: Input) => axiosInstance.put<Output>(httpOptions.basePath + urlPath, data);
    } else {
      return <Input, Output = void>(params: ExtractRouteParams<T> & ConfigOpts, data: Input) => {
        const url = httpOptions.basePath + createUrl(urlPath, params);
        return axiosInstance.put<Output>(url, data, config && params && config(params));
      };
    }
  };
}

function PUTNULL(
  httpOptions: HttpOptions
): <T extends string, ConfigOpts = unknown>(
  path?: T,
  config?: (options: ConfigOpts) => AxiosRequestConfig
) => T extends `${string}{${string}`
  ? <Output = void>(params: ExtractRouteParams<T> & ConfigOpts) => Promise<AxiosResponse<Output>>
  : ConfigOpts extends object
  ? <Output = void>(params: ConfigOpts) => Promise<AxiosResponse<Output>>
  : <Output = void>() => Promise<AxiosResponse<Output>>;

function PUTNULL(httpOptions: HttpOptions) {
  const axiosInstance = apiServices[httpOptions.service];

  return function <T extends string, ConfigOpts = unknown>(
    path?: T,
    config?: (options: ConfigOpts) => AxiosRequestConfig
  ) {
    const urlPath = path ?? "";
    if (urlPath.indexOf("{") < 0 && !config) {
      return <Output = void>() => axiosInstance.put<Output>(httpOptions.basePath + urlPath, null);
    } else {
      return <Output = void>(params: ExtractRouteParams<T> & ConfigOpts) => {
        const url = httpOptions.basePath + createUrl(urlPath, params);
        return axiosInstance.put<Output>(url, null, config && params && config(params));
      };
    }
  };
}

function POST(
  httpOptions: HttpOptions
): <T extends string, ConfigOpts = unknown>(
  path?: T,
  config?: (options: ConfigOpts) => AxiosRequestConfig
) => T extends `${string}{${string}`
  ? <Input, Output = void>(params: ExtractRouteParams<T> & ConfigOpts, data: Input) => Promise<AxiosResponse<Output>>
  : ConfigOpts extends object
  ? <Input, Output = void>(params: ConfigOpts, data: Input) => Promise<AxiosResponse<Output>>
  : <Input, Output = void>(data: Input) => Promise<AxiosResponse<Output>>;

function POST(httpOptions: HttpOptions) {
  const axiosInstance = apiServices[httpOptions.service];

  return function <T extends string, ConfigOpts = unknown>(
    path?: T,
    config?: (options: ConfigOpts) => AxiosRequestConfig
  ) {
    const urlPath = path ?? "";
    if (urlPath.indexOf("{") < 0 && !config) {
      return <Input, Output = void>(data: Input) => axiosInstance.post<Output>(httpOptions.basePath + urlPath, data);
    } else {
      return <Input, Output = void>(params: ExtractRouteParams<T> & ConfigOpts, data: Input) => {
        const url = httpOptions.basePath + createUrl(urlPath, params);
        return axiosInstance.post<Output>(url, data, config && config(params));
      };
    }
  };
}

function POSTNULL(
  httpOptions: HttpOptions
): <T extends string, ConfigOpts = unknown>(
  path?: T,
  config?: (options: ConfigOpts) => AxiosRequestConfig
) => T extends `${string}{${string}`
  ? <Output = void>(params: ExtractRouteParams<T> & ConfigOpts) => Promise<AxiosResponse<Output>>
  : ConfigOpts extends object
  ? <Output = void>(params: ConfigOpts) => Promise<AxiosResponse<Output>>
  : <Output = void>() => Promise<AxiosResponse<Output>>;

function POSTNULL(httpOptions: HttpOptions) {
  const axiosInstance = apiServices[httpOptions.service];

  return function <T extends string, ConfigOpts = unknown>(
    path?: T,
    config?: (options: ConfigOpts) => AxiosRequestConfig
  ) {
    const urlPath = path ?? "";
    if (urlPath.indexOf("{") < 0 && !config) {
      return <Output = void>() => axiosInstance.post<Output>(httpOptions.basePath + urlPath, null);
    } else {
      return <Output = void>(params: ExtractRouteParams<T> & ConfigOpts) => {
        const url = httpOptions.basePath + createUrl(urlPath, params);
        return axiosInstance.post<Output>(url, null, config && config(params));
      };
    }
  };
}

function DELETE(
  httpOptions: HttpOptions
): <T extends string, ConfigOpts = unknown>(
  path?: T,
  config?: (options: ConfigOpts) => AxiosRequestConfig
) => T extends `${string}{${string}`
  ? <Output = void>(params: ExtractRouteParams<T> & ConfigOpts) => Promise<AxiosResponse<Output>>
  : ConfigOpts extends object
  ? <Output = void>(params: ConfigOpts) => Promise<AxiosResponse<Output>>
  : <Output = void>() => Promise<AxiosResponse<Output>>;

function DELETE(httpOptions: HttpOptions) {
  const axiosInstance = apiServices[httpOptions.service];

  return function <T extends string, ConfigOpts = unknown>(
    path?: T,
    config?: (options: ConfigOpts) => AxiosRequestConfig
  ) {
    const urlPath = path ?? "";
    if (urlPath.indexOf("{") < 0 && !config) {
      return <Output = void>() => axiosInstance.delete<Output>(httpOptions.basePath + urlPath);
    } else {
      return <Output = void>(params: ExtractRouteParams<T> & ConfigOpts) => {
        const url = httpOptions.basePath + createUrl(urlPath, params);
        return axiosInstance.delete<Output>(url, config && params && config(params));
      };
    }
  };
}

export const useHttp = (params: HttpOptions = { service: "default", basePath: "" }) => ({
  GET: GET(params),
  PUT: PUT(params),
  PUTNULL: PUTNULL(params),
  POST: POST(params),
  POSTNULL: POSTNULL(params),
  DELETE: DELETE(params),
});
