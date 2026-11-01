# 📚 BookNook – A Small Online Library

> **"Add a book, borrow a book, return a book."**  
> BookNook is an atmospheric, Dark Academia vintage-themed community library platform where book lovers can discover timeless literature, contribute personal copies, and borrow books with automated real-time stock management.

---

## 🌐 Live Website & Links

- **Live Website:** [https://booknook-client-alpha.vercel.app](https://booknook-client-alpha.vercel.app)
- **Client GitHub Repository:** [https://github.com/hmohabbot-oss/booknook-client](https://github.com/hmohabbot-oss/booknook-client)
- **Server GitHub Repository:** [https://github.com/hmohabbot-oss/booknook-server](https://github.com/hmohabbot-oss/booknook-server)
- **Live Server API:** [https://booknook-server-iota.vercel.app](https://booknook-server-iota.vercel.app)

---

## 🌟 Key Features

1. **Dark Academia Vintage Library Theme:** Crafted with rich deep espresso wood tones (`#120E0C`), warm golden amber lamplight (`#E5A856`), and parchment typography to recreate the feel of a classic reading sanctuary.
2. **BetterAuth Authentication & Google Social Login:** Secure authentication with MongoDB Adapter featuring email/password validation (uppercase, lowercase, min 6 characters) and seamless Google OAuth sign-in.
3. **Private Route Protection & Smart Redirection:** Unauthenticated users attempting to access protected routes (`/add-book`, `/my-books`, `/my-borrows`, `/books/:id`) are redirected to `/login`, and automatically returned to their intended destination post-login.
4. **Interactive Swiper.js Banner & Real-Time New Arrivals:** Dynamic homepage showcasing 16:9 cinematic library slides and live latest 6 books loaded directly from MongoDB sorted by recency.
5. **Automated Stock Tracking ($inc):** Real-time copy management that decrements available copies by 1 when a book is borrowed, restores it when returned, and disables borrowing when copies reach zero.
6. **No Double Borrow Protection:** Server-validated constraint ensuring a user cannot borrow multiple copies of the same book concurrently.
7. **Complete CRUD Operations:** Community members can add new books, edit existing volumes with pre-filled forms, and permanently remove books via custom confirmation modals (no default browser alerts).
8. **Responsive Dashboard & Custom Feedback:** Fast, mobile-first design with interactive modal windows, toast notifications (`react-hot-toast`), and a custom 404 Not Found page.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide React, Swiper.js, React Hot Toast
- **Authentication:** BetterAuth (MongoDB Adapter) & Google OAuth
- **Backend:** Node.js, Express.js, MongoDB Native Driver, JWT
- **Deployment:** Vercel (Client & Server)

---

*Developed by Mohabbot Hossain for Programming Hero Batch 14 Assignment 8.*