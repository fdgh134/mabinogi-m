import { useState } from "react";
import { useCharacterStore } from "../../stores/useCharacterStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { 
  copyChecklistToCharacter, 
  deleteCharacterChecklist, 
  characterChecklistExists,
} from "../../firebase/checklistService";

export default function CharacterPresetSelector() {
  const { 
    characters, 
    selected, 
    setSelectedCharacter, 
    addCharacter, 
    removeCharacter, 
  } = useCharacterStore();
  const { user } = useAuthStore();
  const [newCharacter, setNewCharacter] = useState("");

  const handleAddCharacter = async () => {
  const trimmed = newCharacter.trim();
  if (!trimmed || !user) return;

  const alreadyInLocal = characters.includes(trimmed);
  const alreadyInFirebase = await characterChecklistExists(user.uid, trimmed);

  if (alreadyInLocal || alreadyInFirebase) {
    alert(`이미 '${trimmed}' 캐릭터가 존재합니다.`);
    return;
  }

  addCharacter(trimmed);
  await copyChecklistToCharacter(user.uid, trimmed);

  setSelectedCharacter(null);
  setTimeout(() => {
    setSelectedCharacter(trimmed);
  }, 0);
  setNewCharacter("");
};

  const handleDeleteCharacter = async (name: string) => {
    if (!user) return;

    const confirmDelete = window.confirm(`'${name}' 캐릭터 프리셋과 저장된 체크리스트를 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    await deleteCharacterChecklist(user.uid, name);
    removeCharacter(name);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        {characters.map((name) => (
          <div key={name} className={`flex items-center px-3 rounded border gap-1 ${
                  selected === name
                    ? "border-2 border-blue-400 text-gray-700 dark:text-gray-200 font-bold"
                    : "border-gray-400 dark:border-gray-700 dark:text-white"
                }`}>
            <button 
              key={name}
              onClick={() => setSelectedCharacter(name)}
              className="py-1 rounded"
              >
              {name}
            </button>
            <button
                onClick={() => handleDeleteCharacter(name)}
                className="text-red-500 hover:text-red-700"
                title={`${name} 삭제`}
              >
                ❌
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-2">
        <input
          type="text"
          placeholder="새 캐릭터 이름"
          value={newCharacter}
          onChange={(e) => setNewCharacter(e.target.value)}
          className="px-3 py-1 border flex-1 rounded w-fit dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleAddCharacter}
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          추가
        </button>
      </div>
    </div>
  );
};
