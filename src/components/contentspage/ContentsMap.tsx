interface Props {
  onSelect: (tab: "daily" | "materials") => void;
  selected: "daily" | "materials";
}

export default function ContentsMap({ onSelect, selected }: Props) {

  return (
    <div className="p-4 lg:p-10 pt-0">
      <nav>
        <ul className="flex flex-row border-y-1 py-4 divide-x-1 divide-slate-700/50 dark:divide-slate-300/50 border-slate-700/50 dark:border-slate-300/50">
          <li 
            className={`px-4 cursor-pointer ${
              selected === "daily" 
                ? "text-gray-700 dark:text-gray-200 font-bold"
                : "text-gray-500 dark:text-gray-400"
            }`} 
            onClick={() => onSelect("daily")}>
            📒숙제 리스트
          </li>
          <li 
            className={`px-4 cursor-pointer ${
              selected === "materials" 
                ? "text-gray-700 dark:text-gray-200 font-bold"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => onSelect("materials")}>
            🧰가공 재료
          </li>
        </ul>
      </nav>
    </div>
  )
}