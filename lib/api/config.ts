export type AppEnv = "development" | "production";

const DEFAULT_DEV_API_URL = "http://127.0.0.1:8000";
const DEFAULT_PROD_API_URL =
  "https://job-tracker-backend-eiky.onrender.com";

export function getAppEnv(): AppEnv {
  const appEnv = process.env.APP_ENV?.trim().toLowerCase();

  if (appEnv === "production" || appEnv === "prod") {
    return "production";
  }

  if (appEnv === "development" || appEnv === "dev") {
    return "development";
  }

  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function getApiBaseUrl(): string {
  if (getAppEnv() === "production") {
    return process.env.API_BASE_URL_PROD ?? DEFAULT_PROD_API_URL;
  }

  return process.env.API_BASE_URL_DEV ?? DEFAULT_DEV_API_URL;
}
