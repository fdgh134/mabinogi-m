import { useEffect, useState } from "react";
import type { Item } from "./Item";

export default function MaterialInfo() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemNameMap, setItemNameMap] = useState<Map<string, string>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://mabinogi-api.onrender.com/api/items")
    .then(res => res.json())
    .then((data: Item[]) => {
      setItems(data);
      const nameMap = new Map<string, string>();
      data.forEach((item) => {
        nameMap.set(item.id, item.name);
      });
      setItemNameMap(nameMap);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  const getName = (id: string) => itemNameMap.get(id) || id;

  const parseMethodOrFrom = (text: string) => {
    const cleaned = text.replace(/^method:|^from:/, "");
    const isIdLike = /^[\w\-+]+$/.test(cleaned);
    return isIdLike ? getName(cleaned) : cleaned;
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.includes(searchTerm);
    const matchesCategory = selectedCategory === "전체" || item.subCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const grouped = filteredItems.reduce<Record<string, Item[]>>((acc, item) => {
    const key = item.subCategory || "기타";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
    if (a === "재료") return 1;
    if (b === "재료") return -1;
    return a.localeCompare(b);
  });

  const subCategoryList = Array.from(new Set(items.map(item => item.subCategory))).sort();

  return (
    <div>
      <h2 className="mb-4">가공 정보</h2>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <input
          type="text"
          placeholder="🔍 아이템 이름 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-slate-700/50 dark:border-slate-300/50 rounded w-full md:w-64"
        />
        <select
          aria-label="카테고리 선택"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 bg-white text-black dark:bg-gray-800 dark:text-white border-slate-700/50 dark:border-slate-300/50 border rounded"
        >
          <option value="전체">전체 카테고리</option>
          {subCategoryList.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 로딩 중 안내 메세지 */}
      {loading && 
        <p className="text-center text-gray-500">
          ⏳ 아이템 정보 불러오는 중...  
        </p>}

      {!loading && 
        sortedGroups.map(([subCategory, groupItems]) => (
          <section key={subCategory} className="mb-12">
            <h3 className="text-xl font-semibold mb-3 pb-2 border-b border-slate-700/50 dark:border-slate-300/50">
              📂 {subCategory}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-700/50 dark:border-slate-300/50 p-4 rounded bg-slate-100/50 dark:bg-gray-800 shadow"
                >
                  <p className="font-bold mb-2">
                    🧵 {item.name} ({item.category}/{item.subCategory})
                  </p>

                  {item.production.ingredients.length > 0 ? (
                    <div>
                      <p className="text-sm font-semibold mb-1">📦 재료:</p>
                      <ul className="ml-4 list-disc text-sm">
                        {item.production.ingredients.map((ing, index) => {
                          const ingredientName = getName(ing.itemId);
                          const methodName = parseMethodOrFrom(ing.source.methodOrFrom);
                          return (
                            <li key={index}>
                              {ingredientName} ({ing.source.type} - {methodName}) x{ing.quantity}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">✅ 가공 없이 획득 가능</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}