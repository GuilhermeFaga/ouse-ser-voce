import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

/**
 * Firebase web configuration. Values come from `.env` (see FIREBASE.md); the
 * app stays fully local-first when they are missing.
 */
const env = import.meta.env as Record<string, string | undefined>;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let appPromise: Promise<FirebaseApp> | null = null;

/** The app itself is cheap; the SDKs below are the heavy chunks. */
function loadApp(): Promise<FirebaseApp> {
  appPromise ??= (async () => {
    const mod = await import("firebase/app");
    return mod.getApps().length
      ? mod.getApp()
      : mod.initializeApp(firebaseConfig);
  })().catch(error => {
    appPromise = null;
    throw error;
  });
  return appPromise;
}

export interface AuthServices {
  auth: Auth;
}

let authServices: Promise<AuthServices | null> | null = null;

/**
 * Loads only the auth SDK. A visitor who never signs in does not download the
 * Firestore SDK (about 180 kB gzipped) at all.
 */
export function loadFirebaseAuth(): Promise<AuthServices | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null);

  authServices ??= (async () => {
    const [mod, app] = await Promise.all([import("firebase/auth"), loadApp()]);
    return { auth: mod.getAuth(app) };
  })().catch(error => {
    console.error("Firebase Auth não carregou", error);
    authServices = null;
    return null;
  });

  return authServices;
}

export interface FirestoreServices {
  db: Firestore;
}

let firestoreServices: Promise<FirestoreServices | null> | null = null;

/** Loaded after sign-in, when there is something to read or write. */
export function loadFirestore(): Promise<FirestoreServices | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null);

  firestoreServices ??= (async () => {
    const [mod, app] = await Promise.all([
      import("firebase/firestore"),
      loadApp(),
    ]);

    let db: Firestore;
    try {
      db = mod.initializeFirestore(app, {
        // Keeps the record usable offline and queues writes for the next time
        // the phone has a connection.
        localCache: mod.persistentLocalCache({
          tabManager: mod.persistentMultipleTabManager(),
        }),
      });
    } catch {
      db = mod.getFirestore(app);
    }

    return { db };
  })().catch(error => {
    console.error("Firestore não carregou", error);
    firestoreServices = null;
    return null;
  });

  return firestoreServices;
}
