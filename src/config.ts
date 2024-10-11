export const getEnv = (key: string, def?: string): string => {
  const { env } = process;
  const value = env[key] || def;
  if (typeof value !== "string") {
    throw new Error(`env ${key} did not found in env`);
  }
  return value;
};

export const sequence_id = getEnv("CRAWLORA_SEQUENCE_ID"); // provided by default

export const apikey = getEnv("CRAWLORA_AUTH_KEY"); // provided by default
export const showBrowser = getEnv("SHOW_BROWSER", "false") === "true";

export const ISPROXY = getEnv("ISPROXY", "false") === "true";
export const host = getEnv("PROXY_HOST");
export const port = +getEnv("PROXY_PORT");
export const protocol = getEnv("PROXY_PROTOCOL", "http") as string;
export const user_name = getEnv("PROXY_USERNAME");
export const password = getEnv("PROXY_PASSWORD");
