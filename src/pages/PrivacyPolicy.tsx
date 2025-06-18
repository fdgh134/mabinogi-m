import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-[#F6F4F4] p-4 lg:p-10">
      <h1 className="text-xl lg:text-2xl font-bold mb-4">개인정보 처리방침</h1>

      <p className="mb-4">모비노기✔️는 사용자 여러분의 개인정보를 소중하게 생각하며, 아래와 같이 개인정보를 수집, 이용, 보관 및 보호합니다.</p>

      <section className="mb-4 lg:mb-6">
        <h2 className="text-lg font-semibold mb-2">1. 개인정보 수집 항목 및 방법</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>수집 항목: Google 계정 이름, 이메일 주소, 고유 사용자 ID (UID)</li>
          <li>수집 방법: Firebase Authentication을 통한 Google 로그인</li>
        </ul>
      </section>

      <section className="mb-4 lg:mb-6">
        <h2 className="text-lg font-semibold mb-2">2. 개인정보 수집 및 이용 목적</h2>
        <p>수집된 개인정보는 다음 목적에 한하여 이용됩니다:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>사용자 인증 및 로그인 유지</li>
          <li>사용자별 체크리스트 데이터 저장 및 불러오기</li>
          <li>중복 방지를 위한 고유 식별</li>
        </ul>
      </section>

      <section className="mb-4 lg:mb-6">
        <h2 className="text-lg font-semibold mb-2">3. 개인정보 보유 및 이용 기간</h2>
        <p>사용자가 서비스를 이용하는 동안 보유하며, 탈퇴 요청 또는 서비스 종료 시 지체 없이 파기합니다.</p>
      </section>

      <section className="mb-4 lg:mb-6">
        <h2 className="text-lg font-semibold mb-2">4. 개인정보 제공 및 위탁</h2>
        <p>본 서비스는 사용자의 개인정보를 외부에 제공하거나 위탁하지 않습니다.</p>
      </section>

      <section className="mb-4 lg:mb-6">
        <h2 className="text-lg font-semibold mb-2">5. 이용자의 권리와 그 행사 방법</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>이용자는 언제든지 본인의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.</li>
          <li>삭제 요청은 메일 문의를 통해 가능합니다.</li>
        </ul>
      </section>

      <section className="mb-4 lg:mb-6">
        <h2 className="text-lg font-semibold mb-2">6. 개인정보 보호를 위한 노력</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Firebase 및 관련 보안 도구를 통해 사용자 정보는 안전하게 저장됩니다.</li>
          <li>사용자 UID는 비공개로 유지되며, 민감 정보는 별도로 저장하지 않습니다.</li>
        </ul>
      </section>

      <section className="mb-4 lg:mb-6">
        <h2 className="text-lg font-semibold mb-2">7. 문의처</h2>
        <p>서비스 운영자 이메일: <strong>fdgh134@naver.com</strong></p>
      </section>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        본 방침은 2025년 6월 기준으로 적용됩니다. 
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Google 로그인을 통해 서비스를 이용하시는 경우, 위 정책에 동의하신 것으로 간주됩니다.
      </p>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 border rounded text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
      >
        ← 뒤로 가기
      </button>
    </div>
  )
}