# Erovoutika Serverless CMS — README

> **Audience:** Developers and IT staff responsible for setting up, maintaining, or extending the Erovoutika CMS.

---

## 1. Project Overview

The Erovoutika CMS is a custom, serverless content management system built for the **Erovoutika Robotics and Automation** website. It uses plain HTML, CSS, and Vanilla JavaScript on the front end, and relies entirely on **Firebase** (Authentication, Firestore, and Cloud Storage) as its backend. There is no Node.js server, no PHP, and no build step required to run the project.

Administrators use a secure browser-based dashboard (`admin.html`) to edit website content. Changes are written directly to Firestore. The public website (`index4(1).html`) reads from Firestore on every page load and injects the latest content into the DOM automatically.

---

## 2. Key Features

- **Serverless architecture** — Firebase handles all data storage, file hosting, and authentication. No backend server required.
- **Google Sign-In with email whitelist** — Only pre-approved Gmail addresses can access the dashboard. Unauthorized accounts are immediately signed out.
- **Live content hydration** — `erovoutika-cms.js` fetches all section data from Firestore on `DOMContentLoaded` and injects it into the public page without a refresh.
- **Image upload to Firebase Cloud Storage** — Admins can upload images directly from the dashboard. Files are stored in Cloud Storage and the generated download URL is saved to Firestore automatically.
- **Image display controls** — The About section supports server-side width (%), max-width (px), max-height (px), and `object-fit` settings, all stored in Firestore and applied to the live site.
- **Per-section save/reload** — Each content section has its own **Publish Changes** and **Reload from Database** button, making partial updates safe.
- **XSS protection** — All untrusted strings from Firestore are passed through a `esc()` helper before being injected into HTML.
- **Dark/Light mode** — The admin dashboard persists the selected theme in `localStorage`.
- **Toast notification system** — Non-blocking success, error, and info alerts appear in the corner of the admin UI.

---

## 3. File Structure

```
project-root/
│
├── admin.html              # Secure CMS dashboard (all admin logic is self-contained here)
├── index4(1).html          # Public-facing website
├── erovoutika-cms.js       # Hydration script loaded by index4(1).html
│
└── (no firebase-config.js) # Firebase credentials are inlined directly in admin.html
                            # and erovoutika-cms.js — there is no separate config file.
```

> **Note:** The original manual references a `firebase-config.js` file. **This file does not exist** in the current codebase. Firebase credentials and the `ALLOWED_EMAILS` array are embedded directly inside `admin.html` (around line 1340) and `erovoutika-cms.js` (top of file). If you refactor to a shared config file, update both files.

---

## 4. Firestore Data Model

All content lives in the `sections` collection. Each document corresponds to one editable section.

| Document ID  | Fields stored |
|---|---|
| `about`      | `headline`, `description`, `imageUrl`, `imgWidth`, `imgMaxWidth`, `imgMaxHeight`, `imgFit`, `updatedAt` |
| `services`   | `subtitle`, `description`, `cards[]` → `{icon, number, title, body}`, `updatedAt` |
| `portfolio`  | `items[]` → `{imageUrl, alt}`, `updatedAt` |
| `awards`     | `items[]` → `{imageUrl, alt, caption}`, `updatedAt` |
| `partners`   | `items[]` → `{imageUrl, alt}`, `updatedAt` |
| `news`       | `items[]` → `{imageUrl, alt, date, title, link}`, `updatedAt` |

---

## 5. Firebase Storage Layout

Uploaded images are stored in Cloud Storage using this path convention:

| Section  | Storage path pattern |
|---|---|
| About    | `about/{timestamp}_{filename}` |
| Portfolio | `portfolio/{timestamp}_{filename}` |
| Awards   | `awards/{timestamp}_{filename}` |
| Partners | `partners/{timestamp}_{filename}` |
| News     | `news/{timestamp}_{filename}` |

> Services cards do not support image uploads — they use emoji icons only.

---

## 6. Firebase Setup

### 6.1 Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com) and create a new project.
2. Enable **Google Analytics** (optional).

### 6.2 Enable Authentication

1. In the Firebase console, go to **Authentication → Sign-in method**.
2. Enable the **Google** provider.
3. Under **Authorized domains**, make sure the domain where the files are served is listed. When running locally via VS Code Live Server, add `127.0.0.1` and `localhost`.

### 6.3 Enable Firestore

1. Go to **Firestore Database → Create database**.
2. Choose **Production mode** (you will apply rules manually).
3. Select a region close to your primary users.

### 6.4 Enable Cloud Storage

1. Go to **Storage → Get started**.
2. Choose **Production mode**.
3. Select the same region as Firestore.

### 6.5 Register a Web App

1. In **Project Settings → Your apps**, click the `</>` icon to add a web app.
2. Copy the `firebaseConfig` object.

### 6.6 Update the Code

Replace the `firebaseConfig` object in **both** files with your own credentials:

- `admin.html` — search for `const firebaseConfig = {` (around line 1340)
- `erovoutika-cms.js` — `const firebaseConfig = {` at the top of the file

---

## 7. Authorized Admin Emails

The whitelist is a JavaScript array inside `admin.html`:

```javascript
const ALLOWED_EMAILS = [
    "ngbradovan@gmail.com",
    "khatall2026@gmail.com",
    "erovoutika@gmail.com"
];
```

- Comparison is case-insensitive (`.toLowerCase()` is applied before the check).
- If a Google account is **not** in this array, the user is immediately signed out and shown an "Access Denied" message.
- To add or remove an administrator, edit this array and re-deploy `admin.html`.
- The same three emails should also appear in your **Firestore Security Rules** (see Section 8).

---

## 8. Firestore Security Rules

