import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

export async function saveToFirestore(data: { artworks?: any[]; sales?: any[]; inventoryLogs?: any[]; settings?: any }) {
  try {
    const docRef = doc(db, 'storeData', 'main');
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Firestore save warning:', err);
  }
}

export async function loadFromFirestore() {
  try {
    const docRef = doc(db, 'storeData', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('Firestore load warning:', err);
  }
  return null;
}
