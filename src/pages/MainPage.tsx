import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useAuthStore } from "../hooks/useAuthStore";
import DarkModeToggle from "../components/darkmode/DarkModeToggle";

function MainPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/content");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="text-center p-10 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold">메인 소개 페이지</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        구글 로그인
      </button>
      <div className="mt-4">
        <DarkModeToggle />
      </div>
    </div>
  );
}

export default MainPage;
