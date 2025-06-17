import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase";

const vapidKey = "BN3FOzZ1gNPZ3Qe0tInR84gxSvJfP6sBwETtHv6D6URXS-NFQTWpKXpVrOM73j4lqOkVb_GG8_-mSljPcgvtkuU";
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("알림 권한이 거부되었습니다.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: vapidKey,
    });

    if (token) {
      console.log("✅ 발급된 FCM 토큰:", token);
      return token;
    } else {
      console.warn("토큰 발급 실패");
      return null;
    }
  } catch (err) {
    console.error("토큰 요청 중 오류 발생:", err);
    return null;
  }
};
