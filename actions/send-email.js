import { Resend } from "resend";
import { _success } from "zod/v4/core";

export async function sendEmail({ to, subject, react }) {
    const resend = new Resend(process.env.RESEND_API_KEY || "");

    try {
        const data = await resend.emails.send({
            from: "BaChatBhai <onboarding@resend.dev>",
            to,
            subject,
            react,
        })

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }
}