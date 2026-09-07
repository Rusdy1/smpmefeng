import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  getDocs, 
  query, 
  orderBy, 
  where, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { SchoolProfile, GalleryItem, MessageSubmission, AchievementItem, UserProfile } from '../types';
import { initialSchoolProfile, initialGalleries, initialAchievements } from '../data/initialData';

const PROFILE_COLLECTION = 'school_profile';
const PROFILE_DOC_ID = 'main_profile';
const GALLERIES_COLLECTION = 'galleries';
const MESSAGES_COLLECTION = 'messages';
const ACHIEVEMENTS_COLLECTION = 'achievements';
const USERS_COLLECTION = 'users';

export const ADMIN_EMAIL = 'rusdiishak82@admin.smp.belajar.id';

/**
 * Record or sync logged in user in Firestore
 */
export async function recordUserLogin(user: User): Promise<UserProfile> {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const now = new Date().toISOString();
  const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const existing = snap.data() as UserProfile;
      const updatedData: Partial<UserProfile> = {
        displayName: user.displayName || existing.displayName || 'Pengguna SMP MEFENG',
        email: user.email || existing.email,
        photoURL: user.photoURL || existing.photoURL || '',
        lastLoginAt: now,
        role: isAdmin ? 'admin' : (existing.role || 'user'),
      };
      await updateDoc(userRef, updatedData);
      return { ...existing, ...updatedData, uid: user.uid };
    } else {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Pengguna SMP MEFENG',
        photoURL: user.photoURL || '',
        role: isAdmin ? 'admin' : 'user',
        firstLoginAt: now,
        lastLoginAt: now,
        messageCount: 0,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (error) {
    console.warn('Error recording user login in Firestore:', error);
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Pengguna SMP MEFENG',
      photoURL: user.photoURL || '',
      role: isAdmin ? 'admin' : 'user',
      firstLoginAt: now,
      lastLoginAt: now,
    };
  }
}

/**
 * Subscribe to all logged-in users (Owner / Admin feature)
 */
export function subscribeToAllUsers(callback: (users: UserProfile[]) => void) {
  try {
    const q = query(collection(db, USERS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const users: UserProfile[] = snapshot.docs.map((docSnap) => ({
        uid: docSnap.id,
        ...(docSnap.data() as Omit<UserProfile, 'uid'>)
      }));
      // Sort by lastLoginAt descending
      users.sort((a, b) => new Date(b.lastLoginAt || 0).getTime() - new Date(a.lastLoginAt || 0).getTime());
      callback(users);
    }, (error) => {
      console.warn('Error subscribing to all users:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error in subscribeToAllUsers:', error);
    callback([]);
    return () => {};
  }
}

/**
 * Subscribe to all incoming messages (Owner / Admin feature)
 */
export function subscribeToAllMessages(callback: (messages: MessageSubmission[]) => void) {
  try {
    const q = query(collection(db, MESSAGES_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const messages: MessageSubmission[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<MessageSubmission, 'id'>)
      }));
      // Sort by createdAt descending
      messages.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(messages);
    }, (error) => {
      console.warn('Error subscribing to all messages:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error in subscribeToAllMessages:', error);
    callback([]);
    return () => {};
  }
}

/**
 * Update message status or add admin reply notes (Owner feature)
 */
export async function updateMessageStatus(
  messageId: string, 
  status: 'Baru' | 'Dibaca' | 'Dibalas', 
  adminNotes?: string
) {
  const msgRef = doc(db, MESSAGES_COLLECTION, messageId);
  const updateData: { status: 'Baru' | 'Dibaca' | 'Dibalas'; adminNotes?: string } = { status };
  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }
  return await updateDoc(msgRef, updateData);
}

/**
 * Delete a message from Firestore (Owner feature)
 */
export async function deleteMessage(messageId: string) {
  const msgRef = doc(db, MESSAGES_COLLECTION, messageId);
  return await deleteDoc(msgRef);
}

/**
 * Seed initial Firestore documents if they don't exist yet
 */
