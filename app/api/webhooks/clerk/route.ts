import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkUserCreatedEvent = {
  data: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    primary_email_address_id: string | null;
    email_addresses: ClerkEmailAddress[];
  };
  object: "event";
  type: "user.created";
};

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST(req: Request) {
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing WEBHOOK_SECRET environment variable.");
    return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
  }

  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Svix headers." }, { status: 400 });
  }

  const rawBody = await req.text();

  let evt: ClerkUserCreatedEvent;

  try {
    const wh = new Webhook(webhookSecret);
    evt = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch (error) {
    console.error("Error verifying Clerk webhook:", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const clerkUserId = evt.data.id;
    const primaryEmailAddressId = evt.data.primary_email_address_id;

    const primaryEmail =
      evt.data.email_addresses.find((email) => email.id === primaryEmailAddressId)?.email_address ??
      evt.data.email_addresses[0]?.email_address;

    if (!primaryEmail) {
      console.error("Clerk user.created event did not include a usable email address.", evt.data);
      return NextResponse.json({ error: "Missing email address." }, { status: 400 });
    }

    await prisma.user.upsert({
      where: {
        clerkUserId,
      },
      update: {
        email: primaryEmail,
        firstName: evt.data.first_name ?? null,
        lastName: evt.data.last_name ?? null,
      },
      create: {
        clerkUserId,
        email: primaryEmail,
        firstName: evt.data.first_name ?? null,
        lastName: evt.data.last_name ?? null,
      },
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
