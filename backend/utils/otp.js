function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpHtml(otp, name = "there", expiresInMinutes = 10){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your FocusSync Verification Code</title>
    </head>
    <body style="margin:0; padding:0; background-color:#eef0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef0f3; padding: 48px 16px;">
            <tr>
                <td align="center">
                    <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);">

                        <!-- Logo / brand -->
                        <tr>
                            <td style="padding: 32px 40px 0 40px;">
                                <table role="presentation" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="width:28px; height:28px; background-color:#4f46e5; border-radius:7px; text-align:center; vertical-align:middle;">
                                            <span style="color:#ffffff; font-size:15px; font-weight:700; line-height:28px;">F</span>
                                        </td>
                                        <td style="padding-left:10px;">
                                            <span style="font-size:16px; font-weight:700; color:#111827;">FocusSync</span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Divider -->
                        <tr>
                            <td style="padding: 24px 40px 0 40px;">
                                <div style="border-top:1px solid #eef0f3;"></div>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 32px 40px 8px 40px;">
                                <p style="font-size:15px; color:#374151; margin:0 0 4px 0; line-height:1.6;">
                                    Hi ${name},
                                </p>
                                <h1 style="font-size:19px; font-weight:600; color:#111827; margin:16px 0 12px 0; line-height:1.4;">
                                    Verify your email address
                                </h1>
                                <p style="font-size:14px; color:#6b7280; margin:0 0 28px 0; line-height:1.6;">
                                    Enter the code below to confirm your email and finish setting up your FocusSync account. This code expires in ${expiresInMinutes} minutes.
                                </p>
                            </td>
                        </tr>

                        <!-- OTP code block -->
                        <tr>
                            <td style="padding: 0 40px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:10px;">
                                    <tr>
                                        <td style="padding: 22px 24px; text-align:center;">
                                            <span style="font-size:30px; font-weight:700; letter-spacing:10px; color:#111827; font-family: 'Courier New', monospace;">
                                                ${otp}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Security note -->
                        <tr>
                            <td style="padding: 24px 40px 40px 40px;">
                                <p style="font-size:13px; color:#9ca3af; margin:0; line-height:1.6;">
                                    Didn't request this code? You can safely ignore this email — your account is still secure. Never share this code with anyone, including FocusSync staff.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#f9fafb; padding: 20px 40px; border-top:1px solid #eef0f3; text-align:center;">
                                <p style="font-size:12px; color:#9ca3af; margin:0; line-height:1.6;">
                                    &copy; ${new Date().getFullYear()} FocusSync &nbsp;·&nbsp; This is an automated message, please don't reply.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

module.exports = {generateOtp, getOtpHtml};