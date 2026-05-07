// erovoutika-cms.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 1. Paste your Firebase Config here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Fetch and Hydrate Data when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
    await hydrateAboutSection();
    // Add future sections here (e.g., hydrateServices())
});

async function hydrateAboutSection() {
    try {
        const snap = await getDoc(doc(db, 'sections', 'about'));
        if (!snap.exists()) return;
        
        const data = snap.data();

        // Target the existing elements in your index4(1).html
        const headlineEl = document.querySelector('#about .about-text h2');
        const paragraphEl = document.querySelector('#about .about-text p');
        const imageEl = document.querySelector('#aboutImg img');

        // Inject Firebase data
        if (headlineEl && data.headline) headlineEl.innerHTML = data.headline.replace(/\n/g, '<br>');
        if (paragraphEl && data.description) paragraphEl.textContent = data.description;
        if (imageEl && data.imageUrl) imageEl.src = data.imageUrl;
        
    } catch (error) {
        console.error("Error fetching About content:", error);
    }
}
