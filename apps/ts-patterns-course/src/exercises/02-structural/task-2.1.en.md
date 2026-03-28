# Task 2.1: Adapter

## Objective

Implement the Adapter pattern to adapt three different loggers (`ConsoleLogger`, `FileLogger`, `ExternalLogger`) to a unified `ILogger` interface.

## Requirements

1. Define the `ILogger` interface with methods:
   - `info(message: string): string`
   - `error(message: string): string`
   - `warn(message: string): string`
2. Use the provided logger classes with incompatible APIs:
   - `ConsoleLogger` — method `log(message: string): string`
   - `FileLogger` — method `writeLog(level: string, message: string): string`
   - `ExternalLogger` — method `sendLog(payload: { severity: number; text: string }): string`
3. Create three adapters implementing `ILogger`:
   - `ConsoleLoggerAdapter` — delegates to `ConsoleLogger.log()`, prepending the `[INFO]`/`[ERROR]`/`[WARN]` prefix
   - `FileLoggerAdapter` — delegates to `FileLogger.writeLog()`, passing the level as a string
   - `ExternalLoggerAdapter` — delegates to `ExternalLogger.sendLog()`, mapping the level to severity (info=0, warn=1, error=2)
4. Create a factory function `createLogger(type: 'console' | 'file' | 'external'): ILogger`
5. Demonstrate that all three adapters work through the unified interface

## Checklist

- [ ] Interface `ILogger` is defined with three methods
- [ ] `ConsoleLoggerAdapter` accepts `ConsoleLogger` in its constructor and implements `ILogger`
- [ ] `FileLoggerAdapter` accepts `FileLogger` in its constructor and implements `ILogger`
- [ ] `ExternalLoggerAdapter` accepts `ExternalLogger` in its constructor and implements `ILogger`
- [ ] Adapters only translate calls without adding business logic
- [ ] Factory function `createLogger` returns `ILogger`
- [ ] Demonstration — the button outputs results for all three loggers

## How to verify

1. Click the run button
2. Verify that each logger outputs info/warn/error messages in its own format
3. Verify that client code works identically with any logger type via `ILogger`
4. Try passing an invalid type to `createLogger` — TypeScript should show an error
