import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useAuthStore } from "./hooks/useAuthStore";
import MainPage from "./pages/MainPage";
import ContentPage from "./pages/ContentPage";
import AuthRedirectPage from "./pages/AuthRedirectPage";
import { requestNotificationPermission } from "./lib/requestNotificationPermission";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthReady = useAuthStore((state) => state.setAuthReady);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [setUser, setAuthReady]);

  useEffect(() => {
  requestNotificationPermission().then((token) => {
    if (token) {
      // console.log("FCM 토큰:", token);
    }
  });
}, []);

  if (!isAuthReady) {
    return <div className="text-center p-10">⏳ 로그인 상태 확인 중...</div>;
  }

  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth-redirect" element={<AuthRedirectPage />} /> 
        <Route path="/content" element={<ContentPage />} />
      </Routes>
  )
}

export default App
