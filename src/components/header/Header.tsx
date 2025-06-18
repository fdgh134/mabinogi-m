import { useAuthStore } from "../../hooks/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import DarkModeToggle from "../darkmode/DarkModeToggle";
import CharacterPresetSelector from "./CharacterPresetSelector ";

export default function Header() {
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
    <div>
      <div className="flex flex-row align-middle justify-between p-4 lg:p-10 bg-white text-black dark:bg-gray-900 dark:text-white">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl lg:text-2xl">
            환영합니다, {user?.displayName}님!
          </h1>
        </div>
        <div>
          <div>
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              className="bg-red-400 hover:bg-red-500 text-white px-2 lg:px-4 py-2 rounded"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-10 mb-6">
        <CharacterPresetSelector />
      </div>
    </div>
    
  )
}