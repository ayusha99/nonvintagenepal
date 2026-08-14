import nodemailer from 'nodemailer';

const canSendMail = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter;

function getTransporter() {
  if (!transporter && canSendMail()) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendPasswordResetEmail(to, resetUrl) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  if (canSendMail()) {
    const mail = getTransporter();
    await mail.sendMail({
      from: `"Non Vintage Nepal" <${from}>`,
      to,
      subject: 'Reset your password — Non Vintage Nepal',
      html: `
        <p>You requested a password reset for your Non Vintage Nepal account.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
      `,
      text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[dev] Password reset link for ${to}:\n${resetUrl}`);
    return;
  }

  throw new Error('Email service is not configured');
}
