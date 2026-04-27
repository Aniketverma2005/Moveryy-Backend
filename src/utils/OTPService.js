import nodemailer from 'nodemailer'

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendOTPEmail = async (email, otp, firstName) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Email Verification OTP - Moveryy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Moveryy, ${firstName}!</h2>
        <p>Your email verification OTP is:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};