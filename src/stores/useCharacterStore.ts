import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface CharacterStore {
  characters: string[];
  selected: string;
  setSelectedCharacter: (name: string) => void;
  addCharacter: (name: string) => void;
  deleteCharacter: (name: string) => void;
  syncWithFirebase: (uid: string) => Promise<void>;
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  characters: [],
  selected: "",
  setSelectedCharacter: (name: string) => set({ selected: name }),

  addCharacter: (name: string) =>
    set((state) => {
      const newCharacters = [...state.characters, name];
      return {
        characters: newCharacters,
        selected: name,
      };
    }),

  deleteCharacter: (name: string) =>
    set((state) => {
      const updated = state.characters.filter((n) => n !== name);
      const newSelected = state.selected === name ? "" : state.selected;
      return {
        characters: updated,
        selected: newSelected,
      };
    }),

  syncWithFirebase: async (uid: string) => {
    try {
      const docRef = doc(db, "checklist", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.warn("⚠️ Firebase 문서 없음. 빈 문서 생성 후 초기화");
        await setDoc(docRef, { characters: [] });
        set({ characters: [] });
        return;
      }

      const data = docSnap.data();
      const charList: string[] = data.characters ?? [];

      // console.log("✅ Firebase 캐릭터 목록 동기화 완료:", charList);
      set({ characters: charList });

      // 현재 선택된 캐릭터가 없고, 캐릭터가 있다면 자동 선택
      if (!get().selected && charList.length > 0) {
        set({ selected: charList[0] });
      }
    } catch (error) {
      console.error("❌ Firebase 동기화 중 오류 발생:", error);
    }
  },
}));