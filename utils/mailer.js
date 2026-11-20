const { google } = require("googleapis");
const oauth2Client = require("./googleAuth.js");

// Configure Gmail API
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
});

// Send an email using Gmail API
async function sendEmail(to, subject, html) {
    const message = [
        `From: WanderLust <${process.env.GMAIL_USER}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        'Content-Type: text/html; charset="UTF-8"',
        "",
        html,
    ].join("\r\n");

    // Encode the email in Gmail API format
    const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage,
        },
    });

    return response.data;
}

// Send email verification OTP
async function sendVerificationEmail(email, otp) {
    const info = await sendEmail(
        email,
        "Verify your WanderLust account",
        `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to WanderLust!</h2>
                <p>Thank you for creating an account.</p>
                <p>Use the following verification code to verify your email address:</p>
                <h1 style="color: #FE405C; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
                <p>Happy exploring!<br>Team WanderLust</p>
            </div>
        `
    );

    // console.log("Verification email sent:", info.id);

    return info;
}

// Send booking confirmation email
async function sendBookingConfirmationEmail(booking) {
    const info = await sendEmail(
        booking.guestDetails.email,
        "Your WanderLust booking is confirmed!",
        `
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

                <p><strong>Total Amount:</strong> $${booking.pricingDetails.totalPrice.toLocaleString("en-CA")} CAD</p>

                <p>Thank you for choosing WanderLust!</p>

                <p>Happy exploring!<br>Team WanderLust</p>
            </div>
        `
    );

    // console.log("Booking confirmation email sent:", info.id);

    return info;
}

module.exports = {
    sendVerificationEmail,
    sendBookingConfirmationEmail,
};
