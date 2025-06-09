//updateCompletable 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function updateCompletableStatus(userId: string, taskId: string, parentId: string | undefined) {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);

  if (!parentId) {
    // No parent, always completable
    await updateDoc(taskRef, { completable: true });
    return;
  }

  const parentRef = doc(db, 'users', userId, 'tasks', parentId);
  const parentSnap = await getDoc(parentRef);

  if (!parentSnap.exists()) {
    await updateDoc(taskRef, { completable: false });
    return;
  }

  const parentData = parentSnap.data();
  const isParentCompleted = parentData.completed === true;

  await updateDoc(taskRef, { completable: isParentCompleted });
}
