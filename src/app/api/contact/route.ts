import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  phone: z.string().max(50).optional(),
  business: z.string().max(200).optional(),
  plan: z.string().max(50).optional(),
  message: z.string().max(5000).optional(),
  // Honeypot — hidden field, humans leave it empty
  website: z.string().max(200).optional(),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, phone, business, plan, message, website } = parsed.data;

  // Bot filled the honeypot — pretend success, send nothing
  if (website) {
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const row = (label: string, value: string) =>
    `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`;

  const { error } = await resend.emails.send({
    from: "Budapest Labs <hello@budapestlabs.com>",
    to: "hello@budapestlabs.com",
    replyTo: email,
    subject: `New inquiry from ${name}${business ? ` (${business})` : ""}`,
    html: [
      "<h2>New contact form submission</h2>",
      row("Name", name),
      row("Email", email),
      phone ? row("Phone", phone) : "",
      business ? row("Business", business) : "",
      plan ? row("Plan", plan) : "",
      message
        ? `<p><strong>Message:</strong></p><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`
        : "",
    ].join("\n"),
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
