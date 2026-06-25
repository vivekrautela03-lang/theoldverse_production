# Walkthrough - The OldVerse

This document summarizes the files, features, architecture, and verification results for **The OldVerse** premium streaming platform and creator ecosystem, highlighting Phase 3 (The Connected Creator Ecosystem) updates.

---

## 🎬 Key Features Implemented

### 1. Interactive Watch & Screenplay Sync (`src/app/watch/[id]/page.tsx` & `src/components/VideoPlayer.tsx`)
- **Split-Screen Cinema View**: Renders the custom video player on the left and a beautifully formatted, synchronized screenplay script panel on the right on desktop layouts.
- **Screenplay Sync Engine**: Listens to the player's active timestamp using an `onTimeUpdate` callback and automatically highlights the current dialogue segment or action cue.
- **Auto-Scrolling Script Panel**: Uses React refs to automatically scroll the active script segment into view smoothly.
- **Letterboxd-style Review Hub**:
  - Star ratings selector (supporting half stars from 0.5 to 5.0) powered by an interactive range slider.
  - SVG Half-Star Gradient rendering: Uses CSS linear-gradients to draw perfect half-filled stars.
  - Aggregated Star Rating bar-chart: Visualizes the distribution of 1 to 5 star ratings.
  - Review feed: Displays user-logged review cards complete with like counters, avatars, and dates.

### 2. Crew Finder & Jobs Marketplace (`src/app/community/page.tsx`)
- **Unified Opportunities Board**: Divides listings into **Casting Calls** (Actors, Models) and **Crew Finder** (Director of Photography, Composer, Editor, Sound Designer).
- **Multi-Criteria Filter Panel**: Filters opportunities by Role Type (Casting vs. Crew), Budget (Paid vs. Collaboration), and Location (Remote, On-Set, Hybrid).
- **Application Submission modal**: Captures the applicant's name, email, portfolio/reel URL, and cover pitch. Submissions trigger immediate canvas confetti bursts and sync with the database store.

### 3. Backstage Opportunity Manager (`src/app/dashboard/page.tsx`)
- **Job Listings Publisher**: Implements a creation form for creators to post casting calls or crew requirements, instantly publishing them to the `/community` board.
- **Submissions Review Panel**: Displays incoming applications for the creator's listings in real-time, displaying emails, portfolio links, and pitches.
- **Interactive Vetting Controls**: Creators can Approve or Decline candidates, which updates application status badges immediately.

### 4. Creative Resume Builder (`src/app/profile/page.tsx`)
- **Ecosystem Stats Card**: aggregates metrics like total watch hours logged, reviews written, and verified project counts.
- **Professional Timeline**: Displays the user's credits, roles, and narrative contributions on the platform.
- **Applications Status Tracker**: Tracks submitted applications, displaying status badges updated from the dashboard manager.
- **Portfolio Actions**: Clickable triggers to copy a custom portfolio link to the clipboard and simulate a PDF resume export.

### 5. Hydration-Safe Database Store (`src/lib/supabaseStore.ts` & `src/lib/mockData.ts`)
- **Reviews & Ratings Store**: Saves user star-ratings and review texts, dynamically recalculating the media item's overall rating on a 10-point scale.
- **Jobs & Applications Store**: Manages casting and crew job listings, application submissions, and application status approvals.
- **Mock Datasets**: Pre-populated with detailed screenplays for Shivanshi's original clips and starter crew opportunities.

---

## 📂 Project Architecture

Here is the updated directory layout:

```
oldverse_production/
├── src/
│   ├── app/
│   │   ├── globals.css           # Google Fonts (Bebas Neue, Space Grotesk, Inter), custom scrollbars
│   │   ├── layout.tsx            # Global Layout structure (translucent Navbar, Footer, gated Auth check)
│   │   ├── page.tsx              # Autoplay Hero, Carousel slider, Movie rows, Creator spotlight
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin control panel: video review queue, badge approvals, global announcements
│   │   ├── browse/
│   │   │   └── page.tsx          # URL query-synced category browser (wrapped in Suspense)
│   │   ├── community/
│   │   │   └── page.tsx          # Unified jobs board, crew finder filters, application modal
│   │   ├── creator/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Portfolios, photography Masonry grid, follow actions
│   │   ├── dashboard/
│   │   │   └── page.tsx          # SVG analytics charts, project uploader, job publisher, app reviewer
│   │   ├── profile/
│   │   │   └── page.tsx          # Creative Resume card, stats calculator, app status tracker, list logs
│   │   ├── search/
│   │   │   └── page.tsx          # Real-time search by show title, creator name, or genre
│   │   ├── upload/
│   │   │   └── page.tsx          # Stepper upload process (Transcoding simulator)
│   │   └── watch/
│   │       └── [id]/
│   │           └── page.tsx      # Watch route (integrates video player, Screenplay Sync, Review Hub)
│   ├── components/
│   │   ├── AuthPortal.tsx        # Modular auth portal (login, signup, OTP validation, Google OAuth)
│   │   ├── Navbar.tsx            # Floating glassmorphism header, notification drawer, profile toggle
│   │   ├── Footer.tsx            # Premium layout, category linkages, newsletter forms
│   │   ├── MovieRow.tsx          # Horizontal Netflix rows with hover expansions
│   │   └── VideoPlayer.tsx       # Custom seek, volume, speed, fullscreen, and screenplay toggle
│   └── lib/
│       ├── mockData.ts           # Pre-populated creators, films, script segments, casting calls, and types
│       └── supabaseStore.ts      # Hydration-safe LocalStorage database store (events broadcasting)
```

---

## 🛠️ Verification & Build Success

We successfully verified the compilation pipeline using the Next.js production builder.

- **TypeScript Type Checks**: Completed successfully.
- **Static Page Prerendering**: All routes prerendered without any payload exceptions:
  - `/` (Static)
  - `/admin` (Static)
  - `/browse` (Static)
  - `/community` (Static)
  - `/dashboard` (Static)
  - `/profile` (Static)
  - `/search` (Static)
  - `/upload` (Static)
  - `/creator/[id]` (Dynamic)
  - `/watch/[id]` (Dynamic)
