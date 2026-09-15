# 📁 My Account Module

This directory contains the modular implementation of the **StudyLK Student Learning Hub & Dashboard**.

Please refer to the full technical documentation in [MY_ACCOUNT_DOCUMENTATION.md](../../../MY_ACCOUNT_DOCUMENTATION.md) in the project root.

## 🗂️ Folder Structure Quick Reference

- **`index.jsx`**: Main controller, authentication check, and tab router.
- **`components/`**: Shared components (`AccountHeader.jsx`, `AccountNav.jsx`).
- **`sections/`**: Modular feature folders:
  - `dashboard/`: 📊 Main dashboard overview & widgets.
  - `courses/`: 🎓 Enrolled courses hub with search & filters.
  - `calendar/`: 📅 Interactive calendar & study schedule planner.
  - `focus/`: ⏱️ Pomodoro study timer & focus stats.
  - `goals/`: 🎯 Study targets checklist & progress bar.
  - `notes/`: 📝 Digital notes scratchpad & search.
  - `profile/`: 👤 Student profile & account settings.

## ➕ Adding a New Section in 3 Steps
1. Create a folder: `src/pages/MyAccount/sections/<feature_name>/<FeatureSection>.jsx`.
2. Add your tab to `ACCOUNT_TABS` in `components/AccountNav.jsx`.
3. Import and render it in `index.jsx` under `{activeTab === '<feature_name>' && <FeatureSection />}`.
