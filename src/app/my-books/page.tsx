"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  BookOpen,
  Edit,
  Trash2,
  Tag,
  Layers,
  Plus,
  AlertTriangle,
  X,
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
  userEmail: string;
  userName?: string;
}

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [updating, setUpdating] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://booknook-server-iota.vercel.app";

  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to view your added books");
      router.push("/login?callbackUrl=/my-books");
    }
  }, [session, isPending, router]);

  // শুধুমাত্র লগইন করা ইউজারের বইগুলো ফেচ করা
  const fetchMyBooks = async () => {
    if (!session?.user?.email) return;

    try {
      const userEmail = session.user.email.trim().toLowerCase();
      const res = await fetch(`${serverUrl}/books?email=${encodeURIComponent(userEmail)}`);
      if (!res.ok) throw new Error("Failed to load your books");
      const data: Book[] = await res.json();

      // ক্লায়েন্ট-সাইড ডাবল গার্ড: নিশ্চিত করা হচ্ছে শুধুই এই ইউজারের বই থাকবে
      const myBooksOnly = data.filter(
        (b) => b.userEmail && b.userEmail.trim().toLowerCase() === userEmail
      );

      setBooks(myBooksOnly);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error fetching books";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyBooks();
    }
  }, [session, serverUrl]);

  const handleOpenEdit = (book: Book) => {
    setEditingBook({ ...book });
    setEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setUpdating(true);
    try {
      const res = await fetch(`${serverUrl}/books/${editingBook._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBook),
      });

      if (!res.ok) throw new Error("Failed to update book");

      toast.success("Book updated successfully!");
      setEditModalOpen(false);
      fetchMyBooks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error updating book";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenDelete = (book: Book) => {
    setDeletingBook(book);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setDeleting(true);
    try {
      const res = await fetch(`${serverUrl}/books/${deletingBook._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete book");

      toast.success(`"${deletingBook.title}" deleted successfully!`);
      setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      setDeleteModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error deleting book";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || (loading && session)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#e5a856] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-400 font-serif">Loading your volumes...</p>
      </div>
    );
  }

  if (!session) return null;

  const categories = ["Fiction", "Science", "History", "Kids", "Others"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#2d221c]">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#fdf8f0] flex items-center gap-2.5">
            <BookOpen className="w-8 h-8 text-[#e5a856]" />
            <span>My Added Books</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Exclusively displaying volumes contributed by you ({session.user.email}).
          </p>
        </div>
        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d99b52] to-[#e5a856] hover:from-[#e5a856] hover:to-[#f0b76e] text-[#120e0c] font-bold text-sm rounded-xl transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Book</span>
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16 bg-[#1b1512] rounded-2xl border border-dashed border-[#34261f] p-8 max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 text-stone-500 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-[#f7f2eb]">You haven&apos;t contributed any books yet</h3>
          <p className="text-sm text-stone-400 mt-1 mb-6">
            Share your favorite volumes with the library. Other readers can browse them in the All Books catalog!
          </p>
          <Link
            href="/add-book"
            className="px-6 py-2.5 bg-[#e5a856] text-[#120e0c] font-bold text-sm rounded-xl inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add a Book Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-[#1c1613] rounded-2xl border border-[#30241e] hover:border-[#523d32] overflow-hidden shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full bg-[#120e0c] overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500";
                    }}
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 bg-[#120e0c]/90 text-[#e5a856] border border-[#3e2e25] font-serif text-xs rounded-full">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {book.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-serif font-bold text-[#f7f2eb] line-clamp-1 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-stone-400 mb-3">By {book.author}</p>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
                    {book.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-stone-400 bg-[#251d18] p-2.5 rounded-lg border border-[#382b23]">
                    <Layers className="w-4 h-4 text-[#e5a856]" />
                    <span>Total Copies: <strong>{book.totalCopies}</strong></span>
                    <span className="mx-1">•</span>
                    <span>Available: <strong className="text-emerald-400">{book.availableCopies ?? book.totalCopies}</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => handleOpenEdit(book)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#2a201a] hover:bg-[#3d2f26] text-[#e5a856] font-semibold text-xs rounded-xl border border-[#3e2e25] transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleOpenDelete(book)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 font-semibold text-xs rounded-xl border border-red-900/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#1c1613] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#3a2c24] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-[#e5a856]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-[#fdf8f0] mb-1">Edit Book</h3>
            <p className="text-xs text-stone-400 mb-6">Modify volume details for &quot;{editingBook.title}&quot;</p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#251d18] border border-[#382a22] rounded-lg text-sm text-[#f7f2eb] focus:border-[#e5a856]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Author</label>
                <input
                  type="text"
                  required
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#251d18] border border-[#382a22] rounded-lg text-sm text-[#f7f2eb] focus:border-[#e5a856]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
                  <select
                    value={editingBook.category}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#251d18] border border-[#382a22] rounded-lg text-sm text-[#f7f2eb]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#1c1613] text-[#f7f2eb]">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingBook.totalCopies}
                    onChange={(e) => setEditingBook({ ...editingBook, totalCopies: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 bg-[#251d18] border border-[#382a22] rounded-lg text-sm text-[#f7f2eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={editingBook.image}
                  onChange={(e) => setEditingBook({ ...editingBook, image: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#251d18] border border-[#382a22] rounded-lg text-sm text-[#f7f2eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#251d18] border border-[#382a22] rounded-lg text-sm text-[#f7f2eb] resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-[#382a22] hover:bg-[#251d18] text-stone-300 font-medium text-sm rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#d99b52] to-[#e5a856] text-[#120e0c] font-bold text-sm rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#1c1613] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#3a2c24] relative">
            <div className="w-12 h-12 bg-red-950/40 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/50">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-serif font-bold text-[#fdf8f0]">Remove From Catalog?</h3>
            <p className="text-xs text-stone-400 mt-1 mb-6 leading-relaxed">
              Are you sure you want to permanently remove <strong className="text-[#f7f2eb]">&quot;{deletingBook.title}&quot;</strong>? This volume will no longer be available to readers.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 px-4 border border-[#382a22] hover:bg-[#251d18] text-stone-300 font-medium text-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}