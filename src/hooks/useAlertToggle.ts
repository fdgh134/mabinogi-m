import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { requestNotificationPermission } from "../lib/requestNotificationPermission";

export const useAlertToggle = (uid: string) => {
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const docRef = doc(db, "alertSettings", uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAlertEnabled(data.alertEnabled ?? false);
        setFcmToken(data.fcmToken ?? "");
      }
    };
    fetch();
  }, [uid]);

  const saveAlertSetting = async (enabled: boolean, token: string) => {
    const docRef = doc(db, "alertSettings", uid);
    await setDoc(docRef, {
      alertEnabled: enabled,
      fcmToken: token,
    });
  };

  const toggleAlert = async () => {
    const next = !alertEnabled;
    let token: string | null = fcmToken;

    if (!token) {
      token = await requestNotificationPermission();
      if (!token) return;
      setFcmToken(token);
    }

    await saveAlertSetting(next, token);
    setAlertEnabled(next);
  };

  return { alertEnabled, toggleAlert };
};