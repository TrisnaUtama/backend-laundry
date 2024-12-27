import nodemailer, { type Transporter, type SendMailOptions } from "nodemailer";

export async function notifyEmail(code: number, receiver: string) {
	const pass = `${process.env.SMPT_PASSWORD}`;
	const transporter: Transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: "putu.trisna12@gmail.com",
			pass: pass,
		},
	});

	try {
		const info: SendMailOptions = await transporter.sendMail({
			from: '"Laundry.club" <no-reply@laundry.club>',
			to: `${receiver}`,
			subject: "OTP Notification",
			text: `Your OTP code is ${code}. It will expire in 5 minutes.`,
		});
		console.log("Message sent: %s", info.messageId);
	} catch (error) {
		console.log(pass);
		console.error("Error sending email:", error);
	}
}
