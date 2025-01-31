import { displayName } from '@@/package.json'

type LoggerLevels = {
  verbose: boolean
  info: boolean
  warnings: boolean
  errors: boolean
}

let _name: `[${string}]` | undefined

let _levels: LoggerLevels = {
  verbose: true,
  info: true,
  warnings: true,
  errors: true,
}

export const setLoggerName = (name: string) => {
  _name = `[${name}]`
}

export const setLoggerLevels = (levels: LoggerLevels) => {
  _levels = levels
}

export const logger: Console = {
  ...console,

  // Verbose
  debug(...data: any[]): void {
    if (_levels.verbose) {
      if (_name) data.unshift(_name)

      console.debug(...data)
    }
  },

  // Info
  info(...data: any[]): void {
    if (_levels.info) {
      if (_name) data.unshift(_name)

      console.log(...data)
    }
  },
  log(...data: any[]): void {
    this.info(...data)
  },

  // Warnings
  warn(...data: any[]): void {
    if (_levels.warnings) {
      if (_name) data.unshift(_name)

      console.warn(...data)
    }
  },

  // Errors
  error(...data: any[]): void {
    if (_levels.errors) {
      if (_name) data.unshift(_name)

      console.error(...data)
    }
  },
}

setLoggerName(displayName)

setLoggerLevels({
  info: true,
  verbose: import.meta.env.DEV,
  warnings: import.meta.env.DEV,
  errors: import.meta.env.DEV,
})
