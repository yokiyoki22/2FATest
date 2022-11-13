import { ILogger } from "../interfaces/ilogger";

export class Logger implements ILogger{
    async logError(error: any, message: string): Promise<void> {
        console.error(error, message);
    }
}