export async function seedFirestoreIfEmpty() {
  try {
    // 1. Sync & seed school profile
    const profileRef = doc(db, PROFILE_COLLECTION, PROFILE_DOC_ID);
    await setDoc(profileRef, {
      ...initialSchoolProfile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('Synced SMP MEFENG profile to Firestore');

    // 2. Check & seed galleries
    const gallerySnap = await getDocs(collection(db, GALLERIES_COLLECTION));
    if (gallerySnap.empty) {
      for (const item of initialGalleries) {
        await addDoc(collection(db, GALLERIES_COLLECTION), {
          ...item,
          createdAt: new Date().toISOString()
        });
      }
      console.log('Seeded initial gallery items to Firestore');
    }

    // 3. Check & seed achievements
    const achSnap = await getDocs(collection(db, ACHIEVEMENTS_COLLECTION));
    if (achSnap.empty) {
      for (const ach of initialAchievements) {
        await addDoc(collection(db, ACHIEVEMENTS_COLLECTION), {
          ...ach,
          createdAt: new Date().toISOString()
        });
      }
      console.log('Seeded initial achievements to Firestore');
    }
  } catch (error) {
    console.warn('Firestore seeding check noticed:', error);
  }
}

/**
 * Get School Profile from Firestore with fallback to initial data
 */
export async function getSchoolProfile(): Promise<SchoolProfile> {
  try {
    const profileRef = doc(db, PROFILE_COLLECTION, PROFILE_DOC_ID);
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as SchoolProfile;
    }
    return initialSchoolProfile;
  } catch (err) {
    console.error('Error fetching school profile:', err);
    return initialSchoolProfile;
  }
}

/**
 * Subscribe to realtime galleries from Firestore
 */
export function subscribeToGalleries(callback: (items: GalleryItem[]) => void) {
  try {
    const q = query(collection(db, GALLERIES_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items: GalleryItem[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<GalleryItem, 'id'>)
        }));
        callback(items);
      } else {
        callback(initialGalleries);
      }
    }, (error) => {
      console.warn('Firestore galleries listener error (using fallback):', error);
      callback(initialGalleries);
    });
  } catch (err) {
    console.error('Error subscribing to galleries:', err);
    callback(initialGalleries);
    return () => {};
  }
}

/**
 * Add a new Gallery item to Firestore
 */
export async function addGalleryItem(item: Omit<GalleryItem, 'id'>) {
  return await addDoc(collection(db, GALLERIES_COLLECTION), {
    ...item,
    createdAt: new Date().toISOString()
  });
}

/**
 * Update a Gallery item in Firestore
 */
export async function updateGalleryItem(id: string, updates: Partial<Omit<GalleryItem, 'id'>>) {
  const docRef = doc(db, GALLERIES_COLLECTION, id);
  return await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Delete a Gallery item from Firestore
 */
export async function deleteGalleryItem(idOrItem: string | GalleryItem) {
  try {
    if (typeof idOrItem === 'string') {
      const docRef = doc(db, GALLERIES_COLLECTION, idOrItem);
      return await deleteDoc(docRef);
    }

    if (idOrItem.id) {
      const docRef = doc(db, GALLERIES_COLLECTION, idOrItem.id);
      return await deleteDoc(docRef);
    }

    // Fallback: If no document id, search by imageUrl or title
    if (idOrItem.imageUrl) {
      const q = query(collection(db, GALLERIES_COLLECTION), where('imageUrl', '==', idOrItem.imageUrl));
      const snap = await getDocs(q);
      const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    }
  } catch (error) {
    console.error('Error in deleteGalleryItem:', error);
    throw error;
  }
}

/**
 * Submit a contact/message with required inputs and photo
 */
export async function submitMessage(messageData: Omit<MessageSubmission, 'id' | 'createdAt' | 'status'>) {
  const payload: Omit<MessageSubmission, 'id'> = {
    ...messageData,
    createdAt: new Date().toISOString(),
    status: 'Baru'
  };

  const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), payload);
  return { id: docRef.id, ...payload };
}

/**
 * Subscribe to user messages from Firestore
 */
export function subscribeToUserMessages(userId: string, callback: (messages: MessageSubmission[]) => void) {
  try {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('userId', '==', userId)
    );
    return onSnapshot(q, (snapshot) => {
      const items: MessageSubmission[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<MessageSubmission, 'id'>)
      }));
      // Sort client-side by date descending
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(items);
    }, (err) => {
      console.warn('Error listening to user messages:', err);
      callback([]);
    });
  } catch (err) {
    console.error('Error in subscribeToUserMessages:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Update payment details for a registration submission
 */
export async function updateRegistrationPayment(
  registrationId: string,
  paymentData: {
    paymentStatus: 'pending' | 'settlement' | 'capture' | 'deny' | 'cancel' | 'expire' | 'failure';
    paymentType?: string;
    transactionTime?: string;
    orderId?: string;
    paymentAmount?: number;
  }
) {
  const docRef = doc(db, MESSAGES_COLLECTION, registrationId);
  return await updateDoc(docRef, {
    ...paymentData,
    updatedAt: new Date().toISOString()
  });
}


