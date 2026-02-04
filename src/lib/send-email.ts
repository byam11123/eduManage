import { resend, senderEmail } from './email'
import { emailTemplates, EmailTemplateProps } from './email-templates'

export async function sendEmail(
  type: 'welcome' | 'otp' | 'password-reset',
  to: string,
  props: EmailTemplateProps
) {
  try {
    if (!resend) {
      console.warn('Resend API key not configured. Email sending disabled.')
      // In development, return success to prevent blocking the flow
      return { success: true, data: null }
    }

    let template

    switch (type) {
      case 'welcome':
        template = emailTemplates.welcome(props)
        break
      case 'otp':
        template = emailTemplates.otpVerification(props)
        break
      case 'password-reset':
        template = emailTemplates.passwordReset(props)
        break
      default:
        throw new Error('Invalid email type')
    }

    const data = await resend.emails.send({
      from: senderEmail,
      to,
      subject: template.subject,
      html: template.html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}

export async function sendOtpEmail(email: string, otp: string, fullName: string) {
  return sendEmail('otp', email, { fullName, email, otp })
}

export async function sendWelcomeEmail(email: string, fullName: string) {
  return sendEmail('welcome', email, { fullName, email })
}

export async function sendPasswordResetEmail(
  email: string,
  fullName: string,
  resetLink: string
) {
  return sendEmail('password-reset', email, { fullName, email, resetLink })
}
