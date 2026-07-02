import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBukTsxc-G0qy7vilev7EJglMqK3aEL3gQ',
  authDomain: 'medium-3ae06.firebaseapp.com',
  projectId: 'medium-3ae06',
  storageBucket: 'medium-3ae06.firebasestorage.app',
  messagingSenderId: '913524518327',
  appId: '1:913524518327:web:56175bbffb534522b1cc32',
  measurementId: 'G-LXEYYW65VZ',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const analyticsPromise: Promise<Analytics | null> =
  typeof window === 'undefined'
    ? Promise.resolve(null)
    : isSupported()
        .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
        .catch(() => null);