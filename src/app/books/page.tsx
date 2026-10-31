"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Tag, User, Layers, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
}

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "BookNook | All Books";

    const fetchBooks = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/books`);
        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await res.json();
        setBooks(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error loading books";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span>All Books in Library</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Explore our diverse collection. Borrow a book and return it when you are done.
          </p>
        </div>
        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm self-start md:self-auto"
        >
          <span>Add New Book</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading books from library...</p>
        </div>
      ) : books.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">No books found in the library</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">Be the first to add a book to BookNook!</p>
          <Link
            href="/add-book"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl"
          >
            Add a Book
          </Link>
        </div>
      ) : (
        /* Books Grid: 3 cards per row on desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Book Cover Image */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500";
                  }}
                />
                <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-700 font-semibold text-xs rounded-full shadow-sm flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {book.category}
                </span>
              </div>

              {/* Book Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1">
                    {book.title}
                  </h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{book.author}</span>
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Footer with Copies & View Details Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Copies:{" "}
                      <strong
                        className={
                          (book.availableCopies ?? book.totalCopies) > 0
                            ? "text-emerald-600 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {book.availableCopies ?? book.totalCopies}
                      </strong>
                    </span>
                  </div>

                  <Link
                    href={`/books/${book._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}