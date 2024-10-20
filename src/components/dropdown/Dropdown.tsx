import React, { useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

interface DropdownProps {
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  value: string;
  hiddenInputName?: string;
  menuPosition?: "top" | "bottom";
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select an option",
  onSelect,
  value,
  hiddenInputName,
  menuPosition = "bottom",
}) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  // Cập nhật selectedLabel khi giá trị từ props thay đổi
  useEffect(() => {
    const selectedOption = options.find((option) => option.value === value);
    setSelectedLabel(selectedOption ? selectedOption.label : "");
  }, [value, options]);

  const handleSelect = (option: Option) => {
    setSelectedLabel(option.label);
    setIsActive(false);
    onSelect(option.value); // Trigger the callback function with the selected option's value
  };

  return (
    <div className="relative select-menu">
      <div
        className="select-btn flex h-[42px] items-center px-4 gap-2 rounded-lg border border-neutral-gray-40 bg-white cursor-pointer hover:opacity-75 justify-between"
        onClick={() => setIsActive(!isActive)}
      >
        <span className="sBtn-text">{selectedLabel || placeholder}</span>

        {/* SVG Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-300 ${
            isActive ? "rotate-180" : ""
          }`}
        >
          <path
            d="M19 9L12.7809 14.3306C12.3316 14.7158 11.6684 14.7158 11.2191 14.3306L5 9"
            stroke="#525655"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {isActive && (
        <ul
          className={`options absolute w-full left-0 ${
            menuPosition === "bottom"
              ? "top-full mt-[2px]"
              : "bottom-full mb-[2px]"
          } z-10 p-[10px] rounded-lg bg-white shadow-md`}
          style={{ maxHeight: "300px", overflowY: "auto" }} // Điều chỉnh độ cao tối đa và cuộn khi quá dài
        >
          {options.map((option, idx) => (
            <li
              key={idx}
              className="option flex h-[40px] cursor-pointer px-2 rounded-lg items-center hover:bg-neutral-gray-20 hover:text-dark-color "
              onClick={() => handleSelect(option)}
            >
              {option.icon && (
                <i
                  className={`bx ${option.icon} mr-3`}
                  style={{ color: option.color || "#000" }}
                ></i>
              )}
              <span className="option-text hover:bg-neutral-gray-20 hover:text-dark-color">
                {option.label}
              </span>
            </li>
          ))}
        </ul>
      )}
      {
        <input
          type="hidden"
          name={hiddenInputName}
          value={value} // Sử dụng giá trị đã chọn
        />
      }
    </div>
  );
};

export default Dropdown;
