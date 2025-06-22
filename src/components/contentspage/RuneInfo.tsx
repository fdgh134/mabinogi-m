import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../../lib/firebase";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface RuneInfoType {
  id: string;
  name: string;
  tier: string;
  description: string;
  origin: string;
  type?: string;
}

type RuneJsonType = Record<string, RuneInfoType[]>;

const groupLabel: Record<string, string> = {
  wapon: "무기",
  armor: "방어구",
  emblem: "엠블럼",
  accessories: "장신구",
};

const groupOrder = ["wapon", "weapon", "armor", "emblem", "accessories"];
const accessoryTypeOrder = [
  "전사", "검술사", "대검전사", "궁수", "석궁사수", "장궁병", "마법사", "빙결술사", "화염술사", "힐러", "사제", "수도사", "음유시인", "악사", "댄서", "도적", "격투가", "듀얼블레이드", "전격술사", "기타"
];

export default function RuneInfo() {
  const [runeData, setRuneData] = useState<RuneJsonType>({});
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRunes = async () => {
      const runeCol = collection(db, "runes");
      const snapshot = await getDocs(runeCol);
      const groupData: RuneJsonType = {};
      snapshot.forEach(doc => {
        const data = doc.data() as { list: RuneInfoType[] };
        groupData[doc.id] = data.list;
      });
      setRuneData(groupData);
    };
    fetchRunes();
  }, []);

  function groupAccessoriesByType(accessoryList: RuneInfoType[]) {
    const typeMap: Record<string, RuneInfoType[]> = {};
    accessoryList.forEach(rune => {
      const t = rune.type && rune.type !== "None" ? rune.type : "기타";
      if (!typeMap[t]) typeMap[t] = [];
      typeMap[t].push(rune);
    });
    // 지정 순서대로 type 정렬
    return accessoryTypeOrder
      .map(type => typeMap[type] && { type, list: typeMap[type].sort((a, b) => Number(a.id) - Number(b.id)) })
      .filter(Boolean) as { type: string, list: RuneInfoType[] }[];
  }

  // 그룹/검색 필터링
  const visibleGroups = Object.entries(runeData)
    .filter(([group]) => selectedGroup === "all" || group === selectedGroup);


  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">룬 정보</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <input
          type="text"
          placeholder="룬 이름/효과 검색"
          className="px-4 py-2 border border-[#D9D9D9] bg-white rounded-xl dark:bg-zinc-900 dark:text-neutral-100"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label htmlFor="group-select" className="sr-only">카테고리 필터</label>
        <select
          id="group-select"
          className="border rounded-xl p-2 bg-white border-[#d9d9d9] dark:bg-gray-800 dark:text-white dark:border-slate-300/50"
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
        >
          <option value="all">전체</option>
          {groupOrder.map(key =>
            runeData[key] && (
              <option key={key} value={key}>
                {groupLabel[key] ?? key}
              </option>
            )
          )}
        </select>
      </div>

      {visibleGroups.map(([group, runeList]) =>
        group === "accessories" ? (
          // 장신구는 type별 그룹화
          <section key={group} className="mb-14">
            <h2 className="text-2xl font-semibold mb-3 border-l-4 pl-3 border-teal-500">{groupLabel[group] ?? group}</h2>
            {groupAccessoriesByType(
              runeList.filter(
                rune =>
                  rune.name.includes(search) ||
                  rune.description.includes(search) ||
                  (rune.type && rune.type.includes(search))
              )
            ).map(({ type, list }) => (
              <div key={type} className="mb-6">
                <h3 className="text-xl font-bold mb-2">{type}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {list.map(rune => (
                    <div
                      key={rune.id}
                      className="rounded-2xl shadow-md p-5 bg-white dark:bg-zinc-800 hover:shadow-lg hover:scale-105 transition cursor-pointer"
                    >
                      <div className="text-lg font-bold mb-1">{rune.name}</div>
                      <div className="text-sm text-amber-600 mb-1">{rune.tier}</div>
                      <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">
                        {rune.description}
                      </div>
                      <div className="text-xs text-gray-500">{rune.origin}</div>
                      {rune.type && rune.type !== "None" && (
                        <div className="mt-2 text-xs text-blue-500">[{rune.type}]</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section key={group} className="mb-14">
            <h2 className="text-2xl font-semibold mb-4 border-l-4 pl-3 border-teal-500">
              {groupLabel[group] ?? group}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {runeList
                .filter(
                  rune =>
                    rune.name.includes(search) ||
                    rune.description.includes(search) ||
                    (rune.type && rune.type.includes(search))
                )
                .sort((a, b) => Number(a.id) - Number(b.id))
                .map(rune => (
                  <div
                    key={rune.id}
                    className="rounded-2xl shadow-md p-5 bg-white dark:bg-zinc-800 hover:shadow-lg hover:scale-105 transition cursor-pointer"
                  >
                    <div className="text-lg font-bold mb-1">{rune.name}</div>
                    <div className="text-sm text-amber-600 mb-1">{rune.tier}</div>
                    <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">
                      {rune.description}
                    </div>
                    <div className="text-xs text-gray-500">{rune.origin}</div>
                    {rune.type && rune.type !== "None" && (
                      <div className="mt-2 text-xs text-blue-500">[{rune.type}]</div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}