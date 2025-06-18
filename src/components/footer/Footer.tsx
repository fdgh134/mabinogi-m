export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-sm py-4 lg:py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="text-center md:text-left">
          <p>ⓒ {new Date().getFullYear()} Mabinogi-M Checklist by YoomJJu</p>
          <a href="/privacy" className="hover:underline hover:text-blue-500">
            개인정보처리방침
          </a>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://github.com/fdgh134/mabinogi-m"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-500"
          >
            GitHub
          </a>
          <a
            href="https://mabinogimobile.nexon.com/Main"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-500"
          >
            공식 사이트
          </a>
          <a
            href="mailto:fdgh134@naver.com"
            className="hover:underline hover:text-blue-500"
          >
            메일 보내기
          </a>
        </div>
      </div>
    </footer>
  );
};