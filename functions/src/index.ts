import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore();

const sendNotification = async (fcmToken: string) => {
  const payload = {
    notification: {
      title: "🌀 소환의 결계",
      body: "3분 전입니다!",
    },
    token: fcmToken,
  };

  try {
    await admin.messaging().send(payload);
    console.log("✅ 전송 성공:", fcmToken);
  } catch (error) {
    console.error("❌ 전송 실패:", error);
    throw error;
  }
};

export const scheduledPushNotification = functions.pubsub
  .schedule("57 * * * *")
  .timeZone("Asia/Seoul")
  .onRun(async () => {
    console.log("🚀 예약 푸시 전송 시작");
    const snapshot = await db.collection("alertSettings").get();

    for (const doc of snapshot.docs) {
      const { alertEnabled, fcmToken } = doc.data();

      if (alertEnabled && fcmToken) {
        try {
          await sendNotification(fcmToken);
          await db.collection("alertLogs").add({
            uid: doc.id,
            status: "success",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        } catch (error) {
          const err = error as { message: string };
          await db.collection("alertLogs").add({
            uid: doc.id,
            status: "fail",
            error: err.message,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });

          // 실패한 토큰 삭제
          await db.collection("alertSettings").doc(doc.id).update({
            fcmToken: admin.firestore.FieldValue.delete(),
          });
        }
      }
    }

    console.log("✅ 예약 푸시 전송 완료");
    return null;
  });
