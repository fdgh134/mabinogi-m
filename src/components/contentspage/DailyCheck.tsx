import { useState } from "react";
import CheckCard from "./CheckCard";

interface DailyCheckProps {
  id: number;
  title: string;
  description?: string;
  isDone: boolean;
  totalCount: number;
  checkedCount: number; 
  type: "daily" | "weekly";
}

export default function DailyCheck() {
  const [checked, setChecked] = useState<DailyCheckProps[]>([
    { id: 1, title: "불길한 소환의 결계", description: "불길한 소환의 결계 2회 완료", totalCount: 2, checkedCount: 0, isDone: false, type: "daily", },
    { id: 2, title: "검은 구멍", description: "검은 구멍 3회 완료", totalCount: 3, checkedCount: 0, isDone: false, type: "daily" },
  ]);

  const dailyList = checked.filter(item => item.type === "daily");
  const weeklyList = checked.filter(item => item.type === "weekly");

  const toggleCheck = (id: number, index: number) => {
    setChecked((prev) => 
      prev.map(item => {
        if (item.id !== id) return item;
        
        const newCount = index < item.checkedCount
          ? item.checkedCount - 1
          : item.checkedCount + 1;

        return { ...item, checkedCount: Math.max(0, Math.min(item.totalCount, newCount)) };
      })
    )
  };

  return (
    <div className="space-y-8">
  <section>
    <h3 className="text-xl font-bold mb-2">📅 일간</h3>
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
    <h3 className="text-xl font-bold mb-2">🗓 주간</h3>
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