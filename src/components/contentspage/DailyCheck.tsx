import { useState, useEffect, useCallback } from "react";
import CheckCard from "./CheckCard";
import AddChecklistModal from "./AddChecklistModal";
import { 
  getChecklist,
  updateChecklistItem,
  addChecklistItem,
  deleteChecklistItem,
  deleteCharacterChecklist,
  copyChecklistToCharacter,
} from "../../firebase/checklistService";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useCharacterStore } from "../../stores/useCharacterStore";
import { AnimatePresence, motion } from "framer-motion";

interface DailyCheckProps {
  id: string;
  title: string;
  description?: string;
  isDone?: boolean;
  totalCount: number;
  checkedCount: number; 
  type: "daily" | "weekly" | "repeat" | "trade";
}

export default function DailyCheck() {
  const [repeatCycle, setRepeatCycle] = useState(1);
  const [checked, setChecked] = useState<DailyCheckProps[]>([]);
  const [modalType, setModalType] = useState<"daily" | "trade" | "weekly" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuthStore(state => state.user);
  const characters = useCharacterStore(state => state.characters);
  const character = useCharacterStore(state => state.selected);

  useEffect(() => {
    if (!user || !character) return;

    const syncChecklist = async () => {
      setIsLoading(true);
      const items = await getChecklist(user.uid, character);
      const final = items.map(item => ({
        ...item,
        id: item.id ?? "",
        isDone: item.isDone ?? false,
    })) as DailyCheckProps[];
    setChecked(final);
    setIsLoading(false);
  };

  syncChecklist();
}, [user, character]);

const handleResetToTemplate = async () => {
  if (!user || !character) return;

  const confirmReset = window.confirm("현재 체크리스트를 최신 템플릿으로 초기화하시겠습니까?");
  if (!confirmReset) return;

  await deleteCharacterChecklist(user.uid, character);
  await copyChecklistToCharacter(user.uid, character);
  const items = await getChecklist(user.uid, character);
    const converted = items.map(item => ({
      ...item,
      id: item.id ?? "",
      isDone: item.isDone ?? false,
    })) as DailyCheckProps[];
    setChecked(converted);
  };

const resetSection = useCallback(async (type: "daily" | "weekly" | "repeat" | "trade") => {
    if (!user || !character) return;

    const updated = checked.map(item =>
      item.type === type 
        ? { ...item, checkedCount: 0 } 
        : item
    );
    setChecked(updated);

    const affected = checked.filter(item => item.type === type);
    await Promise.all(
      affected.map((item) =>
        updateChecklistItem(user.uid, character, item.id, {
          checkedCount: 0,
          isDone: false,
        })
      )
    );

    if (type === "repeat") setRepeatCycle(1);
  }, [user, character, checked]);

useEffect(() => {
  const now = new Date();
  const lastReset = localStorage.getItem("lastReset") || "";
  const today = now.toISOString().split("T")[0];
  const isMonday = now.getDate() === 1;

  const resetDaily = async () => await resetSection("daily");
  const resetTrade = async () => await resetSection("trade");
  const resetWeekly = async () => await resetSection("weekly");
  const resetRepeat = async () => await resetSection("repeat");

  if (user && character) {
    if (now.getHours() >= 6 && !lastReset.includes(today)) {
      resetDaily();
      resetTrade();
      localStorage.setItem("lastReset", `${today}-daily`);
    }

    if (isMonday && now.getHours() < 6 && !lastReset.includes(`${today}-weekly`)) {
      resetWeekly();
      resetRepeat();
      localStorage.setItem("lastReset", `${today}-weekly`);
    }
  }
}, [user, character, resetSection]);

  const toggleCheck = async (id: string, index: number) => {
    // 먼저 체크 상태 계산
    const updated = checked.map((item) => {
      if (item.id !== id) return item;

      const newCount = index < item.checkedCount
        ? item.checkedCount - 1
        : item.checkedCount + 1;

      return {
        ...item,
        checkedCount: Math.max(0, Math.min(item.totalCount, newCount)),
        isDone: newCount >= item.totalCount,
      };
    });

    setChecked(updated);

    const changed = updated.find(item => item.id === id);
    if (changed && user && character) {
      await updateChecklistItem(user.uid, character, id, {
        checkedCount: changed.checkedCount,
        isDone: changed.isDone,
      });
    }

    // 체크 후 repeat 항목만 추출
    const repeatItems = updated.filter((item) => item.type === "repeat");
    const allRepeatDone = repeatItems.every((item) => item.checkedCount >= item.totalCount);

    // 모든 repeat 완료 시 초기화 및 회차 증가
    if (allRepeatDone) {
      const resetRepeat = updated.map((item) =>
        item.type === "repeat"
          ? { ...item, checkedCount: 0, isDone: false }
          : item
      );
      setChecked(resetRepeat);
      setRepeatCycle((prev) => prev + 1);

      await Promise.all(
        repeatItems.map((item) =>
          updateChecklistItem(user!.uid, character!, item.id, {
            checkedCount: 0,
            isDone: false,
          })
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !character) return;
    await deleteChecklistItem(user.uid, character, id);
    setChecked(prev => prev.filter(item => item.id !== id));
  };

  const handleAdd = async (item: Omit<DailyCheckProps, "id">) => {
    if (!user || !character) return;
    const newItem = await addChecklistItem(user.uid, character, item);
    const converted: DailyCheckProps = {
    ...newItem,
    id: newItem.id ?? "", // string 보장
    isDone: newItem.isDone ?? false,
  };
    setChecked(prev => [...prev, converted]);
    setModalType(null); // 닫기
  };

  const sortChecklist = (list: DailyCheckProps[]) => {
    return list.slice().sort((a, b) => a.title.localeCompare(b.title, "ko"));
  };

  const sections: {
    title: string;
    list: DailyCheckProps[];
    type: "daily" | "weekly" | "repeat" | "trade";
    extra?: string;
    showAdd?: boolean;
  }[] = [
    { title: "🪢 반복 퀘스트", list: sortChecklist(checked.filter(i => i.type === "repeat")), type: "repeat", extra: `(${repeatCycle}회차)` },
    { title: "📅 일간 숙제", list: sortChecklist(checked.filter(i => i.type === "daily")), type: "daily", showAdd: true },
    { title: "🗓 주간 숙제", list: sortChecklist(checked.filter(i => i.type === "weekly")), type: "weekly", showAdd: true },
    { title: "💱 물물 교환", list: sortChecklist(checked.filter(i => i.type === "trade")), type: "trade", showAdd: true },
  ];

  if (!characters || characters.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 h-max">
        상단에 캐릭터를 추가 후 사용해 주세요.
      </div>
    );
  }

  if (!character) {
  return (
    <div className="text-center text-gray-500 mt-10 h-max">
      사용할 캐릭터를 선택해 주세요.
    </div>
  );
}

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        체크리스트를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button onClick={() => handleResetToTemplate()} className="border rounded-xl bg-[#5C5C5C] dark:bg-white px-2 py-1 text-white border-gray-400 dark:border-gray-700 dark:text-white">
        템플릿 초기화
      </button>
      {sections.map(({ title, list, type, extra, showAdd }) => (
        <section key={type}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold mb-2">
              {title} {extra && <span className="text-sm text-gray-500">{extra}</span>}
            </h3>
            <div className="flex gap-2">
              {showAdd && (type === "daily" || type === "trade" || type === "weekly") && (
                <button onClick={() => setModalType(type)} className="cursor-pointer text-xl">➕</button>
              )}
              <button onClick={() => resetSection(type)} className="cursor-pointer">🔃</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <AnimatePresence>
              {list.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <CheckCard
                    {...item}
                    onToggle={index => toggleCheck(item.id, index)}
                    onDelete={["daily", "trade"].includes(item.type) ? () => handleDelete(item.id) : undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      ))}

      {/* 모달 */}
      {modalType && (
        <AddChecklistModal
          type={modalType}
          onAdd={handleAdd}
          onClose={() => setModalType(null)}
        />
      )}
  </div>
  )
}