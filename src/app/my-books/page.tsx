"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
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
}

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [updating, setUpdating] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  // প্রাইভেট রুট চেক
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to view your added books");
      router.push("/login?callbackUrl=/my-books");
    }
  }, [session, isPending, router]);

  // ইউজারের যুক্ত করা বইগুলো ফেচ করা
  const fetchMyBooks = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      const res = await apiFetch("/books?mine=true");
      if (!res.ok) throw new Error("Failed to load your books");
      const data = await res.json();
      setBooks(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error fetching books";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      void Promise.resolve().then(fetchMyBooks);
    }
  }, [session, fetchMyBooks]);

  // Edit হ্যান্ডলার
  const handleOpenEdit = (book: Book) => {
    setEditingBook({ ...book });
    setEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setUpdating(true);
    try {
      const res = await apiFetch(`/books/${editingBook._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBook),
      });

      if (!res.ok) throw new Error("Failed to update book");

      toast.success("Book updated successfully!");
      setEditModalOpen(false);
      fetchMyBooks(); // রিফ্রেশ
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error updating book";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  // Delete হ্যান্ডলার (Custom Confirmation Modal)
  const handleOpenDelete = (book: Book) => {
    setDeletingBook(book);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setDeleting(true);
    try {
      const res = await apiFetch(`/books/${deletingBook._id}`, {
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
        <p className="text-sm text-stone-400 font-medium">Loading your books...</p>
      </div>
    );
  }

  if (!session) return null;

  const categories = ["Fiction", "Science", "History", "Kids", "Others"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#30241e]">
        <div>
          <h1 className="text-3xl font-bold text-[#f7f2eb] flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-[#e5a856]" />
            <span>My Added Books</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Manage, update, and monitor the books you have contributed to BookNook.
          </p>
        </div>
        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d99b52] hover:bg-[#e5a856] text-[#120e0c] font-medium text-sm rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Book</span>
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16 bg-[#1c1613] rounded-2xl border border-dashed border-[#3e2e25] p-8 max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-stone-200">You haven&apos;t added any books yet</h3>
          <p className="text-sm text-stone-400 mt-1 mb-6">
            Share your favorite books with the community by adding your first book.
          </p>
          <Link
            href="/add-book"
            className="px-5 py-2.5 bg-[#d99b52] hover:bg-[#e5a856] text-white text-sm font-medium rounded-xl inline-flex items-center gap-2"
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
              className="bg-[#1c1613] rounded-2xl border border-[#30241e] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full bg-[#2a201a] overflow-hidden">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500";
                    }}
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 bg-[#1c1613]/90 backdrop-blur-sm text-[#e5a856] font-semibold text-xs rounded-full shadow-sm flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {book.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#f7f2eb] line-clamp-1 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-stone-400 mb-3">By {book.author}</p>
                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-4">
                    {book.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-stone-400 bg-[#251d18] p-2.5 rounded-lg border border-[#30241e]">
                    <Layers className="w-4 h-4 text-stone-500" />
                    <span>Total Copies: <strong>{book.totalCopies}</strong></span>
                    <span className="mx-1">•</span>
                    <span>Available: <strong className="text-emerald-600">{book.availableCopies ?? book.totalCopies}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit and Delete */}
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => handleOpenEdit(book)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium text-xs rounded-xl border border-amber-200 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleOpenDelete(book)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#301918] hover:bg-[#48211f] text-red-400 font-medium text-xs rounded-xl border border-red-900/60 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. EDIT MODAL */}
      {/* ==================================================== */}
      {editModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#1c1613] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#30241e] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-300"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#f7f2eb] mb-1">Edit Book</h3>
            <p className="text-xs text-stone-400 mb-6">Modify details for &quot;{editingBook.title}&quot;</p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#251d18] text-[#f7f2eb] border border-[#3e2e25] rounded-lg text-sm focus:ring-2 focus:ring-[#e5a856]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Author</label>
                <input
                  type="text"
                  required
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#251d18] text-[#f7f2eb] border border-[#3e2e25] rounded-lg text-sm focus:ring-2 focus:ring-[#e5a856]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
                  <select
                    value={editingBook.category}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="w-full px-3.5 py-2 border border-[#3e2e25] rounded-lg text-sm bg-[#1c1613]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
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
                    className="w-full px-3.5 py-2 border border-[#3e2e25] rounded-lg text-sm"
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
                  className="w-full px-3.5 py-2 border border-[#3e2e25] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full px-3.5 py-2 border border-[#3e2e25] rounded-lg text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-[#3e2e25] hover:bg-[#251d18] text-stone-200 font-medium text-sm rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 px-4 bg-[#d99b52] hover:bg-[#e5a856] text-[#120e0c] font-medium text-sm rounded-xl flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. CUSTOM DELETE CONFIRMATION MODAL */}
      {/* ==================================================== */}
      {deleteModalOpen && deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#1c1613] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#30241e] relative">
            <div className="w-12 h-12 bg-[#301918] text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-[#f7f2eb]">Delete This Book?</h3>
            <p className="text-xs text-stone-400 mt-1 mb-6 leading-relaxed">
              Are you sure you want to permanently remove <strong className="text-stone-200">&quot;{deletingBook.title}&quot;</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 px-4 border border-[#3e2e25] hover:bg-[#251d18] text-stone-200 font-medium text-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 bg-red-700 hover:bg-red-600 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
