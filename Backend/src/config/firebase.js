import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

let adminAuth;
let isConfigured = false;

if (getApps().length === 0) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY !== "your_private_key_here") {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

        try {
            const app = initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: privateKey,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                }),
            });
            adminAuth = getAuth(app);
            isConfigured = true;
            console.log("Firebase Admin Initialized successfully.");
        } catch (error) {
            console.error("Firebase Admin Initialization Error:", error);
            adminAuth = { verifyIdToken: async () => { throw new Error("Firebase Admin Initialization Error"); } };
        }
    } else {
        console.warn("Firebase Admin credentials not fully configured in .env. Firebase endpoints might fail.");
        adminAuth = { verifyIdToken: async () => { throw new Error("Firebase Admin not configured properly"); } };
    }
} else {
    adminAuth = getAuth(getApp());
    isConfigured = true;
}

export { adminAuth, isConfigured };
