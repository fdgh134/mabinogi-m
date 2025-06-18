import { useEffect, useState } from "react";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useAuthStore } from "../hooks/useAuthStore";
import { useNavigate } from "react-router-dom";

function AuthRedirectPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [status, setStatus] = useState<"loading" | "fail" | "error">("loading");

  useEffect(() => {
    const triedLogin = localStorage.getItem("triedLogin");

    const handleLoginResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        console.log("📦 getRedirectResult:", result);
        console.log("👤 result.user:", result?.user);
        console.log("⚙️ auth.currentUser:", auth.currentUser);

        const user = result?.user || auth.currentUser;

        if (user) {
          setUser(user);
          sessionStorage.removeItem("triedLogin");
          navigate("/content");
        } else {
          sessionStorage.removeItem("triedLogin");
          setStatus("fail");
        }
      } catch (error) {
        console.error("❌ 로그인 오류:", error);
        sessionStorage.removeItem("triedLogin");
        setStatus("error");
      }
    };

    if (triedLogin === "true") {
      handleLoginResult();
    } else {
      sessionStorage.setItem("triedLogin", "true");
      signInWithRedirect(auth, provider);
    }
  }, [navigate, setUser]);

  return (
    <div className="text-center mt-20 text-lg">
      {status === "loading" && "🔐 로그인 처리 중..."}
      {status === "fail" && (
        <div>
          ⚠️ 로그인에 실패했거나 취소되었습니다.
          <br />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              sessionStorage.setItem("triedLogin", "true");
              signInWithRedirect(auth, provider);
            }}
          >
            다시 로그인 시도
          </button>
        </div>
      )}
      {status === "error" && (
        <div>
          ❌ 로그인 중 오류가 발생했습니다.
        </div>
      )}
    </div>
  );
}

export default AuthRedirectPage;