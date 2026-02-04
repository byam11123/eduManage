import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const senderEmail = process.env.RESEND_SENDER_EMAIL || 'kaiwartyabyamkesh7@gmail.com'

export { resend, senderEmail }
