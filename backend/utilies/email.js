import nodemailer from "nodemailer";
import logger from "./logger.js";

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

export async function sendEmail({ to, subject, text, html }) {
  const mailer = getTransporter();
  if (!mailer || !to) {
    logger.debug({ to, subject }, "Email skipped (SMTP not configured)");
    return false;
  }

  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || "CivicEye <noreply@civiceye.app>",
      to,
      subject,
      text,
      html: html || text,
    });
    return true;
  } catch (err) {
    logger.error({ err: err.message, to }, "Failed to send email");
    return false;
  }
}
