
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendVerificationEmail(email, otp) {
    const info = await transporter.sendMail({
        from: `"WanderLust" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your WanderLust account",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to WanderLust!</h2>
                <p>Thank you for creating an account.</p>
                <p>Use the following verification code to verify your email address:</p>
                <h1 style="color: #FE405C; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
                <p>Happy exploring!<br>Team WanderLust</p>
            </div>
        `,
    });

    console.log("Email sent:", info.messageId);

    return info;
}

module.exports = { transporter, sendVerificationEmail };
