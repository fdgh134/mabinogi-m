import { google } from "googleapis";
import fetch from "node-fetch";
import serviceAccount from "./mabinogi-m-1881b-firebase-adminsdk-fbsvc-fcfd773430.json";

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

const getAccessToken = async () => {
  const jwtClient = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: SCOPES,
  });

  const tokens = await jwtClient.authorize();
  return tokens.access_token;
};

export const sendNotification = async (fcmToken: string) => {
  const accessToken = await getAccessToken();
  const projectId = serviceAccount.project_id;

  const message = {
    message: {
      token: fcmToken,
      notification: {
        title: "🌀 불길한 소환의 결계",
        body: "3분 전입니다!",
      },
    },
  };

  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const data = await res.json();
  console.log("📬 FCM 전송 결과:", data);
};
