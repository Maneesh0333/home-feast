import { Resend } from "resend";
import dotenv from "dotenv";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY in .env");
}

const verifyMail = async (mail, otp) => {
  try {
    const source = await fs.promises.readFile(
      path.join(__dirname, "verifyTemplete.hbs"),
      "utf-8",
    );

    const template = handlebars.compile(source);

    const htmlToSend = template({
      otp,
      year: new Date().getFullYear(),
      appName: "HomeFeast",
    });

    const response = await resend.emails.send({
      from: "HomeFeast <onboarding@resend.dev>",
      to: mail,
      subject: "Your Verification Code",
      html: htmlToSend,
    });

    console.log("Email sent:", response);

    return response;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};

export default verifyMail;