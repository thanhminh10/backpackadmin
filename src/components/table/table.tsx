"use client";
import { IHeader } from "@src/interfaces/table";
import { useEffect, useState } from "react";

interface Props {
  headers: IHeader[];
  bodies: any[];
  checkbox?: boolean;
  selectMany?: (selected: string[]) => void;
}

export default function Table({
  headers,
  bodies,
  checkbox,
  selectMany,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false); // Thêm state cho checkbox chọn tất cả

  useEffect(() => {
    if (selectMany) selectMany(selected);
  }, [selectMany, selected]);

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = () => {
    if (checked) {
      setSelected([]);
    } else {
      setSelected(bodies.map((item) => item.id));
    }
    setChecked((prev) => !prev); // Đổi trạng thái checkbox chọn tất cả
  };

  return (
    <table className="table-auto min-w-96 sm:w-full border border-main-bg-color rounded">
      <thead className="bg-main-bg-color rounded">
        <tr className="h-[60px] rounded overflow-hidden">
          {checkbox && (
            <th key="input" className="w-[80px] h-full">
              <div className="block ml-5">
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={handleSelectAll}
                  />
                  <span className="flex items-center justify-center w-5 h-5">
                    {checked ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          fill="#006736"
                          stroke="#006736"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 12L11 15L17.8059 8.1941"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          stroke="#525655"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </span>
                </label>
              </div>
            </th>
          )}

          {headers.map((header) => (
            <th
              className={`p-4 text-16 font-500 h-[60px] ${
                header.center
                  ? "text-center"
                  : header.left
                  ? "text-start"
                  : header.right
                  ? "text-right"
                  : "text-start"
              }`}
              key={header.key}
              style={{
                width: `${header.w}px`, // Đặt giá trị width trực tiếp
              }}
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {bodies.map((body, rowIdx) => (
          <tr key={rowIdx} className="h-[64px] py-2">
            {checkbox && (
              <td
                key={`checkbox-${rowIdx}`}
                className="border-t border-gray-300 text-neutral-gray-80 text-16 font-500 pl-5 items-center w-[80px]"
              >
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selected.includes(body.id)} // Kiểm tra xem phần tử có được chọn không
                    onChange={() => handleSelect(body.id)}
                  />

                  <span className="flex items-center justify-center w-5 h-5">
                    {selected.includes(body.id) ? ( // Kiểm tra nếu phần tử được chọn
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          fill="#006736"
                          stroke="#006736"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 12L11 15L17.8059 8.1941"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          stroke="#525655"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </span>
                </label>
              </td>
            )}
            {headers.map((header, colIdx) => (
              <td
                key={`cell-${rowIdx}-${colIdx}`}
                className={`border-t px-4 border-gray-300 text-neutral-gray-80 text-16 font-500 ${
                  header.center
                    ? "text-center"
                    : header.left
                    ? "text-left"
                    : header.right
                    ? "text-right"
                    : "text-start"
                }`}
                style={{
                  width: `${header.w ? header.w : ""}px`, // Áp dụng width từ headers
                }}
              >
                {body[header.key]} {/* Hiển thị dữ liệu cho từng header.key */}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
