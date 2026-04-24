/**
 * utils/logger.ts — structured console logger with timestamps.
 */
type Level = "info" | "warn" | "error" | "debug";

function log(level: Level, msg: string, ...args: unknown[]): void {
  const ts = new Date().toISOString();
  const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  fn(`[${ts}] [${level.toUpperCase()}]`, msg, ...args);
}

export const logger = {
  info:  (m: string, ...a: unknown[]) => log("info",  m, ...a),
  warn:  (m: string, ...a: unknown[]) => log("warn",  m, ...a),
  error: (m: string, ...a: unknown[]) => log("error", m, ...a),
  debug: (m: string, ...a: unknown[]) => log("debug", m, ...a),
};
