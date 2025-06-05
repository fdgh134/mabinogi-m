import { useAuthStore } from "../hooks/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import DarkModeToggle from "../components/darkmode/DarkModeToggle";

function ContentPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
  };

  return (
    <div className="p-10 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <h2 className="text-2xl font-bold">콘텐츠 페이지</h2>
      <p>환영합니다, {user?.displayName}님!</p>
      <button
        onClick={handleLogout}
        className="bg-red-300 hover:bg-red-500 text-white px-4 py-2 rounded"
      >
        로그아웃
      </button>
      <div className="mt-4">
        <DarkModeToggle />
      </div>
    </div>
    
  );
}

export default ContentPage;