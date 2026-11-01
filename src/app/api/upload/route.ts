import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) return NextResponse.json({ message: "Image upload is not configured on the server" }, { status: 503 });

  const formData = await request.formData();
  const image = formData.get("image");
  if (!(image instanceof File) || !image.type.startsWith("image/")) {
    return NextResponse.json({ message: "Choose a valid image file" }, { status: 400 });
  }
  if (image.size > 8 * 1024 * 1024) {
    return NextResponse.json({ message: "Image must be 8 MB or smaller" }, { status: 400 });
  }

  const uploadData = new FormData();
  uploadData.set("image", image);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    body: uploadData,
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || !result?.data?.display_url) {
    return NextResponse.json({ message: "Image host rejected the upload" }, { status: 502 });
  }
  return NextResponse.json({ url: result.data.display_url });
}
