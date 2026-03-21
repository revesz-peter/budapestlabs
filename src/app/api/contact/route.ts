import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, phone, business, plan, message } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Budapest Labs <hello@budapestlabs.com>",
    to: "budapestlabs@gmail.com",
    replyTo: email,
    subject: `New inquiry from ${name}${business ? ` (${business})` : ""}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${business ? `<p><strong>Business:</strong> ${business}</p>` : ""}
      ${plan ? `<p><strong>Plan:</strong> ${plan}</p>` : ""}
      ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ""}
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
