// erovoutika-cms.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Firebase Config here
const firebaseConfig = {
  apiKey: "AIzaSyD5GwkaU3qKf-jdG2R7QQyGADuYIPedlkY",
  authDomain: "erovoutika-cms-b2f23.firebaseapp.com",
  projectId: "erovoutika-cms-b2f23",
  storageBucket: "erovoutika-cms-b2f23.firebasestorage.app",
  messagingSenderId: "1049312061270",
  appId: "1:1049312061270:web:33458a4547f344160458f7",
  measurementId: "G-KKEP1LKF0Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    await hydrateAboutSection();
});

async function hydrateAboutSection() {
    try {
        const snap = await getDoc(doc(db, 'sections', 'about'));
        if (!snap.exists()) return;
        
        const data = snap.data();

        // Target the specific IDs inside your index4(1).html
        const headlineEl = document.querySelector('#about .about-text h2');
        const paragraphEl = document.querySelector('#about .about-text p');
        const imageEl = document.querySelector('#aboutImg img');

        if (headlineEl && data.headline) headlineEl.innerHTML = data.headline.replace(/\n/g, '<br>');
        if (paragraphEl && data.description) paragraphEl.textContent = data.description;
        if (imageEl && data.imageUrl) imageEl.src = data.imageUrl;
        
    } catch (error) {
        console.error("Error fetching About content:", error);
    }
}
