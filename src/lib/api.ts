export async function apiFetch(path: string, init: RequestInit = {}) {
  const tokenResponse = await fetch("/api/token", { cache: "no-store" });
  if (!tokenResponse.ok) throw new Error("Your session expired. Please sign in again.");
  const { token } = await tokenResponse.json();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}${path}`, {
    ...init,
    headers,
  });
}

export async function uploadBookImage(file: File) {
  const formData = new FormData();
  formData.set("image", file);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Image upload failed");
  return result.url as string;
}
