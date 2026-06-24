<div align="center">
  <img alt="ResumeAI Logo" src="https://raw.githubusercontent.com/Ayush-kathil/resume-builder/main/public/emails/welcome_hero_animated.png" width="160" height="160" />
  <h1>🚀 Advanced Career Platform: Enterprise-Grade Resume Engineering</h1>
  <p><strong>A Next-Generation, data-driven career hub designed to engineer professional, ATS-optimized, FAANG-level resumes in minutes.</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
  [![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
</div>

<br/>

This platform is a modern, full-stack application built with Next.js 16. It leverages cutting-edge natural language processing and advanced heuristics to automatically format and optimize your CV to pass strict legacy Applicant Tracking Systems (ATS) and impress highly technical recruiters.

---

## ⚙️ How the Engine Works

This application is not just a text editor; it is a pipeline of intelligent parsing engines working together to craft your career narrative.

1. **Ingestion Engine**: You can upload a PDF or paste your raw LinkedIn profile. The parser extracts the unstructured text and maps it perfectly into a strict internal JSON schema.
2. **Analysis & Scoring**: As you type, the `LinterService` runs locally in your browser. It scans every bullet point for:
   - 🔴 **Weak Verbs** (e.g., "helped", "worked")
   - 🟢 **Missing Metrics** (ensuring you quantify your impact)
   - 🟡 **Corporate Buzzwords** (e.g., "synergy", "ninja")
   - 🔵 **Punctuation Consistency**
3. **Automated Persona Formatting**: You select a psychological tone (Aggressive, Analytical, or Collaborative). The backend natural language processor seamlessly rewrites your entire JSON state to match that specific persona.
4. **Rendering & Export**: The engine takes the state and perfectly renders it onto an A4 boundary, ensuring 100% legacy ATS compatibility via high-fidelity PDF or native `.docx` export.

---

## 🌟 Next-Gen FAANG Features

- **FAANG Polish (Nuclear Option)**: A one-click structural overhaul that rewrites your bullet points using the strict Action-Verb + Quantified Impact + Tech Stack format expected by top-tier tech companies.
- **Mock Interview Prep Engine**: Automatically analyzes the claims in your resume and generates 5 highly aggressive, tailored behavioral/technical interview questions to test your depth.
- **Psychological Tone Dial**: An interactive slider that seamlessly reframes your entire resume to project an "Aggressive", "Analytical", or "Collaborative" persona depending on the target corporate culture.
- **Career Velocity Radar**: A live, animated Recharts radar that scores your resume's Impact, Technical Depth, Leadership, and Clarity against synthetic FAANG benchmarks.
- **Anti-Bias "Blind Mode"**: Instantly redact your name, email, specific university names, and company names to generate an anonymized resume for unbiased screening.

---

## 🏗️ System Architecture

```mermaid
graph LR
    %% Client Layer
    subgraph Client ["Frontend UI (Next.js)"]
        Zustand["Zustand Store (Global State)"]
        Editor["Editor Pane (Data Entry)"]
        Preview["Live Preview Pane (PDF/DOCX)"]
        Sidebar["Heuristics Sidebar (Linter/Radar)"]
        
        Editor <--> Zustand
        Preview <--> Zustand
        Sidebar <--> Zustand
    end

    %% Backend API Layer
    subgraph Backend ["Next.js API Routes (Serverless)"]
        Parse["/api/resume/parse"]
        Polish["/api/processor/faang-polish"]
        Interview["/api/processor/interview-prep"]
        Tone["/api/processor/tone-shift"]
        LinkedIn["/api/processor/parse-linkedin"]
    end

    %% NLP / DB Layer
    subgraph Services ["External Services"]
        NLP["Natural Language Processor"]
        MongoDB["MongoDB Atlas (Storage)"]
    end

    %% Data Flow
    Sidebar -->|"Triggers Formatting"| Polish
    Sidebar -->|"Requests Prep"| Interview
    Editor -->|"Imports Profile"| LinkedIn
    
    Polish <-->|"JSON Payload"| NLP
    Interview <-->|"JSON Payload"| NLP
    Tone <-->|"JSON Payload"| NLP
    LinkedIn <-->|"JSON Payload"| NLP
    
    Parse <--> MongoDB
```

---

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Local storage persistence)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Natural Language Core**: Advanced NLP API Integration 
- **Document Generation**: `docx` library & React-to-Print

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18+) and npm installed. You will also need a MongoDB database cluster (e.g., MongoDB Atlas) and an API key for the backend NLP processor.

### Installation

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
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   MONGODB_URI=your_mongodb_connection_string

   # Authentication (NextAuth)
   NEXTAUTH_SECRET=your_secure_random_string
   NEXTAUTH_URL=http://localhost:3000

   # NLP Provider Keys
   NLP_API_KEY=your_nlp_api_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.*

---

## 🤝 Contributing
Contributions are always welcome! Whether it's reporting a bug, discussing improvements, or submitting a Pull Request, your input is valued.

## 📄 License
This project is licensed under the MIT License.