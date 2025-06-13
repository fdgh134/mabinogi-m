import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface ChecklistItem {
  id?: string;
  title: string;
  description?: string;
  isDone?: boolean;
  totalCount: number;
  checkedCount: number;
  type: "daily" | "weekly" | "repeat" | "trade";
}

const checklistRef = collection(db, "checklist");

export const getChecklist = async (): Promise<ChecklistItem[]> => {
  const snapshot = await getDocs(checklistRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChecklistItem[];
};

export const addChecklistItem = async (item: ChecklistItem) => {
  await addDoc(checklistRef, item);
};

export const updateChecklistItem = async (id: string, data: Partial<ChecklistItem>) => {
  const ref = doc(db, "checklist", id);
  await updateDoc(ref, data);
};

export const deleteChecklistItem = async (id: string) => {
  const ref = doc(db, "checklist", id);
  await deleteDoc(ref);
};
