export interface IEmailService{
    sendEmail(from: string, to: string[], message: string): Promise<void>
}