import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import type { CollectionName } from '@leadpulse/shared';
import { collectionSchemas } from '@leadpulse/shared';
import { env } from '../config/env.js';

const memoryDb = new Map<string, Map<string, unknown>>();
let firestore: Firestore | null = null;

function hasFirebaseCredentials(): boolean {
  return Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);
}

export function getFirestoreClient(): Firestore | null {
  if (!hasFirebaseCredentials()) return null;
  if (firestore) return firestore;
  const projectId = env.FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) return null;
  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }
  firestore = getFirestore();
  return firestore;
}

function collectionMap(name: CollectionName): Map<string, unknown> {
  const existing = memoryDb.get(name);
  if (existing) return existing;
  const next = new Map<string, unknown>();
  memoryDb.set(name, next);
  return next;
}

export async function setDoc<T extends CollectionName>(
  collectionName: T,
  id: string,
  data: unknown,
): Promise<void> {
  const schema = collectionSchemas[collectionName];
  const parsed = schema.parse(data);
  const db = getFirestoreClient();
  if (db) {
    await db.collection(collectionName).doc(id).set(parsed, { merge: true });
    return;
  }
  collectionMap(collectionName).set(id, parsed);
}

export async function getDoc<T = unknown>(collectionName: CollectionName, id: string): Promise<T | null> {
  const db = getFirestoreClient();
  if (db) {
    const snapshot = await db.collection(collectionName).doc(id).get();
    return snapshot.exists ? (snapshot.data() as T) : null;
  }
  return (collectionMap(collectionName).get(id) as T | undefined) ?? null;
}

export async function listDocs<T = unknown>(collectionName: CollectionName, limit = 50): Promise<T[]> {
  const db = getFirestoreClient();
  if (db) {
    const snapshot = await db.collection(collectionName).limit(limit).get();
    return snapshot.docs.map((doc) => doc.data() as T);
  }
  return Array.from(collectionMap(collectionName).values()).slice(0, limit) as T[];
}

export async function findDocs<T = unknown>(
  collectionName: CollectionName,
  predicate: (value: T) => boolean,
  limit = 50,
): Promise<T[]> {
  const docs = await listDocs<T>(collectionName, 1000);
  return docs.filter(predicate).slice(0, limit);
}

export async function updateDoc<T extends Record<string, unknown>>(
  collectionName: CollectionName,
  id: string,
  patch: Partial<T>,
): Promise<T | null> {
  const current = await getDoc<T>(collectionName, id);
  if (!current) return null;
  const next = { ...current, ...patch };
  await setDoc(collectionName, id, next);
  return next as T;
}

export function isUsingFirestore(): boolean {
  return Boolean(getFirestoreClient());
}

export async function assertNoRecordingReferencesInStoredCalls(): Promise<boolean> {
  const calls = await listDocs<Record<string, unknown>>('callLogs', 1000);
  return calls.every((call) =>
    Object.keys(call).every((key) => !key.toLowerCase().includes('recording') && !key.toLowerCase().includes('audio')),
  );
}
