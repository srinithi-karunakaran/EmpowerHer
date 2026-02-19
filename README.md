# EmpowerHer: An Ecosystem for Women Entrepreneurs

EmpowerHer is a comprehensive platform designed to support and empower the next generation of women leaders through technology, community, and actionable business tools.

## 🚀 Vision
To bridge the gap in regional business support systems and provide women entrepreneurs with the resources they need to scale their ventures.

---

## 🛠️ Software Stack

### Frontend
- **React (Vite)**: Modern, fast frontend framework.
- **Tailwind CSS**: Utility-first CSS for sleek, responsive designs.
- **Framer Motion**: Smooth micro-animations for an enhanced UX.
- **Lucide React**: Beautiful, consistent iconography.

### Backend
- **Node.js & Express**: Robust server-side logic and API handling.
- **Supabase**: 
  - **Authentication**: Secure user management and sessions.
  - **Database (Supabase)**: Scalable data storage for profiles, posts, and AI logs.
  - **Realtime**: Live updates for community interactions.
- **OpenAI API (Mistral)**: Powers the advanced Pitch AI analysis.

---

## 🧩 Core Modules

### 1. Pitch AI
Analyzes business pitches using an "elite Silicon Valley judge" profile. It provides:
- **Scoring**: Detailed metrics on market fit, clarity, and investor appeal.
- **Improvements**: Actionable tips to refine the pitch.
- **Pitch Deck Outline**: A 10-slide outline for a presentation.
- **Scripting**: A 2-minute speech with timing cues.

### 2. Legal & Tax Suite
Helps manage the administrative side of a business:
- **Expense Tracker**: Log and categorize business expenses.
- **OCR Receipt Scanning**: Automated extraction of receipt data (mocked for MVP).
- **Invoice Generator**: Create professional invoices for clients.

### 3. Community Hub
A realtime platform for collaboration:
- **Chat Rooms**: Instant messaging powered by Supabase Realtime.
- **Mentor Matching**: Connect with experienced professionals in your industry.

### 4. Growth Toolkit
Actionable forms to formalize your business:
- **Business Onboarding**: Set up your professional business profile.
- **Fundraising**: Start and manage fundraisers for your projects.

---

## 🏃 Getting Started

### Prerequisites
- Node.js installed.
- Supabase account and project setup (with tables for `users`, `business_profiles`, `ai_conversations`, `fundraisers`, `community_posts`).

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```
3. Set up environment variables in `.env` (root) and `server/.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)

### Running the App
From the root directory:
```bash
npm run dev
```
The app will be available at `http://localhost:5173` and the server at `http://localhost:5000`.

---

## 🌐 Bilingual Support
Built with accessibility in mind, the platform supports two languages to cater to a diverse user base.
