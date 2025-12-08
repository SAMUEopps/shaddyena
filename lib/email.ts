import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPasswordResetEmailProps {
  email: string;
  resetUrl: string;
  userName: string;
}

export async function sendPasswordResetEmail({ 
  email, 
  resetUrl, 
  userName 
}: SendPasswordResetEmailProps) {
  try {
    await resend.emails.send({
      from: 'Shaddyna <no-reply@shaddyna.com>',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Shaddyna</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          </style>
        </head>
        <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #bf2c7e 0%, #a8256c 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                <svg style="width: 40px; height: 40px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Reset Your Password
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0; font-size: 16px;">
                Hello ${userName}, let's get you back into your account
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 48px 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin-bottom: 24px; color: #4b5563;">
                You recently requested to reset your password for your Shaddyna account. Click the button below to proceed.
              </p>

              <!-- Reset Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #bf2c7e 0%, #a8256c 100%); 
                          color: white; 
                          padding: 18px 36px; 
                          text-decoration: none; 
                          border-radius: 10px; 
                          font-weight: 600;
                          font-size: 16px;
                          display: inline-block;
                          box-shadow: 0 4px 20px rgba(191, 44, 126, 0.3);
                          transition: all 0.3s ease;
                          letter-spacing: 0.5px;">
                  Reset Password
                </a>
              </div>

              <!-- Link Backup -->
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #bf2c7e;">
                <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">
                  <strong>🔒 Security Note:</strong> For your security, this link expires in 15 minutes and can only be used once.
                </p>
              </div>

              <!-- Alternative Link -->
              <div style="margin: 30px 0;">
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 14px; color: #374151; word-break: break-all; font-family: 'SF Mono', Monaco, Consolas, monospace;">
                    ${resetUrl}
                  </p>
                </div>
              </div>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;">

              <!-- Support Info -->
              <div style="text-align: center;">
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                  Need help or have questions?
                </p>
                <a href="mailto:support@shaddyna.com" 
                   style="color: #bf2c7e; font-size: 14px; font-weight: 600; text-decoration: none;">
                  Contact our support team →
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 32px 40px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0 0 8px;">
                This email was sent to ${email}
              </p>
              <p style="margin: 0 0 16px;">
                Shaddyna © ${new Date().getFullYear()} · All rights reserved
              </p>
              <div style="display: inline-flex; gap: 24px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms" style="color: #9ca3af; text-decoration: none;">Terms of Service</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send email');
  }
}