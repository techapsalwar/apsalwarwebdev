# 🏆 Master Plan: World-Class Army Public School Alwar Website

## 1. Vision Statement
To engineer a **blazing fast, accessible, and immersive digital campus** that reflects the prestige of Army Public School Alwar. This platform will serve as the gold standard for educational websites, blending **classic institutional dignity** with **modern technological excellence**.

## 2. Technical Architecture

### Core Stack
*   **Framework:** Laravel 12 (Robust Backend Security & Logic)
*   **Frontend:** React 18 + Inertia.js v2 (SPA feel with Monolith simplicity)
*   **Styling:** Tailwind CSS (Utility-first, Design System driven)
*   **Build Tool:** Vite (HMR, Optimized Builds)

### Critical Upgrades (The "Blazing Fast" Engine)
1.  **Server-Side Rendering (SSR):**
    *   *Why:* Essential for SEO (Google indexing) and social sharing cards (WhatsApp/Facebook previews).
    *   *Action:* Implement Inertia SSR with a Node.js sidecar process.
2.  **Progressive Web App (PWA):**
    *   *Why:* Allows parents/students to "install" the site as an app. Provides offline access to critical info (Contacts, Calendar).
    *   *Action:* Integrate `vite-plugin-pwa` with a custom service worker.
3.  **Image Optimization Pipeline:**
    *   *Why:* Large photos slow down sites.
    *   *Action:* Auto-convert uploads to WebP/AVIF formats using `spatie/laravel-medialibrary` or a custom intervention pipeline.

## 3. Design System & Tokens (The "Classic & Modern" Look)

To ensure consistency across the "Classic" (Institutional) and "Modern" (UI/UX) aspects, we define strict tokens.

### 🎨 Color Palette
*   **Primary (Heritage):** `#1e3a8a` (Deep Royal Blue) - Represents Trust, Dignity, Intelligence.
*   **Secondary (Vibrance):** `#ea580c` (Burnt Orange/Gold) - Represents Energy, Courage (Army roots).
*   **Neutral (Canvas):**
    *   Surface: `#ffffff` (White)
    *   Background: `#f8fafc` (Slate 50)
    *   Text: `#0f172a` (Slate 900)
*   **Status:**
    *   Success: `#10b981` (Emerald)
    *   Alert: `#ef4444` (Red)

### ✍️ Typography
*   **Headings (Classic):** *Playfair Display* or *Merriweather*. Serif fonts that convey authority and tradition.
*   **Body (Modern):** *Inter* or *Lato*. Clean, highly readable sans-serif for long-form text and UI elements.
*   **Monospace:** *JetBrains Mono* (for technical data/codes).

### 📐 Layout & Spacing
*   **Container:** Centered, max-width `1280px` (xl) for standard content.
*   **Grid:** 12-column fluid grid.
*   **Spacing Scale:** Tailwind default (4px base).

## 4. Feature Roadmap

### Phase 1: Foundation & Performance (Immediate)
*   [ ] **PWA Integration:** Configure manifest, service worker, and offline fallback page.
*   [ ] **SEO Overhaul:** Install `spatie/laravel-sitemap` and `artesaos/seotools`. Implement dynamic meta tags for News/Events.
*   [ ] **SSR Setup:** Configure `inertia-ssr` for search engine visibility.
*   [ ] **Design System Implementation:** Update `tailwind.config.js` with the formalized colors and fonts.

### Phase 2: Engagement & Experience (Short Term)
*   [ ] **Interactive Calendar:** A React-based calendar filtering Academic, Sports, and Holiday events.
*   [ ] **Global Search (Command Center):** A `cmd+k` modal to instantly find Circulars, Staff, or Pages.
*   [ ] **Alumni Network:** A dedicated registration and networking portal for past students.
*   [ ] **Download Center 2.0:** A searchable, categorized repository for circulars and assignments.

### Phase 3: Advanced Administration (Medium Term)
*   [ ] **Media Manager:** A drag-and-drop interface for managing gallery photos and documents.
*   [ ] **Rich Text Editor:** Upgrade to Tiptap/Editor.js for writing beautiful News articles with embedded media.
*   [ ] **Audit Logs:** Track who changed what (Security & Accountability).

## 5. Admin Panel Evolution
The Admin Panel will be transformed into a **Command Center**:
*   **Dashboard:** Real-time analytics (Visitors, Most viewed notices).
*   **Quick Actions:** "Post News", "Upload Circular" accessible in one click.
*   **Preview Mode:** See how content looks on Mobile/Desktop before publishing.

## 6. Success Metrics
*   **Lighthouse Score:** 95+ in Performance, Accessibility, Best Practices, SEO.
*   **Load Time:** < 1.5s for First Contentful Paint (FCP).
*   **PWA:** Installable on Android/iOS with a perfect Lighthouse PWA score.
