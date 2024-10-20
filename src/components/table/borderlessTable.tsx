import React from "react";

interface Header {
  key: string; 
  title: string; 
  w?: number; 
  center?: boolean; 
}

interface DataRow {
  key: string | number; 
  [key: string]: any;
}

interface TableProps {
  headers: Header[];
  data: DataRow[];
}

const BorderlessTable: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`py-2 text-16 font-500 text-neutral-gray-80 tracking-wider ${
                  header.center ? "text-center" : "text-left"
                }`}
                style={{
                  width: header.w ? `${header.w}px` : "auto", // Áp dụng width từ header
                }}
              >
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.key} className="border-b">
              {headers.map((header, i) => (
                <td
                  key={i}
                  className={`py-2 ${
                    header.center ? "text-center" : "text-left"
                  }`}
                >
                  {row[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorderlessTable;
