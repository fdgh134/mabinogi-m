export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-sm py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="text-center md:text-left">
          ⓒ {new Date().getFullYear()} Mabinogi-M Checklist by YoomJJu
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
            href="https://mabinogi.nexon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-500"
          >
            공식 사이트
          </a>
        </div>
      </div>
    </footer>
  );
}
