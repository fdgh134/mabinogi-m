import { useState } from "react";
import { motion } from "framer-motion";

interface CheckCardProps {
  id: string;
  title: string;
  description?: string;
  totalCount: number;
  checkedCount: number;
  type: "daily" | "weekly" | "repeat" | "trade";
  onToggle: (index: number) => void;
  onDelete?: () => void;
}

export default function CheckCard({ 
  title, 
  description, 
  totalCount, 
  checkedCount, 
  onToggle,
  onDelete,
}: CheckCardProps) {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const isDone = checkedCount >= totalCount;

  const handleDeleteClick = () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed && onDelete) {
      onDelete();
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(43, 175, 126, 0.4)" }}
      className={`rounded-2xl p-4 shadow transition bg-white dark:bg-gray-800
      ${isDone ? "opacity-60" : ""}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3
            className={`text-lg font-semibold ${
              isDone ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
            }`}
          >
            {title}
            {isDone && <span className="ml-2 text-sm text-green-600 dark:text-green-400">✅ 완료</span>}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{description}</p>
          )}
        </div>

        {/* 체크박스 리스트 */}
        <div className="flex gap-[2px] mt-1">
          {[...Array(totalCount)].map((_, i) => (
            <motion.input
              aria-label={`체크박스 ${i + 1}`}
              key={i}
              type="checkbox"
              checked={i < checkedCount}
              onChange={() => {
                setClickedIndex(i);
                onToggle(i);
                setTimeout(() => setClickedIndex(null), 250);
              }}
              className="w-5 h-5 accent-blue-500"
              animate={clickedIndex === i ? { scale: [1, 1.2, 0.95, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* 진행도 표시 */}
      <p className="text-xs text-right text-gray-400 dark:text-gray-500">
        {checkedCount} / {totalCount}
      </p>

      {/* 삭제 버튼 */}
      {onDelete && (
        <div className="mt-2 text-left">
          <button
            onClick={handleDeleteClick}
            className="text-md"
          >
            🗑
          </button>
        </div>
      )}
    </motion.div>
  );
}