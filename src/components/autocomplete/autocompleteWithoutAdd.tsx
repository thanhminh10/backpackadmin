import React, { useEffect, useRef, useState } from "react";

interface AutocompleteProps {
  data: { name: string; code: string }[];
  field?: string;
  hiddenInputName?: string;
  showHiddenInput?: boolean;
  value: string;
  onChange: (value: string) => void;
  menuPosition?: "top" | "bottom"; 
}

const AutoCompleteWithOutAdd: React.FC<AutocompleteProps> = ({
  data,
  field,
  hiddenInputName,
  showHiddenInput = true,
  value,
  onChange,
  menuPosition = "bottom", 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<
    { name: string; code: string }[]
  >([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hiddenInputValue, setHiddenInputValue] = useState<string>(value);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      const selectedOption = data.find((item) => item.code === value);
      if (selectedOption) {
        setSearchTerm(selectedOption.name);
        setHiddenInputValue(selectedOption.code);
      }
    } else {
      setSearchTerm("");
      setHiddenInputValue("");
    }
  }, [value, data]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions(isFocused ? data : []);
    } else {
      const filteredSuggestions = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  }, [searchTerm, data, isFocused]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectSuggestion = (suggestion: {
    name: string;
    code: string;
  }) => {
    setSearchTerm(suggestion.name);
    setHiddenInputValue(suggestion.code);
    setSuggestions([]);
    setIsFocused(false); 
    onChange(suggestion.code);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        className="select-btn flex h-[42px] items-center px-4 gap-2 rounded-lg border border-neutral-gray-40 bg-white justify-between z-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={field || "Tìm kiếm"}
      />

    
      {isFocused && suggestions.length > 0 && (
        <ul
          className={`absolute left-0 w-full p-[10px] ${
            menuPosition === "bottom"
              ? "top-full mt-[2px]"
              : "bottom-full mb-[2px]"
          }   bg-white shadow-md border mt-2 rounded-lg  z-50 max-h-60 overflow-auto transition-transform duration-700 ease-in-out transform ${
            isFocused ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          }`}
          style={{ transformOrigin: "top" }} 
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-neutral-gray-20 hover:text-dark-color  cursor-pointer duration-main rounded-lg"
              onMouseDown={() => handleSelectSuggestion(suggestion)} 
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}

      {showHiddenInput && (
        <input type="hidden" name={hiddenInputName} value={hiddenInputValue} />
      )}
    </div>
  );
};

export default AutoCompleteWithOutAdd;
