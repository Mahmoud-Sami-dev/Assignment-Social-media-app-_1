import {MailjetEmailProvider} from "./mail-jet.service";

export const mailjetProvider = new MailjetEmailProvider({
    apiKey: "12345",
    secretKey: "54321",
    fromEmail: "nassefm807@gmail.com",
    fromName: "nassefm807",
})