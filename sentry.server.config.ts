import { init } from "@sentry/nextjs";

init({
  dsn: process.env.SENTRY_DSN || "",
  environment: process.env.NODE_ENV || "development",
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
});
