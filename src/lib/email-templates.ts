export interface EmailTemplateProps {
  fullName: string
  email: string
  otp?: string
  resetLink?: string
}

export const emailTemplates = {
  welcome: ({ fullName, email }: EmailTemplateProps) => ({
    subject: 'Welcome to Coaching Management System',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Coaching Management System</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 32px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #667eea;
              margin-top: 0;
              font-size: 24px;
            }
            .content p {
              margin-bottom: 20px;
              color: #555;
            }
            .features {
              background-color: #f8f9fa;
              padding: 30px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .features ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .features li {
              padding: 12px 0;
              padding-left: 30px;
              position: relative;
            }
            .features li:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #667eea;
              font-weight: bold;
              font-size: 18px;
            }
            .footer {
              background-color: #667eea;
              color: #ffffff;
              text-align: center;
              padding: 20px;
              font-size: 14px;
            }
            .footer a {
              color: #ffffff;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Coaching Management System</h1>
            </div>
            <div class="content">
              <h2>Hello, ${fullName}! 👋</h2>
              <p>Welcome to the Coaching Management System! We're thrilled to have you on board. Your account has been successfully created and is ready to use.</p>

              <div class="features">
                <h3 style="margin-top: 0; color: #667eea;">What's Next?</h3>
                <ul>
                  <li>Set up your coaching profile</li>
                  <li>Create and manage batches and courses</li>
                  <li>Track student attendance and performance</li>
                  <li>Manage fee collection and payments</li>
                  <li>Generate reports and analytics</li>
                </ul>
              </div>

              <p>To get started, simply sign in to your account using the email address: <strong>${email}</strong></p>

              <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>

              <p>We look forward to helping you streamline your coaching operations!</p>

              <p>Best regards,<br>The Coaching Management Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Coaching Management System. All rights reserved.</p>
              <p style="margin-top: 10px;">
                If you didn't create this account, please disregard this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  otpVerification: ({ fullName, otp }: EmailTemplateProps) => ({
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 32px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #667eea;
              margin-top: 0;
              font-size: 24px;
            }
            .content p {
              margin-bottom: 20px;
              color: #555;
            }
            .otp-box {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff;
              font-size: 36px;
              font-weight: 700;
              letter-spacing: 8px;
              padding: 25px;
              text-align: center;
              border-radius: 8px;
              margin: 30px 0;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              background-color: #667eea;
              color: #ffffff;
              text-align: center;
              padding: 20px;
              font-size: 14px;
            }
            .footer a {
              color: #ffffff;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <h2>Hello, ${fullName}! 👋</h2>
              <p>Thank you for signing up for the Coaching Management System. To complete your registration, please verify your email address using the code below:</p>

              <div class="otp-box">${otp}</div>

              <p>This verification code will expire in <strong>10 minutes</strong>. Please use it as soon as possible.</p>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <p style="margin: 5px 0 0 0;">
                  Never share this code with anyone. Our team will never ask for your verification code.
                </p>
              </div>

              <p>If you didn't request this code, please ignore this email and your account will not be created.</p>

              <p>Best regards,<br>The Coaching Management Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Coaching Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: ({ fullName, resetLink }: EmailTemplateProps) => ({
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 32px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #667eea;
              margin-top: 0;
              font-size: 24px;
            }
            .content p {
              margin-bottom: 20px;
              color: #555;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              background-color: #667eea;
              color: #ffffff;
              text-align: center;
              padding: 20px;
              font-size: 14px;
            }
            .footer a {
              color: #ffffff;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello, ${fullName}! 👋</h2>
              <p>We received a request to reset your password for your Coaching Management System account. If you made this request, click the button below to reset your password:</p>

              <div style="text-align: center;">
                <a href="${resetLink}" class="reset-button">Reset Password</a>
              </div>

              <p>Alternatively, you can copy and paste the following link into your browser:</p>
              <p style="word-break: break-all; color: #667eea; font-size: 12px;">${resetLink}</p>

              <div class="warning">
                <strong>⚠️ Important:</strong>
                <p style="margin: 5px 0 0 0;">
                  This password reset link will expire in <strong>10 minutes</strong>. After that, you'll need to request a new reset link.
                </p>
              </div>

              <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>

              <p>Best regards,<br>The Coaching Management Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Coaching Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}
