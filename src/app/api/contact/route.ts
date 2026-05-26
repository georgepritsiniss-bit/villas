import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email"),
  subject: z.string().trim().min(2, "Subject is too short").max(200),
  message: z.string().trim().min(10, "Message is too short").max(5000),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = ContactSchema.parse(json);

    // In production, forward this to your CRM/inbox provider
    // (e.g. Resend, Postmark, Slack webhook, or store in a `messages`
    // Supabase table). For now we log and acknowledge.
    console.info("[contact] new message", data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    console.error("[contact] failed", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
