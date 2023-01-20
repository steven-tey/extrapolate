import nodemailer from "nodemailer";
import { buildSendMail } from "mailing-core";

const transport = nodemailer.createTransport({
  host: "smtp.postmarkapp.com",
  port: 587,
  auth: {
    user: process.env.POSTMARK_TOKEN,
    pass: process.env.POSTMARK_TOKEN,
  },
});

const sendMail = buildSendMail({
  transport,
  defaultFrom: "Steven from Extrapolate <steven@extrapolate.app>",
  configPath: "./mailing.config.json",
});

export default sendMail;
