"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";
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

  // ডিফল্ট রিটার্ন ডেট (আজ থেকে ৭ দিন পর)
  const defaultReturnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [returnDate, setReturnDate] = useState(defaultReturnDate);

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
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/books/${id}`);
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

    if (id) {
      fetchBook();
    }
  }, [id]);

  // বই ধার নেওয়ার ফাংশন (Borrow Action)
  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !session) return;

    setBorrowing(true);
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id,
          userEmail: session.user.email,
          userName: session.user.name,
          returnDate: returnDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      toast.success(`You have successfully borrowed "${book.title}"!`);
      // UI-তে ইনস্ট্যান্ট কপি সংখ্যা ১ কমিয়ে দেওয়া
      setBook((prev) => (prev ? { ...prev, availableCopies: prev.availableCopies - 1 } : null));
      setModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Borrow failed";
      toast.error(message);
    } finally {
      setBorrowing(false);
    }
  };

  // লোডিং স্টেট
  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading book details...</p>
      </div>
    );
  }

  if (!session) return null;

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Book Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          The requested book does not exist or has been removed.
        </p>
        <Link
          href="/books"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium"
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
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Books</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
        {/* Book Cover Image */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500";
              }}
            />
          </div>
        </div>

        {/* Book Information */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
              <Tag className="w-3.5 h-3.5" />
              {book.category}
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 leading-tight">
              {book.title}
            </h1>
            <p className="text-base text-slate-600 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <span>
                By <strong className="text-slate-800">{book.author}</strong>
              </span>
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                  available
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>
                  {available
                    ? `Available Copies: ${book.availableCopies ?? book.totalCopies} of ${book.totalCopies}`
                    : "Not Available (Out of Stock)"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-800 mb-1">About This Book</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>
          </div>

          {/* Added by & Action */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Added by Community Contributor:
              </p>
              <p>Name: <span className="font-medium text-slate-800">{book.userName || "BookNook Member"}</span></p>
              <p>Email: <span className="font-medium text-slate-800">{book.userEmail || "N/A"}</span></p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              disabled={!available}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                available
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <BookCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Borrow Book</h3>
                <p className="text-xs text-slate-500">Confirm your book borrowing details</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBorrow} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <img src={book.image} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-slate-500">{book.author}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Your Name (Read-only)
                </label>
                <input
                  type="text"
                  readOnly
                  value={session.user.name || ""}
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Your Email (Read-only)
                </label>
                <input
                  type="email"
                  readOnly
                  value={session.user.email || ""}
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Return Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Standard borrowing period is 7 days.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={borrowing}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {borrowing ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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