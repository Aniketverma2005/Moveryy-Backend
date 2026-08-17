import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiErrors } from "../../utils/ApiErrors.js";
import { Validation } from "../../utils/Validation.js";
import { ContactUs } from "../../models/index.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const submitComplaint = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiErrors(401, "Unauthorized Request");
    }

    const { name, mobile, description } = req.body;

    // Email comes from the logged-in user's token
    const email = req.user.email;

    // Validations
    if (Validation.isEmpty(name)) {
        throw new ApiErrors(400, "Name is required");
    }
    if (Validation.isEmpty(mobile) || !Validation.validatePhone(mobile)) {
        throw new ApiErrors(400, "A valid mobile number is required (e.g. +919876543210)");
    }
    if (Validation.isEmpty(description)) {
        throw new ApiErrors(400, "Complaint description is required");
    }

    // Save to DB
    const complaint = await ContactUs.create({
        name: name.trim(),
        mobile: mobile.trim(),
        email,
        description: description.trim()
    });

    // Send email to Moveryy team
    await transporter.sendMail({
        from: `"Moveryy Complaints" <${process.env.SMTP_FROM}>`,
        to: "moveryyy@gmail.com",
        subject: `New Complaint #${complaint.id} — ${name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Roboto','Helvetica','Arial',sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #dadce0; border-radius:8px;">

                                <!-- Header -->
                                <tr>
                                    <td style="padding:40px 40px 20px 40px; text-align:center;">
                                        <h1 style="margin:0; font-size:24px; font-weight:400; color:#202124;">
                                            Moveryy
                                        </h1>
                                        <p style="margin:8px 0 0 0; font-size:13px; color:#5f6368;">Complaint Management</p>
                                    </td>
                                </tr>

                                <!-- Title -->
                                <tr>
                                    <td style="padding:0 40px 10px 40px;">
                                        <h2 style="margin:0; font-size:20px; font-weight:500; color:#d93025;">
                                            New Complaint Received
                                        </h2>
                                        <p style="margin:6px 0 0 0; font-size:13px; color:#5f6368;">
                                            Complaint ID: <strong>#${complaint.id}</strong> &nbsp;|&nbsp; 
                                            Submitted: <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong>
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding:10px 40px;">
                                        <hr style="border:none; border-top:1px solid #e0e0e0; margin:0;">
                                    </td>
                                </tr>

                                <!-- Details -->
                                <tr>
                                    <td style="padding:20px 40px 30px 40px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:8px 0; width:30%;">
                                                    <span style="font-size:13px; color:#5f6368; font-weight:500;">Name</span>
                                                </td>
                                                <td style="padding:8px 0;">
                                                    <span style="font-size:14px; color:#202124;">${name}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;">
                                                    <span style="font-size:13px; color:#5f6368; font-weight:500;">Email</span>
                                                </td>
                                                <td style="padding:8px 0;">
                                                    <span style="font-size:14px; color:#202124;">${email}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;">
                                                    <span style="font-size:13px; color:#5f6368; font-weight:500;">Mobile</span>
                                                </td>
                                                <td style="padding:8px 0;">
                                                    <span style="font-size:14px; color:#202124;">${mobile}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0; vertical-align:top;">
                                                    <span style="font-size:13px; color:#5f6368; font-weight:500;">Description</span>
                                                </td>
                                                <td style="padding:8px 0;">
                                                    <span style="font-size:14px; color:#202124; line-height:1.6;">${description}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding:20px 40px; background-color:#fafafa; border-top:1px solid #f0f0f0; border-radius:0 0 8px 8px;">
                                        <p style="margin:0; font-size:12px; color:#5f6368; text-align:center;">
                                            This is an automated message from the Moveryy complaint system.
                                        </p>
                                        <p style="margin:6px 0 0 0; font-size:12px; color:#5f6368; text-align:center;">
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
    });

    return res.status(201).json({
        success: true,
        message: "Your complaint has been submitted successfully. Our team will get back to you shortly.",
        data: {
            id: complaint.id,
            name: complaint.name,
            email: complaint.email,
            mobile: complaint.mobile,
            status: complaint.status,
            createdAt: complaint.createdAt
        }
    });
});

export { submitComplaint };
