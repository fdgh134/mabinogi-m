import { getFirestore } from 'firebase-admin/firestore';
import { sendNotification } from './sendNotification';

const db = getFirestore();

export const sendScheduledNotifications = async () => {
  const snapshot = await db.collection("alertSettings").get();
  console.log("🔍 유저 수:", snapshot.size);

  for (const doc of snapshot.docs) {
    const { alertEnabled, fcmToken } = doc.data();
    if (alertEnabled && fcmToken) {
      try {
        console.log(`📨 전송 중: ${doc.id}`);
        await sendNotification(fcmToken);
      } catch (error) {
        console.error(`❌ 전송 실패: ${doc.id}`, error);
      }
    }
  }
};