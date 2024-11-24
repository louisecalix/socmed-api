import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
});

export async function sendResetEmail(to, token) {
    const resetUrl = `https://yourwebsite.com/reset-password?token=${token}`;
    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetUrl}. This link will expire in 30 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset email sent successfully');
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw error;
    }
}
