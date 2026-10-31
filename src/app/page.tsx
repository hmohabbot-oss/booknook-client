"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { BookOpen, ArrowRight, BookMarked, RefreshCw, Sparkles, Tag, User, Star, CheckCircle2 } from "lucide-react";
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

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "BookNook | Home";

    const fetchNewArrivals = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        // রিকোয়ারমেন্ট অনুযায়ী ডাটাবেজ থেকে সর্বশেষ ৬টি বই লোড করা
        const res = await fetch(`${serverUrl}/books?limit=6`);
        if (!res.ok) throw new Error("Failed to load new arrivals");
        const data = await res.json();
        setNewArrivals(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error loading new arrivals";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // ব্যানার স্লাইডারের ৩টি স্লাইড
  const slides = [
    {
      title: "Discover Your Next Favorite Book",
      subtitle: "Explore thousands of community-shared books ranging from classic literature to modern scientific breakthroughs.",
      bg: "from-indigo-900 via-indigo-800 to-slate-900",
      tag: "Free Community Library",
    },
    {
      title: "Add a Book, Borrow a Book, Return a Book",
      subtitle: "Join our circular reading community. Share the books you love and borrow the ones you've always wanted to read.",
      bg: "from-blue-900 via-indigo-900 to-slate-900",
      tag: "Simple & Seamless",
    },
    {
      title: "Expand Your Knowledge & Imagination",
      subtitle: "Borrow books for up to 7 days with zero late fees. Easy renewals and a modern reading experience await you.",
      bg: "from-slate-900 via-indigo-950 to-indigo-900",
      tag: "Open to All Readers",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* ==================================================== */}
      {/* 1. BANNER / SLIDER (Swiper.js) */}
      {/* ==================================================== */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          className="h-[480px] w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className={`w-full h-full bg-gradient-to-r ${slide.bg} text-white flex items-center justify-center px-6 sm:px-12 relative overflow-hidden`}
              >
                {/* Decorative background circle */}
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-3xl text-center space-y-5 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold rounded-full uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    {slide.tag}
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
                    >
                      <span>Browse Books</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ==================================================== */}
      {/* 2. NEW ARRIVALS (Dynamic 6 Books) */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            Fresh on the Shelves
          </span>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">New Arrivals</h2>
          <p className="text-slate-500 text-sm mt-2">
            The newest additions to our library catalog, sorted by recency. Grab them before copies run out!
          </p>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500">Loading new arrivals...</p>
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-medium text-sm">No books in the library yet.</p>
            <Link href="/add-book" className="text-indigo-600 text-xs hover:underline mt-1 inline-block">
              Add the first book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
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

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{book.author}</span>
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Copies:{" "}
                      <strong className="text-indigo-600 font-semibold">
                        {book.availableCopies ?? book.totalCopies}
                      </strong>
                    </span>
                    <Link
                      href={`/books/${book._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-medium text-xs rounded-lg transition-colors"
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

        {/* See All Books Button */}
        <div className="text-center mt-12">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. EXTRA SECTION 1: How Borrowing Works */}
      {/* ==================================================== */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">How Borrowing Works</h2>
            <p className="text-slate-500 text-sm mt-2">
              Borrowing books from BookNook is quick, convenient, and completely automated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Choose Your Book</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse our collection by category or search for titles you love. Check availability in real time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Click & Confirm Borrow</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your return date and confirm. The book copy will be reserved under your personal profile.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Read & Return</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enjoy your reading! Once finished, simply click &quot;Return Book&quot; from your dashboard to restore the copy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. EXTRA SECTION 2: Reader Reviews & Benefits */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            Reader Community
          </span>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">What Readers Say</h2>
          <p className="text-slate-500 text-sm mt-2">
            Real feedback from book lovers who actively borrow and share books on BookNook.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;BookNook made it so effortless to discover scientific books that were out of stock in local stores. The borrowing process takes literally 2 clicks!&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                AK
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Arif Khan</h4>
                <p className="text-[11px] text-slate-400">Regular Reader</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;I love that I can add my own extra books to the library for others to borrow. A truly wonderful initiative for the book lover community.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                SN
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Sadia Nusrat</h4>
                <p className="text-[11px] text-slate-400">Book Contributor</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;The live copy counter and instant return tracking are fantastic. No complicated paperwork, just pure reading enjoyment.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                TR
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Tanvir Rahman</h4>
                <p className="text-[11px] text-slate-400">Literature Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}