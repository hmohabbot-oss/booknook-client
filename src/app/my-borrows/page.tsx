"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { BookMarked, Calendar, Undo2, ArrowRight, BookOpen, Clock } from "lucide-react";

interface BorrowRecord {
  _id: string;
  bookId: string;
  title: string;
  image: string;
  borrowDate: string;
  returnDate: string;
  userEmail: string;
}

export default function MyBorrowsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "BookNook | My Borrows";
  }, []);

  // প্রাইভেট রুট গার্ড
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to view your borrowed books");
      router.push("/login?callbackUrl=/my-borrows");
    }
  }, [session, isPending, router]);

  // ইউজারের ধার নেওয়া বইয়ের তালিকা লোড করা
  useEffect(() => {
    const fetchBorrows = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await apiFetch("/borrows");
        if (!res.ok) throw new Error("Failed to load borrowed books");
        const data = await res.json();
        setBorrows(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error fetching borrowed books";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchBorrows();
    }
  }, [session]);

  // বই ফেরত দেওয়ার ফাংশন (Return Book)
  const handleReturnBook = async (borrowId: string, title: string) => {
    setReturningId(borrowId);
    try {
      const res = await apiFetch(`/borrows/${borrowId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to return book");
      }

      toast.success(`"${title}" returned successfully! Available copies updated.`);
      // তালিকা থেকে বইটি রিমুভ করা
      setBorrows((prev) => prev.filter((item) => item._id !== borrowId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error returning book";
      toast.error(message);
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || (loading && session)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#e5a856] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-400 font-medium">Loading your borrowed books...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#30241e]">
        <div>
          <h1 className="text-3xl font-bold text-[#f7f2eb] flex items-center gap-2">
            <BookMarked className="w-8 h-8 text-[#e5a856]" />
            <span>My Borrowed Books</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Track and manage all the books you have currently borrowed from BookNook.
          </p>
        </div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a201a] hover:bg-[#30241e] text-stone-200 font-medium text-xs rounded-xl transition-colors self-start sm:self-auto"
        >
          <span>Browse More Books</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {borrows.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-[#1c1613] rounded-2xl border border-dashed border-[#3e2e25] p-8 max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 text-stone-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-stone-200">No books borrowed yet</h3>
          <p className="text-sm text-stone-400 mt-1 mb-6">
            You haven&apos;t borrowed any books from our library yet. Find a book you like and start reading!
          </p>
          <Link
            href="/books"
            className="px-5 py-2.5 bg-[#d99b52] hover:bg-[#e5a856] text-[#120e0c] text-sm font-medium rounded-xl inline-flex items-center gap-2"
          >
            <span>Explore Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Responsive Table */
        <div className="bg-[#1c1613] rounded-2xl border border-[#30241e] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#251d18] border-b border-[#30241e] text-stone-300 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Book</th>
                  <th className="py-4 px-6">Borrow Date</th>
                  <th className="py-4 px-6">Return Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30241e] text-sm">
                {borrows.map((record) => (
                  <tr key={record._id} className="hover:bg-[#251d18]/60 transition-colors">
                    {/* Image & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <Image
                          src={record.image}
                          alt={record.title}
                          width={48}
                          height={64}
                          unoptimized
                          className="w-12 h-16 object-cover rounded shadow-sm border border-[#30241e]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500";
                          }}
                        />
                        <span className="font-bold text-[#f7f2eb] line-clamp-1">
                          {record.title}
                        </span>
                      </div>
                    </td>

                    {/* Borrow Date */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs text-stone-300 bg-[#2a201a] px-2.5 py-1 rounded-md">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        {record.borrowDate}
                      </span>
                    </td>

                    {/* Return Date */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#e5a856] bg-[#2a201a] border border-[#3e2e25] px-2.5 py-1 rounded-md font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#e5a856]" />
                        {record.returnDate}
                      </span>
                    </td>

                    {/* Return Action Button */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleReturnBook(record._id, record.title)}
                        disabled={returningId === record._id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2a201a] hover:bg-[#d99b52] text-[#e5a856] hover:text-[#120e0c] font-medium text-xs rounded-xl transition-colors disabled:opacity-60"
                      >
                        {returningId === record._id ? (
                          <span className="w-3.5 h-3.5 border-2 border-[#e5a856] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Undo2 className="w-3.5 h-3.5" />
                            <span>Return Book</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
