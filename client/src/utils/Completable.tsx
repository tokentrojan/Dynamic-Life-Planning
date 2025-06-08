import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function checkParentCompleted(userId: string, parentID?: string): Promise<boolean> {
  if (!parentID) return true;

  const parentRef = doc(db, 'users', userId, 'tasks', parentID);
  const parentSnap = await getDoc(parentRef);

  if (!parentSnap.exists()) return false;

  return parentSnap.data().completed === true;
}
