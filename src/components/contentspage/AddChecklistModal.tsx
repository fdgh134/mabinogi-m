import { useState } from "react";

interface AddChecklistModalProps {
  type: "daily" | "trade";
  onAdd: (item: {
    title: string;
    description?: string;
    totalCount: number;
    checkedCount: number;
    isDone: boolean;
    type: "daily" | "trade";
  }) => void;
  onClose: () => void;
}

export default function AddChecklistModal({ type, onAdd, onClose }: AddChecklistModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalCount, setTotalCount] = useState(1);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title,
      description,
      totalCount,
      checkedCount: 0,
      isDone: false,
      type,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">퀘스트 추가 ({type === "daily" ? "일간" : "물물교환"})</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="제목 (예: 🧪 회복복 포션 제작)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:bg-slate-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="설명 (선택)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:bg-slate-700 dark:text-white"
          />
          <input
            aria-label="총 횟수"
            type="number"
            min={1}
            value={totalCount}
            onChange={(e) => setTotalCount(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-300 dark:bg-slate-700 dark:text-white"
          />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-slate-600 dark:text-white">
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
