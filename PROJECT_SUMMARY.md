# Algo Battle - LeetCode-like Coding Platform

## Project Overview

A full-featured coding platform built with Next.js that allows users to solve algorithmic problems with a complete code editor, submission system, and persistent database.

## ✅ Completed Features

### 1. **Problem List Page** (`/`)
- Displays all available coding problems with ID and title
- **Status indicators** with color-coded backgrounds:
  - 🔴 **Not Attempted**: Gray background
  - 🟡 **Attempted**: Yellow background  
  - 🟢 **Submitted/Solved**: Green background
- Each problem shows difficulty level (Easy/Medium/Hard)
- Click any problem to navigate to the code editor

### 2. **Code Editor Page** (`/problem/[id]`)
- **Monaco Editor** with syntax highlighting for multiple languages
- **Language selector dropdown** supporting:
  - JavaScript
  - Python  
  - Java
  - C++
  - C
- **Run button** - Execute code with test cases
- **Submit button** - Submit solution for evaluation
- **Output panel** showing:
  - Test results
  - Runtime and memory usage
  - Error messages
- **Problem description** with test cases
- **Submission history** modal

### 3. **Persistent Database** (SQLite)
- **Problems table**: Stores problem details, descriptions, test cases
- **Submissions table**: All user submissions with status, runtime, memory
- **Problem attempts table**: Tracks when problems are attempted
- Database persists between application restarts
- Automatic seeding with 5 sample problems

### 4. **Navigation & Routing**
- Clean routing between pages using Next.js App Router
- Back navigation from problem page to problems list
- Responsive design for all screen sizes

### 5. **Sample Problems Included**
- Two Sum (Easy)
- Add Two Numbers (Medium)  
- Longest Substring Without Repeating Characters (Medium)
- Median of Two Sorted Arrays (Hard)
- Palindrome Number (Easy)

## 🏗️ Technical Architecture

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for server endpoints
- **SQLite** with better-sqlite3 for database
- **RESTful APIs** for code execution and submission

### Database Schema
```sql
-- Problems table
CREATE TABLE problems (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  test_cases TEXT NOT NULL,
  solution TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table  
CREATE TABLE submissions (
  id INTEGER PRIMARY KEY,
  problem_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT CHECK (status IN ('Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded')),
  runtime INTEGER,
  memory_usage INTEGER,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (problem_id) REFERENCES problems (id)
);

-- Problem attempts tracking
CREATE TABLE problem_attempts (
  id INTEGER PRIMARY KEY,
  problem_id INTEGER NOT NULL,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (problem_id) REFERENCES problems (id)
);
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Open http://localhost:3000
   - Database will be automatically created and seeded

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── run/route.ts          # Code execution API
│   │   └── submit/route.ts       # Submission API
│   ├── problem/[id]/page.tsx     # Individual problem page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Problems list page
├── components/
│   ├── MonacoEditor.tsx          # Code editor component
│   ├── OutputPanel.tsx           # Results display
│   ├── ProblemsList.tsx          # Problems list component
│   ├── ProblemSolver.tsx         # Main problem solving interface
│   └── SubmissionHistory.tsx     # Submission history modal
├── lib/
│   ├── database.ts               # Database connection and schema
│   ├── db-service.ts             # Database operations
│   └── seed-data.ts              # Sample problems data
└── types/
    └── index.ts                  # TypeScript type definitions
```

## 🔧 Key Features Details

### Status Tracking System
- **Not Attempted**: No interaction with the problem
- **Attempted**: User has run code or visited the problem page  
- **Submitted**: User has successfully submitted a solution
- Visual indicators on both list and individual problem pages

### Code Execution System
- Simulated code execution for demo purposes
- Validates basic syntax requirements per language
- Returns formatted test results with runtime/memory metrics
- Handles errors gracefully with descriptive messages

### Submission System
- Persistent storage of all submissions
- Status tracking (Accepted, Wrong Answer, Runtime Error, Time Limit Exceeded)
- Complete submission history with code viewing
- Automatic attempt tracking

### Responsive Design
- Mobile-friendly interface
- Optimized layouts for different screen sizes
- Clean, modern UI following best practices

## 🔒 Security Note

The current implementation uses a **simulated code execution environment** for demonstration purposes. In a production environment, you would need to implement:

- Secure code sandboxing (Docker containers)
- Resource limits and timeouts
- Input sanitization and validation
- User authentication and authorization

## 🎯 Future Enhancements

Potential improvements for production use:
- Real code execution environment
- User authentication system
- Problem categories and tagging
- Discussion forums for problems
- Contest/competition features
- Performance analytics and insights
- Code plagiarism detection

---

**Project Status**: ✅ **COMPLETE** - All requested features implemented and tested.
