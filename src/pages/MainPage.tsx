import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/darkmode/DarkModeToggle";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthStore } from "../hooks/useAuthStore";

function MainPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // const handleLogin = () => {
  //   const loginUrl = `${window.location.origin}/auth-redirect`;
  //   window.location.href = loginUrl;
  // };

  const isInAppBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    return /kakaotalk|instagram|naver|line|facebook/.test(ua);
  };


  const handleLogin = () => {
    if (isInAppBrowser()) {
      // ✅ 인앱 브라우저에서는 redirect 방식
      sessionStorage.setItem("triedLogin", "true");
      window.location.href = `${window.location.origin}/auth-redirect`;
    } else {
      // ✅ 일반 브라우저에서는 popup 방식
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("✅ 로그인 성공:", result.user);
          setUser(result.user);
          navigate("/content");
        })
        .catch((error) => {
          console.error("❌ 팝업 로그인 실패:", error);
        });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-#F6F4F4 text-black dark:bg-gray-900 dark:text-white px-4">
      {/* 다크모드 토글 - 우측 상단 */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">모비노기✔️</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          마비노기 모바일 유저를 위한 개인 도우미 도구
        </p>
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg shadow"
        >
          Google 계정으로 로그인
        </button>
      </div>
    </div>
  );
}

export default MainPage;
