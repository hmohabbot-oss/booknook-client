"use client";

import Link from "next/link";
import { BookOpen, Home, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "BookNook | 404 Not Found";
  }, []);

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-12 h-12" />
          </div>
          <span className="absolute -top-1 -right-1 px-3 py-1 bg-red-500 text-white font-bold text-xs rounded-full shadow-sm">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Oops! The book or page you are looking for seems to have been misplaced on our library shelves.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/books"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Books</span>
          </Link>
        </div>
      </div>
    </div>
  );
}