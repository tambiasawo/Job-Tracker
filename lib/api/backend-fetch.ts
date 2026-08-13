import { getApiBaseUrl, getAppEnv } from "@/lib/api/config";

export function getBackendUnavailableMessage(): string {
  if (getAppEnv() === "development") {
    return `Cannot reach the API at ${getApiBaseUrl()}. Start the backend with: fastapi dev main.py`;
  }

  return "Cannot reach the API. Please try again in a moment.";
}

export function isBackendFetchError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("network")
  );
}
