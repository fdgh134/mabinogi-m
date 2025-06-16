import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CharacterStore {
  characters: string[];
  selected: string | null;
  addCharacter: (name: string) => void;
  setSelectedCharacter: (name: string) => void;
  removeCharacter: (name: string) => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      characters: [],
      selected: null,

      addCharacter: (name) =>
        set((state) => ({
          characters: state.characters.includes(name)
            ? state.characters
            : [...state.characters, name],
          selected: state.selected ?? name,
        })),

      setSelectedCharacter: (name) =>
        set(() => ({
          selected: name,
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
    }),
    {
      name: "character-preset-storage",
    }
  )
);