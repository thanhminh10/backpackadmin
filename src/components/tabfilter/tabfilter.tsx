"use client";
import { iconClose } from "@src/utils/icon/icon";
import { useState } from "react";

interface HeaderSearchProps {
  tabsData: { label: string; status: Boolean | null }[];
  refetch: (args: { active: Boolean | null; pageIndex: number }) => void;
}

const TabFilter: React.FC<HeaderSearchProps> = ({ tabsData, refetch }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchTag, setSearchTag] = useState<string | null>("");

  const filterStatus = (index: number, status: Boolean | null) => {
    setActiveTabIndex(index);
    refetch({ active: status, pageIndex: 1 });
  };

  const removeSearchTag = () => {
    setSearchTag(null);
    setSearchValue("");
    refetch({ active: null, pageIndex: 1 });
  };

  return (
    <div className="flex justify-between flex-col lg:flex-row gap-3 items-start">
      <nav>
        <div className="flex space-x-3 border-b border-white">
          {/* Loop through tab data and render button for each. */}
          {tabsData.map((tab, idx) => (
            <button
              key={idx}
              className={`pt-2.5 pr-3 py-4 pl-3 ${
                idx === activeTabIndex
                  ? "border-b border-neutral-gray-60 border-opacity-100"
                  : ""
              }`}
              onClick={() => filterStatus(idx, tab.status)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          {searchTag && (
            <>
              <button
                className="py-[4px] px-3 bg-white rounded-[16px] cursor-pointer"
                onClick={removeSearchTag}
              >
                <span> Xóa tất cả </span>
                {iconClose}
              </button>

              <button
                className="py-[4px] px-3 bg-white rounded-[16px] cursor-pointer"
                onClick={removeSearchTag}
              >
                <span> Từ khoá: {searchTag} </span>
                {iconClose}
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default TabFilter;
