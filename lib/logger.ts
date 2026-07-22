type LogLevel = "debug" | "info" | "warn" | "error";

const levelValues: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const envLevel = (process.env.LOG_LEVEL || "").toLowerCase() as LogLevel;
const defaultLevel: LogLevel = envLevel in levelValues ? envLevel : process.env.NODE_ENV === "production" ? "warn" : "debug";

function formatLog(level: LogLevel, message: string, meta?: unknown) {
  const line = {
    time: new Date().toISOString(),
    level,
    message,
    ...(meta !== undefined ? { meta } : {}),
  };
  return JSON.stringify(line);
}

function shouldLog(level: LogLevel) {
  return levelValues[level] >= levelValues[defaultLevel];
}

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (shouldLog("debug")) {
      console.debug(formatLog("debug", message, meta));
    }
  },
  info: (message: string, meta?: unknown) => {
    if (shouldLog("info")) {
      console.info(formatLog("info", message, meta));
    }
  },
  warn: (message: string, meta?: unknown) => {
    if (shouldLog("warn")) {
      console.warn(formatLog("warn", message, meta));
    }
  },
  error: (message: string, error: unknown) => {
    if (shouldLog("error")) {
      const meta = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error;
      console.error(formatLog("error", message, meta));
    }
  },
};
