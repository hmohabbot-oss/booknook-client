import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.json({ message: "Server authentication is not configured" }, { status: 500 });
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    sub: session.user.id,
    email: session.user.email,
    name: session.user.name,
    iat: now,
    exp: now + 5 * 60,
    iss: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    aud: process.env.JWT_AUDIENCE || "booknook-api",
  }));
  const input = `${header}.${payload}`;
  const signature = createHmac("sha256", secret).update(input).digest("base64url");

  return NextResponse.json({ token: `${input}.${signature}` }, {
    headers: { "Cache-Control": "no-store, private" },
  });
}
