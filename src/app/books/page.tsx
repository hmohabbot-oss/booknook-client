"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      {/* Page Header (Vintage Dark & Amber) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#2d221c]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#fdf8f0] flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#e5a856]" />
            <span>All Books in Library</span>
          </h1>
          <p className="text-stone-400 text-sm mt-1.5 font-sans">
            Explore our diverse collection. Borrow a book and return it when you are done.
          </p>
        </div>
        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] text-[#120e0c] font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#d99b52]/15 self-start md:self-auto"
        >
          <span>Add New Book</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-[#e5a856] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-400 font-serif">Loading books from library shelves...</p>
        </div>
      ) : books.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-[#1b1512] rounded-2xl border border-dashed border-[#34261f] p-8">
          <BookOpen className="w-12 h-12 text-stone-500 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-[#f7f2eb]">No books found in the library</h3>
          <p className="text-sm text-stone-400 mt-1 mb-6">Be the first to add a book to BookNook!</p>
          <Link
            href="/add-book"
            className="px-6 py-2.5 bg-[#e5a856] text-[#120e0c] font-bold text-sm rounded-xl"
          >
            Add a Book
          </Link>
        </div>
      ) : (
        /* Books Grid: 3 cards per row on desktop (Vintage Mahogany Cards) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-[#1c1613] rounded-2xl border border-[#30241e] hover:border-[#523d32] overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col group"
            >
              {/* Book Cover Image */}
              <div className="relative h-64 w-full bg-[#120e0c] overflow-hidden">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1613] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 right-3 px-3 py-1 bg-[#120e0c]/90 backdrop-blur-md text-[#e5a856] border border-[#3e2e25] font-serif text-xs rounded-full shadow-sm flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {book.category}
                </span>
              </div>

              {/* Book Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#f7f2eb] line-clamp-1 group-hover:text-[#e5a856] transition-colors mb-1">
                    {book.title}
                  </h2>
                  <p className="text-xs text-stone-400 flex items-center gap-1.5 mb-3">
                    <User className="w-3.5 h-3.5 text-[#e5a856]" />
                    <span>By {book.author}</span>
                  </p>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Footer with Copies & View Details Button */}
                <div className="pt-4 border-t border-[#291f1a] flex items-center justify-between">
                  <div className="text-xs text-stone-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#e5a856]" />
                    <span>
                      Copies:{" "}
                      <strong className="text-[#e5a856]">
                        {book.availableCopies ?? book.totalCopies}
                      </strong>
                    </span>
                  </div>

                  <Link
                    href={`/books/${book._id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#2a201a] hover:bg-[#e5a856] text-[#e5a856] hover:text-[#120e0c] font-semibold text-xs rounded-lg transition-all border border-[#3e2e25]"
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
