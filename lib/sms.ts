import africastalking from "africastalking";

const at = africastalking({
  apiKey: process.env.AT_API_KEY!,
  username: process.env.AT_USERNAME!,
});

const sms = at.SMS;

export async function sendSMS(to: string, message: string) {
  try {
    const payload: any = {
      to,
      message,
    };

    // Add senderId only if it exists
    //if (process.env.AT_SENDER_ID) {
     // payload.from = process.env.AT_SENDER_ID;
   // }

    const res = await sms.send(payload);

    console.log("📨 SMS Sent:", res);
    return true;
  } catch (error) {
    console.error("❌ SMS Error:", error);
    return false;
  }
}
