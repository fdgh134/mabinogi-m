import { useState, useEffect } from "react";
import CheckCard from "./CheckCard";
import { getChecklist, updateChecklistItem } from "../../firebase/checklistService";
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

  useEffect(() => {
    const fetchData = async () => {
      const items = await getChecklist();
      const final = items.map(item => ({
        ...item,
        id: item.id ?? "",
        isDone: item.isDone ?? false,
      }));
      setChecked(final);
    };
    fetchData();
  }, []);

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
      };
    });

    setChecked(updated);

    const changed = updated.find(item => item.id === id);
    if (changed) {
      await updateChecklistItem(id, { checkedCount: changed.checkedCount });
    }

    // 체크 후 repeat 항목만 추출
    const repeatItems = updated.filter((item) => item.type === "repeat");
    const allRepeatDone = repeatItems.every((item) => item.checkedCount >= item.totalCount);

    // 모든 repeat 완료 시 초기화 및 회차 증가
    if (allRepeatDone) {
      const resetRepeat = updated.map((item) =>
        item.type === "repeat"
          ? { ...item, checkedCount: 0 }
          : item
      );
      setChecked(resetRepeat);
      setRepeatCycle((prev) => prev + 1);

      await Promise.all(
        repeatItems.map(item => updateChecklistItem(item.id, { checkedCount: 0 }))
      );
    }
  };

  const resetSection = async (type: "daily" | "weekly" | "repeat" | "trade") => {
    const updated = checked.map(item =>
      item.type === type ? { ...item, checkedCount: 0 } : item
    );
    setChecked(updated);

    const affected = checked.filter(item => item.type === type);
    await Promise.all(
      affected.map(item =>
        updateChecklistItem(item.id, { checkedCount: 0 })
      )
    );

    if (type === "repeat") setRepeatCycle(1);
  };

  const sections: {
    title: string;
    list: DailyCheckProps[];
    type: "daily" | "weekly" | "repeat" | "trade";
    extra?: string;
  }[] = [
    { title: "🪢 반복 퀘스트", list: checked.filter(i => i.type === "repeat"), type: "repeat", extra: `(${repeatCycle}회차)` },
    { title: "📅 일간 숙제", list: checked.filter(i => i.type === "daily"), type: "daily" },
    { title: "🗓 주간 숙제", list: checked.filter(i => i.type === "weekly"), type: "weekly" },
    { title: "💱 물물 교환", list: checked.filter(i => i.type === "trade"), type: "trade" },
  ];

  return (
    <div className="space-y-8">
      {sections.map(({ title, list, type, extra }) => (
        <section key={type}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold mb-2">
              {title} {extra && <span className="text-sm text-gray-500">{extra}</span>}
            </h3>
            <button onClick={() => resetSection(type)} className="cursor-pointer">🔃</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {list.map(item => (
              <CheckCard
                key={item.id}
                {...item}
                onToggle={index => toggleCheck(item.id, index)}
              />
            ))}
          </div>
        </section>
      ))}
  </div>
  )
}