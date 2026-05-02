import nodemailer from 'nodemailer';

class Email {
    to: string;
    firstName: string;
    url: string;
    from: string;

    constructor(to: string, firstName: string, url: string) {
        this.to = to;
        this.firstName = firstName;
        this.url = url;
        this.from = process.env.EMAIL_FROM || 'Starbucks <no-reply@starbucks.com>';
    }

    newTransport() {
        if (!process.env.EMAIL_HOST || !process.env.EMAIL_USERNAME) {
            return null;
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(subject: string, html: string) {
        const transport = this.newTransport();
        if (!transport) {
            console.log('Email skipped: SMTP not configured');
            return;
        }
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
        };

        await transport.sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send(
            'Welcome to Starbucks',
            `<h1>Welcome ${this.firstName}</h1><p>Your account is ready.</p><p>Visit: <a href="${this.url}">${this.url}</a></p>`
        );
    }

    async sendPasswordReset() {
        await this.send(
            'Password reset request',
            `<h1>Password reset</h1><p>Reset your password here: <a href="${this.url}">${this.url}</a></p>`
        );
    }
}

export default Email;