Apply these rules under **Firestore Database → Rules** in the Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sections/{document=**} {
      // Public website can read all section documents
      allow read: if true;

      // Only whitelisted admins can write
      allow write: if request.auth != null &&
        (request.auth.token.email == "ngbradovan@gmail.com" ||
         request.auth.token.email == "khatall2026@gmail.com" ||
         request.auth.token.email == "erovoutika@gmail.com");
    }
  }
}
```

If you add a new admin email to `ALLOWED_EMAILS`, also add the corresponding `||` clause to these rules, then click **Publish**.

---

## 9. Cloud Storage Security Rules

Apply these rules under **Storage → Rules** in the Firebase console. They allow authenticated users to upload and allow public read access (needed for the live site to display images):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

For stricter access, restrict `write` to the same whitelisted emails using `request.auth.token.email`.

---

## 10. How Admin and Live Site Connect

```
Admin saves content
        │
        ▼
  Firestore (sections/{id})
        │
        ▼
index4(1).html loads → erovoutika-cms.js runs on DOMContentLoaded
        │
        ▼
  Fetches each section doc → injects data into DOM targets
```

The live site makes **one `getDoc()` call per section** (6 total) in parallel via `Promise.all()`. There are no real-time listeners — the page fetches data once on load. To reflect admin changes, the public page just needs to be refreshed.

---

## 11. DOM Targets in `index4(1).html`

`erovoutika-cms.js` depends on the following selectors being present in the public HTML. **Do not remove or rename these elements** without also updating the hydration script.

| Section   | Target selector(s) |
|---|---|
| About     | `#about .about-text h2`, `#about .about-text p`, `#aboutImg img` |
| Services  | `.stack-left .section-tag`, `.stack-left .stack-sub`, `#stackRight` |
| Portfolio | `.gallery-grid` |
| Awards    | `.awards-grid` |
| Partners  | `.marquee-track` |
| News      | `.news-grid` |

After injecting Portfolio, Awards, and News items, the script also re-runs:

- `reObserveReveal()` — re-registers scroll-reveal `IntersectionObserver` on newly injected `.reveal` elements.
- `reattachCursorHover(selector)` — reattaches `mouseenter`/`mouseleave` listeners for the custom cursor enlargement effect.

For Services cards, `window.__reinitCards()` (defined in `index4(1).html`) is called to re-run the stacked-card rotation logic and reattach mouse listeners.

---

## 12. Running the Project Locally

The project requires a **local HTTP server** because:

1. `erovoutika-cms.js` uses ES Modules (`import`/`export`), which browsers block over the `file://` protocol.
2. Firebase Authentication requires an authorized domain — `file://` is not valid.

**Recommended: VS Code Live Server extension**

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
2. Open the project folder in VS Code.
3. Right-click `admin.html` → **Open with Live Server**. The dashboard opens at `http://127.0.0.1:5500/admin.html`.
4. Open `index4(1).html` via Live Server for the public site: `http://127.0.0.1:5500/index4(1).html`.

Ensure `127.0.0.1` is listed under **Firebase → Authentication → Authorized domains**.

---

## 13. Deploying to Production

Since there is no server-side code, you can host the files on any static hosting provider:

- **Firebase Hosting** (recommended — same project, free tier available)
- GitHub Pages
- Netlify / Vercel

After deployment, add your production domain to **Firebase Authentication → Authorized domains**.

---

## 14. Notes for Developers

- **No build step** — The project uses Firebase JS SDK v12 via CDN (`https://www.gstatic.com/firebasejs/12.12.1/...`). No `npm install` required.
- **Firebase SDK version** — Currently pinned to `12.12.1` in both `admin.html` and `erovoutika-cms.js`. If you upgrade, update all import URLs in both files consistently.
- **Default data fallbacks** — If a Firestore document does not yet exist when the admin loads, `admin.html` falls back to hardcoded default values (e.g., `DEFAULT_SERVICES`, `DEFAULT_NEWS`). Publishing creates the document for the first time.
- **Partners marquee** — The marquee duplicates the partner logo set automatically in both `hydratePartners()` (live site) and the admin preview. You only manage the unique set.
- **No real-time listeners** — The live site uses `getDoc()`, not `onSnapshot()`. Content changes are visible only after a page refresh.
- **`index4(1).html` filename** — The parentheses in the filename are unusual and can cause issues on some servers or with some CLI tools. Consider renaming it to `index.html` or `index4.html` if you encounter 404 errors in production.

---

## 15. Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Login popup blocked or fails | Firebase auth domain not authorized | Add `127.0.0.1` (local) or your domain (production) to Firebase → Authentication → Authorized domains |
| "Access Denied" after Google sign-in | Email not in `ALLOWED_EMAILS` | Add the email to the array in `admin.html` |
| Content not updating on live site | Firestore read rules too strict, or wrong `projectId` | Verify `allow read: if true;` rule; confirm `firebaseConfig` matches in both files |
| Images not uploading | Storage rules deny write, or CORS issue | Confirm Storage rules allow write for authenticated users |
| Hydration script not loading | ES Module import fails over `file://` | Open with Live Server, not by double-clicking the file |
| `window.__reinitCards is not a function` | Services cards loaded before the page script defines the function | Ensure `erovoutika-cms.js` is the **last** `<script>` tag in `index4(1).html` |
| Partners logos not looping seamlessly | Old DOM not cleared before inject | `hydratePartners()` replaces `track.innerHTML` and duplicates the set — if broken, check that `.marquee-track` selector matches |
| Firestore write denied after adding new admin | Firestore rules not updated | Update the `allow write` rule in Firestore console and publish |

---

*Last documented based on code review of `admin.html`, `index4(1).html`, and `erovoutika-cms.js`.*
