"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import {
  BookOpen,
  User,
  Tag,
  Layers,
  Calendar,
  Mail,
  ArrowLeft,
  BookCheck,
  AlertCircle,
  X,
  Clock,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName?: string;
  userEmail?: string;
  createdAt?: string;
}

export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: session, isPending } = useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  const [returnDate, setReturnDate] = useState("");

  // প্রাইভেট রুট চেক
  useEffect(() => {
    if (!isPending && !session && id) {
      toast.error("Please login to view book details and borrow");
      router.push(`/login?callbackUrl=/books/${id}`);
    }
  }, [session, isPending, router, id]);

  // বইয়ের তথ্য ফেচ করা
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await apiFetch(`/books/${id}`);
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();
        setBook(data);
        document.title = `BookNook | ${data.title}`;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error fetching book";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (id && !isPending && session) {
      fetchBook();
    }
  }, [id, isPending, session]);

  // বই ধার নেওয়া
  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !session) return;

    setBorrowing(true);
    try {
      const res = await apiFetch("/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id,
          returnDate: returnDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      toast.success(`You have successfully borrowed "${book.title}"!`);
      setBook((prev) => (prev ? { ...prev, availableCopies: prev.availableCopies - 1 } : null));
      setModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Borrow failed";
      toast.error(message);
    } finally {
      setBorrowing(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#e5a856] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-400 font-serif">Opening library volume...</p>
      </div>
    );
  }

  if (!session) return null;

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <AlertCircle className="w-12 h-12 text-[#e5a856] mx-auto mb-3" />
        <h2 className="text-xl font-serif font-bold text-[#f7f2eb]">Book Not Found</h2>
        <p className="text-sm text-stone-400 mt-1 mb-6">
          The requested book does not exist or has been removed from our shelves.
        </p>
        <Link
          href="/books"
          className="px-6 py-2.5 bg-[#e5a856] text-[#120e0c] font-bold rounded-xl text-sm"
        >
          Back to All Books
        </Link>
      </div>
    );
  }

  const available = (book.availableCopies ?? book.totalCopies) > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-400 hover:text-[#e5a856] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-[#e5a856]" />
        <span>Back to Library Catalog</span>
      </Link>

      {/* Main Vintage Details Card */}
      <div className="bg-[#1c1613] rounded-3xl border border-[#30241e] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
        {/* Book Cover Image */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm aspect-[3/4] bg-[#120e0c] rounded-2xl overflow-hidden shadow-2xl border border-[#3a2c24] relative group">
            <Image
              src={book.image}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              unoptimized
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1613]/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Book Information */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#281f1a] text-[#e5a856] border border-[#423228] text-xs font-serif font-semibold rounded-full">
              <Tag className="w-3.5 h-3.5" />
              {book.category}
            </span>

            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#fdf8f0] leading-tight">
              {book.title}
            </h1>
            <p className="text-base text-stone-300 flex items-center gap-2">
              <User className="w-4 h-4 text-[#e5a856]" />
              <span>
                By <strong className="text-[#f7f2eb]">{book.author}</strong>
              </span>
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
                  available
                    ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
                    : "bg-red-950/40 text-red-400 border-red-800/50"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>
                  {available
                    ? `Available Copies: ${book.availableCopies ?? book.totalCopies} of ${book.totalCopies}`
                    : "Currently Out of Stock"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-serif font-bold text-[#e5a856] mb-1.5">About This Edition</h3>
              <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line font-sans">
                {book.description}
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-[#291f1a]">
            <div className="bg-[#241c17] p-4 rounded-xl border border-[#382b23] text-xs text-stone-400 space-y-1.5">
              <p className="font-semibold text-[#e5a856] flex items-center gap-1.5 font-serif">
                <BookOpen className="w-4 h-4" /> Added to Community Library By:
              </p>
              <p>Name: <span className="font-medium text-[#f7f2eb]">{book.userName || "BookNook Member"}</span></p>
              <p>Email: <span className="font-medium text-[#f7f2eb]">{book.userEmail || "N/A"}</span></p>
            </div>

            <button
              onClick={() => {
                setReturnDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
                setModalOpen(true);
              }}
              disabled={!available}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                available
                  ? "bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] text-[#120e0c] cursor-pointer shadow-[#d99b52]/15 hover:scale-[1.01]"
                  : "bg-[#251d19] text-stone-500 border border-[#362922] cursor-not-allowed"
              }`}
            >
              <BookCheck className="w-5 h-5" />
              <span>{available ? "Borrow This Book" : "Not Available"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#1c1613] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#3a2c24] relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-[#e5a856] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#2a201a] text-[#e5a856] rounded-xl border border-[#3e2e25]">
                <BookCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-[#f7f2eb]">Borrow Book</h3>
                <p className="text-xs text-stone-400">Confirm your reading reservation</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBorrow} className="space-y-4">
              <div className="p-3 bg-[#241c17] rounded-xl border border-[#342720] flex items-center gap-3">
                <Image src={book.image} alt={book.title} width={40} height={56} unoptimized className="w-10 h-14 object-cover rounded shadow-sm" />
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#fdf8f0] line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-stone-400">{book.author}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#e5a856]" /> Reader Name (Read-only)
                </label>
                <input
                  type="text"
                  readOnly
                  value={session.user.name || ""}
                  className="w-full px-3.5 py-2 bg-[#251d18] border border-[#382a22] rounded-lg text-sm text-stone-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#e5a856]" /> Reader Email (Read-only)
                </label>
                <input
                  type="email"
                  readOnly
                  value={session.user.email || ""}
                  className="w-full px-3.5 py-2 bg-[#251d18] border border-[#382a22] rounded-lg text-sm text-stone-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#e5a856]" /> Scheduled Return Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#251d18] border border-[#382a22] rounded-lg text-sm text-[#f7f2eb] focus:outline-none focus:border-[#e5a856] [color-scheme:dark]"
                />
                <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#e5a856]" /> Standard borrowing period is 7 days.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-[#3e2e25] hover:bg-[#251d18] text-stone-300 font-medium text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={borrowing}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] text-[#120e0c] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-[#d99b52]/20"
                >
                  {borrowing ? (
                    <span className="w-4 h-4 border-2 border-[#120e0c] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Confirm Borrow</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
