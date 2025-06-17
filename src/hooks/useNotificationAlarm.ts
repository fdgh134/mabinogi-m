import { useEffect } from "react";
import { requestNotificationPermission } from "../lib/requestNotificationPermission";

export const useNotificationAlarm = (alertEnabled: boolean) => {
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    let lastNotifiedMinute = -1;

    const runAlarmLoop = async () => {
      try {
        const granted = await requestNotificationPermission();
        if (!granted) {
          console.warn("❌ 알림 권한 거부됨");
          alert("알림 권한이 비활성화되어 있어 알림을 받을 수 없습니다.");
          return;
        }

        if (!alertEnabled) {
          console.log("🔕 알림 설정 꺼져 있음");
          return;
        }

        timer = setInterval(() => {
          const now = new Date();
          const minute = now.getMinutes();

          if (minute === 57 && now.getSeconds() === 0 && minute !== lastNotifiedMinute) {
            lastNotifiedMinute = minute;
            new Notification("🌀 불길한 소환의 결계", {
              body: "곧 시작됩니다! (3분 전)",
            });
            // console.log("🔔 소환의 결계 알림 전송됨");
          }
        }, 1000);
      } catch (err) {
        console.error("🚨 알림 루프 실행 중 오류:", err);
      }
    };

    runAlarmLoop();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [alertEnabled]);
};