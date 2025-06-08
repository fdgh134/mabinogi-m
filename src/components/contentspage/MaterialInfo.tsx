import { useEffect, useState } from "react";
import type { Item } from "./Item";

export default function MaterialInfo() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemNameMap, setItemNameMap] = useState<Map<string, string>>(new Map());

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
    });
  }, [])

  const getName = (id: string) => itemNameMap.get(id) || id;

  const parseMethodOrFrom = (text: string) => {
    const cleaned = text.replace(/^method:|^from:/, "");
    const isIdLike = /^[\w\-+]+$/.test(cleaned);
    return isIdLike ? getName(cleaned) : cleaned;
  };

  return (
    <div>
      <h2>생산 정보</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 pt-4 gap-4">
        {items.map((item) => (
        <div key={item.id} className="border border-slate-700/50 dark:border-slate-300/50 p-4 rounded bg-white dark:bg-gray-800 shadow">
          <p className="font-bold mb-2">🧵 {item.name} ({item.category}/{item.subCategory})</p>

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
            <p className="text-sm text-gray-400">📘 가공 없이 획득 가능</p>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}