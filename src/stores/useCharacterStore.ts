import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface CharacterStore {
  characters: string[];
  selected: string | null;
  addCharacter: (name: string) => void;
  setSelectedCharacter: (name: string | null) => void;
  removeCharacter: (name: string) => void;
  loadCharactersFromFirebase: (uid: string) => Promise<void>;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      characters: [],
      selected: null,

      setSelectedCharacter: (name) =>
        set(() => ({
          selected: name,
        })),

      addCharacter: (name) =>
        set((state) => ({
          characters: state.characters.includes(name)
            ? state.characters
            : [...state.characters, name],
          selected: state.selected ?? name,
        })),

      removeCharacter: (name) =>
        set((state) => {
          const updated = state.characters.filter((c) => c !== name);
          const isSelected = state.selected === name;
          return {
            characters: updated,
            selected: isSelected ? null : state.selected,
          };
        }),

      loadCharactersFromFirebase: async (uid: string) => {
        const docRef = doc(db, "checklist", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const names = Object.keys(data).filter((key) => key !== "_template");
          set({ characters: names});
        }
      },
    }),
    {
      name: "character-preset-storage",
    }
  )
);