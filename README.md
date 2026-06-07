# 🚀 ResumeAI - Enterprise-Grade AI Resume Builder

<div align="center">
  <img alt="ResumeAI Logo" src="https://raw.githubusercontent.com/Ayush-kathil/resume-builder/main/public/emails/welcome_hero_animated.png" width="160" height="160" />
</div>

<p align="center">
  <strong>An advanced, AI-powered resume builder designed to help users craft professional, ATS-friendly resumes in minutes.</strong>
</p>

---

## 🌟 Overview

ResumeAI is a modern, full-stack application built with Next.js 16. It leverages cutting-edge Artificial Intelligence to automatically generate, format, and optimize your CV. With an intuitive builder interface, intelligent AI suggestions, enterprise-grade security, and robust administrative tools, crafting the perfect resume has never been easier or more secure.

---

## ✨ Key Features

### 🛠️ Core Resume Builder
- **Intuitive Visual Interface**: A user-friendly, drag-and-drop dashboard to manage, create, and preview resumes seamlessly.
- **Real-time Preview Engine**: Watch your resume compile and update in real-time as you type, with zero lag.
- **Premium Templates**: Choose from a variety of professionally designed, ATS-optimized resume templates.
- **Comprehensive Sections**: Complete support for personal details, professional summaries, work experiences, education, skills, and custom project sections.

### 🤖 AI-Powered Capabilities
- **AI Summary Generation**: Automatically generate compelling professional summaries tailored to your unique profile.
- **Bullet Point Rewriter**: Use AI to rewrite and enhance specific bullet points for maximum impact and action-oriented language.
- **Smart Skill Suggestions**: Get tailored suggestions for skills and experience bullet points based on your target role and industry.
- **Conversational 'Chat to Edit'**: A conversational AI interface to edit and refine your resume content naturally.
- **Text Shortening & Expansion**: Concisely shorten lengthy descriptions or expand brief points without losing key context.
- **Smart CV Parsing**: Upload an existing resume (PDF/DOCX) and have the AI extract, categorize, and populate your details automatically.

### 🛡️ Enterprise Security & Admin Dashboard
- **Admin Analytics Dashboard**: Comprehensive metrics tracking user engagement, resume generations, and AI token usage.
- **Role-Based Access Control (RBAC)**: Secure routes and actions based on user roles.
- **Security Alerts & Auditing**: Automated security email alerts for account modifications and robust audit logging.
- **Prompt Engineering IDE**: Built-in admin workspace for developing, testing, and fine-tuning the AI prompts that power the platform.

### 💾 Export & Sharing
- **High-Fidelity PDF Export**: Generate pixel-perfect, high-quality PDFs ready for printing or emailing.
- **DOCX Export**: Download your resume as a Word document for offline manual editing.
- **TXT Export**: Plain text export for easy copying and pasting into restrictive online application forms.

---

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI Providers**: [Google Generative AI (Gemini)](https://ai.google.dev/) & [OpenAI](https://openai.com/)
- **Emails**: [React Email](https://react.email/) & [Nodemailer](https://nodemailer.com/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have Node.js (v18+) and npm installed. You will also need a MongoDB database cluster (e.g., MongoDB Atlas) and API keys for the AI providers (OpenAI and/or Gemini).

### Installation & Running Commands

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ayush-kathil/resume-builder.git
   cd resume-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and configure your environment variables:
   ```env
   # Database Configuration
   MONGODB_URI=your_mongodb_connection_string

   # Authentication (NextAuth)
   NEXTAUTH_SECRET=your_secure_random_string
   NEXTAUTH_URL=http://localhost:3000

   # AI Provider Keys
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key

   # Email Configuration (SMTP for transactional emails)
   SMTP_HOST=smtp.your-email-provider.com
   SMTP_PORT=587
   SMTP_USER=your_email_address
   SMTP_PASSWORD=your_email_password
   SMTP_EMAIL=your_sending_email_address
   ```

4. **Run the Development Server:**
   Start the application in development mode with hot-reloading:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.*

5. **Build for Production:**
   To create an optimized production build:
   ```bash
   npm run build
   ```

6. **Start Production Server:**
   After building, start the production server:
   ```bash
   npm run start
   ```

---

## 🤝 Contributing
Contributions are always welcome! Whether it's reporting a bug, discussing improvements, or submitting a Pull Request, your input is valued.

## 📄 License
This project is licensed under the MIT License.