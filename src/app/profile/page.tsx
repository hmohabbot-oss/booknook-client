"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { BookOpen, Mail, UserRound } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.title = "BookNook | My Profile";
    if (!isPending && !session) router.replace("/login?callbackUrl=/profile");
  }, [isPending, session, router]);

  if (isPending || !session) {
    return <div className="flex min-h-[50vh] items-center justify-center text-stone-400">Loading profile...</div>;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-3xl border border-[#30241e] bg-[#1c1613] p-8 text-center shadow-xl sm:p-10">
        {session.user.image ? (
          <Image src={session.user.image} alt="Profile" width={96} height={96} unoptimized className="mx-auto mb-5 h-24 w-24 rounded-full border border-[#48352b] object-cover" />
        ) : (
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#48352b] bg-[#281f1a] text-[#e5a856]"><UserRound className="h-10 w-10" /></div>
        )}
        <h1 className="font-serif text-3xl font-bold text-[#f7f2eb]">My Profile</h1>
        <p className="mt-2 text-sm text-stone-400">Your BookNook reader account</p>
        <div className="mt-8 space-y-4 border-t border-[#30241e] pt-6 text-left">
          <p className="flex items-center gap-3 text-sm text-stone-200"><UserRound className="h-4 w-4 text-[#e5a856]" />{session.user.name || "Reader"}</p>
          <p className="flex items-center gap-3 text-sm text-stone-200"><Mail className="h-4 w-4 text-[#e5a856]" />{session.user.email}</p>
          <p className="flex items-center gap-3 text-sm text-stone-400"><BookOpen className="h-4 w-4 text-[#e5a856]" />Community library member</p>
        </div>
      </div>
    </section>
  );
}
