import cron from 'node-cron';
import { sendScheduledNotifications } from './sendScheduledNotifications';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

initializeApp({ credential: applicationDefault() });

cron.schedule("57 * * * *", async () => {
  console.log("🚀 푸시 예약 작업 실행 중...");
  await sendScheduledNotifications();
});

sendScheduledNotifications();
