"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { BookPlus, Image as ImageIcon, Layers, User, Mail, Hash, AlignLeft, Sparkles, Upload, Loader2 } from "lucide-react";

export default function AddBookPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://booknook-server-iota.vercel.app";

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
  const [totalCopies, setTotalCopies] = useState(1);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = ["Fiction", "Science", "History", "Kids", "Others"];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error("File size must be under 8 MB");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "e73a0e98031d683a45c3ceca62a83856";
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data?.data?.url) {
        setImage(data.data.url);
        toast.success("Image uploaded to ImgBB successfully!");
      } else {
        throw new Error(data?.error?.message || "Failed to upload image");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error";
      toast.error(message + ". You can also paste an image URL directly.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("You must be logged in to add a book");
      return;
    }

    if (!title.trim() || !author.trim() || !image.trim() || !description.trim()) {
      toast.error("Please fill in all required fields and provide a book cover");
      return;
    }

    if (totalCopies < 1) {
      toast.error("Total copies must be at least 1");
      return;
    }

    setLoading(true);

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      category,
      image: image.trim(),
      totalCopies: Number(totalCopies),
      description: description.trim(),
      userName: session.user.name || "BookNook Reader",
      userEmail: session.user.email.trim().toLowerCase(),
    };

    try {
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

      setTitle("");
      setAuthor("");
      setImage("");
      setDescription("");
      setTotalCopies(1);
      setCategory("Fiction");

      router.push("/my-books");
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
            <p className="text-sm text-stone-400 mt-0.5">Share a volume with fellow BookNook readers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Book Cover Image: Local Upload to ImgBB or Direct URL */}
          <div className="space-y-3">
            <label className="block text-xs font-serif font-semibold text-stone-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#e5a856]" />
              <span>Book Cover Image * (Upload File or Enter URL)</span>
            </label>

            <div className="p-4 bg-[#251d18] border border-[#382a22] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#1c1613] text-[#e5a856] rounded-xl border border-[#382a22]">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#f7f2eb]">Upload Image from Device</p>
                  <p className="text-[11px] text-stone-400">Uploads directly to ImgBB (up to 8 MB)</p>
                </div>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#2f231c] hover:bg-[#e5a856] hover:text-[#120e0c] text-[#e5a856] font-semibold text-xs rounded-xl border border-[#48352b] transition-all">
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative">
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Or paste direct image URL (e.g. from Wikipedia / ImgBB)"
                className="w-full px-4 py-2.5 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] placeholder:text-stone-500 font-medium"
              />
            </div>

            {image && (
              <div className="flex items-center gap-3.5 p-3.5 bg-[#241c17] border border-[#362922] rounded-xl animate-in fade-in duration-200">
                <img
                  src={image}
                  alt="Cover preview"
                  className="w-12 h-16 object-cover rounded shadow-md border border-[#3e2e25]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="text-xs text-stone-400">
                  <p className="font-semibold text-[#f7f2eb]">Cover Preview Active</p>
                  <p className="text-[11px] text-emerald-400">Image successfully linked for library display.</p>
                </div>
              </div>
            )}
          </div>

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

          <button
            type="submit"
            disabled={loading || uploadingImage}
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