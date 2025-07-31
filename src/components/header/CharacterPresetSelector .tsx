import { useEffect, useState } from "react";
import { useCharacterStore } from "../../stores/useCharacterStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { 
  copyChecklistToCharacter, 
  deleteCharacterChecklist, 
  characterChecklistExists,
  appendCharacterToUserDoc,
  removeCharacterFromUserDoc,
} from "../../firebase/checklistService";
import { motion } from "framer-motion"

export default function CharacterPresetSelector() {
  const { 
    characters, 
    selected, 
    setSelectedCharacter, 
    addCharacter, 
    deleteCharacter,
    syncWithFirebase,
  } = useCharacterStore();

  const { user } = useAuthStore();
  const [newCharacter, setNewCharacter] = useState("");

  // 로그인 직후 Firestore 동기화
  useEffect(() => {
    if (user?.uid) {
      // console.log("사용자 로그인 감지, Firebase 동기화 시작");
      syncWithFirebase(user.uid);
    }
  }, [user?.uid, syncWithFirebase]);

  // 탭 포커스 시 Firestore 동기화
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user?.uid) {
        // console.log("탭 포커스 감지, Firebase 동기화 시작");
        syncWithFirebase(user.uid);
      }
    };
    const handleFocus = () => {
      if (user?.uid) {
        // console.log("윈도우 포커스 감지, Firebase 동기화 시작");
        syncWithFirebase(user.uid);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.uid, syncWithFirebase]);

  useEffect(() => {
    if (!selected && characters.length > 0) {
      setSelectedCharacter(characters[0]);
    }
  }, [characters, selected, setSelectedCharacter]);

  // 캐릭터 추가: 최신 기준 중복 검사
  const handleAddCharacter = async () => {
    const trimmed = newCharacter.trim();
    if (!trimmed || !user) return;

    // 먼저 firebase에서 중복 검사
    await syncWithFirebase(user.uid);

    // 동기화 후 다시 중복 검사
    const currentCharacters = useCharacterStore.getState().characters;
    const alreadyExists = currentCharacters.includes(trimmed);
    
    if (alreadyExists) {
      alert(`이미 '${trimmed}' 캐릭터가 존재합니다.`);
      return;
    }

    // firebase에도 한번 더 확인
    const existInFirebase = await characterChecklistExists(user.uid, trimmed);
    if (existInFirebase) {
      alert(`이미 '${trimmed}' 캐릭터가 존재합니다.`);
      await syncWithFirebase(user.uid);
      return;
    }

    try {
      addCharacter(trimmed);
      await copyChecklistToCharacter(user.uid, trimmed);
      await appendCharacterToUserDoc(user.uid, trimmed);

      setSelectedCharacter("");
      setTimeout(() => {
        setSelectedCharacter(trimmed);
      }, 100);

      setNewCharacter("");

      setTimeout(() => {
        setSelectedCharacter(trimmed);
      }, 500);
    } catch (error) {
      console.error("캐릭터 추가 실패:", error);
      alert("캐릭터 추가 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteCharacter = async (name: string) => {
    if (!user) return;

    const confirmDelete = window.confirm(`'${name}' 캐릭터 프리셋과 저장된 체크리스트를 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    try {
      await deleteCharacterChecklist(user.uid, name);
      await removeCharacterFromUserDoc(user.uid, name);
      deleteCharacter(name);

      // 삭제 후 동기화
      await syncWithFirebase(user.uid);

    } catch (error) {
      console.error("캐릭터 삭제 실패:", error);
      alert("캐릭터 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {characters.map((name) => (
          <motion.div 
            key={name} 
            whileHover={{ scale: 1.07, boxShadow: "0 2px 14px rgba(43, 175, 126, 0.26)" }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-3 rounded-3xl border gap-1 ${
              selected === name
                ? "bg-[#5C5C5C] dark:bg-[#5C5C5C] dark:border-none text-white dark:text-gray-200 font-semibold"
                : "border-[#5C5C5C] dark:border-gray-700 dark:text-white"
            }`}
            style={{
              transition: "box-shadow 0.2s, background 0.2s, color 0.2s",
            }}
            onClick={() => setSelectedCharacter(name)}
          >
            <span className="py-1 rounded">{name}</span>
            <button
                onClick={() => handleDeleteCharacter(name)}
                className="text-red-500 hover:text-red-700"
                title={`${name} 삭제`}
              >
                ❌
            </button>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row gap-2">
        <input
          type="text"
          placeholder="새 캐릭터 이름"
          value={newCharacter}
          onChange={(e) => setNewCharacter(e.target.value)}
          className="px-3 py-1 border border-[#D9D9D9] bg-white flex-1 rounded-xl w-fit dark:border-gray-400 dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleAddCharacter}
          className="bg-[#2BAF7E] text-white px-4 py-1 rounded-xl"
        >
          추가
        </button>
      </div>
    </div>
  );
};
