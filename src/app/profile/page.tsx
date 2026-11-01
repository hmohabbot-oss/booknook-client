"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { User, Mail, Sparkles, Image as ImageIcon, Check, BookOpen } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = "BookNook | My Profile";
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to view your profile");
      router.push("/login?callbackUrl=/profile");
    } else if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session, isPending, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setUpdating(true);
    try {
      await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (text?: string) => {
    if (!text) return "BN";
    return text
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#e5a856] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-400 font-serif">Opening your reader profile...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#1c1613] rounded-3xl border border-[#30241e] shadow-2xl overflow-hidden p-8 sm:p-10 space-y-8">
        {/* Header / Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-[#291f1a]">
          <div className="relative">
            {image && !image.includes("dicebear") && !image.includes("googleusercontent.com") ? (
              <img
                src={image}
                alt={name || "Reader"}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#e5a856]/70 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#d99b52] to-[#e5a856] text-[#120e0c] font-serif font-extrabold text-2xl flex items-center justify-center border-4 border-[#f0b76e]/50 shadow-xl">
                {getInitials(name || session.user.name)}
              </div>
            )}
            <span className="absolute bottom-0 right-0 p-1.5 bg-[#251d18] text-[#e5a856] border border-[#3e2e25] rounded-full shadow-md">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdf8f0]">
              {session.user.name}
            </h1>
            <p className="text-xs text-stone-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#e5a856]" />
              <span>{session.user.email}</span>
            </p>
            <p className="text-[11px] text-[#e5a856] font-serif pt-1 flex items-center justify-center sm:justify-start gap-1">
              <BookOpen className="w-3.5 h-3.5" /> BookNook Verified Reader Member
            </p>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div>
          <h2 className="text-lg font-serif font-bold text-[#f7f2eb] mb-1">Edit Profile Details</h2>
          <p className="text-xs text-stone-400 mb-6">Update your display name and profile picture URL</p>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#e5a856] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  readOnly
                  value={session.user.email || ""}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#17120f] border border-[#2d221c] rounded-xl text-sm text-stone-400 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5">Profile Photo URL</label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-[#e5a856] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="py-3 px-6 bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] text-[#120e0c] font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d99b52]/15 disabled:opacity-70"
            >
              {updating ? (
                <span className="w-4 h-4 border-2 border-[#120e0c] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}