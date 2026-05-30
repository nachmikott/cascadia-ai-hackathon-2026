import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendSMS(message: string) {
  const phoneNumber = process.env.NEIGHBOR_PHONE_NUMBER;
  if (!phoneNumber) {
    console.error("[sms] NEIGHBOR_PHONE_NUMBER not set");
    return;
  }

  try {
    await sns.send(new PublishCommand({ Message: message, PhoneNumber: phoneNumber }));
    console.log("[sms] SMS sent to", phoneNumber);
  } catch (e) {
    console.error("[sms] Failed to send SMS:", e);
  }
}
