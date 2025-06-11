import { useState } from "react";
import CheckCard from "./CheckCard";

interface DailyCheckProps {
  id: number;
  title: string;
  description?: string;
  isDone: boolean;
  totalCount: number;
  checkedCount: number; 
  type: "daily" | "weekly" | "repeat";
}

export default function DailyCheck() {
  const [repeatCycle, setRepeatCycle] = useState(1);
  const [checked, setChecked] = useState<DailyCheckProps[]>([
    { id: 1, title: "🌀불길한 소환의 결계", description: "불길한 소환의 결계 2회 완료", totalCount: 2, checkedCount: 0, isDone: false, type: "daily", },
    { id: 2, title: "🌀검은 구멍", description: "검은 구멍 3회 완료", totalCount: 3, checkedCount: 0, isDone: false, type: "daily" },
    { id: 3, title: "🎟️글라스기브넨 레이드", description: "글라스기브넨 레이드 1회 완료", totalCount: 1, checkedCount: 0, isDone: false, type: "weekly" },
    { id: 4, title: "🎟️어비스 던전", description: "어비스 던전 3회 완료", totalCount: 3, checkedCount: 0, isDone: false, type: "weekly" },
    { id: 5, title: "💎요일 던전", description: "요일 던전 1회 완료", totalCount: 1, checkedCount: 0, isDone: false, type: "daily" },
    { id: 6, title: "🌀심층 던전 클리어", description: "심층 던전 3회 클리어", totalCount: 3, checkedCount: 0, isDone: false, type: "repeat" },
    { id: 7, title: "🪓던전 클리어", description: "던전 5회 클리어", totalCount: 5, checkedCount: 0, isDone: false, type: "repeat" },
    { id: 8, title: "🏹사냥터 클리어", description: "사냥터 5회 클리어", totalCount: 5, checkedCount: 0, isDone: false, type: "repeat" },
  ]);

  const dailyList = checked.filter(item => item.type === "daily");
  const weeklyList = checked.filter(item => item.type === "weekly");
  const repeatList = checked.filter(item => item.type === "repeat");

  const toggleCheck = (id: number, index: number) => {
    let updated: DailyCheckProps[] = [];

    // 먼저 체크 상태 계산
    updated = checked.map((item) => {
      if (item.id !== id) return item;
      const newCount = index < item.checkedCount
        ? item.checkedCount - 1
        : item.checkedCount + 1;
      return {
        ...item,
        checkedCount: Math.max(0, Math.min(item.totalCount, newCount)),
      };
    });

    // 체크 후 repeat 항목만 추출
    const repeatItems = updated.filter((item) => item.type === "repeat");
    const allRepeatDone = repeatItems.every((item) => item.checkedCount >= item.totalCount);

    // 모든 repeat 완료 시 초기화 및 회차 증가
    if (allRepeatDone) {
      updated = updated.map((item) =>
        item.type === "repeat"
          ? { ...item, checkedCount: 0 }
          : item
      );
      setRepeatCycle((prev) => prev + 1);
    }

    setChecked(updated);
  };

  const resetSection = (type: "daily" | "weekly" | "repeat") => {
    setChecked((prev) =>
      prev.map((item) =>
        item.type === type ? { ...item, checkedCount: 0 } : item
      )
    );

    if (type === "repeat") {
      setRepeatCycle(1);
    }
  };

  return (
    <div className="space-y-8">
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold mb-2">
          🪢 반복 <span className="text-sm text-gray-500">({repeatCycle}회차)</span>
        </h3>
        <button
          onClick={() => resetSection("repeat")}
          className="cursor-pointer"
        >
          🔃
        </button>
      </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {repeatList.map(item => (
        <CheckCard
          key={item.id}
          {...item}
          onToggle={(index) => toggleCheck(item.id, index)}
        />
      ))}
    </div>
    </section>

    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold mb-2">📅 일간</h3>
        <button
            onClick={() => resetSection("daily")}
            className="cursor-pointer"
          >
          🔃
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dailyList.map(item => (
          <CheckCard
            key={item.id}
            {...item}
            onToggle={(index) => toggleCheck(item.id, index)}
          />
        ))}
      </div>
    </section>

    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold mb-2">🗓 주간</h3>
        <button
            onClick={() => resetSection("weekly")}
            className="cursor-pointer"
          >
          🔃
        </button>
      </div>      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {weeklyList.map(item => (
          <CheckCard
            key={item.id}
            {...item}
            onToggle={(index) => toggleCheck(item.id, index)}
          />
        ))}
      </div>
    </section>
  </div>
  )
}