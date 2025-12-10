/**
 * Conditional logger utility for player.js
 * Provides debug, log, warn, and error methods that only output when enabled
 */

class Logger {
  private enabled: boolean

  constructor(enabled: boolean = false) {
    this.enabled = enabled
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  debug(...args: any[]): void {
    if (this.enabled) {
      console.debug(...args)
    }
  }

  log(...args: any[]): void {
    if (this.enabled) {
      console.log(...args)
    }
  }

  warn(...args: any[]): void {
    if (this.enabled) {
      console.warn(...args)
    }
  }

  error(...args: any[]): void {
    if (this.enabled) {
      console.error(...args)
    }
  }
}

/**
 * Creates a new logger instance
 * @param enabled - Whether logging is enabled (default: false)
 */
export function createLogger(enabled: boolean = false): Logger {
  return new Logger(enabled)
}

export default Logger
