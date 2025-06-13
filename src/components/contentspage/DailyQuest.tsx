import { useState, useEffect } from "react";
import DailyCheck from "./DailyCheck";

export default function DailyQuest() {
  
  const [alertEnabled, setAlertEnabled] = useState(true);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!alertEnabled) return;
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getMinutes() === 57 && now.getSeconds() === 0) {
        new Notification("🌀 불길한 소환의 결계", {
          body: "곧 시작됩니다! (3분 전)",
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [alertEnabled]);

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <h1 className="mb-4">체크리스트</h1>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <span>불길한 소환의 결계 알림</span>
          <div className="relative inline-block w-10 h-6">
            <input
              type="checkbox"
              checked={alertEnabled}
              onChange={() => setAlertEnabled((prev) => !prev)}
              className="peer sr-only"
            />
            <div className="w-10 h-6 bg-gray-300 peer-checked:bg-blue-500 dark:bg-gray-600 dark:peer-checked:bg-blue-600 rounded-full transition-colors duration-200"></div>
            <div
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-200
                        peer-checked:translate-x-4"
            ></div>
          </div>
        </label>
      </div>
      <DailyCheck />
    </div>
    
  )
  
}
