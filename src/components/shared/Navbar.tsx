"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { BookOpen, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out!");
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch {
      toast.error("Failed to logout");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "BN";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
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

          {/* Auth State / Profile (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#e5a856] transition-all"
                  aria-label="User Menu"
                >
                  {session.user.image && !session.user.image.includes("dicebear") && !session.user.image.includes("googleusercontent.com") ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[#e5a856]/60 shadow-md"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#d99b52] to-[#e5a856] text-[#120e0c] font-serif font-bold text-xs flex items-center justify-center border-2 border-[#f0b76e]/50 shadow-md">
                      {getInitials(session.user.name)}
                    </div>
                  )}
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
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-300 hover:bg-[#2b211b] hover:text-[#e5a856] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#e5a856]" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-[#2b211b] text-left transition-colors border-t border-[#2d221c]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
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
                  className="px-5 py-2 text-sm font-semibold text-[#120e0c] bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] rounded-xl shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-300 hover:text-[#e5a856] p-2 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#e5a856]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu (এখন সম্পূর্ণ সক্রিয়) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181310] border-b border-[#2d221c] px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-stone-300 hover:text-[#e5a856] hover:bg-[#251d18] text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-stone-300 hover:text-[#e5a856] hover:bg-[#251d18] text-sm font-medium transition-colors"
            >
              All Books
            </Link>
            {session && (
              <>
                <Link
                  href="/add-book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-stone-300 hover:text-[#e5a856] hover:bg-[#251d18] text-sm font-medium transition-colors"
                >
                  Add Book
                </Link>
                <Link
                  href="/my-books"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-stone-300 hover:text-[#e5a856] hover:bg-[#251d18] text-sm font-medium transition-colors"
                >
                  My Books
                </Link>
                <Link
                  href="/my-borrows"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-stone-300 hover:text-[#e5a856] hover:bg-[#251d18] text-sm font-medium transition-colors"
                >
                  My Borrows
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-stone-300 hover:text-[#e5a856] hover:bg-[#251d18] text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-[#e5a856]" />
                  <span>My Profile</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Auth / Profile Section */}
          <div className="pt-3 border-t border-[#291f1a]">
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-[#251d18] rounded-xl border border-[#382b23]">
                  {session.user.image && !session.user.image.includes("dicebear") && !session.user.image.includes("googleusercontent.com") ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-[#e5a856]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d99b52] to-[#e5a856] text-[#120e0c] font-serif font-bold text-sm flex items-center justify-center border border-[#f0b76e]/50">
                      {getInitials(session.user.name)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-[#f7f2eb] truncate">{session.user.name}</p>
                    <p className="text-xs text-stone-400 truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-950/40 border border-red-900/50 text-red-400 font-semibold text-xs rounded-xl hover:bg-red-900/60 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-medium text-stone-300 hover:text-[#e5a856] bg-[#251d18] border border-[#382b23] rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-bold text-[#120e0c] bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] rounded-xl shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}