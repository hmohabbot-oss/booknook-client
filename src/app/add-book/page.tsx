"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { apiFetch, uploadBookImage } from "@/lib/api";
import { BookPlus, Image as ImageIcon, Layers, User, Mail, Hash, AlignLeft, Sparkles } from "lucide-react";

export default function AddBookPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [totalCopies, setTotalCopies] = useState(1);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["Fiction", "Science", "History", "Kids", "Others"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || (!image && !imageFile) || !description) {
      toast.error("Please complete all required fields and choose a cover image");
      return;
    }

    if (totalCopies < 1) {
      toast.error("Total copies must be at least 1");
      return;
    }

    setLoading(true);

    try {
      const uploadedImage = imageFile ? await uploadBookImage(imageFile) : image;
      const newBook = {
      title,
      author,
      category,
      image: uploadedImage,
      totalCopies: Number(totalCopies),
      description,
      };

      const response = await apiFetch("/books", {
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

      setTitle("");
      setAuthor("");
      setImage("");
      setImageFile(null);
      setDescription("");
      setTotalCopies(1);
      setCategory("Fiction");

      router.push("/books");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error adding book";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#e5a856] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-400 font-serif">Checking reader credentials...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1c1613] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#30241e]">
        <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-[#291f1a]">
          <div className="p-3 bg-[#281f1a] text-[#e5a856] rounded-xl border border-[#3e2e25]">
            <BookPlus className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdf8f0]">Contribute a Book</h1>
            <p className="text-sm text-stone-400 mt-0.5">Share a cherished volume with fellow BookNook readers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Title */}
            <div>
              <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5">Book Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Midnight Library"
                className="w-full px-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] placeholder:text-stone-500 font-medium"
              />
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5">Author Name *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Matt Haig"
                className="w-full px-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] placeholder:text-stone-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#e5a856]" />
                <span>Category *</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#1c1613] text-[#f7f2eb]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Copies */}
            <div>
              <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#e5a856]" />
                <span>Total Copies *</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={totalCopies}
                onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] font-medium"
              />
            </div>
          </div>

          {/* Book image upload or existing image URL */}
          <div>
            <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#e5a856]" />
              <span>Book Cover Image *</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl text-sm text-[#f7f2eb] file:mr-3 file:rounded-lg file:border-0 file:bg-[#e5a856] file:px-3 file:py-1.5 file:font-semibold file:text-[#120e0c]"
            />
            <p className="mt-1 text-xs text-stone-500">Choose an image up to 8 MB. Upload uses ImgBB.</p>
            {imageFile && <p className="mt-2 text-xs text-stone-300">Selected: {imageFile.name}</p>}
            <p className="my-2 text-center text-xs text-stone-500">Or provide an existing image URL</p>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/book-cover.jpg"
              className="w-full px-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] placeholder:text-stone-500 font-medium"
            />
            {image && !imageFile && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-[#241c17] border border-[#362922] rounded-xl">
                <Image
                  src={image}
                  alt="Cover preview"
                  width={48}
                  height={64}
                  unoptimized
                  className="w-12 h-16 object-cover rounded shadow-md border border-[#3e2e25]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="text-xs text-stone-400">
                  <p className="font-semibold text-[#f7f2eb]">Cover Preview Active</p>
                  <p>Image link verified for library display.</p>
                </div>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-[#e5a856]" />
              <span>Short Description *</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief overview of this book's essence..."
              className="w-full px-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] placeholder:text-stone-500 resize-none font-medium"
            />
          </div>

          {/* Read-Only Contributor Info */}
          <div className="p-4 bg-[#241c17] rounded-xl border border-[#382b23] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-stone-400 block mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-[#e5a856]" /> Contributor (Name)
              </span>
              <p className="text-sm font-semibold text-[#f7f2eb]">{session?.user?.name || "Reader"}</p>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 block mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#e5a856]" /> Contributor (Email)
              </span>
              <p className="text-sm font-semibold text-[#f7f2eb]">{session?.user?.email || "Email"}</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] text-[#120e0c] font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d99b52]/15 disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-[#120e0c] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Add Book to Shelves</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
