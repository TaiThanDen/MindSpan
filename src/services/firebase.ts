import { db, storage } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Folder, UploadedFile, EmailSettings } from '../types';

// Folders
export const createFolder = async (userId: string, name: string): Promise<string> => {
  const folderRef = await addDoc(collection(db, 'folders'), {
    name,
    userId,
    createdAt: new Date()
  });
  return folderRef.id;
};

// Files
export const uploadFile = async (
  userId: string,
  folderId: string,
  file: File,
  content: string
): Promise<string> => {
  // Upload file content
  const fileRef = await addDoc(collection(db, 'files'), {
    name: file.name,
    content,
    folderId,
    userId,
    createdAt: new Date(),
    lastReviewed: null
  });
  return fileRef.id;
};

// Email Settings
export const updateEmailSettings = async (
  userId: string,
  settings: Partial<EmailSettings>
): Promise<void> => {
  const q = query(collection(db, 'emailSettings'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    await addDoc(collection(db, 'emailSettings'), {
      userId,
      ...settings,
      createdAt: new Date()
    });
  } else {
    const settingsDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'emailSettings', settingsDoc.id), settings);
  }
};

// Get random file from selected folders
export const getRandomFile = async (userId: string, folderIds: string[]): Promise<UploadedFile | null> => {
  const q = query(
    collection(db, 'files'),
    where('userId', '==', userId),
    where('folderId', 'in', folderIds)
  );
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  
  const files = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as UploadedFile[];
  
  return files[Math.floor(Math.random() * files.length)];
};