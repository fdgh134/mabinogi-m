interface Props {
  onSelect: (tab: "daily" | "materials") => void;
}

export default function ContentsMap({ onSelect }: Props) {

  return (
    <div className="p-10 pt-0">
      <nav>
        <ul className="flex flex-row border-y-1 py-4 divide-x-1 divide-slate-700/50 dark:divide-slate-300/50 border-slate-700/50 dark:border-slate-300/50">
          <li className="px-4 cursor-pointer" onClick={() => onSelect("daily")}>
            📒일일 숙제
          </li>
          <li className="px-4 cursor-pointer" onClick={() => onSelect("materials")}>
            🧰가공 재료
          </li>
        </ul>
      </nav>
    </div>
  )
}