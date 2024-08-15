import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiRespose";

export async function sendVeficationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code MM",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "verification email send Successfully" };
  } catch (emailError) {
    console.error("error sending email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
