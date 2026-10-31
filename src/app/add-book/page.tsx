"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { BookPlus, Image as ImageIcon, Layers, User, Mail, Hash, AlignLeft, Sparkles } from "lucide-react";

export default function AddBookPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  // প্রাইভেট রুট গার্ড: লগইন না থাকলে রিডাইরেক্ট হবে
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to add a book");
      router.push("/login?callbackUrl=/add-book");
    }
  }, [session, isPending, router]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [image, setImage] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["Fiction", "Science", "History", "Kids", "Others"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !image || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (totalCopies < 1) {
      toast.error("Total copies must be at least 1");
      return;
    }

    setLoading(true);

    const newBook = {
      title,
      author,
      category,
      image,
      totalCopies: Number(totalCopies),
      description,
      userName: session?.user?.name,
      userEmail: session?.user?.email,
    };

    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        throw new Error("Failed to add book to library");
      }

      toast.success("Book added to BookNook successfully!");

      // ফর্ম ক্লিয়ার করা
      setTitle("");
      setAuthor("");
      setImage("");
      setDescription("");
      setTotalCopies(1);
      setCategory("Fiction");

      // All Books পেজে রিডাইরেক্ট
      router.push("/books");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error adding book";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // লোডিং স্টেট (রিলোড দিলে যেন লগইন পেজে না যায়)
  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookPlus className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add a New Book</h1>
            <p className="text-sm text-slate-500">Contribute a book to the BookNook community library</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Book Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Great Gatsby"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author Name *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. F. Scott Fitzgerald"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Category *</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Copies (Challenge) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-slate-400" />
                <span>Total Copies *</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={totalCopies}
                onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Book Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>Book Cover Image URL *</span>
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/... or ImgBB Direct link"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {/* Image Preview */}
            {image && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <img
                  src={image}
                  alt="Cover preview"
                  className="w-12 h-16 object-cover rounded shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Image Preview</p>
                  <p>Make sure this link directly points to the image file.</p>
                </div>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <AlignLeft className="w-4 h-4 text-slate-400" />
              <span>Short Description *</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief overview about the book..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
          </div>

          {/* Read-Only User Details */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Added By (Name)
              </span>
              <p className="text-sm font-semibold text-slate-700">{session?.user?.name || "User"}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Added By (Email)
              </span>
              <p className="text-sm font-semibold text-slate-700">{session?.user?.email || "Email"}</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Add Book to Library</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}