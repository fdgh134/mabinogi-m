import { useAuthStore } from "../../hooks/useAuthStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { signOut, updateProfile } from "firebase/auth";
import DarkModeToggle from "../darkmode/DarkModeToggle";
import CharacterPresetSelector from "./CharacterPresetSelector ";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.displayName ?? "");

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

  const handleNameSave = async () => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: nickname });
    setUser(auth.currentUser);
    setEditing(false);
  }

  return (
    <div className="flex flex-row align-middle justify-between p-10 bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col gap-2">
        {editing ? (
          <div className="flex gap-2 items-center">
            <input
              aria-label="닉네임 입력"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border px-2 py-1 rounded darg:bg-slate-800"
            />
            <button onClick={handleNameSave} className="text-sm text-blue-500 hover:underline">
              저장
            </button>
            <button onClick={() => setEditing(false)} className="text-sm text-gray-400 hover:underline">
              취소
            </button>
          </div>
        ) : (
          <h1 className="text-2xl">
            환영합니다, {user?.displayName}님!
             <button onClick={() => setEditing(true)} className="ml-2 text-sm text-gray-400 hover:underline">
              ✏️
            </button>
          </h1>
        )}
        
      </div>
      <div>
        <div>
          <DarkModeToggle />
          <button
            onClick={handleLogout}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded"
          >
            로그아웃
          </button>
        </div>
        <div className="mt-2">
          <CharacterPresetSelector />
        </div>
      </div>
    </div>
  )
}