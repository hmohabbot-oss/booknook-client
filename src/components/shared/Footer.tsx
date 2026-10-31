import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0e0b09] text-stone-300 pt-14 pb-8 border-t border-[#261c16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#e5a856] font-bold text-xl">
              <BookOpen className="w-6 h-6" />
              <span className="font-serif tracking-wider">BookNook</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              A cozy vintage library where stories live forever. Add a book, borrow a book, and return a book to keep the circle of knowledge alive.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[#e5a856] font-semibold text-xs mb-4 uppercase tracking-wider font-serif">Quick Navigation</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-[#e5a856] transition-colors">Home Library</Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-[#e5a856] transition-colors">All Book Catalog</Link>
              </li>
              <li>
                <Link href="/add-book" className="hover:text-[#e5a856] transition-colors">Contribute a Book</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#e5a856] font-semibold text-xs mb-4 uppercase tracking-wider font-serif">Library Desk</h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#e5a856]" />
                <span>Rajshahi, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e5a856]" />
                <span>curator@booknook.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e5a856]" />
                <span>+880 1700-000000</span>
              </li>
            </ul>
          </div>

          {/* Social Links (New X Logo) */}
          <div>
            <h3 className="text-[#e5a856] font-semibold text-xs mb-4 uppercase tracking-wider font-serif">Connect With Us</h3>
            <div className="flex space-x-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1c1613] hover:bg-[#e5a856] hover:text-[#120e0c] text-stone-300 border border-[#342720] transition-all"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1c1613] hover:bg-[#e5a856] hover:text-[#120e0c] text-stone-300 border border-[#342720] transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#221813] pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} BookNook Community Library. Preserving knowledge together.
        </div>
      </div>
    </footer>
  );
}