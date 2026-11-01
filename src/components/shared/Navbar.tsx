"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { BookOpen, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out!");
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="bg-[#181310]/95 backdrop-blur-md border-b border-[#2d221c] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 text-[#e5a856] font-bold text-xl group">
            <div className="p-2 rounded-xl bg-[#281f1a] border border-[#3e2e25] group-hover:border-[#e5a856] transition-colors">
              <BookOpen className="w-5 h-5 text-[#e5a856]" />
            </div>
            <span className="tracking-wide font-serif">BookNook</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-7">
            <Link href="/" className="text-stone-300 hover:text-[#e5a856] text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/books" className="text-stone-300 hover:text-[#e5a856] text-sm font-medium transition-colors">
              All Books
            </Link>
            {session && (
              <>
                <Link href="/add-book" className="text-stone-300 hover:text-[#e5a856] text-sm font-medium transition-colors">
                  Add Book
                </Link>
                <Link href="/my-books" className="text-stone-300 hover:text-[#e5a856] text-sm font-medium transition-colors">
                  My Books
                </Link>
                <Link href="/my-borrows" className="text-stone-300 hover:text-[#e5a856] text-sm font-medium transition-colors">
                  My Borrows
                </Link>
              </>
            )}
          </div>

          {/* Auth State / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#e5a856] transition-all"
                >
                  <Image
                    src={session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt={session.user.name || "User"}
                    width={36}
                    height={36}
                    unoptimized
                    className="w-9 h-9 rounded-full object-cover border border-[#48352b]"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#1f1814] rounded-xl shadow-2xl py-2 border border-[#3a2c24] z-50">
                    <div className="px-4 py-2.5 border-b border-[#2d221c]">
                      <p className="text-sm font-semibold text-[#f7f2eb]">{session.user.name}</p>
                      <p className="text-xs text-stone-400 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-300 hover:bg-[#2b211b] hover:text-[#e5a856] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#e5a856]" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-[#2b211b] text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-stone-300 hover:text-[#e5a856] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-semibold text-[#14100e] bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] rounded-xl shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-300 hover:text-[#e5a856] p-2"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#2d221c] py-3">
            <div className="flex flex-col gap-1">
              {[
                ["Home", "/"], ["All Books", "/books"],
                ...(session ? [["Add Book", "/add-book"], ["My Books", "/my-books"], ["My Borrows", "/my-borrows"], ["My Profile", "/profile"]] : []),
              ].map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-stone-300 hover:bg-[#251d18] hover:text-[#e5a856]">
                  {label}
                </Link>
              ))}
              {session ? (
                <button onClick={handleLogout} className="px-3 py-2 text-left text-sm text-red-400">Logout</button>
              ) : (
                <div className="flex gap-3 px-3 pt-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm text-stone-300">Login</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#e5a856]">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
