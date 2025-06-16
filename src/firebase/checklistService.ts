import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  CollectionReference,
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

export const getChecklistCollectionRef = (
  uid: string,
  character: string | null
): CollectionReference => {
  if (character) {
    return collection(db, "checklist", uid, character) as CollectionReference;
  } else {
    return collection(db, "checklist", "_template", "items") as CollectionReference;
  }
};

/**
 * 프리셋 데이터 불러오기 (최초 1회)
 */
export const getTemplateChecklist = async (): Promise<ChecklistItem[]> => {
  const ref = collection(db, "checklist", "_template", "items");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as ChecklistItem[];
};

/**
 * 로그인한 사용자+캐릭터에 해당하는 체크리스트 불러오기
 */
export const getChecklist = async (
  uid: string,
  character: string
): Promise<ChecklistItem[]> => {
  const ref = collection(db, "checklist", uid, character);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as ChecklistItem[];
};

/**
 * 체크리스트 항목 추가
 */
export const addChecklistItem = async (
  uid: string,
  character: string,
  item: Omit<ChecklistItem, "id">
): Promise<ChecklistItem> => {
  const ref = collection(db, "checklist", uid, character);
  const docRef = await addDoc(ref, item);
  return { ...item, id: docRef.id };
};

/**
 * 체크리스트 항목 수정
 */
export const updateChecklistItem = async (
  uid: string,
  character: string,
  id: string,
  data: Partial<ChecklistItem>
) => {
  const ref = doc(db, "checklist", uid, character, id);
  await updateDoc(ref, data);
};

/**
 * 체크리스트 항목 삭제
 */
export const deleteChecklistItem = async (
  uid: string,
  character: string,
  id: string
) => {
  const ref = doc(db, "checklist", uid, character, id);
  await deleteDoc(ref);
};

export const copyChecklistToCharacter = async (
  uid: string,
  character: string
): Promise<void> => {
  const defaultChecklist = await getTemplateChecklist();
  const targetRef = getChecklistCollectionRef(uid, character);

  await Promise.all(
    defaultChecklist.map((item) =>
      addDoc(targetRef, {
        title: item.title,
        description: item.description || "",
        totalCount: item.totalCount,
        checkedCount: 0,
        isDone: false,
        type: item.type,
      })
    )
  );
};

export const deleteCharacterChecklist = async (uid: string, character: string) => {
  const charRef = collection(db, "checklist", uid, character);
  const snapshot = await getDocs(charRef);

  const deletions = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
  await Promise.all(deletions);
};

export const characterChecklistExists = async (uid: string, character: string): Promise<boolean> => {
  const ref = collection(db, "checklist", uid, character);
  const snapshot = await getDocs(ref);
  return !snapshot.empty;
};