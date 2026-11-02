"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  BookOpen,
  Edit3,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  Upload,
  Loader2,
  Image as ImageIcon,
  Layers,
  Hash,
  AlignLeft,
  Check,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName?: string;
  userEmail?: string;
  createdAt?: string;
}

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://booknook-server-iota.vercel.app";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("Fiction");
  const [editCopies, setEditCopies] = useState(1);
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete Modal State
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categories = ["Fiction", "Science", "History", "Kids", "Others"];

  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to view your personal books collection");
      router.push("/login?callbackUrl=/my-books");
    }
  }, [session, isPending, router]);

  const fetchMyBooks = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const email = session.user.email.trim().toLowerCase();
      const res = await fetch(`${serverUrl}/books?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();

      // Strictly enforce that only books added by the logged-in user are shown in My Books
      const userBooks = Array.isArray(data)
        ? data.filter((b: Book) => b.userEmail && b.userEmail.toLowerCase() === email)
        : [];

      setBooks(userBooks);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading your books";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyBooks();
    }
  }, [session]);

  // Open Edit Modal & populate current book data
  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category || "Fiction");
    setEditCopies(book.totalCopies || 1);
    setEditImage(book.image || "");
    setEditDescription(book.description || "");
  };

  // Upload new image to ImgBB inside Edit Modal
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setEditImage(data.data.url);
        toast.success("New cover image uploaded to ImgBB!");
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

  // Save Book Changes
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    if (!editTitle.trim() || !editAuthor.trim() || !editImage.trim() || !editDescription.trim()) {
      toast.error("Please fill in all required fields and cover image");
      return;
    }

    if (editCopies < 1) {
      toast.error("Total copies must be at least 1");
      return;
    }

    setUpdating(true);

    const updatedData = {
      title: editTitle.trim(),
      author: editAuthor.trim(),
      category: editCategory,
      image: editImage.trim(),
      totalCopies: Number(editCopies),
      description: editDescription.trim(),
    };

    try {
      const res = await fetch(`${serverUrl}/books/${editingBook._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        // Fallback to PATCH if PUT is not defined
        const patchRes = await fetch(`${serverUrl}/books/${editingBook._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });
        if (!patchRes.ok) throw new Error("Failed to update book");
      }

      toast.success("Book details updated successfully!");

      // Update in local state
      setBooks((prev) =>
        prev.map((b) =>
          b._id === editingBook._id
            ? {
                ...b,
                ...updatedData,
                availableCopies: Math.max(0, (b.availableCopies || 0) + (Number(editCopies) - b.totalCopies)),
              }
            : b
        )
      );

      setEditingBook(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error updating book";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  // Delete Book Handler
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setDeleting(true);
    try {
      const res = await fetch(`${serverUrl}/books/${deletingBook._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete book");

      toast.success("Book removed from library successfully");
      setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      setDeletingBook(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error deleting book";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || (loading && !books.length)) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#e5a856] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-400 font-serif">Opening your personal shelves...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#2d221c]">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#fdf8f0] flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#e5a856]" />
            <span>My Added Books</span>
          </h1>
          <p className="text-stone-400 text-sm mt-1.5 font-sans">
            Volumes and editions you have contributed to the BookNook community library.
          </p>
        </div>
        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] text-[#120e0c] font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#d99b52]/15 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Empty State */}
      {books.length === 0 ? (
        <div className="bg-[#1c1613] border border-[#30241e] rounded-3xl p-12 text-center max-w-xl mx-auto my-8 shadow-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#281f1a] text-[#e5a856] rounded-2xl flex items-center justify-center border border-[#3e2e25]">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#fdf8f0] mb-2">No Books Added Yet</h3>
          <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">
            You haven't contributed any books to BookNook yet. Share a book with the community so other readers can borrow and explore it!
          </p>
          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e5a856] hover:bg-[#d99b52] text-[#120e0c] font-bold text-sm rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Book</span>
          </Link>
        </div>
      ) : (
        /* Books Table */
        <div className="bg-[#1c1613] border border-[#30241e] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#f7f2eb]">
              <thead className="bg-[#241c17] text-stone-300 font-serif text-xs uppercase tracking-wider border-b border-[#30241e]">
                <tr>
                  <th scope="col" className="px-6 py-4">Book</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Copies (Avail / Total)</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#281f1a]">
                {books.map((b) => (
                  <tr key={b._id} className="hover:bg-[#221a15] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-12 h-16 object-cover rounded shadow border border-[#382b23] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div>
                          <Link
                            href={`/books/${b._id}`}
                            className="font-serif font-bold text-[#fdf8f0] hover:text-[#e5a856] transition-colors text-base line-clamp-1"
                          >
                            {b.title}
                          </Link>
                          <p className="text-xs text-stone-400 mt-0.5">by {b.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-[#281f1a] text-[#e5a856] border border-[#3d2e24] rounded-lg text-xs font-medium">
                        {b.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <span className="text-emerald-400 font-bold">{b.availableCopies ?? b.totalCopies}</span>
                      <span className="text-stone-500 mx-1">/</span>
                      <span className="text-stone-400">{b.totalCopies}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#251d18] hover:bg-[#e5a856] hover:text-[#120e0c] text-[#e5a856] font-medium text-xs rounded-lg border border-[#3e2e25] transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingBook(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#251d18] hover:bg-rose-900/60 text-rose-400 font-medium text-xs rounded-lg border border-[#3e2e25] hover:border-rose-800 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT BOOK MODAL WITH DIRECT IMGBB UPLOAD & PREVIEW */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1c1613] p-6 sm:p-8 rounded-2xl max-w-lg w-full border border-[#30241e] shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setEditingBook(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-[#f7f2eb] p-1.5 rounded-lg hover:bg-[#281f1a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="mb-5 pb-4 border-b border-[#291f1a]">
              <h2 className="text-xl font-serif font-bold text-[#fdf8f0]">Edit Book</h2>
              <p className="text-xs text-stone-400 mt-1">
                Modify volume details for &ldquo;{editingBook.title}&rdquo;
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] font-medium"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5">Author *</label>
                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-4 py-2 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] font-medium"
                />
              </div>

              {/* Category & Copies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#e5a856]" />
                    <span>Category *</span>
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#1c1613]">
                        {c}
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
                    value={editCopies}
                    onChange={(e) => setEditCopies(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] font-medium"
                  />
                </div>
              </div>

              {/* Image Upload from Device OR Paste URL */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-serif font-semibold text-stone-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#e5a856]" />
                  <span>Cover Image * (Upload or Edit URL)</span>
                </label>

                {/* Local Upload Box */}
                <div className="p-3 bg-[#241c17] border border-[#382a22] rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#1c1613] text-[#e5a856] rounded-lg border border-[#382a22]">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#f7f2eb]">Upload New Image</p>
                      <p className="text-[10px] text-stone-400">Directly uploads to ImgBB</p>
                    </div>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2f231c] hover:bg-[#e5a856] hover:text-[#120e0c] text-[#e5a856] font-semibold text-xs rounded-lg border border-[#48352b] transition-all">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleEditImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct URL input */}
                <input
                  type="url"
                  required
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="Or paste direct image URL"
                  className="w-full px-4 py-2 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] placeholder:text-stone-500 font-medium"
                />

                {/* Live Preview */}
                {editImage && (
                  <div className="flex items-center gap-3 p-2.5 bg-[#241c17] border border-[#362922] rounded-xl">
                    <img
                      src={editImage}
                      alt="Edit cover preview"
                      className="w-10 h-14 object-cover rounded shadow border border-[#3e2e25]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="text-xs text-stone-400">
                      <p className="font-semibold text-[#f7f2eb]">Cover Preview Active</p>
                      <p className="text-[11px] text-emerald-400">Ready to save with volume details.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-serif font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-[#e5a856]" />
                  <span>Description *</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-[#251d18] border border-[#382a22] rounded-xl focus:outline-none focus:border-[#e5a856] text-sm text-[#f7f2eb] placeholder:text-stone-500 resize-none font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#291f1a]">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-5 py-2.5 bg-[#251d18] hover:bg-[#30251f] text-stone-300 font-medium text-xs rounded-xl border border-[#382b23] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating || uploadingImage}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] text-[#120e0c] font-bold text-xs rounded-xl transition-all shadow-md shadow-[#d99b52]/15 flex items-center gap-1.5 disabled:opacity-60"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1c1613] p-6 rounded-2xl max-w-md w-full border border-rose-900/40 shadow-2xl relative">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-2.5 bg-rose-950/60 text-rose-400 rounded-xl border border-rose-900/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#fdf8f0]">Delete Book</h3>
                <p className="text-xs text-stone-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-stone-300 mb-6">
              Are you sure you want to permanently remove &ldquo;
              <span className="font-semibold text-[#f7f2eb]">{deletingBook.title}</span>&rdquo; from the library shelves?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                className="px-4 py-2 bg-[#251d18] hover:bg-[#30251f] text-stone-300 font-medium text-xs rounded-xl border border-[#382b23] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-900/20 flex items-center gap-1.5 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Book</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}