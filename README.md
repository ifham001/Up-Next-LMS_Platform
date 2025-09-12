📚 Learning Management System (LMS)

A modern, full-stack Learning Management System built with Next.js, Node.js (Hono), PostgreSQL, and Drizzle ORM. Designed for seamless online learning with courses, quizzes, and progress tracking.

🚀 Features

🎓 Course Management – Create and organize courses with multiple sections.

📝 Quizzes & Assessments – Add quizzes with questions, answers, and options.

📊 Progress Tracking – Track learner activity across sections and quizzes.

🔒 Secure Authentication – Modern login & signup flow.

📱 Responsive UI – Optimized for all devices using Tailwind CSS.

🛠️ Tech Stack

Frontend: Next.js, TypeScript, Tailwind CSS

Backend: Node.js (Hono)

Database: PostgreSQL + Drizzle ORM

Auth & APIs: Secure authentication, RESTful APIs

📂 Project Structure
/frontend   → Next.js app (UI)
/backend    → Hono server with APIs
/db         → Drizzle ORM schemas & migrations

⚡ Getting Started
1. Clone the repo
git clone https://github.com/yourusername/lms-platform.git
cd lms-platform

2. Install dependencies
npm install

3. Set up environment variables

Create a .env file with:

DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key

4. Run the app
npm run dev

📌 Roadmap

 Add role-based access (student/teacher/admin)

 Video streaming support

 Certificates on course completion

🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a PR.

📜 License

This project is licensed under the MIT License.
