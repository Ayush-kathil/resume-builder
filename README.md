<div align="center">
  <img alt="ResumeAI Logo" src="https://raw.githubusercontent.com/Ayush-kathil/resume-builder/main/public/emails/welcome_hero_animated.png" width="160" height="160" />
  <h1>🚀 ResumeAI: Enterprise-Grade FAANG AI Resume Builder</h1>
  <p><strong>A Next-Generation, AI-powered career hub designed to engineer professional, ATS-friendly, FAANG-level resumes in minutes.</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
  [![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
</div>

<br/>

ResumeAI is a modern, full-stack application built with Next.js 16. It leverages cutting-edge Artificial Intelligence (Google Gemini 2.5) to automatically generate, format, and optimize your CV to pass strict legacy Applicant Tracking Systems (ATS) and impress highly technical recruiters.

---

## 🌟 Next-Gen FAANG Engines

Unlike standard builders, ResumeAI is equipped with **5 specialized AI Engines** that act as your personal executive career coach:

1. **FAANG Polish (Nuclear Option)**: A one-click structural overhaul that rewrites your bullet points using the strict Action-Verb + Quantified Impact + Tech Stack format expected by top-tier tech companies.
2. **Mock Interview Prep Engine**: Automatically analyzes the claims in your resume and generates 5 highly aggressive, tailored behavioral/technical interview questions to grill you.
3. **Psychological Tone Dial**: An interactive slider that seamlessly rewrites your entire resume to project an "Aggressive", "Analytical", or "Collaborative" persona depending on the target corporate culture.
4. **Career Velocity Radar**: A live, animated Recharts radar that scores your resume's Impact, Technical Depth, Leadership, and Clarity against synthetic FAANG benchmarks.
5. **Magic LinkedIn Import**: Paste raw, unstructured text from your LinkedIn profile, and the AI will perfectly extract and map the data into a strict JSON schema instantly.

---

## 🏗️ System Architecture

```mermaid
graph TD
    %% Client Layer
    subgraph Client [Frontend UI]
        Zustand[Zustand Store]
        Editor[Editor Pane]
        Preview[Live Preview Pane]
        Sidebar[AI Engines Sidebar]
        
        Editor <--> Zustand
        Preview <--> Zustand
        Sidebar <--> Zustand
    end

    %% Backend API Layer
    subgraph Backend [Next.js API Routes]
        Parse[/api/resume/parse]
        Polish[/api/ai/faang-polish]
        Interview[/api/ai/interview-prep]
        Tone[/api/ai/tone-shift]
        LinkedIn[/api/ai/parse-linkedin]
    end

    %% External Services
    subgraph External [External Services]
        Gemini[Google Gemini 2.5 Pro]
        MongoDB[(MongoDB Atlas)]
    end

    %% Data Flow
    Sidebar -->|Triggers AI Action| Polish
    Sidebar -->|Requests Prep| Interview
    Editor -->|Imports| LinkedIn
    
    Polish <-->|JSON Prompting| Gemini
    Interview <-->|JSON Prompting| Gemini
    Tone <-->|JSON Prompting| Gemini
    LinkedIn <-->|JSON Prompting| Gemini
    
    Parse <--> MongoDB
```

---

## ✨ Core Features

### 🛡️ Enterprise-Grade Formatting
- **Anti-Bias "Blind Mode"**: Instantly redact your name, email, specific university names, and company names to generate an anonymized resume for unbiased screening.
- **ATS "Raw Text" View**: Toggle a raw text view to see exactly what an ancient Applicant Tracking System scraper will see, ensuring zero invisible formatting errors.
- **DOCX & PDF Export**: Native browser-side rendering for both high-fidelity PDFs and ATS-compliant Microsoft Word `.docx` files.
- **Real-Time Linter**: A live engine that highlights weak verbs in red, missing metrics in green, overused corporate buzzwords in yellow, and punctuation inconsistencies in blue.

### 💾 Robust Persistence & State
- **Undo/Redo History**: Granular, state-based history tracking allowing you to reverse major AI rewrites.
- **Dynamic Reordering**: Drag-and-drop structural organization for sections (e.g., moving Education below Experience for senior roles).
- **Target Job Matcher**: Paste a job description to get a live keyword match percentage and visual heatmap of missing skills.

---

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Local storage persistence)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI Core**: [Google Generative AI (Gemini 2.5)](https://ai.google.dev/) 
- **Document Generation**: `docx` library & React-to-Print

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js (v18+) and npm installed. You will also need a MongoDB database cluster (e.g., MongoDB Atlas) and an API key for Google Gemini.

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
   GEMINI_API_KEY=your_gemini_api_key

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
   npm run start
   ```

---

## 🤝 Contributing
Contributions are always welcome! Whether it's reporting a bug, discussing improvements, or submitting a Pull Request, your input is valued.

## 📄 License
This project is licensed under the MIT License.