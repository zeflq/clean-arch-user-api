export interface ILogger {
    logInfo(message: string, context?: Record<string, any>): void;
    logError(message: string, context?: Record<string, any>): void;
}