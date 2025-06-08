import { useState } from "react"
import ContentsMap from "./ContentsMap"
import DailyQuest from "./DailyQuest";
import MaterialInfo from "./MaterialInfo";

export default function ContentsWarp() {
  const [selectedTab, setSelectedTab] = useState("daily");
  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white">
      <ContentsMap onSelect={setSelectedTab} />

      <div className="px-10">
        {selectedTab === "daily" && <DailyQuest />}
        {selectedTab === "materials" && <MaterialInfo />}
      </div>
    </div>
  )
}