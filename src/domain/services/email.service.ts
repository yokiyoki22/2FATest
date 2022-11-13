import { injectable } from "tsyringe";
import { IEmailService } from "../interfaces/services/iemail.service";

@injectable()
export class EmailService implements IEmailService{
    async sendEmail(from: string, to: string[], message: string): Promise<void> {
        console.log(message);
    }
}