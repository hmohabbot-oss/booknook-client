"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { BookOpen, ArrowRight, Sparkles, Tag, User, Star } from "lucide-react";
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
    document.title = "BookNook | Vintage Library";

    const fetchNewArrivals = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
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

  // ৩টি স্লাইডে আপনার আসল ফটোগুলোর পাথ ব্যবহার করা হয়েছে
  const slides = [
    {
      title: "Step Inside the Endless Hall of Stories",
      subtitle: "Explore timeless classics, rare chronicles, and modern literature carefully curated by fellow readers.",
      tag: "Vintage Library Arch",
      image: "/banners/banner1.jpg",
    },
    {
      title: "Add a Book, Borrow a Book, Return a Book",
      subtitle: "Every borrowed book is a journey taken. Share your own cherished books and keep the ancient love of reading alive.",
      tag: "The Readers' Covenant",
      image: "/banners/banner2.jpg",
    },
    {
      title: "Warm Lamp Light & The Scent of Old Paper",
      subtitle: "Borrow books with ease, manage your personal bookshelf, and immerse yourself in an atmospheric library experience.",
      tag: "Dark Academia Sanctuary",
      image: "/banners/banner3.jpg",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. VINTAGE BANNER SLIDER WITH REAL BACKGROUND IMAGES */}
      <section className="relative border-b border-[#2d221c]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          className="h-[540px] w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-full bg-cover bg-center text-[#f7f2eb] flex items-center justify-center px-6 sm:px-12 relative overflow-hidden"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                {/* Dark Vignette Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120e0c] via-[#120e0c]/70 to-[#120e0c]/50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(18,14,12,0.85)_100%)] pointer-events-none" />

                <div className="max-w-3xl text-center space-y-6 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1f1713]/90 border border-[#e5a856]/40 text-[#e5a856] text-xs font-semibold rounded-full uppercase tracking-widest font-serif backdrop-blur-sm shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#e5a856]" />
                    {slide.tag}
                  </span>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight leading-tight text-[#fdf8f0] drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed font-sans drop-shadow">
                    {slide.subtitle}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] text-[#120e0c] font-bold text-sm rounded-xl transition-all shadow-xl shadow-[#d99b52]/20 hover:scale-105"
                    >
                      <span>Explore Library Shelves</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#e5a856] font-semibold text-xs uppercase tracking-widest font-serif">
            Fresh Upon The Shelves
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f7f2eb] mt-1.5">
            New Arrivals
          </h2>
          <p className="text-stone-400 text-sm mt-2">
            The latest editions gathered by our book sanctuary. Borrow your copy before it is reserved.
          </p>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-[#e5a856] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-stone-400">Opening library archive...</p>
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-12 bg-[#1b1512] rounded-2xl border border-dashed border-[#34261f]">
            <BookOpen className="w-10 h-10 text-stone-500 mx-auto mb-2" />
            <p className="text-stone-300 font-medium text-sm">No books currently on the shelves.</p>
            <Link href="/add-book" className="text-[#e5a856] text-xs hover:underline mt-1 inline-block">
              Contribute the first volume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((book) => (
              <div
                key={book._id}
                className="bg-[#1c1613] rounded-2xl border border-[#30241e] hover:border-[#523d32] overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col group"
              >
                <div className="relative h-64 w-full bg-[#120e0c] overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
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

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#f7f2eb] line-clamp-1 group-hover:text-[#e5a856] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-1 mb-3">
                      <User className="w-3.5 h-3.5 text-[#e5a856]" />
                      <span>By {book.author}</span>
                    </p>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#291f1a] flex items-center justify-between">
                    <span className="text-xs text-stone-400">
                      Copies:{" "}
                      <strong className="text-[#e5a856]">
                        {book.availableCopies ?? book.totalCopies}
                      </strong>
                    </span>
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

        <div className="text-center mt-14">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#251d18] hover:bg-[#322720] text-[#f7f2eb] border border-[#403026] text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            <span>View Complete Collection</span>
            <ArrowRight className="w-4 h-4 text-[#e5a856]" />
          </Link>
        </div>
      </section>

      {/* 3. HOW BORROWING WORKS */}
      <section className="bg-[#17120f] py-20 border-y border-[#2a201a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#e5a856] font-semibold text-xs uppercase tracking-widest font-serif">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f7f2eb] mt-1.5">
              The Path of Borrowing
            </h2>
            <p className="text-stone-400 text-sm mt-2">
              How our community preserves and circulates books without traditional library friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1f1915] p-8 rounded-2xl border border-[#33261f] text-center space-y-3">
              <div className="w-12 h-12 bg-[#2d221c] text-[#e5a856] border border-[#48352b] rounded-xl flex items-center justify-center mx-auto font-serif font-bold text-lg">
                I
              </div>
              <h3 className="font-serif font-bold text-[#f7f2eb] text-lg">Discover & Select</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Explore rare or favorite volumes across categories and verify remaining physical copies in real time.
              </p>
            </div>

            <div className="bg-[#1f1915] p-8 rounded-2xl border border-[#33261f] text-center space-y-3">
              <div className="w-12 h-12 bg-[#2d221c] text-[#e5a856] border border-[#48352b] rounded-xl flex items-center justify-center mx-auto font-serif font-bold text-lg">
                II
              </div>
              <h3 className="font-serif font-bold text-[#f7f2eb] text-lg">Confirm Reservation</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Pick your return date and confirm. The stock decreases immediately to preserve fairness among readers.
              </p>
            </div>

            <div className="bg-[#1f1915] p-8 rounded-2xl border border-[#33261f] text-center space-y-3">
              <div className="w-12 h-12 bg-[#2d221c] text-[#e5a856] border border-[#48352b] rounded-xl flex items-center justify-center mx-auto font-serif font-bold text-lg">
                III
              </div>
              <h3 className="font-serif font-bold text-[#f7f2eb] text-lg">Read & Restore</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Enjoy your literary voyage, then click &quot;Return Book&quot; from your dashboard to pass it to the next seeker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. READER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#e5a856] font-semibold text-xs uppercase tracking-widest font-serif">
            Reader Reflections
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f7f2eb] mt-1.5">
            Words from Fellow Book Lovers
          </h2>
          <p className="text-stone-400 text-sm mt-2">
            Thoughts shared by readers who actively inhabit our digital reading sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1c1613] p-7 rounded-2xl border border-[#30241e] space-y-4">
            <div className="flex text-[#e5a856] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-300 italic leading-relaxed font-serif">
              &quot;BookNook feels like stepping into an ancient, dimly lit sanctuary of books. Borrowing is intuitive and utterly delightful.&quot;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-[#291f1a]">
              <div className="w-9 h-9 rounded-xl bg-[#2e231c] text-[#e5a856] font-serif font-bold flex items-center justify-center text-xs border border-[#443328]">
                AK
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#f7f2eb]">Arif Khan</h4>
                <p className="text-[11px] text-stone-500">Avid Reader</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1613] p-7 rounded-2xl border border-[#30241e] space-y-4">
            <div className="flex text-[#e5a856] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-300 italic leading-relaxed font-serif">
              &quot;Being able to add my own classic collection so others can discover them brings me immense joy. The amber aesthetic is pure art.&quot;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-[#291f1a]">
              <div className="w-9 h-9 rounded-xl bg-[#2e231c] text-[#e5a856] font-serif font-bold flex items-center justify-center text-xs border border-[#443328]">
                SN
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#f7f2eb]">Sadia Nusrat</h4>
                <p className="text-[11px] text-stone-500">Book Contributor</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1613] p-7 rounded-2xl border border-[#30241e] space-y-4">
            <div className="flex text-[#e5a856] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-300 italic leading-relaxed font-serif">
              &quot;The live stock tracking and seamless return system make this the most elegant digital library I have ever used.&quot;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-[#291f1a]">
              <div className="w-9 h-9 rounded-xl bg-[#2e231c] text-[#e5a856] font-serif font-bold flex items-center justify-center text-xs border border-[#443328]">
                TR
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#f7f2eb]">Tanvir Rahman</h4>
                <p className="text-[11px] text-stone-500">History Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}