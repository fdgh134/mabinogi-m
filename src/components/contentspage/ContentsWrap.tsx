import { useState } from "react"
import ContentsMap from "./ContentsMap"
import DailyQuest from "./DailyQuest";
import MaterialInfo from "./MaterialInfo";

export default function ContentsWarp() {
  const [selectedTab, setSelectedTab] = useState<"daily" | "materials">("daily");
  return (
    <div className="bg-[#F6F4F4] text-black dark:bg-gray-900 dark:text-white flex-1">
      <ContentsMap onSelect={setSelectedTab} selected={selectedTab} />

      <div className="px-4 lg:px-10">
        {selectedTab === "daily" && <DailyQuest />}
        {selectedTab === "materials" && <MaterialInfo />}
      </div>
    </div>
  )
}