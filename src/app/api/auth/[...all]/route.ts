import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    return await auth.handler(request);
  } catch (error) {
    console.error("BetterAuth GET Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    return await auth.handler(request);
  } catch (error) {
    console.error("BetterAuth POST Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}