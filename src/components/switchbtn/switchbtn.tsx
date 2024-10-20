import React from "react";
import { Control, Controller } from "react-hook-form";

interface ToggleSwitchProps {
  control: Control<any>; // Adjust 'any' to the appropriate form type if needed
  name: string;
  defaultValue?: boolean; // Optional default value
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  control,
  name,
  defaultValue = true,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue} // Set default value
      render={({ field: { value, onChange } }) => (
        <label className="inline-flex items-center justify-between cursor-pointer border border-neutral-gray-40 rounded-lg px-4 py-2 ">
          <span
            className={`text-16-400  ${
              value ? "text-dark-color" : "text-neutral-gray-60"
            }`}
          >
            {value ? "Đang hoạt động" : "Không hoạt động"}
          </span>
          <input
            type="checkbox"
            className="sr-only peer"
            checked={value}
            onChange={onChange}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 rounded-full peer dark:bg-neutral-gray-40 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-dark-color"></div>
        </label>
      )}
    />
  );
};

export default ToggleSwitch;
