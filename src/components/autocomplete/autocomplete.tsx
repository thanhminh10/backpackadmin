import React, { useEffect, useState } from "react";
import { useDebounce } from "@src/hooks/useDebounce";

interface AutocompleteProps {
  data: { keyword: string; value: string }[];
  field?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (
    searchTerm: string
  ) => Promise<{ keyword: string; value: string }[]>;
  onKeywordAdd: (
    keyword: string
  ) => Promise<{ keyword: string; value: string }>;
  hiddenInputName?: string;
}

const AutoComplete: React.FC<AutocompleteProps> = ({
  data,
  field,
  value, // from props
  onChange,
  onSearch,
  onKeywordAdd,
  hiddenInputName,
}) => {
  const [searchTerm, setSearchTerm] = useState(value); // searchString
  const [selectedValue, setSelectedValue] = useState(
    data.find((item) => item.keyword === value)?.value ?? ""
  );
  const [isSelected, setIsSelected] = useState(false);
  const [suggestions, setSuggestions] = useState<
    { keyword: string; value: string }[]
  >([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  // Hook UseDebounce
  const debounceSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (isFocused && searchTerm.trim() === "") {
      setSuggestions(data);
    } else {
      const filteredSuggestions = data.filter((item) =>
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  }, [isFocused, data, searchTerm]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Hook UseDebounce
      if (debounceSearchTerm.trim() !== "") {
        setLoading(true);
        try {
          const searchResults = await onSearch(debounceSearchTerm);
          setSuggestions(searchResults);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSuggestions();
  }, [debounceSearchTerm, onSearch]);

  // Select Item
  const handleSelectSuggestion = (suggestion: {
    keyword: string;
    value: string;
  }) => {
    setSearchTerm(suggestion.keyword);
    setSelectedValue(suggestion.value);
    setIsSelected(true);
    onChange(suggestion.value);
    setIsFocused(false);
  };
  // Add brand , cate ,...
  const handleAddKeyword = async () => {
    setLoading(true);
    try {
      const newCategory = await onKeywordAdd(searchTerm);
      setSearchTerm(newCategory.keyword);
      setSelectedValue(newCategory.value);
      setIsSelected(true);
      const tmp = [];
      tmp.push(newCategory);
      setSuggestions(tmp);
    } catch (error) {
      console.error("Error adding keyword:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="select-btn flex h-[42px] items-center px-4 gap-2 rounded-lg border border-neutral-gray-40 bg-white justify-between z-10"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsSelected(false);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        placeholder={field || "Tìm kiếm"}
      />
      <input type="hidden" name={hiddenInputName} value={selectedValue} />

      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute top-1/2 right-4 transform -translate-y-1/2 transition-transform duration-300 ${
          isFocused ? "rotate-180" : ""
        }`}
      >
        <path
          d="M19 9L12.7809 14.3306C12.3316 14.7158 11.6684 14.7158 11.2191 14.3306L5 9"
          stroke="#525655"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {isFocused && (
        <ul className="absolute left-0 w-full bg-white border mt-2 rounded-lg z-50 p-[10px] shadow-md">
          {loading ? (
            <li className="p-2 text-gray-500">Đang tìm kiếm...</li>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="option-text p-2 hover:bg-neutral-gray-20 hover:text-dark-color cursor-pointer rounded-lg"
                onMouseDown={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.keyword}
              </li>
            ))
          ) : (
            !isSelected &&
            searchTerm &&
            suggestions.length === 0 && (
              <li className="p-2 text-gray-500 cursor-pointer hover:text-dark-color rounded-lg">
                <button
                  type="button"
                  className="btn w-full flex items-center border border-neutral-gray-40 rounded-lg"
                  onMouseDown={handleAddKeyword}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Plus">
                      <path
                        id="Line"
                        d="M1 8L15 8"
                        stroke="#053729"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        id="Line_2"
                        d="M8 1L8 15"
                        stroke="#053729"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>

                  <span className="text-dark-color line-clamp-2">
                    Thêm: {searchTerm}
                  </span>
                </button>
                <div className="p-2 text-center text-16-400 text-neutral-gray-60">
                  Không tìm thấy kết quả
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
