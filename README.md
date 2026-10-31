# 📚 BookNook – A Small Online Library

BookNook is a modern community library platform where book lovers can explore, contribute, borrow, and return books seamlessly. Built with Next.js (App Router), Express.js, MongoDB, and BetterAuth.

🌐 **Live Website:** [https://your-booknook-app.vercel.app](https://your-booknook-app.vercel.app)  
💻 **Server Repository:** [https://github.com/your-username/booknook-server](https://github.com/your-username/booknook-server)

---

## 🌟 Key Features

1. **Authentication & Session Management:** Built with BetterAuth and MongoDB Adapter, supporting password validation (uppercase, lowercase, min 6 characters) and seamless private route protection.
2. **Interactive Swiper Banner & New Arrivals:** Dynamic homepage showcasing interactive slides and real-time latest 6 books loaded directly from MongoDB.
3. **Real-Time Stock & Quantity Tracking ($inc):** Automated copy management that decreases available copies by 1 when a book is borrowed and restores the count when returned.
4. **No Double Borrow Protection:** Server-side validation preventing a user from borrowing the same book twice simultaneously.
5. **Full CRUD Operations:** Community members can add new books, edit existing details with pre-filled forms, and safely delete books using custom confirmation modals (no default browser alerts).
6. **Custom Modals & Feedback:** Polished user experience with interactive modals, toast notifications for all feedback, responsive card grids, and a custom 404 page.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide React, Swiper.js, React Hot Toast
- **Authentication:** BetterAuth (MongoDB Adapter)
- **Backend:** Node.js, Express.js, MongoDB Native Driver
- **Deployment:** Vercel (Client) & Render / Vercel (Server)