export interface ILogger{
    logError(error: any, message: string): Promise<void>
}