# Erovoutika CMS — Admin User Manual

> **Audience:** Website administrators who manage content through the Erovoutika CMS dashboard. No coding knowledge is required to follow this guide.

---

## Table of Contents

1. [What Is the Erovoutika CMS?](#1-what-is-the-erovoutika-cms)
2. [What You Need Before You Start](#2-what-you-need-before-you-start)
3. [How to Open the Admin Dashboard](#3-how-to-open-the-admin-dashboard)
4. [How to Log In](#4-how-to-log-in)
5. [The Dashboard at a Glance](#5-the-dashboard-at-a-glance)
6. [Editing the About Section](#6-editing-the-about-section)
7. [Editing the Services Section](#7-editing-the-services-section)
8. [Editing the Portfolio Section](#8-editing-the-portfolio-section)
9. [Editing the Awards Section](#9-editing-the-awards-section)
10. [Editing the Academe Partners Section](#10-editing-the-academe-partners-section)
11. [Editing the News & Updates Section](#11-editing-the-news--updates-section)
12. [Publishing Changes](#12-publishing-changes)
13. [Viewing the Live Site](#13-viewing-the-live-site)
14. [Best Practices](#14-best-practices)
15. [Common Problems and Fixes](#15-common-problems-and-fixes)

---

## 1. What Is the Erovoutika CMS?

The Erovoutika CMS is a private admin panel that lets authorized staff update the content of the Erovoutika Robotics and Automation website — without touching any code.

Using the CMS, you can:

- Update the company description, headline, and featured photo in the **About** section.
- Edit service titles, icons, and descriptions in the **Services** section.
- Add or replace images in the **Portfolio** gallery.
- Manage award images and captions in the **Awards** section.
- Add or remove partner/university logos from the scrolling banner in the **Academe Partners** section.
- Update news card images, dates, headlines, and links in the **News & Updates** section.

All changes are published to the live website instantly when you click **Publish Changes**.

---

## 2. What You Need Before You Start

- A **Google (Gmail) account** that has been pre-approved by the IT team. Only approved emails can log in.
- The **VS Code Live Server extension** running on your computer — or access to the hosted admin URL if the site has been deployed online.
- A modern browser (Chrome, Edge, or Firefox recommended).

> If you are not sure whether your email is approved, contact your IT administrator.

---

## 3. How to Open the Admin Dashboard

### If you are running the site locally (on your own computer)

1. Open **Visual Studio Code**.
2. Open the project folder (the folder that contains `admin.html`).
3. In the file explorer, right-click **`admin.html`** and choose **Open with Live Server**.
4. Your browser will open automatically at an address like:
   ```
   http://127.0.0.1:5500/admin.html
   ```
5. The login screen will appear.

> **Important:** Never open the file by simply double-clicking it. It must be opened through Live Server, or login will not work.

### If the site is deployed online

Navigate to the hosted URL provided by your IT team (e.g., `https://yourdomain.com/admin.html`).

---

## 4. How to Log In

1. On the login screen, click the **Sign in with Google** button.
2. A Google account picker will appear in a pop-up window.
3. Select or type in your approved Gmail account and confirm.
4. If your account is authorized, the dashboard will open immediately.
5. If you see an **"Access Denied"** message, your account is not on the approved list — contact your IT administrator.

> If the pop-up does not appear, check that your browser is not blocking pop-ups for this site.

### How to Log Out

Click the **Logout** button in the top-right corner of the dashboard at any time.

---

## 5. The Dashboard at a Glance

Once logged in, you will see:

**Top navigation bar** — Shows the Erovoutika logo, a **View Live Site** link, a light/dark mode toggle, your logged-in email address, and the Logout button.

**Left sidebar** — Links to each editable section:
- Overview
- About Me
- Services
- Portfolio
- Awards
- Academe Partners
- News & Updates
- Live Site (external link)

**Main area** — Displays the editor for whichever section you select.

**Overview panel** — The default landing page after login. It shows:
- Number of active sections (6).
- Firebase connection status (should show **Connected** in green).
- Quick-access buttons to jump directly to any section.

**Status badges** — Each section shows a small colored dot:
- 🟢 **Synced** — The content on screen matches what is in the database.
- 🟡 **Saving...** — A save is in progress.
- 🔴 **Error** — Something went wrong during the last save.

---

## 6. Editing the About Section

Click **About Me** in the sidebar.

### Text Content

| Field | What it does |
|---|---|
| **Main Headline** | The large heading text in the About section on the live site. You can press Enter for a new line — the line break will show on the website. |
| **Who We Are (Description)** | The paragraph of body text below the headline. |

Both fields are required. You cannot publish without filling them in.

### Featured Image

1. Click the dashed upload area (or drag and drop a file onto it).
2. Choose a PNG, JPG, or WEBP image. Maximum size: **10 MB**.
3. A preview of the image will appear below the upload area.
4. To remove the image, click the **Remove Image** button below the preview.

### Image Display Settings

After uploading a photo, you can control how it appears on the live site:

| Setting | What it does |
|---|---|
| **Image Display Width** (slider) | Sets the image width as a percentage of its container. Drag left to make it narrower. |
| **Max Width (px)** | Optional. Prevents the image from growing wider than this number of pixels, even on large screens. |
| **Max Height (px)** | Optional. Prevents the image from growing taller than this number of pixels. |
| **Object Fit** | Controls how the image fills its space. **Cover** crops the image to fill. **Contain** shows the whole image with letterboxing. **Fill** stretches it. **None / Natural** shows the image at its original size. |

A **Size Preview** box at the bottom of the card shows you how the image will look with your current settings before you publish.

### Saving

Click **Publish Changes**. A green "Synced" badge confirms the save was successful.

To discard your edits and reload the last saved version, click **Reload from Database**.

---

## 7. Editing the Services Section

Click **Services** in the sidebar.

### Section Introduction

| Field | What it does |
|---|---|
| **Section Subtitle** | A small label that appears above the "Our Services" heading (e.g., "What We Do"). |
| **Section Description** | A short paragraph describing Erovoutika's services that appears in the left column. |

### Service Cards

Each service is displayed as a card on the live site. The default setup has 6 cards (Certifications, Automation, Robotics, Research & Development, Cybersecurity, Blockchain).

**To edit a card:**

1. Find the card row (labeled "Service Card 1", "Service Card 2", etc.).
2. Update any of the following fields:

| Field | What it does |
|---|---|
| **Icon (emoji)** | The emoji shown at the top of the card (e.g., 🎓, ⚙️, 🤖). |
| **Number Label** | The category tag (e.g., "01 — Certifications"). |
| **Card Title** | The main title of the card. You can press Enter for a line break. |
| **Description** | The body text that describes the service. |

**To add a card:** Click the **+ Add Card** button above the card list.

**To remove a card:** Click the **Remove** button on the right side of any card row. You will be asked to confirm before it is deleted.

### Saving

Click **Publish Changes**. To discard edits, click **Reload from Database**.

---

## 8. Editing the Portfolio Section

Click **Portfolio** in the sidebar.

The Portfolio section controls the image gallery grid on the live site.

**To add a gallery image:**

1. Click **+ Add Image**.
2. A new row will appear at the bottom of the list.
3. Either paste an image URL into the **Image URL** field, or click the small **Upload** button to upload a file directly.
4. Fill in the **Alt Text** field with a brief description of the image (e.g., "Robotics competition 2023"). This is used for accessibility.

**To remove an image:**

Click the **Remove** button on any image row and confirm the prompt.

**To replace an image:**

Paste a new URL into the Image URL field, or click the upload button to upload a new file.

> **Note:** Scroll-reveal animations and the custom cursor hover effect are automatically re-applied when new items are published.

### Saving

Click **Publish Changes**. To discard edits, click **Reload from Database**.

---

## 9. Editing the Awards Section

Click **Awards** in the sidebar.

The Awards section controls the award images and their caption text shown on the live site.

**Each award item has:**

| Field | What it does |
|---|---|
| **Image URL** | URL of the award image, or upload using the small Upload button. |
| **Alt Text** | Brief description of the award image (for accessibility). |
| **Caption** | The text label shown beneath the award image on the live site. |

**To add an award:** Click **+ Add Award**.

**To remove an award:** Click the **Remove** button on the item row and confirm.

### Saving

Click **Publish Changes**. To discard edits, click **Reload from Database**.

---

## 10. Editing the Academe Partners Section

Click **Academe Partners** in the sidebar.

This section controls the logos that scroll continuously across the screen in the Partners/Academe Partners marquee banner on the live site.

> The marquee automatically duplicates all logos to create a seamless scrolling loop. You only manage the unique set of logos — you do not need to add them twice.

### Adding a Partner Logo

1. Click **+ Add Partner**.
2. A form will appear below the logo grid.
3. Either:
   - Paste the logo image URL into the **Logo URL** field, **or**
   - Click **📂 Click to upload logo image** to upload a file directly.
4. Fill in the **Alt Text / Name** field (e.g., "University of Santo Tomas"). Both fields are required.
5. Click **Save Partner**.

### Editing or Removing a Partner

- **Edit:** Click the **Edit** button on any logo card in the grid. The form will reload with that partner's current data. Make your changes and click **Save Partner**.
- **Remove:** Click the **Remove** button on any logo card and confirm the prompt.

### Saving

Click **Publish Changes** to push all changes live. To discard edits, click **Reload from Database**.

---

## 11. Editing the News & Updates Section

Click **News & Updates** in the sidebar.

Each news item appears as a card on the live site with an image, date, headline, and a "Read More" link.

**Each news card has:**

| Field | Required | What it does |
|---|---|---|
| **Image URL** | No | URL of the card image. You can also use the small Upload button to upload a file. |
| **Alt Text** | No | Brief description of the image (for accessibility). |
| **Date** | Yes | The date shown on the card (e.g., "April 20–22, 2023"). This can be any text — it does not have to be a formal date format. |
| **Headline / Title** | Yes | The news headline shown on the card. |
| **Read More Link** | No | The URL the "Read More →" link opens when clicked. |

**To add a news card:** Click **+ Add News Card**. The new card will scroll into view automatically.

**To remove a news card:** Click the **Remove** button on the card row and confirm.

### Saving

Click **Publish Changes**. All pending image uploads are processed first, then the data is saved. To discard edits, click **Reload from Database**.

---

## 12. Publishing Changes

Every section has a **Publish Changes** button. Here is what happens when you click it:

1. The button label changes to **Publishing…** while the save is in progress.
2. If you selected image files to upload, they are uploaded to Firebase Cloud Storage first. This may take a few seconds depending on your internet speed.
3. All text and image data is saved to the Firestore database.
4. A **green toast notification** appears in the corner confirming success (e.g., "About Me published successfully! ✓").
5. The status badge next to the section title changes back to **Synced**.

If the save fails, a **red toast notification** appears. Check your internet connection and try again.

### Reload from Database

Each section also has a **Reload from Database** button. Use this if:

- You made changes you want to throw away.
- You want to reset the form to what is currently on the live site.

You will be prompted to confirm before the reload happens, since unsaved changes will be lost.

---

## 13. Viewing the Live Site

- Click **View Live Site** in the top-right of the dashboard navbar, **or**
- Click **Live Site** in the bottom of the left sidebar.

Both links open `index4(1).html` in a new browser tab.

After publishing changes, **refresh the live site tab** to see your updates. Content is loaded fresh each time the page opens.

---

## 14. Best Practices

- **Always click Publish Changes before navigating away.** Switching to a different section does not save your work automatically.
- **Use descriptive alt text for every image.** This helps with accessibility and search engine visibility.
- **Keep image file sizes reasonable.** Large files take longer to upload and slow down the live site. Aim for under 1–2 MB per image when possible.
- **Test on the live site after publishing.** Open `index4(1).html` in a new tab, refresh it, and confirm the changes appear as expected.
- **Do not leave the dashboard open in multiple tabs at the same time.** This can cause conflicts if you edit the same section from two windows simultaneously.
- **Use the light/dark mode toggle** (the small switch in the top-right) to set your preferred working appearance. The choice is saved for your next visit.
- **News card dates are free-form text.** You can write "Coming Soon", "April 2023", or a full date range — whatever appears correctly on the live site.

---

## 15. Common Problems and Fixes

### "Sign-in failed. Please try again."

- Check that your browser is not blocking pop-up windows for this site.
- Make sure you have a stable internet connection.
- Try a different browser (Chrome is recommended).

### "Access Denied: your@email.com is not an authorized administrator."

- Your Google account is not on the approved admin list.
- Contact your IT administrator to have your email added.

### The login pop-up does not appear at all

- Your browser may be blocking pop-ups. Look for a pop-up blocked icon in the address bar and allow pop-ups for this site.

### The dashboard opened but shows "Connecting…" instead of "Connected" for Firebase

- This usually means there is a network issue or a mismatch in the Firebase configuration.
- Check your internet connection.
- Contact your IT administrator — the Firebase project settings may need to be verified.

### I clicked Publish but nothing happened / I see an error toast

- Check your internet connection.
- If you uploaded a large image file, the upload may have timed out. Try with a smaller image.
- If the error persists, contact your IT administrator — Firestore or Storage security rules may need to be updated.

### My changes are not showing on the live site

- Make sure you clicked **Publish Changes** (not just edited the fields).
- Refresh the live site tab — the page must be reloaded to fetch the latest data.
- Confirm the status badge shows **Synced** after publishing.

### The admin panel opened but no content loaded (all fields are blank)

- The Firestore document for that section may not exist yet. This is normal for a fresh setup. Fill in the fields and click **Publish Changes** to create it for the first time.

### Images are not showing on the live site after publishing

- Check that the image URL is correct and publicly accessible.
- If you uploaded a file, the upload may have failed silently. Try the upload again.
- Confirm that Firebase Storage rules allow public read access (contact your IT administrator).

### I accidentally removed an item (card, image, award, etc.)

- Click **Reload from Database** immediately (before clicking Publish) to restore the last saved version. Any changes made since the last publish will be lost, but the removed item will be restored.

---

*For technical issues beyond this guide, contact your IT administrator or developer.*
