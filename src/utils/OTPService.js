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
    from: `"Moveryy" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: `Email verification code: ${otp}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #dadce0; border-radius: 8px;">
                
                <!-- Logo/Brand -->
                <tr>
                  <td style="padding: 40px 40px 30px 40px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #202124; letter-spacing: -0.5px;">
                      Moveryy
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 400; color: #202124;">
                      Verify your email
                    </h2>
                    
                    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 20px; color: #5f6368;">
                      Moveryy received a request to use <strong>${email}</strong> as a recovery email for your Moveryy account.
                    </p>
                    
                    <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 20px; color: #5f6368;">
                      Use this code to finish setting up your account:
                    </p>
                    
                    <!-- OTP -->
                    <div style="text-align: center; margin: 30px 0;">
                      <h1 style="margin: 0; font-size: 36px; font-weight: 400; color: #202124; letter-spacing: 5px;">
                        ${otp}
                      </h1>
                    </div>
                    
                    <p style="margin: 30px 0 20px 0; font-size: 14px; line-height: 20px; color: #5f6368;">
                      This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.
                    </p>
                    
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #5f6368;">
                      If you don't recognise <strong>${email}</strong>, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; font-size: 12px; line-height: 18px; color: #5f6368; text-align: center;">
                      You received this email to let you know about important changes to your Moveryy Account and services.
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; line-height: 18px; color: #5f6368; text-align: center;">
                      © ${new Date().getFullYear()} Moveryy LLC
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
  
  await transporter.sendMail(mailOptions);
};