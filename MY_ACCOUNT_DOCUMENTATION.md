# 📘 StudyLK — "My Account" Learning Hub & Dashboard Documentation

Welcome to the comprehensive technical and architectural documentation for the upgraded **My Account** student portal in StudyLK.

---

## 📑 Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [Why This Architecture Was Chosen](#2-why-this-architecture-was-chosen)
3. [Technology Stack](#3-technology-stack)
4. [Complete Directory & Folder Structure](#4-complete-directory--folder-structure)
5. [Detailed Breakdown of Sections & Features](#5-detailed-breakdown-of-sections--features)
6. [Reusable UI Primitives (shadcn/ui Pattern)](#6-reusable-ui-primitives-shadcnui-pattern)
7. [Step-by-Step Guide: How to Add New Sections in the Future](#7-step-by-step-guide-how-to-add-new-sections-in-the-future)
8. [Data Flow & Authentication](#8-data-flow--authentication)
9. [Maintenance & Best Practices](#9-maintenance--best-practices)

---

## 1. Overview & Purpose

### Background
Originally, the student area only contained a simple "My Courses" page that listed course enrollments. As the StudyLK platform grows, students need a comprehensive **learning workspace** that helps them:
- Monitor their enrolled courses and jump directly into study materials, daily questions, and past papers.
- Track their daily study goals and exam preparation milestones.
- Practice focused study sessions using structured Pomodoro intervals.
- Plan upcoming live lecture schedules, paper practices, and exam dates on an interactive calendar.
- Keep quick digital revision notes, theorem summaries, and formula scratchpads.
- Manage their student profile details and security settings.

---

## 2. Why This Architecture Was Chosen

### 🧱 Modular Isolation (Separation of Concerns)
- Instead of having a single monolithic `MyAccount.jsx` file with thousands of lines, **every feature lives in its own dedicated subfolder** under `src/pages/MyAccount/sections/`.
- Each section is independently testable, maintainable, and does not cause merge conflicts or side effects when edited.

### 📐 Side Navigation Panel UX
- A persistent, sticky vertical navigation panel (`w-72`) on desktop gives students one-click access to any tool at any time.
- Displays live badges (such as active enrolled course counts `1`, `2`, etc.) and student identity info.
- Automatically collapses into a smooth, responsive horizontal pill bar on mobile devices.

### 🎨 Clean Light Aesthetics
- Designed with StudyLK's signature bright aesthetic: pure white cards (`#ffffff`), soft emerald-tinted background (`#F8FBF8`), high-contrast dark green typography (`#1A3A1A`), and vibrant accent indicators.

---

## 3. Technology Stack

| Technology | Role |
|---|---|
| **React 19** | Core UI library with clean functional hooks (`useState`, `useEffect`, `useMemo`, `useRef`) |
| **Tailwind CSS** | Modern utility-first CSS framework for layout, spacing, and colors |
| **shadcn/ui Pattern** | Composable, accessible UI component primitives (`Card`, `Button`, `Badge`, `Input`, `Progress`) |
| **Lucide Icons (`lucide-react`)** | Lightweight, consistent SVG icon system |
| **clsx & tailwind-merge** | Safe conditional class merging via `cn()` helper |
| **React Router (`react-router-dom`)** | URL tab synchronization (`?tab=courses`, `?tab=focus`, etc.) and route navigation |

---

## 4. Complete Directory & Folder Structure

```
studylk/src/
├── lib/
│   └── utils.js                                      # Utility functions (cn helper)
│
├── components/ui/                                    # Reusable shadcn/ui style components
│   ├── badge.jsx                                     # Status badge component
│   ├── button.jsx                                    # Versatile button with variants
│   ├── card.jsx                                      # Card container & header/content sub-components
│   ├── input.jsx                                     # Styled text/date input
│   └── progress.jsx                                  # Dynamic animated progress bar
│
└── pages/
    └── MyAccount/
        ├── index.jsx                                 # Master Orchestrator (State, auth & tab router)
        │
        ├── components/                               # Shared Account Components
        │   ├── AccountHeader.jsx                     # Top welcome banner with avatar & metrics
        │   └── AccountNav.jsx                        # Side navigation panel & mobile nav
        │
        └── sections/                                 # Feature-Specific Modular Sections
            │
            ├── dashboard/                            # 📊 1. Main Dashboard Hub
            │   ├── DashboardSection.jsx              # Section orchestrator
            │   ├── MetricCards.jsx                   # Metric summary cards (Total, Active, Pending, Goals)
            │   ├── QuickCoursesWidget.jsx            # Recent course fast-launch cards
            │   └── ShortcutsGrid.jsx                 # Quick links to Past Papers, Notes, Catalog
            │
            ├── courses/                              # 🎓 2. My Courses Hub
            │   ├── MyCoursesSection.jsx              # Section orchestrator
            │   ├── CourseCard.jsx                    # Course card with Materials/Questions/Papers actions
            │   └── CourseFilters.jsx                 # Live search bar & status filter pills
            │
            ├── calendar/                             # 📅 3. Calendar & Study Planner
            │   └── CalendarSection.jsx               # Interactive month view & custom event scheduler
            │
            ├── focus/                                # ⏱️ 4. Focus Zone (Pomodoro)
            │   └── FocusSection.jsx                  # Timer ring, presets (25m/50m), stats & ambient sound
            │
            ├── goals/                                # 🎯 5. Goals & Target Tracker
            │   └── GoalsSection.jsx                  # Goal checklist, categories & live progress bar
            │
            ├── notes/                                # 📝 6. Digital Study Notes
            │   └── NotesSection.jsx                  # Color-coded sticky notes, tag filter & search
            │
            └── profile/                              # 👤 7. Profile & Account Settings
                └── ProfileSection.jsx                # Student account info, security guidelines & logout
```

---

## 5. Detailed Breakdown of Sections & Features

### 📊 Section 1: Dashboard (`sections/dashboard/`)
- **Greeting Banner**: Personalized motivation text, today's date, and 1-click action buttons.
- **Metric Cards**: Real-time counts for Enrolled Courses, Approved & Active, Pending Admin Review, and Daily Target.
- **Quick Courses Launcher**: Displays the student's most recent courses with status badges (`Approved`, `Pending`, `Rejected`) and direct portal links.
- **Mini Focus & Scratchpad Widgets**: Launch a 25-minute Pomodoro timer or open quick notes right from the dashboard.
- **Shortcuts Grid**: Instant links to Past Papers, Model Papers, Study Notes, and the Stream Catalog.

### 🎓 Section 2: My Courses (`sections/courses/`)
- **Status Filtering**: Filter by `All`, `Approved`, or `Pending`.
- **Search Bar**: Real-time filtering by course title or teacher name.
- **Course Portal Launchers**:
  - `📖 Open Course Portal` (`/my-courses/:courseId/overview`)
  - `📁 Materials` (`/my-courses/:courseId/materials`)
  - `❓ Questions` (`/my-courses/:courseId/daily-questions`)
  - `📄 Papers` (`/my-courses/:courseId/past-papers`)

### 📅 Section 3: Calendar & Schedule (`sections/calendar/`)
- **Month Grid View**: Shows the full current month with "Today" indicator and event badges.
- **Custom Event Scheduler**: Add custom study reminders categorized as `📖 Study`, `📝 Paper`, `🎓 Live Class`, or `🏆 Exam`.
- **Storage**: Automatically persists scheduled events in `localStorage` (`studylk_calendar_events`).

### ⏱️ Section 4: Focus Zone (`sections/focus/`)
- **Interval Presets**:
  - `25m Focus (Pomodoro)`
  - `50m Deep Work`
  - `5m Quick Break`
  - `15m Long Break`
- **Animated Circular SVG Timer**: Smooth countdown ring animation with play/pause/reset controls.
- **Metrics**: Session counter and total focus hours calculation.
- **Ambient Sound**: Toggleable study atmosphere helper.

### 🎯 Section 5: Goals & Targets (`sections/goals/`)
- **Goal Checklist**: Check off completed tasks with strike-through styling.
- **Progress Metric**: Calculates completion percentage and displays a dynamic gradient progress bar.
- **Subject Categorization**: Tag goals by subject (`Physics`, `Chemistry`, `Maths`, `Biology`, `Daily Practice`, `Revision`).
- **Storage**: Automatically persists in `localStorage` (`studylk_goals`).

### 📝 Section 6: Study Notes (`sections/notes/`)
- **Quick Note Creator**: Save formula summaries and theorems with custom card colors (`Emerald`, `Amber`, `Sky`, `Purple`) and subject tags.
- **Live Search**: Instant keyword search across note titles and body text.
- **Storage**: Automatically persists in `localStorage` (`studylk_notes`).

### 👤 Section 7: Profile & Settings (`sections/profile/`)
- **Student Profile Overview**: Displays full name, email, phone number, enrolled stream, and account verification badge.
- **Study Guidelines**: Helpful reminders regarding security and lecture schedules.
- **Sign Out**: Clears access tokens and securely redirects to `/login`.

---

## 6. Reusable UI Primitives (shadcn/ui Pattern)

All primitives are located in `src/components/ui/` and styled with Tailwind CSS:

### `Card` (`src/components/ui/card.jsx`)
```jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title Here</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content goes here...</p>
  </CardContent>
</Card>
```

### `Button` (`src/components/ui/button.jsx`)
```jsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="default">Primary Action</Button>
<Button variant="secondary" size="sm">Secondary Action</Button>
<Button variant="outline">Outline Action</Button>
<Button variant="danger">Delete / Logout</Button>
```

### `Badge` (`src/components/ui/badge.jsx`)
```jsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">Default</Badge>
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>
```

### `Input` (`src/components/ui/input.jsx`)
```jsx
import { Input } from '@/components/ui/input'

<Input type="text" placeholder="Type here..." value={value} onChange={e => setValue(e.target.value)} />
```

### `Progress` (`src/components/ui/progress.jsx`)
```jsx
import { Progress } from '@/components/ui/progress'

<Progress value={75} max={100} className="h-3" />
```

---

## 7. Step-by-Step Guide: How to Add New Sections in the Future

Want to add a new section like **Flashcards**, **AI Tutor**, or **Analytics**? Follow these 4 easy steps:

### Step 1: Create the Section Folder
Create a new folder under `src/pages/MyAccount/sections/<section_name>/`:
```
src/pages/MyAccount/sections/flashcards/
└── FlashcardsSection.jsx
```

### Step 2: Write your Section Component
Example `FlashcardsSection.jsx`:
```jsx
import React, { useState } from 'react'
import { Sparkles, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'

export default function FlashcardsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <CardTitle>🃏 Flashcards Revision</CardTitle>
          </div>
          <Button size="sm" className="font-bold">
            <Plus className="h-4 w-4" /> New Deck
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-zinc-500">Practice active recall with custom flashcards.</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Step 3: Register the Tab in `AccountNav.jsx`
Open `src/pages/MyAccount/components/AccountNav.jsx` and add your tab to the `ACCOUNT_TABS` array:
```javascript
import { Sparkles } from 'lucide-react' // Import your desired icon

export const ACCOUNT_TABS = [
  { id: 'dashboard',  label: 'Dashboard',           icon: LayoutDashboard },
  { id: 'courses',    label: 'My Courses',          icon: GraduationCap },
  { id: 'calendar',   label: 'Calendar & Schedule', icon: Calendar },
  { id: 'focus',      label: 'Focus Zone',          icon: Timer },
  { id: 'goals',      label: 'Goals & Targets',     icon: Target },
  { id: 'notes',      label: 'Study Notes',         icon: StickyNote },
  { id: 'flashcards', label: 'Flashcards',          icon: Sparkles }, // 👈 Added here!
  { id: 'profile',    label: 'Profile & Settings',  icon: User },
]
```

### Step 4: Render in `MyAccount/index.jsx`
Open `src/pages/MyAccount/index.jsx`:
```javascript
import FlashcardsSection from './sections/flashcards/FlashcardsSection' // 👈 Import here

// Inside the return statement:
{activeTab === 'flashcards' && <FlashcardsSection />} // 👈 Render here
```

**That's it!** The side navigation bar will automatically display your new tab, update URL query parameters (`?tab=flashcards`), and render your new component seamlessly!

---

## 8. Data Flow & Authentication

1. **Authentication Check**:
   - `MyAccount/index.jsx` reads `studentUser` and `studentAccessToken` from `localStorage`.
   - If not authenticated, the user is immediately redirected to `/login`.
2. **Data Loading**:
   - Calls `studentMyCourses()` from `src/api/api.js`.
   - Passes `enrollments`, `approvedCourses`, and `pendingCourses` down to children components as props.
3. **URL Synchronization**:
   - The active tab is synced with the URL query string (`/my-account?tab=courses`).
   - Clicking a sidebar link updates both the state and the URL query parameter.
   - Visiting `/my-courses` maps to `<MyAccount defaultTab="courses" />` for complete backwards compatibility.

---

## 9. Maintenance & Best Practices

- **Avoid Monolithic Files**: Always keep sub-widgets (like cards or filters) separated inside their section's folder.
- **Color Consistency**: Always use StudyLK standard tokens:
  - Page Background: `#F8FBF8`
  - Cards Background: `#ffffff`
  - Primary Green: `#2E7D32` / `#16A34A` / `from-emerald-600 to-green-700`
  - Typography: `#1A3A1A` for headings and `#71717A` / `text-zinc-500` for subtitles.
- **Icon Usage**: Always import icons directly from `lucide-react`.
