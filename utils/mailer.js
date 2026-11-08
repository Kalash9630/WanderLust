
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

async function sendBookingConfirmationEmail(booking) {
    const info = await transporter.sendMail({
        from: `"WanderLust" <${process.env.EMAIL_USER}>`,
        to: booking.guestDetails.email,
        subject: "Your WanderLust booking is confirmed!",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #FE405C;">Your stay is confirmed!</h2>

                <p>Hello ${booking.guestDetails.fullName},</p>

                <p>Your booking with WanderLust has been successfully confirmed.</p>

                <h3>Booking Details</h3>

                <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
                <p><strong>Property:</strong> ${booking.listing.title}</p>
                <p><strong>Location:</strong> ${booking.listing.location}, ${booking.listing.country}</p>
                <p><strong>Check-in:</strong> ${new Date(booking.stayDetails.checkIn).toDateString()}</p>
                <p><strong>Check-out:</strong> ${new Date(booking.stayDetails.checkOut).toDateString()}</p>
                <p><strong>Nights:</strong> ${booking.stayDetails.nights}</p>

                <h3>Payment Summary</h3>

                <p><strong>Total Amount:</strong> ₹ ${booking.pricingDetails.totalPrice.toLocaleString("en-IN")}</p>

                <p>Thank you for choosing WanderLust!</p>

                <p>Happy exploring!<br>Team WanderLust</p>
            </div>
        `,
    });

    console.log("Booking confirmation email sent:", info.messageId);

    return info;
}

module.exports = {
    transporter,
    sendVerificationEmail,
    sendBookingConfirmationEmail
};